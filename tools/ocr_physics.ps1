param(
  [int]$StartPage = 4,
  [int]$EndPage = 167,
  [string]$ImageDirectory = (Join-Path $PSScriptRoot '..\assets\physics\book'),
  [string]$OutputPath = (Join-Path $PSScriptRoot '..\tmp\pdfs\ocr\physics-ocr.json')
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Runtime.WindowsRuntime

[Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType=WindowsRuntime] | Out-Null
[Windows.Media.Ocr.OcrResult, Windows.Foundation, ContentType=WindowsRuntime] | Out-Null
[Windows.Globalization.Language, Windows.Foundation, ContentType=WindowsRuntime] | Out-Null
[Windows.Storage.StorageFile, Windows.Storage, ContentType=WindowsRuntime] | Out-Null
[Windows.Storage.Streams.IRandomAccessStream, Windows.Storage.Streams, ContentType=WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType=WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.SoftwareBitmap, Windows.Graphics.Imaging, ContentType=WindowsRuntime] | Out-Null

$script:asTaskMethods = [System.WindowsRuntimeSystemExtensions].GetMethods() |
  Where-Object { $_.Name -eq 'AsTask' -and $_.IsGenericMethod }

function Await-WinRt {
  param(
    [Parameter(Mandatory)]$Operation,
    [Parameter(Mandatory)][Type]$ResultType
  )

  $method = $script:asTaskMethods |
    Where-Object {
      $_.GetGenericArguments().Count -eq 1 -and
      $_.GetParameters().Count -eq 1
    } |
    Select-Object -First 1

  $task = $method.MakeGenericMethod($ResultType).Invoke($null, @($Operation))
  $task.Wait()
  return $task.Result
}

$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage(
  [Windows.Globalization.Language]::new('en-US')
)

if ($null -eq $engine) {
  throw 'Windows OCR engine could not be initialized.'
}

$pages = [System.Collections.Generic.List[object]]::new()

for ($page = $StartPage; $page -le $EndPage; $page++) {
  $imagePath = Join-Path $ImageDirectory ("page-{0:d3}.jpg" -f $page)
  if (-not (Test-Path -LiteralPath $imagePath)) {
    Write-Warning "Missing image: $imagePath"
    continue
  }

  $resolvedPath = (Resolve-Path -LiteralPath $imagePath).Path
  $file = Await-WinRt ([Windows.Storage.StorageFile]::GetFileFromPathAsync($resolvedPath)) ([Windows.Storage.StorageFile])
  $stream = Await-WinRt ($file.OpenAsync([Windows.Storage.FileAccessMode]::Read)) ([Windows.Storage.Streams.IRandomAccessStream])
  $decoder = Await-WinRt ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
  $bitmap = Await-WinRt ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
  $result = Await-WinRt ($engine.RecognizeAsync($bitmap)) ([Windows.Media.Ocr.OcrResult])

  $lines = foreach ($line in $result.Lines) {
    $words = @($line.Words)
    if ($words.Count -eq 0) { continue }
    $left = ($words | ForEach-Object { $_.BoundingRect.X } | Measure-Object -Minimum).Minimum
    $top = ($words | ForEach-Object { $_.BoundingRect.Y } | Measure-Object -Minimum).Minimum
    $right = ($words | ForEach-Object { $_.BoundingRect.X + $_.BoundingRect.Width } | Measure-Object -Maximum).Maximum
    $bottom = ($words | ForEach-Object { $_.BoundingRect.Y + $_.BoundingRect.Height } | Measure-Object -Maximum).Maximum
    [ordered]@{
      text = $line.Text
      x = [math]::Round($left, 2)
      y = [math]::Round($top, 2)
      width = [math]::Round($right - $left, 2)
      height = [math]::Round($bottom - $top, 2)
    }
  }

  $pages.Add([ordered]@{
    page = $page
    width = $bitmap.PixelWidth
    height = $bitmap.PixelHeight
    text = $result.Text
    lines = @($lines)
  })

  $bitmap.Dispose()
  $stream.Dispose()
  Write-Host ("OCR {0}/{1}" -f $page, $EndPage)
}

$outputDirectory = Split-Path -Parent $OutputPath
New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null
$pages | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $OutputPath -Encoding utf8
Write-Output ("Saved {0} pages to {1}" -f $pages.Count, $OutputPath)
