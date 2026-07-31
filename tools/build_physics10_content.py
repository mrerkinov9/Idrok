import hashlib
import io
import json
import re
import sys
import unicodedata
from pathlib import Path

from PIL import Image
import pdfplumber
from pypdf import PdfReader

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT / "10-SINF FIZIKA DARSLIK 2022.pdf"
OUT = ROOT / "assets" / "physics10"
FIGURES = OUT / "figures"

TITLES = [
 "Kuchlarni qo‘shish","Markazga intilma kuch","Gravitatsiya maydonidagi harakat","Masalalar yechish: dinamika",
 "Jism og‘irligining harakat turiga bog‘liqligi","Jismning bir nechta kuch ta’siridagi harakati","Masalalar yechish: kuchlar",
 "Jismning qiya tekislikdagi harakati","Qiya tekislikda bajarilgan ish va FIK","Masalalar yechish: qiya tekislik",
 "Laboratoriya: qiya tekislikning FIKini aniqlash","Massa markazi, muvozanat turlari va kuch momenti",
 "Momentlar qoidasiga asoslangan oddiy mexanizmlar","Masalalar yechish: statika","Mexanik tebranishlar",
 "Prujinali va matematik mayatniklar","Laboratoriya: matematik mayatnik yordamida g ni aniqlash","Mexanik to‘lqinlar",
 "Tovush to‘lqinlari","Masalalar yechish: tebranishlar va to‘lqinlar","Suyuqlik va gazlar harakati",
 "Harakatlanayotgan gaz va suyuqlik bosimidan texnikada foydalanish","Masalalar yechish: gidrodinamika",
 "Elektr maydon kuchlanganligining superpozitsiya prinsipi","Zaryadlangan sharning elektr maydoni",
 "Masalalar yechish: elektr maydon","Elektrostatik maydonda zaryadni ko‘chirishda bajarilgan ish",
 "Elektr maydondagi zaryadning potensial energiyasi","Elektr maydon energiyasi",
 "Amaliy mashg‘ulot: energiyaning bir turdan boshqasiga aylanishi","Masalalar yechish: elektrostatika",
 "Tok kuchi va tok zichligi","To‘liq zanjir uchun Om qonuni","Masalalar yechish: o‘zgarmas tok",
 "Laboratoriya: tok manbaining EYKi va ichki qarshiligini aniqlash","Metall qarshiligining temperaturaga bog‘liqligi",
 "Masalalar yechish: qarshilik","Suyuqliklarda elektr toki","Faradeyning birinchi va ikkinchi qonuni",
 "Masalalar yechish: elektroliz","Elektrolizdan turmush va texnikada foydalanish","Gazlarda va vakuumda elektr toki",
 "Yarimo‘tkazgichlar va ularning metallardan farqi","Yarimo‘tkazgichlarning elektr o‘tkazuvchanligi",
 "Yarimo‘tkazgichli asboblar va ularning qo‘llanishi","Laboratoriya: diodning volt-amper tavsifi",
 "Magnit maydon induksiyasi va tokli o‘tkazgich magnit maydoni","Magnit maydonning tokli o‘tkazgichga ta’siri",
 "Tokli o‘tkazgichlarning o‘zaro ta’siri","Tokli o‘tkazgichni magnit maydonda ko‘chirishda bajarilgan ish",
 "Magnit maydonda zaryadli zarraning harakati","O‘zgarmas tok elektr dvigateli","Masalalar yechish: magnit maydon",
 "Elektromagnit induksiya","Amaliy mashg‘ulot: elektromagnit induksiya","O‘zinduksiya va induktivlik",
 "Masalalar yechish: elektromagnit induksiya","Tok magnit maydonining energiyasi va moddalarning magnit xossalari",
 "Masalalar yechish: magnit xossalar",
]
STARTS = [8,11,14,17,19,23,26,28,31,33,35,36,40,43,48,52,54,55,57,61,66,70,72,76,80,84,85,87,91,94,95,98,103,107,109,110,115,122,125,129,130,132,137,139,142,147,150,154,159,161,164,167,169,171,174,176,179,180,184]
CHAPTERS = [
 {"title":"Dinamika va statika elementlari","icon":"forces","accent":"#5b63e8"},
 {"title":"Mexanik tebranishlar va to‘lqinlar","icon":"wave","accent":"#e85b91"},
 {"title":"Gidrodinamika va aerodinamika","icon":"drop","accent":"#16a6a1"},
 {"title":"Elektrostatik maydon","icon":"charge","accent":"#f0a42c"},
 {"title":"O‘zgarmas tok qonunlari","icon":"circuit","accent":"#6c55df"},
 {"title":"Turli muhitlarda elektr toki","icon":"diode","accent":"#e5674e"},
 {"title":"Magnit maydon","icon":"magnet","accent":"#2784d8"},
]
CHAPTER_ENDS = [14,20,23,31,37,46,59]
FORMULAS = [
 "F = F₁ + F₂ + … (vektor yig‘indi)","F = mv²/R","v₁ = √(gR)","F = mv²/R","P = m(g ± a)","ΣF = ma","a = F/m",
 "ma = mg·sinα − Fᵢ","η = Afoydali/Asarflangan · 100%","A = Fs","η = mgh/(Fs) · 100%","M = Fd",
 "F₁l₁ = F₂l₂","ΣM = 0","x = A cos(ωt + φ)","T = 2π√(m/k); T = 2π√(l/g)","g = 4π²l/T²",
 "v = λν","I = P/S","v = λν","S₁v₁ = S₂v₂","p + ρv²/2 + ρgh = const","Q = Sv",
 "E = ΣEᵢ (vektor yig‘indi)","E = kq/r²","E = F/q","A = qEd","Wₚ = qφ","W = CU²/2","Wₖ ↔ Wₚ","φ = A/q",
 "I = q/t; j = I/S","I = ε/(R + r)","R = U/I","ε = U + Ir","R = R₀(1 + αΔT)","I = U/R",
 "m = kIt","m = (M/nF)It","t = m/(kI)","m = kIt","I = q/t","σ = qnμ","σ = 1/ρ",
 "I = I₀(e^(qU/kT) − 1)","I = f(U)","B = μ₀I/(2πr)","F = BIl·sinα","F = μ₀I₁I₂l/(2πr)",
 "A = BIls","F = qvB·sinα","M = BISN","F = BIl","ε = −ΔΦ/Δt","ε = −NΔΦ/Δt",
 "εL = −LΔI/Δt","L = εΔt/ΔI","W = LI²/2","μ = B/B₀",
]
UNITS = ["N","N","m/s","N","N","N","m/s²","N","%","J","%","N·m","N·m","N·m","m","s","m/s²","m/s","W/m²","m/s","m³/s","Pa","m³/s","N/C","N/C","N/C","J","J","J","J","V","A; A/m²","A","Ω","V","Ω","A","kg","kg","s","kg","A","S/m","S/m","A","A","T","N","N","J","N","N·m","N","V","V","V","H","J","—"]

def normalize(value):
    value = unicodedata.normalize("NFKD", str(value).lower())
    value = "".join(c for c in value if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9]+", " ", value.replace("o‘","o").replace("g‘","g")).strip()

def clean_line(value):
    value = str(value or "").replace("\u00ad", "").replace("ﬁ", "fi").replace("ﬂ", "fl")
    value = re.sub(r"\s+", " ", value).strip()
    return value

def page_blocks(page, page_number, title):
    raw = (page.extract_text() or "").replace("\x00", " ")
    lines = [clean_line(x) for x in raw.splitlines()]
    lines = [x for x in lines if x and x != str(page_number) and not re.fullmatch(r"[IVX]+ BOB.*", x)]
    blocks, current = [], ""
    for line in lines:
        if normalize(title) in normalize(line) and len(line) < len(title) + 24:
            continue
        if current.endswith("-") and line[:1].islower():
            current = current[:-1] + line
        elif current:
            current += " " + line
        else:
            current = line
        if len(current) > 180 and re.search(r"[.!?;:]$", line):
            blocks.append(current)
            current = ""
        elif len(current) > 520:
            blocks.append(current)
            current = ""
    if current:
        blocks.append(current)
    return [{"type":"paragraph","text":b,"page":page_number} for b in blocks if len(b) > 35]

def first_summary(blocks, title):
    for block in blocks:
        text = block["text"]
        if len(text) >= 100 and not re.match(r"^(Masala|Berilgan|Formula|Hisoblash|[0-9]+\.)", text):
            sentences = re.split(r"(?<=[.!?])\s+", text)
            result = " ".join(sentences[:2]).strip()
            return result[:520]
    return f"{title} mavzusida asosiy fizik qonun, kattaliklar orasidagi bog‘lanish va uning amaliy qo‘llanishi o‘rganiladi."

def video_pool(path):
    try:
        data = json.loads((ROOT / path).read_text(encoding="utf-8-sig"))
        return [x for x in data if x.get("title") and x.get("embed")]
    except Exception:
        return []

STOP = {"va","uchun","bilan","hamda","masalalar","yechish","laboratoriya","amaliy","mashgulot","qonuni","elektr","magnit"}
def score(title, item):
    q=[x for x in normalize(title).split() if len(x)>3 and x not in STOP]
    t=normalize(item.get("title",""))
    return sum(20 if x in t.split() else 8 if x in t else 0 for x in q)

def choose_unique(title, pool, used):
    ranked=sorted(((score(title,x),x) for x in pool if x.get("id") not in used),key=lambda z:z[0],reverse=True)
    if not ranked:
        return None,0
    value,item=ranked[0]
    used.add(item.get("id"))
    return item,value

def experiment_for(chapter, title):
    templates=[
      "Ip, yuk va dinamometr yordamida kuch yo‘nalishi hamda jism harakatini o‘zgartirib kuzating.",
      "Mayatnik yoki prujina yordamida tebranish davrini bir necha marta o‘lchab, o‘rtacha qiymatni toping.",
      "Suv oqimi kesimi o‘zgarganda tezlik va bosim qanday o‘zgarishini xavfsiz idishda kuzating.",
      "Mayda qog‘oz bo‘laklari va ishqalangan plastik jism bilan elektr maydon ta’sirini kuzating.",
      "Past kuchlanishli batareya, rezistor va o‘lchov asboblari bilan zanjir kattaliklarini taqqoslang.",
      "Xavfsiz past kuchlanishda turli materiallarning elektr o‘tkazuvchanligini taqqoslang.",
      "Magnit, kompas va izolyatsiyalangan sim yordamida magnit maydon yo‘nalishini kuzating.",
    ]
    return f"{templates[chapter]} Kuzatuvni “{title}” mavzusidagi formula bilan izohlang."

def extract_figure(plumber_pages, page_indices, target, used_hashes):
    candidates=[]
    for pi in page_indices[:2]:
        page=plumber_pages[pi]
        for item in page.images:
            x0,x1=float(item.get("x0",0)),float(item.get("x1",0))
            top,bottom=float(item.get("top",0)),float(item.get("bottom",0))
            width,height=x1-x0,bottom-top
            if width*height<1200 or min(width,height)<22 or max(width,height)/max(1,min(width,height))>7:
                continue
            if x0<8 and top<8:
                continue
            candidates.append((width*height,pi,(x0,top,x1,bottom)))
    if not candidates:
        return ""
    for _,pi,bbox in sorted(candidates,reverse=True):
        try:
            page=plumber_pages[pi]
            pad=8
            crop=(max(0,bbox[0]-pad),max(0,bbox[1]-pad),min(page.width,bbox[2]+pad),min(page.height,bbox[3]+pad))
            image=page.crop(crop).to_image(resolution=170).original.convert("RGB")
            buf=io.BytesIO(); image.save(buf,format="PNG",optimize=True)
            data=buf.getvalue(); digest=hashlib.sha1(data).hexdigest()
            if digest in used_hashes:
                continue
            used_hashes.add(digest); target.write_bytes(data)
            return target.relative_to(ROOT).as_posix()
        except Exception:
            continue
    return ""

def main():
    OUT.mkdir(parents=True,exist_ok=True)
    FIGURES.mkdir(parents=True,exist_ok=True)
    reader=PdfReader(str(PDF))
    primary=video_pool("tmp/kau_videos.json")+video_pool("tmp/kau_astronomiya_videos.json")
    experiments=video_pool("tmp/pizik_lab_videos.json")+video_pool("tmp/Fizikadan_tajribalar_videos.json")
    used_videos,used_experiments,used_figures=set(),set(),set()
    lessons=[]
    chapter=0
    for index,(title,start) in enumerate(zip(TITLES,STARTS),start=1):
        while index>CHAPTER_ENDS[chapter]:
            chapter+=1
        end=(STARTS[index]-1) if index<len(STARTS) else 189
        page_numbers=list(range(start,end+1))
        blocks=[]
        for page_number in page_numbers:
            blocks.extend(page_blocks(reader.pages[page_number-1],page_number,title))
        summary=first_summary(blocks,title)
        figure_target=FIGURES/f"lesson-{index:02}.png"
        figure=figure_target.relative_to(ROOT).as_posix() if figure_target.exists() else ""
        video,vscore=choose_unique(title,primary,used_videos)
        exp,escore=choose_unique(title+" tajriba",experiments,used_experiments)
        relation=f"{FORMULAS[index-1]} munosabati mavzudagi asosiy fizik kattaliklarning bir-biriga qanday bog‘lanishini ko‘rsatadi."
        application=f"{title} qonuniyatlari texnika, muhandislik va kundalik fizik hodisalarni tahlil qilishda qo‘llanadi."
        lessons.append({
          "id":f"l{index}","chapter":chapter,"number":index,"title":title,
          "pages":str(start) if start==end else f"{start}–{end}","pageNumbers":page_numbers,
          "summary":summary,"paragraphs":[summary,f"Asosiy bog‘lanish: {relation}",f"Amaliy ahamiyati: {application}"],
          "formula":FORMULAS[index-1],"unit":UNITS[index-1],"relationship":relation,"application":application,
          "theoryBlocks":blocks,"figure":figure,"figurePage":start,
          "experiment":experiment_for(chapter,title),
          "experimentQuestion":f"Kuzatuv natijasi nima sababdan shunday bo‘ldi? Javobingizni “{title}” mavzusidagi asosiy qoida bilan izohlang.",
          "experimentExplanation":f"Hodisa {FORMULAS[index-1]} bog‘lanishi va energiya hamda kuchlarning saqlanish qonunlari asosida tushuntiriladi.",
          "simulation":"interactive","reward":110+chapter*15+(20 if "Masalalar" in title else 0)+(30 if "Laboratoriya" in title else 0),
          "video":({
             "id":video.get("id"),"title":video.get("title"),"duration":video.get("duration",""),"source":video.get("source",""),
             "embed":video.get("embed"),"provider":video.get("provider","O‘zbekcha fizika"),"type":video.get("type","youtube"),
             "matchScore":vscore,"verified":vscore>=16
          } if video else {"verified":False}),
          "experimentVideo":({
             "id":exp.get("id"),"title":exp.get("title"),"duration":exp.get("duration",""),"source":exp.get("source",""),
             "embed":exp.get("embed"),"provider":"O‘zbekcha fizika tajribalari","matchScore":escore,"verified":escore>=16
          } if exp else {"verified":False}),
        })
    output={"version":10,"grade":10,"chapters":CHAPTERS,"lessons":lessons,"totalPages":192}
    (OUT/"physics-content.js").write_text("window.PHYSICS_COURSE = "+json.dumps(output,ensure_ascii=False,separators=(",",":"))+";\n",encoding="utf-8")
    report={
      "lessons":len(lessons),"chapters":len(CHAPTERS),"theoryBlocks":sum(len(x["theoryBlocks"]) for x in lessons),
      "figures":sum(bool(x["figure"]) for x in lessons),"verifiedVideos":sum(bool(x["video"].get("verified")) for x in lessons),
      "verifiedExperiments":sum(bool(x["experimentVideo"].get("verified")) for x in lessons),
    }
    (ROOT/"tmp"/"physics10-content-report.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=="__main__":
    main()
