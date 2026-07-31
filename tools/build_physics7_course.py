"""Build the complete 7th-grade Idrok physics course from the 2022 textbook."""

from __future__ import annotations

import json
import math
import re
import shutil
import subprocess
import sys
import unicodedata
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from pypdf import PdfReader

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT / "7-SINF FIZIKA DARSLIK 2022.pdf"
OUT = ROOT / "assets" / "physics7"
FIGURES = OUT / "figures"
LOW_RENDER = ROOT / "tmp" / "pdfs" / "physics7-pages"
CONTACT = ROOT / "tmp" / "pdfs" / "physics7-contact.png"
POPPLER = Path(
    r"C:\Users\ANUBIS PC\.cache\codex-runtimes\codex-primary-runtime"
    r"\dependencies\native\poppler\Library\bin\pdftoppm.exe"
)

CHAPTERS = [
    {"title": "Mexanik harakat haqida ma’lumotlar", "icon": "motion", "accent": "#5b63e8"},
    {"title": "Tabiatda kuch va energiya", "icon": "forces", "accent": "#16a6a1"},
    {"title": "Issiqlik hodisalari", "icon": "thermal", "accent": "#f0a42c"},
    {"title": "Elektr", "icon": "charge", "accent": "#e85b91"},
    {"title": "Optika", "icon": "light", "accent": "#2784d8"},
]
CHAPTER_ENDS = [15, 30, 38, 57, 62]

# number | start page | title | formula | unit | relationship
RAW_LESSONS = r"""
1|7|Fizika fani taraqqiyoti tarixida O‘rta Osiyo olimlarining tutgan o‘rni|—|—|O‘rta Osiyo allomalari kuzatish, o‘lchash va hisoblash orqali fizika hamda astronomiya rivojiga katta hissa qo‘shgan.
2|10|Fizika sohasida O‘zbekistonda ilmiy maktab yaratgan fizik olimlar|—|—|O‘zbekiston fizik olimlari yadro fizikasi, Quyosh energiyasi, yarimo‘tkazgichlar va yuqori energiyalar sohalarida ilmiy maktablar yaratgan.
3|13|Fizik kattaliklar. Xalqaro birliklar sistemasi (SI)|kattalik = son qiymati × birlik|SI|Har bir fizik kattalik son qiymati, belgisi va o‘lchov birligi bilan ifodalanadi; SI birliklari o‘lchash natijalarini yagona tizimga keltiradi.
4|17|Fizikada tadqiqot metodlari|kuzatish → faraz → tajriba → xulosa|—|Fizik tadqiqot kuzatish, muammoni belgilash, faraz ilgari surish, tajriba o‘tkazish va xulosa chiqarish bosqichlaridan iborat.
5|20|Skalyar va vektor kattaliklar|a = (aₓ, aᵧ), bu yerda a — vektor|—|Skalyar kattalik faqat son qiymatiga, vektor kattalik esa son qiymati bilan birga yo‘nalishga ham ega.
6|22|Masalalar yechish: fizik kattaliklar va vektorlar|x = k·x₀|SI|Masala yechishda berilganlar SI birliklariga o‘tkaziladi, kerakli formula tanlanadi va natija birligi bilan yoziladi.
7|24|Mexanik harakat|x = x(t)|m|Jismning boshqa jismlarga nisbatan vaziyatining vaqt o‘tishi bilan o‘zgarishi mexanik harakat deyiladi.
8|28|Kinematikaning asosiy tushunchalari|Δr = r₂ − r₁ (vektor)|m|Trayektoriya jism harakat chizig‘i, yo‘l trayektoriya uzunligi, ko‘chish esa boshlang‘ich va oxirgi vaziyatlarni bog‘lovchi vektordir.
9|31|To‘g‘ri chiziqli tekis harakatda tezlik va yo‘l|v = s/t; s = vt|m/s|Tekis harakatda jism teng vaqt oralig‘ida teng yo‘l bosadi va uning tezligi o‘zgarmaydi.
10|36|Masalalar yechish: tekis harakat|s = vt|m|Tekis harakat masalalarida tezlik, vaqt va yo‘l orasidagi s = vt bog‘lanishi qo‘llanadi.
11|39|Notekis harakat|vₒ‘rt = sᵤₘ/tᵤₘ|m/s|Notekis harakatda tezlik o‘zgaradi; butun yo‘lning o‘rtacha tezligi umumiy yo‘lning umumiy vaqtga nisbatidir.
12|42|Laboratoriya: notekis harakatning o‘rtacha tezligini aniqlash|vₒ‘rt = s/t|m/s|Masofa va harakat vaqti tajribada o‘lchanib, jismning o‘rtacha tezligi hisoblanadi.
13|43|Masalalar yechish: notekis harakat|vₒ‘rt = sᵤₘ/tᵤₘ|m/s|Harakat qismlarining yo‘llari va vaqtlarini alohida qo‘shib, butun harakatning o‘rtacha tezligi topiladi.
14|45|Aylana bo‘ylab harakat|T = t/N; ν = N/t|s; Hz|Aylana bo‘ylab tekis harakat davr, chastota, radius va chiziqli tezlik bilan tavsiflanadi.
15|48|Masalalar yechish: aylana bo‘ylab harakat|v = 2πR/T|m/s|Aylana bo‘ylab harakatda bir aylanish yo‘li 2πR ga teng bo‘lib, tezlik davr yoki chastota orqali topiladi.
16|53|Massa va uning birliklari|m = ρV|kg|Massa jism inertligini va undagi modda miqdorini tavsiflaydigan fizik kattalikdir.
17|55|Zichlik va uning birliklari|ρ = m/V|kg/m³|Zichlik moddaning birlik hajmiga to‘g‘ri keladigan massasini ko‘rsatadi.
18|59|Laboratoriya: turli shakldagi jismlarning zichligini aniqlash|ρ = m/V|kg/m³|Jism massasi tarozida, hajmi esa geometrik usul yoki suyuqlikka botirish orqali o‘lchanib, zichligi aniqlanadi.
19|62|Jismlarning o‘zaro ta’siri. Kuch|F = ma|N|Kuch jismlarning o‘zaro ta’sirini ifodalaydi va jism tezligi yoki shaklini o‘zgartirishi mumkin.
20|66|Bosim va uning birliklari|p = F/S|Pa|Bosim sirtga tik ta’sir qiluvchi kuchning shu sirt yuziga nisbatiga teng.
21|69|Masalalar yechish: bosim|p = F/S|Pa|Bosim masalalarida kuch nyutonda, yuza kvadrat metrda olinib, natija paskalda ifodalanadi.
22|71|Suyuqlik va gazlarda bosimning uzatilishi|p = F/S|Pa|Paskal qonuniga ko‘ra tashqi bosim suyuqlik va gazning barcha nuqtalariga o‘zgarishsiz uzatiladi.
23|74|Tinch holatdagi suyuqlik bosimi|p = ρgh|Pa|Suyuqlikning gidrostatik bosimi uning zichligi va chuqurlik ortishi bilan ortadi.
24|76|Masalalar yechish: suyuqlik bosimi|p = ρgh|Pa|Gidrostatik bosimni hisoblashda suyuqlik zichligi, erkin tushish tezlanishi va chuqurlik ko‘paytiriladi.
25|78|Atmosfera bosimi|pₐₜₘ = ρgh|Pa|Atmosfera havosining og‘irligi Yer sirtidagi jismlarga bosim beradi; bu bosim barometr bilan o‘lchanadi.
26|83|Mexanik ish|A = Fs·cosα|J|Kuch jismni siljitganda mexanik ish bajaradi; ish kuch va ko‘chishning kuch yo‘nalishidagi proyeksiyasiga bog‘liq.
27|85|Mexanik energiyaning turlari|Eₚ = mgh; Eₖ = mv²/2|J|Potensial energiya jismlarning o‘zaro vaziyatiga, kinetik energiya esa jism massasi va tezligiga bog‘liq.
28|88|Masalalar yechish: mexanik energiya|E = Eₚ + Eₖ|J|Mexanik energiya kinetik va potensial energiyalar yig‘indisidan iborat.
29|90|Mexanik quvvat va uning birligi|P = A/t|W|Quvvat bajarilgan ishning shu ishni bajarishga ketgan vaqtga nisbatidir.
30|93|Masalalar yechish: ish va quvvat|P = A/t|W|Ish, vaqt va quvvat orasidagi bog‘lanishdan noma’lum kattalik topiladi.
31|97|Ichki energiya|ΔU = Q + Aₜₐₛₕqᵢ|J|Jism ichki energiyasi uni tashkil etgan zarralarning kinetik va potensial energiyalari yig‘indisidir.
32|100|Issiqlik miqdori|Q = cmΔT|J|Jismni isitish yoki sovitishda uzatiladigan issiqlik miqdori massa, solishtirma issiqlik sig‘imi va temperatura o‘zgarishiga bog‘liq.
33|104|Masalalar yechish: issiqlik miqdori|Q = cmΔT|J|Issiqlik masalalarida temperaturalar farqi, massa va moddaning solishtirma issiqlik sig‘imi hisobga olinadi.
34|106|Amaliy mashg‘ulot: turli temperaturali suvlar aralashtirilganda issiqlik almashinuvi|Q_berilgan = Q_olingan|J|Issiq suv bergan issiqlik miqdori sovuq suv olgan issiqlik miqdoriga teng bo‘lganda issiqlik muvozanati yuzaga keladi.
35|107|Yoqilg‘ining solishtirma yonish issiqligi|Q = qm|J|Yoqilg‘i yonganda ajraladigan issiqlik miqdori uning massasi va solishtirma yonish issiqligiga bog‘liq.
36|110|Bug‘lanish va kondensatsiya. Qaynash|Q = Lm|J|Bug‘lanish suyuqlik sirtida har qanday temperaturada, qaynash esa butun hajmda muayyan temperaturada sodir bo‘ladi.
37|115|Qattiq jismning erishi va qotishi|Q = λm|J|Kristall jism erish temperaturasida issiqlik yutib eriydi, qotishda esa shu miqdordagi issiqlikni beradi.
38|118|Masalalar yechish: fazaviy o‘tishlar|Q = cmΔT + λm + Lm|J|Murakkab issiqlik jarayonlarida isitish, erish va bug‘lanish bosqichlarining issiqlik miqdorlari qo‘shiladi.
39|123|Jismlarning elektrlanishi|q = ±Ne|C|Jismlar elektron olishi yoki yo‘qotishi natijasida manfiy yoki musbat zaryadlanadi.
40|126|Elektr zaryad|q = Ne|C|Elektr zaryad diskret bo‘lib, elementar zaryadning butun sonli karralisidan iborat.
41|130|Elektroskop va elektrometr|q = CU|C|Elektroskop zaryad mavjudligini, elektrometr esa elektrlanish darajasini aniqlashga xizmat qiladi.
42|132|Elektr o‘tkazgichlar va dielektriklar|R = ρl/S|Ω|O‘tkazgichlarda erkin zaryadlar ko‘chishi mumkin, dielektriklarda esa zaryadlar bog‘langan holatda bo‘ladi.
43|134|Zaryadlangan jismlarning o‘zaro ta’sirlashuvi|F = k|q₁q₂|/r²|N|Bir xil ishorali zaryadlar itarishadi, qarama-qarshi ishorali zaryadlar tortishadi.
44|137|O‘tkazgichlarda elektr zaryadlarning taqsimlanishi|Eᵢchki = 0|N/C|Elektrostatik muvozanatda ortiqcha zaryad o‘tkazgichning tashqi sirtida taqsimlanadi, o‘tkazgich ichida maydon nol bo‘ladi.
45|139|Tabiatdagi elektr hodisalar|q = It|C|Chaqmoq bulutlar va Yer orasidagi katta elektr razryadi bo‘lib, zaryadlar ajralishi natijasida yuzaga keladi.
46|142|Elektr toki|I = q/t|A|Elektr toki zaryadlangan zarralarning tartibli harakati bo‘lib, tok mavjudligi uchun erkin zaryadlar va elektr maydon kerak.
47|145|Tok manbalari|ε = Aₜₐₛₕqᵢ/q|V|Tok manbai boshqa turdagi energiyani elektr energiyaga aylantirib, zanjirda kuchlanish hosil qiladi.
48|149|Elektr kuchlanish va uni o‘lchash|U = A/q|V|Kuchlanish elektr maydonning birlik zaryadni ko‘chirishda bajargan ishini ko‘rsatadi va voltmetr bilan o‘lchanadi.
49|153|Tok kuchi|I = q/t|A|Tok kuchi o‘tkazgich kesimidan vaqt birligida o‘tgan elektr zaryadiga teng va ampermetr bilan o‘lchanadi.
50|156|Masalalar yechish: tok va kuchlanish|A = UIt|J|Elektr zanjirida ish, kuchlanish, tok kuchi va vaqt orasidagi bog‘lanish qo‘llanadi.
51|158|Laboratoriya: elektr zanjirida tok kuchi va kuchlanishni o‘lchash|I = q/t; U = A/q|A; V|Ampermetr zanjirga ketma-ket, voltmetr esa o‘lchanayotgan iste’molchiga parallel ulanadi.
52|159|Elektr qarshilik|R = ρl/S|Ω|O‘tkazgich qarshiligi uning materialiga va uzunligiga to‘g‘ri, ko‘ndalang kesim yuziga teskari proporsional.
53|163|Rezistorlar. Reostatlar|R = ρl/S|Ω|Rezistor zanjir qarshiligini belgilaydi, reostat esa o‘tkazgichning faol uzunligini o‘zgartirib tok kuchini rostlaydi.
54|166|Zanjirning bir qismi uchun Om qonuni|I = U/R|A|Zanjir qismidagi tok kuchi kuchlanishga to‘g‘ri, qarshilikka teskari proporsional.
55|169|Masalalar yechish: Om qonuni|R = U/I|Ω|Om qonuni yordamida tok kuchi, kuchlanish yoki qarshilikdan istalgan biri hisoblanadi.
56|171|Amaliy mashg‘ulot: reostat yordamida tok kuchini rostlash|I = U/R|A|Reostat qarshiligi o‘zgartirilganda zanjirdagi tok kuchi ham o‘zgaradi.
57|172|Laboratoriya: Om qonunini o‘rganish|R = U/I|Ω|Kuchlanish va tok kuchi bir necha marta o‘lchanib, ularning nisbati o‘zgarmas qarshilikka tengligi tekshiriladi.
58|176|Yorug‘likning to‘g‘ri chiziq bo‘ylab tarqalishi|s = ct|m|Yorug‘lik bir jinsli shaffof muhitda to‘g‘ri chiziq bo‘ylab tarqaladi va soya hosil qiladi.
59|178|Quyosh va Oy tutilishi|Soya + yarimsoya|—|Quyosh, Yer va Oyning o‘zaro joylashuvi natijasida Quyosh yoki Oy tutilishi kuzatiladi.
60|181|Yorug‘likning qaytishi va sinishi|α = β; n = sinα/sinγ|—|Qaytishda tushish burchagi qaytish burchagiga teng, sinishda esa nur muhit chegarasida yo‘nalishini o‘zgartiradi.
61|184|Linza|D = 1/F|dptr|Linza yorug‘lik nurlarini yig‘adi yoki sochadi; uning asosiy kattaliklari fokus masofasi va optik kuchdir.
62|186|Amaliy mashg‘ulot: yorug‘likning yassi ko‘zgudan qaytishi|α = β|°|Yassi ko‘zguda qaytgan nur, tushgan nur va normal bir tekislikda yotadi, qaytish burchagi tushish burchagiga teng.
""".strip()

APPLICATIONS = [
    "Bu bilim transport, navigatsiya, sport, o‘lchash va harakatni grafik tahlil qilishda qo‘llanadi.",
    "Bu qonuniyat qurilish, gidravlika, mexanizmlar, energetika va kundalik xavfsizlik masalalarini tushuntiradi.",
    "Issiqlik almashinuvi haqidagi bilim isitish-sovitish tizimlari, oshxona, sanoat va energiya tejashda ishlatiladi.",
    "Elektr qonunlari yoritish, maishiy texnika, sensorlar, aloqa va xavfsiz elektr zanjirlarini qurishda qo‘llanadi.",
    "Optika qonunlari ko‘zoynak, kamera, mikroskop, teleskop, ko‘zgu va yoritish tizimlarining asosini tashkil qiladi.",
]

EXPERIMENTS = [
    "Telefon sekundomeri, o‘lchov lentasi va kichik aravacha yordamida masofa hamda vaqtni o‘lchang; harakat turini grafikda tasvirlang.",
    "Tarozi, o‘lchov silindri, dinamometr yoki suvli idish yordamida massa, zichlik, kuch yoki bosimni xavfsiz tarzda o‘lchang.",
    "Ikki idishdagi turli temperaturali suv, termometr va metall qoshiq yordamida issiqlik almashinuvini kuzating; issiq suv bilan ehtiyot bo‘ling.",
    "Batareya, kichik lampochka, sim va kalitdan past kuchlanishli zanjir tuzing; ulanishni faqat quvvat uzilganida o‘zgartiring.",
    "Fonar, karton teshiklar, ko‘zgu yoki suvli shaffof idish yordamida yorug‘likning tarqalishi, qaytishi va sinishini kuzating.",
]


def parse_lessons():
    rows = []
    for line in RAW_LESSONS.splitlines():
        number, start, title, formula, unit, relationship = line.split("|", 5)
        rows.append(
            {
                "number": int(number),
                "start": int(start),
                "title": title,
                "formula": formula,
                "unit": unit,
                "relationship": relationship,
            }
        )
    assert len(rows) == 62 and [row["number"] for row in rows] == list(range(1, 63))
    return rows


def chapter_for(number):
    return next(index for index, end in enumerate(CHAPTER_ENDS) if number <= end)


def clean_text(value):
    value = unicodedata.normalize("NFC", str(value or ""))
    replacements = {
        "\u00ad": "",
        "\ufb01": "fi",
        "\ufb02": "fl",
        "oʻ": "o‘",
        "gʻ": "g‘",
        "Oʻ": "O‘",
        "Gʻ": "G‘",
        "’": "’",
        "–": "–",
    }
    for old, new in replacements.items():
        value = value.replace(old, new)
    word_repairs = {
        "T ARAQQIYOTI": "TARAQQIYOTI",
        "T ARIXIDA": "TARIXIDA",
        "O‘RT A": "O‘RTA",
        "ma tematika": "matematika",
        "al- Xorazmiy": "al-Xorazmiy",
        "astro nomik": "astronomik",
        "say yora": "sayyora",
        "sha hri da": "shahrida",
        "o‘chmas iz qoldir gan": "o‘chmas iz qoldirgan",
        "bio logiya": "biologiya",
        "ta biiy": "tabiiy",
        "tad qiq": "tadqiq",
        "me’ros": "meros",
    }
    for old, new in word_repairs.items():
        value = value.replace(old, new)
    value = re.sub(r"\s+", " ", value).strip()
    value = re.sub(r"\b([A-Za-zO‘G‘o‘g‘]{2,})\s*-\s+([a-z‘]{2,})\b", r"\1\2", value)
    value = re.sub(r"\bbo‘\s+ladi\b", "bo‘ladi", value, flags=re.I)
    value = re.sub(r"\bo‘r\s+gan", "o‘rgan", value, flags=re.I)
    value = re.sub(r"\bta\s+biat", "tabiat", value, flags=re.I)
    return value


def page_blocks(reader, page_number, lesson_title):
    text = (reader.pages[page_number - 1].extract_text() or "").replace("\x00", " ")
    raw_lines = [clean_text(line) for line in text.splitlines()]
    lines = []
    for line in raw_lines:
        if not line or line == str(page_number):
            continue
        if re.search(r"(veb-sayt|telegram|telefon raqam|zokirjon\.com|www\.)", line, re.I):
            continue
        if len(line) < 3 or re.fullmatch(r"[IVXLC]+\s*BOB", line):
            continue
        lines.append(line)

    blocks, current = [], ""
    for line in lines:
        if current.endswith("-") and re.match(r"^[a-zа-я‘]", line):
            current = current[:-1] + line
        elif current:
            current += " " + line
        else:
            current = line
        if len(current) >= 170 and re.search(r"[.!?;:]$", line):
            blocks.append(clean_text(current))
            current = ""
        elif len(current) >= 560:
            blocks.append(clean_text(current))
            current = ""
    if current:
        blocks.append(clean_text(current))

    result = []
    title_key = re.sub(r"[^a-z0-9]+", "", unicodedata.normalize("NFKD", lesson_title.lower()))
    for block in blocks:
        compact = re.sub(r"\s+", "", unicodedata.normalize("NFKD", block.lower()))
        if title_key and title_key[:25] in compact and len(block) < len(lesson_title) + 45:
            continue
        if len(block) < 38:
            continue
        letters = sum(ch.isalpha() for ch in block)
        if letters / max(1, len(block)) < 0.45:
            continue
        result.append({"type": "paragraph", "text": block, "page": page_number})
    return result


def summary_from_blocks(blocks, fallback):
    for block in blocks:
        text = block["text"]
        if len(text) < 105 or re.match(r"^(Masala|Mashq|Berilgan|Formula|Hisoblash|\d+[.)])", text):
            continue
        sentences = re.split(r"(?<=[.!?])\s+", text)
        summary = " ".join(sentences[:2]).strip()
        if 90 <= len(summary) <= 520:
            return summary
    return fallback


def problem_for(number, title):
    if number <= 6:
        return {
            "title": f"{title}: o‘lchash va taqqoslash",
            "given": "O‘lchangan kattalik 2,4 m, asbob bo‘linmasi 0,1 m.",
            "steps": ["Natijani SI birligida yozamiz", "2,4 m = 24·0,1 m", "Natija: 2,4 m"],
            "answer": 2.4,
            "unit": "m",
            "prompt": "350 cm necha metr bo‘ladi?",
            "practice": 3.5,
        }
    if number <= 15:
        return {
            "title": "Harakat tezligini hisoblash",
            "given": "Jism 120 m yo‘lni 20 s da bosib o‘tdi.",
            "steps": ["v = s/t", "v = 120/20", "v = 6 m/s"],
            "answer": 6,
            "unit": "m/s",
            "prompt": "Jism 180 m yo‘lni 30 s da bosib o‘tsa, tezligi qancha?",
            "practice": 6,
        }
    if number <= 18:
        return {
            "title": "Zichlikni hisoblash",
            "given": "Jism massasi 2 kg, hajmi 0,001 m³.",
            "steps": ["ρ = m/V", "ρ = 2/0,001", "ρ = 2000 kg/m³"],
            "answer": 2000,
            "unit": "kg/m³",
            "prompt": "m = 3 kg va V = 0,0015 m³ bo‘lsa, zichlikni toping.",
            "practice": 2000,
        }
    if number == 19:
        return {
            "title": "Kuchni hisoblash",
            "given": "m = 4 kg, a = 3 m/s².",
            "steps": ["F = ma", "F = 4·3", "F = 12 N"],
            "answer": 12,
            "unit": "N",
            "prompt": "m = 5 kg va a = 2 m/s² bo‘lsa, kuchni toping.",
            "practice": 10,
        }
    if number <= 25:
        return {
            "title": "Bosimni hisoblash",
            "given": "F = 200 N, S = 0,04 m².",
            "steps": ["p = F/S", "p = 200/0,04", "p = 5000 Pa"],
            "answer": 5000,
            "unit": "Pa",
            "prompt": "F = 300 N va S = 0,06 m² bo‘lsa, bosimni toping.",
            "practice": 5000,
        }
    if number <= 30:
        return {
            "title": "Ish va quvvatni hisoblash",
            "given": "600 J ish 3 s da bajarildi.",
            "steps": ["P = A/t", "P = 600/3", "P = 200 W"],
            "answer": 200,
            "unit": "W",
            "prompt": "900 J ish 3 s da bajarilsa, quvvat qancha?",
            "practice": 300,
        }
    if number <= 38:
        return {
            "title": "Issiqlik miqdorini hisoblash",
            "given": "m = 0,5 kg suv, c = 4200 J/(kg·°C), ΔT = 10 °C.",
            "steps": ["Q = cmΔT", "Q = 4200·0,5·10", "Q = 21 000 J"],
            "answer": 21000,
            "unit": "J",
            "prompt": "0,2 kg suv 5 °C ga isitilsa, Q qancha? c = 4200.",
            "practice": 4200,
        }
    if number <= 45:
        return {
            "title": "Elektr zaryadni hisoblash",
            "given": "Jism 5 ta shartli elementar zaryad oldi.",
            "steps": ["q = Ne", "N = 5", "q = 5e"],
            "answer": 5,
            "unit": "e",
            "prompt": "Jism 8 ta elektron olsa, zaryad moduli necha e bo‘ladi?",
            "practice": 8,
        }
    if number <= 57:
        return {
            "title": "Om qonuni bo‘yicha hisoblash",
            "given": "U = 12 V, R = 4 Ω.",
            "steps": ["I = U/R", "I = 12/4", "I = 3 A"],
            "answer": 3,
            "unit": "A",
            "prompt": "U = 18 V va R = 6 Ω bo‘lsa, tok kuchini toping.",
            "practice": 3,
        }
    if number == 58:
        return {
            "title": "Yorug‘lik bosib o‘tgan yo‘l",
            "given": "c = 300 000 km/s, t = 2 s.",
            "steps": ["s = ct", "s = 300 000·2", "s = 600 000 km"],
            "answer": 600000,
            "unit": "km",
            "prompt": "Yorug‘lik 3 s da qancha yo‘l bosadi? c = 300 000 km/s.",
            "practice": 900000,
        }
    if number == 59:
        return {
            "title": "Quyosh nuri bosib o‘tgan masofa",
            "given": "c = 300 000 km/s, t = 500 s.",
            "steps": ["s = ct", "s = 300 000·500", "s = 150 000 000 km"],
            "answer": 150000000,
            "unit": "km",
            "prompt": "Yorug‘lik 8 s da qancha yo‘l bosadi? c = 300 000 km/s.",
            "practice": 2400000,
        }
    if number == 61:
        return {
            "title": "Linzaning optik kuchi",
            "given": "F = 0,5 m.",
            "steps": ["D = 1/F", "D = 1/0,5", "D = 2 dptr"],
            "answer": 2,
            "unit": "dptr",
            "prompt": "Fokus masofasi 0,25 m bo‘lgan linzaning optik kuchini toping.",
            "practice": 4,
        }
    return {
        "title": "Optik kattalikni hisoblash",
        "given": "Tushish burchagi 35°.",
        "steps": ["Qaytish qonuni: α = β", "α = 35°", "β = 35°"],
        "answer": 35,
        "unit": "°",
        "prompt": "Tushish burchagi 48° bo‘lsa, qaytish burchagi qancha?",
        "practice": 48,
    }


def read_video_pool():
    path = ROOT / "tmp" / "video-pool.json"
    if not path.exists():
        return []
    raw = path.read_bytes()
    encoding = "utf-16" if raw.startswith((b"\xff\xfe", b"\xfe\xff")) else "utf-8-sig"
    data = json.loads(raw.decode(encoding))
    pool = []
    for grade in ("g9", "g10"):
        for item in data.get(grade, []):
            if item.get("id") and item.get("title"):
                pool.append(
                    {
                        "id": item["id"],
                        "title": item["title"],
                        "lesson": item.get("lesson", ""),
                        "provider": "Khan Academy O‘zbek",
                    }
                )
    unique = {}
    for item in pool:
        unique.setdefault(item["id"], item)
    return list(unique.values())


STOP_WORDS = {
    "va", "bilan", "uchun", "hamda", "haqida", "uning", "mavzu", "masalalar",
    "yechish", "laboratoriya", "amaliy", "mashg‘ulot", "sinf", "fizika",
}


def tokens(value):
    value = unicodedata.normalize("NFKD", value.lower())
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    value = value.replace("o‘", "o").replace("g‘", "g")
    return {word for word in re.findall(r"[a-z0-9]+", value) if len(word) > 2 and word not in STOP_WORDS}


def assign_videos(rows):
    pool = read_video_pool()
    approved = {
        22: "YlP-fSsKsTo",
        31: "S_g1aOUkoJA",
        32: "4wvQrvir44o",
        34: "trm-1731579088",
        35: "3g5RegoDxFY",
        36: "45KZFUbJV4g",
        37: "3GOjgEIMO4o",
        40: "PwXvtlzcb_M",
        45: "eHeR5V188SQ",
        48: "KV2LWFYCnZ0",
        49: "wgPtas0ubso",
        51: "9YQ9irb1FxM",
        52: "j0rQHktZyYA",
        54: "ob4F2SiSWa8",
        57: "v_f_OZHhvrI",
        60: "BmzZSJAGHU0",
        61: "xizixoPywmo",
    }
    by_id = {item["id"]: item for item in pool}
    for row in rows:
        best = by_id.get(approved.get(row["number"]))
        if best:
            row["video"] = {
                "id": best["id"],
                "title": best["title"],
                "source": f"https://www.youtube.com/watch?v={best['id']}",
                "embed": f"https://www.youtube-nocookie.com/embed/{best['id']}?rel=0",
                "provider": best["provider"],
                "type": "youtube",
                "verified": True,
            }
        else:
            row["video"] = None


def colorful_bbox(image):
    small = image.resize((max(1, image.width // 3), max(1, image.height // 3)))
    array = np.asarray(small.convert("RGB"))
    mx, mn = array.max(axis=2), array.min(axis=2)
    raw_mask = ((mx - mn) > 30) & (mx < 248)
    raw_mask[: int(raw_mask.shape[0] * 0.20), :] = False
    raw_mask[-int(raw_mask.shape[0] * 0.07) :, :] = False
    raw_mask[:, : int(raw_mask.shape[1] * 0.04)] = False
    raw_mask[:, -int(raw_mask.shape[1] * 0.04) :] = False
    binary = Image.fromarray((raw_mask * 255).astype("uint8")).filter(ImageFilter.MaxFilter(5))
    mask = np.asarray(binary) > 0
    seen = np.zeros(mask.shape, dtype=bool)
    components = []
    height, width = mask.shape
    for y in range(height):
        for x in range(width):
            if not mask[y, x] or seen[y, x]:
                continue
            stack = [(x, y)]
            seen[y, x] = True
            xs, ys = [], []
            while stack:
                cx, cy = stack.pop()
                xs.append(cx)
                ys.append(cy)
                for nx, ny in ((cx - 1, cy), (cx + 1, cy), (cx, cy - 1), (cx, cy + 1)):
                    if 0 <= nx < width and 0 <= ny < height and mask[ny, nx] and not seen[ny, nx]:
                        seen[ny, nx] = True
                        stack.append((nx, ny))
            x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
            box_area = (x1 - x0 + 1) * (y1 - y0 + 1)
            box_width, box_height = x1 - x0 + 1, y1 - y0 + 1
            if box_area < 45 or box_width < 7 or box_height < 7:
                continue
            if box_width > width * 0.78 and box_height < height * 0.18:
                continue
            density = float(raw_mask[y0 : y1 + 1, x0 : x1 + 1].mean())
            if density < 0.035:
                continue
            score = box_area * (0.35 + density)
            components.append((score, x0, y0, x1, y1))
    if not components:
        return None, 0
    score, x0, y0, x1, y1 = max(components, key=lambda item: item[0])
    scale = 3
    pad = 20
    bbox = (
        max(0, x0 * scale - pad),
        max(0, y0 * scale - pad),
        min(image.width, (x1 + 1) * scale + pad),
        min(image.height, (y1 + 1) * scale + pad),
    )
    return bbox, score


def make_figures(rows):
    FIGURES.mkdir(parents=True, exist_ok=True)
    temp = ROOT / "tmp" / "pdfs" / "physics7-hires"
    temp.mkdir(parents=True, exist_ok=True)
    for index, row in enumerate(rows):
        end = rows[index + 1]["start"] - 1 if index + 1 < len(rows) else 188
        candidates = []
        for page_number in range(row["start"], end + 1):
            low_path = LOW_RENDER / f"page-{page_number:03d}.jpg"
            if not low_path.exists():
                continue
            low_page = Image.open(low_path).convert("RGB")
            page_bbox, score = colorful_bbox(low_page)
            if page_bbox:
                candidates.append((score, page_number, page_bbox, low_page.size))
        if candidates:
            _, page, bbox, _ = max(candidates, key=lambda item: item[0])
            low = Image.open(LOW_RENDER / f"page-{page:03d}.jpg").convert("RGB")
        else:
            page = row["start"]
            low = Image.open(LOW_RENDER / f"page-{page:03d}.jpg").convert("RGB")
            bbox = (
                int(low.width * 0.46),
                int(low.height * 0.26),
                int(low.width * 0.93),
                int(low.height * 0.66),
            )
        prefix = temp / f"page-{page:03d}"
        hires_path = prefix.with_suffix(".png")
        if not hires_path.exists():
            subprocess.run(
                [
                    str(POPPLER),
                    "-f", str(page), "-l", str(page), "-singlefile",
                    "-png", "-r", "150", str(PDF), str(prefix),
                ],
                check=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
        hires = Image.open(hires_path).convert("RGB")
        sx, sy = hires.width / low.width, hires.height / low.height
        hb = tuple(int(value * (sx if index % 2 == 0 else sy)) for index, value in enumerate(bbox))
        crop = hires.crop(hb)
        if crop.width < 300 or crop.height < 180:
            cx = (hb[0] + hb[2]) // 2
            cy = (hb[1] + hb[3]) // 2
            half_width = max(180, crop.width // 2)
            half_height = max(130, crop.height // 2)
            crop = hires.crop(
                (
                    max(0, cx - half_width),
                    max(0, cy - half_height),
                    min(hires.width, cx + half_width),
                    min(hires.height, cy + half_height),
                )
            )
        crop.thumbnail((1100, 720), Image.Resampling.LANCZOS)
        canvas = Image.new("RGB", (1100, 720), "white")
        x = (canvas.width - crop.width) // 2
        y = (canvas.height - crop.height) // 2
        canvas.paste(crop, (x, y))
        destination = FIGURES / f"lesson-{row['number']:02d}.jpg"
        canvas.save(destination, quality=91, optimize=True, progressive=True)
        row["figure"] = f"assets/physics7/figures/{destination.name}"
        row["figurePage"] = page


def make_contact(rows):
    thumbs = []
    for row in rows:
        image = Image.open(ROOT / row["figure"]).convert("RGB")
        image.thumbnail((270, 177))
        tile = Image.new("RGB", (300, 225), "#eef2f7")
        tile.paste(image, ((300 - image.width) // 2, 8))
        draw = ImageDraw.Draw(tile)
        draw.text((10, 190), f"{row['number']:02d}. {row['title'][:34]}", fill="#0f1c36")
        thumbs.append(tile)
    columns = 4
    rows_count = math.ceil(len(thumbs) / columns)
    sheet = Image.new("RGB", (columns * 300, rows_count * 225), "white")
    for index, thumb in enumerate(thumbs):
        sheet.paste(thumb, ((index % columns) * 300, (index // columns) * 225))
    CONTACT.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(CONTACT, optimize=True)


def main():
    if not PDF.exists():
        raise FileNotFoundError(PDF)
    if not LOW_RENDER.exists():
        raise FileNotFoundError(LOW_RENDER)
    rows = parse_lessons()
    reader = PdfReader(str(PDF))
    if len(reader.pages) < 190:
        raise RuntimeError(f"To‘liq darslik kutilgan edi, sahifalar soni: {len(reader.pages)}")
    assign_videos(rows)
    cached_figures = all((FIGURES / f"lesson-{row['number']:02d}.jpg").exists() for row in rows)
    if cached_figures:
        for row in rows:
            row["figure"] = f"assets/physics7/figures/lesson-{row['number']:02d}.jpg"
            row["figurePage"] = row["start"]
    else:
        make_figures(rows)

    lessons = []
    for index, row in enumerate(rows):
        end = rows[index + 1]["start"] - 1 if index + 1 < len(rows) else 188
        blocks = []
        for page_number in range(row["start"], end + 1):
            blocks.extend(page_blocks(reader, page_number, row["title"]))
        chapter = chapter_for(row["number"])
        summary = summary_from_blocks(blocks, row["relationship"])
        experiment = f"{EXPERIMENTS[chapter]} Kuzatuvni “{row['title']}” mavzusidagi asosiy qoida bilan izohlang."
        lesson = {
            "id": f"l{row['number']}",
            "chapter": chapter,
            "number": row["number"],
            "title": row["title"],
            "pages": f"{row['start']}–{end}" if row["start"] != end else str(end),
            "pageNumbers": list(range(row["start"], end + 1)),
            "summary": summary,
            "paragraphs": [
                summary,
                f"Asosiy bog‘lanish: {row['relationship']}",
                f"Amaliy ahamiyati: {APPLICATIONS[chapter]}",
            ],
            "formula": row["formula"],
            "formulaExplanation": row["relationship"],
            "unit": row["unit"],
            "relationship": row["relationship"],
            "application": APPLICATIONS[chapter],
            "theoryBlocks": blocks,
            "figure": row["figure"],
            "figurePage": row["figurePage"],
            "video": row["video"],
            "experimentVideo": None,
            "experiment": experiment,
            "experimentQuestion": f"Natija nima sababdan shunday bo‘ldi? Javobingizni “{row['title']}” mavzusining qonuniyati bilan tushuntiring.",
            "experimentExplanation": f"{row['relationship']} {APPLICATIONS[chapter]}",
            "simulation": "interactive",
            "problem": problem_for(row["number"], row["title"]),
            "reward": 90 + chapter * 15 + (20 if "Masalalar" in row["title"] or "Laboratoriya" in row["title"] else 0),
        }
        lessons.append(lesson)

    course = {
        "version": 1,
        "grade": 7,
        "chapters": CHAPTERS,
        "lessons": lessons,
        "totalPages": 192,
        "source": "Fizika 7-sinf, Respublika ta’lim markazi, 2022",
    }
    OUT.mkdir(parents=True, exist_ok=True)
    content = "window.PHYSICS_COURSE = " + json.dumps(course, ensure_ascii=False, separators=(",", ":")) + ";\n"
    (OUT / "physics-content.js").write_text(content, encoding="utf-8")
    make_contact(rows)

    report = {
        "pages": len(reader.pages),
        "chapters": len(CHAPTERS),
        "lessons": len(lessons),
        "theoryBlocks": sum(len(lesson["theoryBlocks"]) for lesson in lessons),
        "figures": sum(bool(lesson["figure"]) for lesson in lessons),
        "videos": sum(bool(lesson["video"]) for lesson in lessons),
        "problems": sum(bool(lesson["problem"]) for lesson in lessons),
        "first": lessons[0]["title"],
        "last": lessons[-1]["title"],
    }
    (ROOT / "tmp" / "pdfs" / "physics7-report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
