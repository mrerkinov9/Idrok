import json
import re
import unicodedata
from difflib import SequenceMatcher
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OCR_PATH = ROOT / "tmp" / "pdfs" / "ocr" / "physics-ocr-hi.json"
FIGURE_MANIFEST_PATH = ROOT / "assets" / "physics" / "figures" / "manifest.json"
REVIEW_PAGE_ENDS = {14: 49, 25: 80, 30: 93, 43: 130, 57: 163}


OCR_REPLACEMENTS = {
    "http://eduportal.uz": "",
    "Molekulyar - kinetik": "Molekulyar-kinetik",
    "molekulyar - kinetik": "molekulyar-kinetik",
    "o 'z": "o‘z",
    "O 'z": "O‘z",
    "g '": "g‘",
    "G '": "G‘",
    "bo '": "bo‘",
    "to '": "to‘",
    "ko '": "ko‘",
    "yo '": "yo‘",
}


def clean_ocr_line(value):
    value = str(value or "").replace("\u00ad", "").replace("—", "–")
    for old, new in OCR_REPLACEMENTS.items():
        value = value.replace(old, new)
    value = re.sub(r"([A-Za-zÀ-ž‘’])\-\s+([a-zà-ž‘’]{2,})", r"\1\2", value)
    value = re.sub(r"([oOgG])'", r"\1‘", value)
    value = value.replace("'", "’")
    value = re.sub(r"\bmoleku\s+lal", "molekulal", value, flags=re.IGNORECASE)
    value = re.sub(r"\bV\s+IV\b", "V–IV", value)
    value = re.sub(r"\(D\s*(?=\d+[.)])", "", value)
    value = re.sub(r"\s+([,.;:!?])", r"\1", value)
    value = re.sub(r"\(\s+", "(", value)
    value = re.sub(r",(?=[A-Za-zÀ-ž‘’])", ", ", value)
    value = re.sub(r"\s{2,}", " ", value).strip(" •")
    value = re.sub(r"^([Il])[-–]s\.", "1-§.", value)
    value = re.sub(r"^(\d+)[-–]s\.", r"\1-§.", value)
    return value.strip()


def heading_like(value):
    letters = [char for char in value if char.isalpha()]
    if len(letters) < 5:
        return False
    uppercase_ratio = sum(char.isupper() for char in letters) / len(letters)
    return uppercase_ratio > 0.76 or bool(re.match(r"^\d+\s*[-–]?\s*§", value))


def similar_title(value, title):
    left = normalize(value)
    right = normalize(title)
    if not left or not right:
        return False
    left_tokens = set(left.split())
    right_tokens = set(right.split())
    coverage = len(left_tokens & right_tokens) / max(1, min(len(left_tokens), len(right_tokens)))
    return right in left or left in right or coverage > 0.72 or SequenceMatcher(None, left, right).ratio() > 0.72


def join_ocr_lines(lines):
    result = ""
    for line in lines:
        text = line["text"]
        if not result:
            result = text
        elif result.endswith("-") and text[:1].islower():
            result = result[:-1] + text
        else:
            result += " " + text
    return clean_ocr_line(result)


def build_theory_blocks(page_numbers, lesson_title, ocr_pages):
    blocks = []
    for page_number in page_numbers:
        page = ocr_pages.get(page_number)
        if not page:
            continue
        width = float(page.get("width") or 1241)
        height = float(page.get("height") or 1772)
        lines = []
        for raw in page.get("lines", []):
            text = clean_ocr_line(raw.get("text"))
            if not text or "eduportal" in text.lower():
                continue
            if float(raw.get("y", 0)) > height * 0.90 and re.fullmatch(r"\d{1,3}", text):
                continue
            if re.fullmatch(r"(?:[IVXLC]+|\d+)\s*BOB", text, re.IGNORECASE):
                continue
            lines.append({
                "text": text,
                "x": float(raw.get("x", 0)),
                "y": float(raw.get("y", 0)),
                "height": float(raw.get("height", 20)),
            })
        if not lines:
            continue
        lines.sort(key=lambda item: (item["y"], item["x"]))
        steps = [lines[i]["y"] - lines[i - 1]["y"] for i in range(1, len(lines))]
        normal_steps = sorted(step for step in steps if 12 <= step <= 70)
        normal_step = normal_steps[len(normal_steps) // 2] if normal_steps else 34

        groups = []
        current = []
        for line in lines:
            if not current:
                current = [line]
                continue
            previous = current[-1]
            gap = line["y"] - previous["y"]
            starts_paragraph = (
                gap > normal_step * 1.48
                or heading_like(line["text"])
                or heading_like(previous["text"])
                or (
                    previous["text"].endswith((".", "?", "!", ":"))
                    and line["x"] - previous["x"] > width * 0.025
                )
            )
            if starts_paragraph:
                groups.append(current)
                current = [line]
            else:
                current.append(line)
        if current:
            groups.append(current)

        for group in groups:
            text = join_ocr_lines(group)
            if len(text) < 2 or re.fullmatch(r"\d{1,3}", text):
                continue
            is_heading = heading_like(text) and len(text) < 150
            if is_heading and similar_title(text, lesson_title):
                continue
            if is_heading and any(word in normalize(text) for word in ("bob", "asoslari")) and page_number == page_numbers[0]:
                continue
            blocks.append({
                "type": "heading" if is_heading else "paragraph",
                "text": text,
                "page": page_number,
            })

    compact = []
    for block in blocks:
        if (
            compact
            and block["type"] == "paragraph"
            and compact[-1]["type"] == "paragraph"
            and len(compact[-1]["text"]) < 170
            and len(block["text"]) < 260
            and compact[-1]["page"] == block["page"]
        ):
            compact[-1]["text"] = clean_ocr_line(compact[-1]["text"] + " " + block["text"])
        else:
            compact.append(block)
    return compact


CHAPTERS = [
    {"title": "Modda tuzilishining molekulyar-kinetik nazariyasi asoslari", "icon": "atom", "accent": "#6757e8"},
    {"title": "Ichki energiya va termodinamika elementlari", "icon": "heat", "accent": "#ff7657"},
    {"title": "Issiqlik dvigatellari", "icon": "engine", "accent": "#f2b23f"},
    {"title": "Suyuq va qattiq jismlarning xossalari", "icon": "drop", "accent": "#11a9a1"},
    {"title": "Optika: yorug‘lik qonunlari va optik asboblar", "icon": "prism", "accent": "#ec5f9e"},
    {"title": "Olamning fizik manzarasi va fizika-texnika taraqqiyoti", "icon": "cosmos", "accent": "#367dd9"},
]


def lesson(title, start, end, summary, formula, unit, relationship, application,
           experiment, video_query, experiment_query, simulation):
    return {
        "title": title,
        "start": start,
        "end": end,
        "summary": summary,
        "formula": formula,
        "unit": unit,
        "relationship": relationship,
        "application": application,
        "experiment": experiment,
        "videoQuery": video_query,
        "experimentQuery": experiment_query,
        "simulation": simulation,
    }


LESSONS = [
    # I bob — 1–14
    lesson("Modda tuzilishining molekulyar-kinetik nazariyasi", 4, 6,
           "Barcha moddalar atom va molekulalardan tuzilgan; zarralar uzluksiz tartibsiz harakat qiladi va o‘zaro ta’sirlashadi.",
           "n = N / V", "m⁻³", "Temperatura ortsa, zarralarning tartibsiz harakati va diffuziya tezlashadi.",
           "Atir hidining xonaga tarqalishi va Broun harakati MKT dalillaridir.",
           "Sovuq va iliq suvga bir vaqtda siyoh tomizib, diffuziya tezligini taqqoslang.",
           "gazlarning molekulyar nazariyasi Broun harakati diffuziya", "molekula diffuziya Broun", "particles"),
    lesson("Molekulaning massasi va o‘lchami", 7, 11,
           "Molekulalar juda kichik bo‘lib, ularning massasi molyar massa va Avogadro soni yordamida baholanadi.",
           "m₀ = M / Nₐ", "kg; m", "Bir molekula massasi molyar massaga to‘g‘ri, Avogadro soniga teskari proporsional.",
           "Yog‘ tomchisining yupqa qatlamini o‘lchash molekula o‘lchamini taxmin qilishga yordam beradi.",
           "Suv yuzasiga juda kichik moy tomchisini qo‘yib, yoyilgan doira yuzini kuzating.",
           "makroholatlar mikroholatlar molekula o‘lchami massasi", "molekula moy tomchisi", "scale"),
    lesson("Modda miqdori", 12, 15,
           "Modda miqdori zarrachalar sonini ifodalaydi; bir mol modda Avogadro sonicha zarrachani tutadi.",
           "ν = N / Nₐ = m / M", "mol", "Massa ortishi bilan, molyar massa o‘zgarmasa, modda miqdori ham ortadi.",
           "Kimyoviy va termodinamik hisoblarda modda miqdori massa bilan zarralar sonini bog‘laydi.",
           "Bir xil massadagi suv va osh tuzi uchun modda miqdori nega farq qilishini jadvalda taqqoslang.",
           "modda miqdori ideal gaz formulasi mol Avogadro", "mol modda miqdori", "particles"),
    lesson("Masalalar yechish: molekula va modda miqdori", 16, 17,
           "Molekula soni, massa, molyar massa va modda miqdori orasidagi bog‘lanishlar ketma-ket qo‘llanadi.",
           "N = νNₐ; m = νM", "mol; kg", "Berilgan kattaliklar SI ga o‘tkazilib, avval modda miqdori, keyin zarrachalar soni topiladi.",
           "Gaz, suyuqlik va qattiq moddadagi molekulalar sonini hisoblashda bir xil algoritm ishlaydi.",
           "100 ml suv massasini o‘lchab, undagi taxminiy molekulalar sonini hisoblang.",
           "gazning modda miqdorini topish misol", "molekula soni tajriba", "measure"),
    lesson("Ideal gaz", 18, 20,
           "Ideal gaz modelida molekulalar hajmi va ularning to‘qnashuvdan tashqari o‘zaro ta’siri e’tiborga olinmaydi.",
           "p = ⅓m₀n⟨v²⟩", "Pa", "Zarralar konsentratsiyasi yoki o‘rtacha tezligi ortsa, gaz bosimi ortadi.",
           "Siyrak gazlarni o‘rganishda ideal gaz modeli real jarayonlarni yaxshi yaqinlashtiradi.",
           "Yopiq plastik idishni iliq va sovuq suvga tushirib, devorlar holatidagi farqni kuzating.",
           "ideal gaz molekulyar nazariya bosim", "gaz bosimi shar", "piston"),
    lesson("Temperatura", 21, 24,
           "Temperatura jismning issiqlik holatini va zarralarining o‘rtacha kinetik energiyasini tavsiflaydi.",
           "T = t + 273.15", "K; °C", "Kelvin temperaturasi ortishi bilan zarralarning o‘rtacha kinetik energiyasi ortadi.",
           "Mutlaq temperatura gaz qonunlari va termodinamik hisoblarning asosiy parametridir.",
           "Muzli, xona haroratidagi va iliq suv temperaturalarini bir termometrda navbat bilan o‘lchang.",
           "harorat Kelvin shkalasi mutlaq temperatura", "harorat termometr", "thermometer"),
    lesson("Gaz molekulalarining harakat tezligi", 25, 27,
           "Gaz molekulalari turli tezliklarda harakat qiladi, ularning o‘rtacha kvadratik tezligi temperatura va molyar massaga bog‘liq.",
           "vᵣₘₛ = √(3RT / M)", "m/s", "Temperatura ortsa tezlik ortadi, molyar massa ortsa tezlik kamayadi.",
           "Yengil gazlarning og‘ir gazlarga nisbatan tezroq tarqalishi shu bog‘lanish bilan tushuntiriladi.",
           "Atir hidining iliq va salqin joyda tarqalish vaqtini xavfsiz masofada taqqoslang.",
           "Maksvell Boltsman taqsimoti molekulalar tezligi", "gaz molekula tezligi", "particles"),
    lesson("Masalalar yechish: temperatura va tezlik", 28, 29,
           "Temperatura, molyar massa va molekulalarning o‘rtacha tezligi haqidagi formulalar masalalarda birgalikda ishlatiladi.",
           "v₂ / v₁ = √(T₂M₁ / T₁M₂)", "m/s", "Bir xil gazda temperatura to‘rt marta ortsa, o‘rtacha kvadratik tezlik ikki marta ortadi.",
           "Turli gazlarning bir xil temperaturadagi tezliklarini nisbat orqali tez hisoblash mumkin.",
           "Ikki xil temperaturada hid tarqalish vaqtini o‘lchab, tezliklar nisbatini baholang.",
           "Maksvell Boltsman tezlik misol", "tezlik harorat tajriba", "measure"),
    lesson("Ideal gaz holatining tenglamalari", 30, 32,
           "Ideal gazning bosimi, hajmi, temperaturasi va modda miqdori Mendeleyev–Klapeyron tenglamasi bilan bog‘lanadi.",
           "pV = νRT", "Pa·m³ = J", "Modda miqdori o‘zgarmasa pV/T nisbat doimiy qoladi.",
           "Ballonlar, nasoslar va yopiq idishlardagi gaz holatini hisoblashda tenglama qo‘llanadi.",
           "Shprits uchini yopib, porshenni sekin bosganda hajm va qarshilik qanday o‘zgarishini kuzating.",
           "ideal gaz qonunlari pV nRT", "gaz shprits bosim", "piston"),
    lesson("Izotermik jarayon", 33, 34,
           "Izotermik jarayonda temperatura o‘zgarmaydi, bosim va hajm esa teskari proporsional o‘zgaradi.",
           "p₁V₁ = p₂V₂", "Pa·m³", "T = const bo‘lganda hajm kamayishi bosimning ortishiga olib keladi.",
           "Sekin siqilayotgan gaz atrof bilan issiqlik almashib, temperaturasini deyarli o‘zgartirmaydi.",
           "Yopiq shprits porshenini sekin bosib, hajm kamayganda qarshilik ortishini his qiling.",
           "izotermik jarayon bajarilgan ish Boyle Mariott", "izotermik shprits", "piston"),
    lesson("Izobarik jarayon", 35, 36,
           "Izobarik jarayonda bosim o‘zgarmaydi, gaz hajmi mutlaq temperaturaga to‘g‘ri proporsional.",
           "V₁ / T₁ = V₂ / T₂", "m³/K", "p = const bo‘lganda temperatura ortsa hajm ham ortadi.",
           "Erkin harakatlanuvchi porshen ostidagi gazni qizdirish izobarik jarayonga yaqin.",
           "Bo‘sh sharni iliq va sovuq shisha og‘ziga kiydirib, hajm o‘zgarishini kuzating.",
           "ideal gaz qonunlari izobarik jarayon Charles", "shar issiq sovuq havo", "piston"),
    lesson("Izoxorik jarayon", 37, 37,
           "Izoxorik jarayonda hajm o‘zgarmaydi, gaz bosimi mutlaq temperaturaga to‘g‘ri proporsional.",
           "p₁ / T₁ = p₂ / T₂", "Pa/K", "V = const bo‘lganda temperatura ortsa bosim ham ortadi.",
           "Qattiq yopilgan idishdagi gazning qizishi izoxorik jarayonga misol bo‘ladi.",
           "Qopqog‘i mahkam plastik idishni iliq va sovuq suvda kuzating; juda issiq suv ishlatmang.",
           "ideal gaz qonunlari izoxorik jarayon Gay Lyussak", "yopiq idish gaz harorat", "piston"),
    lesson("Amaliy mashg‘ulot: molekulalarning o‘lchamini baholash", 38, 39,
           "Yog‘ tomchisi hajmi va uning suv yuzasida hosil qilgan qatlam yuzi orqali molekula diametri baholanadi.",
           "d ≈ V / S", "m", "Tomchi hajmi o‘zgarmasa qatlam yuzi katta bo‘lgani sari uning qalinligi kichrayadi.",
           "Bu tajriba bevosita ko‘rinmaydigan molekula o‘lchamini makroskopik o‘lchovlardan topadi.",
           "Likopchadagi suvga juda kichik moy tomizib, doira diametrini o‘lchang va yuzini hisoblang.",
           "molekula o‘lchamini baholash makro mikro", "moy tomchisi molekula", "scale"),
    lesson("Masalalar yechish: gaz qonunlari", 40, 43,
           "Gazning bir holatdan ikkinchisiga o‘tishida bosim, hajm va temperatura qiymatlari umumiy gaz qonuni bilan bog‘lanadi.",
           "p₁V₁ / T₁ = p₂V₂ / T₂", "Pa·m³/K", "Uch parametrdan ikkitasi o‘zgarsa, uchinchi parametr tenglamadan aniqlanadi.",
           "Meteorologiya, pnevmatika va ballon hisoblarida umumiy gaz qonuni ishlatiladi.",
           "Shpritsdagi havo hajmini ikki holatda o‘lchab, bosim o‘zgarishini sifat jihatdan izohlang.",
           "PV diagrammalar ideal gaz masalalar", "gaz qonuni tajriba", "piston"),

    # II bob — 15–25
    lesson("Ichki energiya", 50, 52,
           "Jismning ichki energiyasi uni tashkil etgan zarralarning kinetik va o‘zaro ta’sir potensial energiyalari yig‘indisidir.",
           "U = Eₖ + Eₚ", "J", "Temperatura yoki agregat holat o‘zgarsa, jismning ichki energiyasi ham o‘zgaradi.",
           "Ish bajarish va issiqlik uzatish ichki energiyani o‘zgartirishning ikki usulidir.",
           "Metall simni bir necha marta bukib, bukilgan joyning isishini ehtiyotkorlik bilan tekshiring.",
           "ichki energiya haqida batafsil", "ichki energiya ishqalanish", "thermal"),
    lesson("Termodinamik ish", 53, 54,
           "Gaz kengayganda tashqi kuchlarga qarshi ish bajaradi; siqilganda esa gaz ustida ish bajariladi.",
           "A = pΔV", "J", "Doimiy bosimda hajm o‘zgarishi qancha katta bo‘lsa, bajarilgan ish shuncha katta.",
           "Porshenli dvigatellar va kompressorlarda gaz ishi asosiy jarayondir.",
           "Velosiped nasosini tez siqib, korpusning isishini sezib ko‘ring.",
           "kengayish ishi termodinamik ish", "nasos siqish issiqlik", "piston"),
    lesson("Issiqlik miqdori", 55, 59,
           "Jismni isitish yoki sovitishda berilgan issiqlik miqdori massa, solishtirma issiqlik sig‘imi va temperatura o‘zgarishiga bog‘liq.",
           "Q = cmΔT", "J", "Bir xil modda uchun massa yoki temperatura o‘zgarishi ortsa, zarur issiqlik miqdori ham ortadi.",
           "Ovqat pishirish, isitish tizimi va material tanlashda issiqlik sig‘imi muhim.",
           "Bir xil massali suv va o‘simlik yog‘ini teng vaqt isitib, temperatura o‘zgarishini solishtiring.",
           "issiqlik sig‘imi issiqlik miqdori", "issiqlik sigimi suv moy", "calorimeter"),
    lesson("Masalalar yechish: issiqlik miqdori", 60, 62,
           "Issiqlik masalalarida massa kilogrammda, temperatura farqi gradusda olinib, Q = cmΔT munosabati bosqichma-bosqich qo‘llanadi.",
           "c = Q / (mΔT)", "J/(kg·K)", "Bir xil Q va m da temperaturasi kamroq o‘zgargan moddaning issiqlik sig‘imi kattaroq.",
           "Noma’lum modda turini tajribada uning solishtirma issiqlik sig‘imi orqali aniqlash mumkin.",
           "Bir piyola suv massasini va sovish vaqtida temperatura o‘zgarishini jadvalga yozing.",
           "issiqlik sig‘imi misol masala", "suv sovish harorat", "calorimeter"),
    lesson("Amaliy mashg‘ulot: jismlarda issiqlik muvozanati", 63, 63,
           "Turli temperaturadagi jismlar tutashtirilganda issiqlik issiq jismdan sovuq jismga o‘tib, umumiy temperatura qaror topadi.",
           "Qᵦₑᵣ = Qₒₗ", "J", "Ideal yopiq tizimda issiq jism bergan issiqlik sovuq jism olgan issiqlikka teng.",
           "Kalorimetriya usuli jismlarning issiqlik xossalarini o‘lchashda ishlatiladi.",
           "Iliq va salqin suvni aralashtirib, yakuniy temperaturaning ikkala boshlang‘ich qiymat orasida ekanini tekshiring.",
           "issiqlik muvozanati issiqlik uzatilishi", "issiq sovuq suv aralashtirish", "calorimeter"),
    lesson("Laboratoriya: qattiq jismlarning solishtirma issiqlik sig‘imi", 64, 64,
           "Qizdirilgan qattiq jism suvga tushiriladi va issiqlik balansi orqali uning solishtirma issiqlik sig‘imi topiladi.",
           "cⱼ = cₛmₛ(T − Tₛ) / [mⱼ(Tⱼ − T)]", "J/(kg·K)", "Jism bergan issiqlik suv olgan issiqlikka teng deb olinadi.",
           "Metallarni aniqlash va issiqlik texnikasida material xossalarini baholashda usul qo‘llanadi.",
           "Faqat o‘qituvchi nazoratida iliq metall buyum va suv bilan issiqlik almashinuvini kuzating.",
           "yog‘och temir issiqlik o‘tkazuvchanligi solishtirish", "metall suv issiqlik tajriba", "calorimeter"),
    lesson("Yoqilg‘ining solishtirma yonish issiqligi", 65, 66,
           "Solishtirma yonish issiqligi bir kilogramm yoqilg‘i to‘liq yonganda ajraladigan energiyani ifodalaydi.",
           "Q = qm", "J/kg", "Yoqilg‘i massasi ikki marta ortsa, to‘liq yonishda ajraladigan issiqlik ham ikki marta ortadi.",
           "Energetika va transportda yoqilg‘ilar samaradorligini taqqoslashda q kattaligi ishlatiladi.",
           "Olov yoqmasdan, turli yoqilg‘ilarning jadvaldagi q qiymatlari bo‘yicha 1 kg uchun energiyasini taqqoslang.",
           "ishqalanish issiqlik energiyasi yonish yoqilg‘i", "yonish issiqlik tajriba", "combustion"),
    lesson("Termodinamikaning birinchi qonuni", 67, 69,
           "Sistemaga berilgan issiqlik uning ichki energiyasini o‘zgartirishga va tashqi kuchlarga qarshi ish bajarishga sarflanadi.",
           "Q = ΔU + A", "J", "Energiya yo‘qolmaydi: u issiqlik, ichki energiya va ish ko‘rinishlari orasida almashinadi.",
           "Dvigatel, sovutgich va issiqlik almashinuvi hisoblarining energiya balansi shu qonunga tayanadi.",
           "Havo to‘ldirilgan shpritsni tez va sekin siqib, temperatura ta’sirini sifat jihatdan solishtiring.",
           "termodinamikaning birinchi qonuni ichki energiya", "termodinamika shprits", "thermal"),
    lesson("Masalalar yechish: termodinamikaning birinchi qonuni", 70, 71,
           "Masalalarda issiqlik, ichki energiya o‘zgarishi va ishning ishoralari jarayon yo‘nalishiga qarab tanlanadi.",
           "ΔU = Q − A", "J", "Gaz ish bajarsa A musbat, gaz ustida ish bajarilsa tanlangan ishora tizimida A manfiy olinadi.",
           "Energiya balansini to‘g‘ri yozish issiqlik qurilmalaridagi yo‘qotishlarni aniqlaydi.",
           "Uch xil Q va A qiymati uchun ΔU ni hisoblab, natijalarni jadvalda taqqoslang.",
           "termodinamika birinchi qonun misollar", "energiya balansi tajriba", "thermal"),
    lesson("Issiqlik jarayonlarining qaytmasligi. Termodinamikaning ikkinchi qonuni", 72, 72,
           "Tabiiy issiqlik jarayonlari ma’lum yo‘nalishda kechadi: issiqlik o‘z-o‘zidan sovuq jismdan issiq jismga o‘tmaydi.",
           "ΔS ≥ 0", "J/K", "Yopiq sistemadagi qaytmas jarayonda entropiya kamaymaydi.",
           "Ikkinchi qonun issiqlik dvigatelining FIKi nega 100% bo‘la olmasligini tushuntiradi.",
           "Iliq va sovuq suv aralashgach, ularning o‘z-o‘zidan yana ajralmasligini kuzatuv sifatida izohlang.",
           "entropiya termodinamika ikkinchi qonun qaytmas jarayon", "issiq sovuq qaytmas", "entropy"),
    lesson("Laboratoriya: suvlarni aralashtirishda issiqlik miqdorini taqqoslash", 73, 73,
           "Turli temperaturadagi suvlar aralashtirilganda issiq suv bergan va sovuq suv olgan issiqlik miqdorlari tajribada taqqoslanadi.",
           "c m₁(T₁ − T) ≈ c m₂(T − T₂)", "J", "Issiqlik yo‘qotishlari kichik bo‘lsa, berilgan va olingan issiqliklar deyarli teng.",
           "Laboratoriya issiqlik balansi va o‘lchash xatoligini amalda ko‘rsatadi.",
           "Teng massali iliq va salqin suvni aralashtirib, boshlang‘ich va yakuniy temperaturalarni yozing.",
           "issiqlik uzatilishi suv aralashtirish laboratoriya", "suv aralashtirish issiqlik", "calorimeter"),

    # III bob — 26–30
    lesson("Ichki yonuv dvigatellari", 81, 82,
           "Ichki yonuv dvigatelida yoqilg‘i silindr ichida yonib, gaz bosimi porshenni harakatga keltiradi.",
           "η = A / Q₁", "%", "Foydali ish ortib, yoqilg‘idan olingan issiqlik o‘zgarmasa FIK ortadi.",
           "Avtomobil dvigatelining so‘rish, siqish, ish yo‘li va chiqarish taktlarini tushuntiradi.",
           "Qog‘ozdan porshen-silindr maketi yasab, to‘rt takt ketma-ketligini strelkalar bilan ko‘rsating.",
           "Karno dvigateli issiqlik dvigateli ishlash prinsipi", "ichki yonuv dvigatel", "engine"),
    lesson("Issiqlik dvigatellarining ishlash prinsipi", 83, 85,
           "Issiqlik dvigateli isitkichdan Q₁ oladi, uning bir qismini ishga aylantiradi va qolgan Q₂ ni sovitkichga beradi.",
           "A = Q₁ − Q₂", "J", "Q₂ nol bo‘lmagani uchun real issiqlik dvigatelining FIKi doim 100% dan kichik.",
           "Bug‘ turbinalari, ichki yonuv dvigateli va reaktiv dvigatellar umumiy energiya aylanishiga ega.",
           "Shamol g‘ildiragi maketini iliq havo oqimiga yaqinlashtirib, issiqlikdan harakat hosil bo‘lishini kuzating; olov ishlatmang.",
           "Karno sikli Karno dvigateli", "issiqlik dvigatel maket", "engine"),
    lesson("Masalalar yechish: issiqlik dvigatellari", 86, 86,
           "Dvigatel masalalarida isitkichdan olingan issiqlik, bajarilgan ish, sovitkichga berilgan issiqlik va FIK bog‘lanadi.",
           "η = (Q₁ − Q₂) / Q₁ · 100%", "%", "Q₁ bir xil bo‘lsa, Q₂ kamayishi FIKning ortishiga olib keladi.",
           "Yoqilg‘i sarfi va foydali ish orqali transport vositasi samaradorligi baholanadi.",
           "Uch xil Q₁ va Q₂ juftligi uchun FIKni hisoblab, eng samarali holatni toping.",
           "Karno issiqlik mashinasi foydali ish koeffitsiyenti", "dvigatel FIK tajriba", "engine"),
    lesson("Issiqlik mashinalari va tabiatni muhofaza qilish", 87, 88,
           "Issiqlik mashinalari foydali ish bilan birga chiqindi issiqlik va zararli gazlar chiqaradi, shu sabab samaradorlik va ekologiya birga baholanadi.",
           "mCO₂ = k · mᵧ", "kg", "Yoqilg‘i sarfi kamayganda bir xil yo‘l uchun chiqariladigan zararli modda ham kamayadi.",
           "Elektromobil, jamoat transporti va qayta tiklanuvchi energiya havoni ifloslantirishni kamaytiradi.",
           "Bir haftalik transport qatnovingizni jadvalga yozib, piyoda yoki jamoat transporti bilan kamayadigan masofani hisoblang.",
           "energiya samaradorligi issiqlik mashinasi tabiat", "ekologiya dvigatel tajriba", "engine"),
    lesson("Masalalar yechish: FIK va ekologiya", 89, 90,
           "FIK, yoqilg‘i energiyasi, foydali ish va chiqindi issiqlik bo‘yicha hisoblar qurilmaning iqtisodiy hamda ekologik samaradorligini ko‘rsatadi.",
           "A = ηqm", "J", "Bir xil foydali ish uchun FIK ortsa kerakli yoqilg‘i massasi kamayadi.",
           "Dvigatel tanlashda quvvat bilan birga yoqilg‘i sarfi va emissiya ham hisobga olinadi.",
           "Ikki shartli dvigatelning FIK va yoqilg‘i sarfini hisoblab, qaysi biri ekologikroq ekanini izohlang.",
           "Karno FIK misol issiqlik mashinasi", "FIK yoqilgi ekologiya", "engine"),

    # IV bob — 31–43
    lesson("Suyuqlikning xossalari", 94, 96,
           "Suyuqlik oqadi, idish shaklini oladi va erkin sirt hosil qiladi; molekulalararo kuchlar sirt tarangligini yuzaga keltiradi.",
           "F = σl", "N/m", "Sirt chizig‘i uzunligi ortsa, sirt taranglik kuchi ham ortadi.",
           "Suv tomchisi shakli, sovun pufagi va mayda jismlarning suv sirtida turishi shu hodisa bilan bog‘liq.",
           "Suv yuziga ehtiyotkorlik bilan qog‘oz qisqich qo‘yib, sirt pardasini kuzating.",
           "suyuqlik sirt taranglik kuchi kapillyarlik", "sirt taranglik suv", "surface"),
    lesson("Ho‘llash. Kapillyar hodisalar", 97, 99,
           "Suyuqlikning qattiq jismga yopishish kuchi ichki tortishishdan katta bo‘lsa ho‘llash, kapillyar nayda esa ko‘tarilish yuz beradi.",
           "h = 2σcosθ / (ρgr)", "m", "Kapillyar radiusi kichraygan sari suyuqlikning ko‘tarilish balandligi ortadi.",
           "O‘simliklarda suvning ko‘tarilishi, sochiq va qog‘ozning suv shimishi kapillyarlikdir.",
           "Rangli suvga qog‘oz sochiqning uchini botirib, suvning yuqoriga ko‘tarilishini kuzating.",
           "sirt taranglik kapillyarlik ho‘llash", "kapillyar qogoz suv", "capillary"),
    lesson("Masalalar yechish: suyuqliklar", 100, 102,
           "Suyuqlik masalalarida sirt taranglik kuchi, kapillyar ko‘tarilish va suyuqlik ustuni bosimi formulalari tanlanadi.",
           "p = ρgh", "Pa", "Bir xil suyuqlikda chuqurlik ortishi bilan gidrostatik bosim chiziqli ortadi.",
           "Suv minorasi, manometr va gidravlik qurilmalar bosim qonunlariga asoslanadi.",
           "Turli balandlikdagi suv ustunlarini shaffof idishlarda solishtirib, tub bosimi haqida xulosa qiling.",
           "suyuqlik ustunining bosimi masalalar", "suv bosimi tajriba", "fluid"),
    lesson("Laboratoriya: suyuqlikning sirt taranglik koeffitsiyenti", 103, 103,
           "Tomchi uzilishidagi kuchni yoki tomchilar sonini o‘lchash orqali suyuqlikning sirt taranglik koeffitsiyenti aniqlanadi.",
           "σ = F / l", "N/m", "Suyuqlik turi va temperaturasi o‘zgarsa sirt taranglik koeffitsiyenti ham o‘zgaradi.",
           "Yuvish vositalari sirt tarangligini kamaytirgani uchun sirtni yaxshiroq ho‘llaydi.",
           "Oddiy suv va sovunli suv tomchilarining tanga ustida nechta sig‘ishini taqqoslang.",
           "sirt taranglik koeffitsiyenti laboratoriya", "sovun suv tomchi", "surface"),
    lesson("Kristall va amorf jismlar", 104, 105,
           "Kristallarda zarralar davriy tartibda joylashadi va aniq erish temperaturasi bor; amorf jismlarda uzoq tartib yo‘q.",
           "ρ = m / V", "kg/m³", "Kristall xossalari yo‘nalishga bog‘liq bo‘lishi mumkin, amorf jismlar esa asta yumshaydi.",
           "Tuz, muz va metallar kristall; shisha, smola va ko‘plab plastmassalar amorf jismlarga misol.",
           "Tuz kristallarini lupa ostida shisha yoki plastik bo‘lagi bilan taqqoslang.",
           "qattiq jismlar kristall amorf tuzilish", "kristall tuz tajriba", "lattice"),
    lesson("Qattiq jismlarning mexanik xossalari", 106, 108,
           "Qattiq jismlar kuch ta’sirida cho‘zilish, siqilish, egilish, siljish yoki buralish deformatsiyasiga uchraydi.",
           "σ = F / S; ε = Δl / l₀", "Pa", "Elastiklik chegarasigacha kuch ortsa deformatsiya ham ortadi va kuch olib tashlanganda jism tiklanadi.",
           "Ko‘prik, bino, prujina va mexanik detallar mustahkamlik hisobiga ko‘ra loyihalanadi.",
           "Rezina tasmani turli yuklarda cho‘zib, yuk va uzayish orasidagi bog‘lanishni chizing.",
           "prujina elastiklik kuchi mexanik xossalar", "elastiklik rezina tajriba", "spring"),
    lesson("Masalalar yechish: deformatsiya", 109, 110,
           "Deformatsiya masalalarida Guk qonuni, mexanik kuchlanish, nisbiy uzayish va Yung moduli qo‘llanadi.",
           "F = kΔl; E = σ / ε", "N/m; Pa", "Elastik sohada uzayish kuchga to‘g‘ri proporsional.",
           "Prujina qattiqligi va material moduli konstruktsiya qanchalik egilishini oldindan aytadi.",
           "Prujinaga yoki rezina tasmaga ketma-ket bir xil yuklar osib, uzayishni jadvalga yozing.",
           "prujinani siqish ish elastiklik misol", "prujina yuk tajriba", "spring"),
    lesson("Qattiq jismlarning erishi va qotishi", 111, 112,
           "Kristall jism erish temperaturasida issiqlik yutib suyuqlikka, qotishda esa shu miqdor issiqlikni berib qattiq holatga o‘tadi.",
           "Q = λm", "J", "Erish davomida kristall moddaning temperaturasi deyarli o‘zgarmay, energiya tuzilishni buzishga sarflanadi.",
           "Metall quyish, muzlatish va material ishlab chiqarish fazaviy o‘tishlarga asoslanadi.",
           "Muz bo‘lagining erish jarayonida temperaturani vaqt bo‘yicha yozib, erish plato holatini kuzating.",
           "issiqlik sig‘imi suyuqlanish erish qotish", "muz erishi tajriba", "phase"),
    lesson("Moddaning solishtirma erish issiqligi. Amorf jismlarning erishi va qotishi", 113, 115,
           "Solishtirma erish issiqligi bir kilogramm kristall modda erish temperaturasida erishi uchun kerak bo‘lgan energiyadir; amorf jism aniq nuqtada emas, oraliqda yumshaydi.",
           "λ = Q / m", "J/kg", "Massa ortsa erish uchun kerakli issiqlik miqdori to‘g‘ri proporsional ortadi.",
           "Muzlatish texnikasi va metallurgiyada λ energiya sarfini hisoblash uchun kerak.",
           "Muz va plastilin yoki mumning isitilmasdan turib mexanik xossalarini taqqoslang; olov ishlatmang.",
           "issiqlik sig‘imi suyuqlanish amorf erish", "muz amorf jism tajriba", "phase"),
    lesson("Bug‘lanish va kondensatsiya", 116, 118,
           "Bug‘lanish suyuqlik sirtidan har qanday temperaturada kechadi; kondensatsiyada bug‘ suyuqlikka aylanib issiqlik ajratadi.",
           "Q = Lm", "J", "Temperatura, sirt yuzi va havo oqimi ortsa bug‘lanish tezlashadi.",
           "Terning sovitishi, kiyim qurishi va bulut hosil bo‘lishi bug‘lanish-kondensatsiya bilan bog‘liq.",
           "Teng suv tomchilaridan birini yoyib, ikkinchisini tomchi holida qoldirib qurish vaqtini taqqoslang.",
           "issiqlik qaynash bug‘lanish kondensatsiya", "buglanish suv tajriba", "phase"),
    lesson("Atmosferadagi hodisalar", 119, 123,
           "Atmosferadagi bug‘lanish, kondensatsiya, konveksiya va bosim farqlari bulut, tuman, yog‘in va shamolni yuzaga keltiradi.",
           "φ = p / pₛ · 100%", "%", "Havo soviganda to‘yingan bug‘ bosimi kamayib, shudring nuqtasida kondensatsiya boshlanadi.",
           "Ob-havo prognozida temperatura, bosim, namlik va shamol birgalikda kuzatiladi.",
           "Sovuq stakan sirtida suv tomchilari paydo bo‘lishini kuzatib, ularning manbasini izohlang.",
           "issiqlik uzatilishi konveksiya atmosfera namlik", "tuman bulut atmosfera tajriba", "humidity"),
    lesson("Laboratoriya: havoning nisbiy namligini aniqlash", 124, 124,
           "Quruq va nam termometr ko‘rsatkichlari farqi yoki shudring nuqtasi orqali havoning nisbiy namligi aniqlanadi.",
           "φ = ρ / ρₛ · 100%", "%", "Bir xil temperaturada havodagi suv bug‘i miqdori ortsa nisbiy namlik ortadi.",
           "Namlik sog‘liq, qishloq xo‘jaligi, saqlash va ishlab chiqarish sharoitiga ta’sir qiladi.",
           "Xonadagi namlikni maishiy gigrometr bilan o‘lchab, deraza ochishdan oldin va keyin solishtiring.",
           "havoning nisbiy namligi shudring nuqtasi", "namlik gigrometr tajriba", "humidity"),
    lesson("Masalalar yechish: fazaviy o‘tishlar va namlik", 125, 125,
           "Erish, bug‘lanish va namlik masalalarida energiya balansi, solishtirma yashirin issiqlik va to‘yingan bug‘ jadvali qo‘llanadi.",
           "Q = λm + cmΔT + Lm", "J", "Jarayon bir necha bosqichdan iborat bo‘lsa, har bosqich issiqligi alohida topilib qo‘shiladi.",
           "Muzni isitish, eritish va suvni bug‘latish uchun umumiy energiya bosqichma-bosqich hisoblanadi.",
           "Muzli suvning vaqt bo‘yicha temperaturasi uchun uch bosqichli grafik chizing va izohlang.",
           "erish bug‘lanish namlik masalalar", "fazaviy otish tajriba", "humidity"),

    # V bob — 44–57
    lesson("Yorug‘lik tezligini aniqlash", 131, 133,
           "Yorug‘lik vakuumda taxminan 300 million metr/sekund tezlik bilan tarqaladi; bu tezlik astronomik va laboratoriya usullarida o‘lchangan.",
           "c = s / t ≈ 3·10⁸ m/s", "m/s", "Vakuumdagi c barcha kuzatuvchilar uchun bir xil fundamental doimiydir.",
           "Lazerli masofa o‘lchagich, aloqa va astronomiyada yorug‘likning tarqalish vaqti ishlatiladi.",
           "Telefon chirog‘ini uzoqroq devorga yo‘naltirib, yorug‘likning amalda oniy ko‘rinishini va juda katta c ni muhokama qiling.",
           "yorug‘lik va efir yorug‘lik tezligi", "yoruglik tezligi tajriba", "lightSpeed"),
    lesson("Yorug‘likning qaytish va sinish qonunlari", 134, 137,
           "Qaytishda tushish burchagi qaytish burchagiga teng; sinishda nur tezlik o‘zgargani uchun yo‘nalishini o‘zgartiradi.",
           "α = β; n₁sinα = n₂sinγ", "daraja; o‘lchovsiz", "Optik zichroq muhitga o‘tgan nur normal tomon og‘adi.",
           "Ko‘zgu, ko‘zoynak, kamera va suvdagi buyumning siniq ko‘rinishi shu qonunlar bilan tushuntiriladi.",
           "Suvli stakanga qalam solib, yon tomondan qaraganda uning siniq ko‘rinishini kuzating.",
           "yorug‘lik qaytishi sinish qonuni Snellius", "yoruglik sinishi suv", "rays"),
    lesson("Masalalar yechish: qaytish va sinish", 138, 138,
           "Optik masalalarda burchaklar normaldan o‘lchanadi va Snell qonuni yordamida noma’lum burchak yoki sindirish ko‘rsatkichi topiladi.",
           "n = sinα / sinγ", "o‘lchovsiz", "α va γ nisbatini emas, ularning sinuslari nisbatini olish kerak.",
           "Muhit turini tajribada nur burchaklarini o‘lchash orqali aniqlash mumkin.",
           "Suvli idishda chiroq nuri yo‘lini qog‘ozga belgilab, tushish va sinish burchaklarini taxminan o‘lchang.",
           "sinish qonuniga oid misol", "sinish burchagi tajriba", "rays"),
    lesson("To‘la ichki qaytish", 139, 141,
           "Nur optik zich muhitdan siyrak muhitga kritik burchakdan katta burchakda tushsa, ikkinchi muhitga o‘tmay to‘liq qaytadi.",
           "sinαₖᵣ = n₂ / n₁", "daraja", "Tushish burchagi kritik qiymatdan oshganda singan nur yo‘qolib, faqat qaytgan nur qoladi.",
           "Optik tolali aloqa, endoskop va prizmalarda to‘la ichki qaytish ishlatiladi.",
           "Suv oqimiga yon tomondan chiroq yo‘naltirib, yorug‘likning oqim bo‘ylab egilishini xavfsiz sharoitda kuzating.",
           "yorug‘likning to‘la ichki qaytishi", "tola optika suv nur", "rays"),
    lesson("Masalalar yechish: to‘la ichki qaytish", 142, 142,
           "Kritik burchak sindirish ko‘rsatkichlari orqali topilib, nur to‘liq qaytadimi yoki sinib chiqadimi aniqlanadi.",
           "αₖᵣ = arcsin(n₂ / n₁)", "daraja", "n₁ va n₂ farqi kattalashsa kritik burchak odatda kichrayadi.",
           "Optik tolaga qaysi burchakda nur kiritish kerakligini hisoblashda kritik burchak muhim.",
           "Turli shisha va suv uchun jadvaldagi n qiymatlaridan kritik burchaklarni hisoblab taqqoslang.",
           "to‘la ichki qaytish misol", "kritik burchak tajriba", "rays"),
    lesson("Laboratoriya: shishaning nur sindirish ko‘rsatkichi", 143, 143,
           "Shisha plastinkaga tushgan va singan nurlar burchaklari o‘lchanib, ularning sinuslari nisbati orqali sindirish ko‘rsatkichi topiladi.",
           "n = sinα / sinγ", "o‘lchovsiz", "Bir xil shisha uchun turli tushish burchaklarida hisoblangan n qiymatlari yaqin bo‘lishi kerak.",
           "Optik material sifati va linza hisoblarida sindirish ko‘rsatkichi asosiy xossadir.",
           "Shaffof plastinka konturini qog‘ozga chizib, chiroq nurining kirish va chiqish yo‘lini belgilang.",
           "suvda yorug‘lik sinishi shisha laboratoriya", "shisha nur sinishi", "refraction"),
    lesson("Linzalar", 144, 145,
           "Linza ikki sferik sirt bilan chegaralangan shaffof jism bo‘lib, qavariq linza nurlarni yig‘adi, botiq linza esa sochadi.",
           "D = 1 / F", "dptr", "Fokus masofasi qisqargan sari linzaning optik kuchi kattalashadi.",
           "Ko‘zoynak, lupa, kamera, mikroskop va teleskop linzalardan foydalanadi.",
           "Lupa bilan uzoq manbaning tasvirini oq qog‘ozga tushirib, fokus masofasini taxminan o‘lchang; Quyoshga qaramang.",
           "qavariq linza botiq linza", "linza fokus tajriba", "lens"),
    lesson("Yupqa linza yordamida tasvir yasash", 146, 147,
           "Tasvir bosh optik o‘qqa parallel, optik markazdan o‘tuvchi va fokus orqali yo‘nalgan asosiy nurlar yordamida yasaladi.",
           "1 / F = 1 / d + 1 / f", "m⁻¹", "Buyum fokusdan tashqarida bo‘lsa qavariq linza haqiqiy tasvir hosil qilishi mumkin.",
           "Kamera va proyektorda tasvir masofasi linza bilan ekran oralig‘ini belgilaydi.",
           "Lupa va oq qog‘oz yordamida deraza tasvirini hosil qilib, buyum-linza masofasi o‘zgarganda tasvirni kuzating.",
           "yupqa linza formulasi tasvir yasash", "linza tasvir tajriba", "lens"),
    lesson("Masalalar yechish: linzalar", 148, 149,
           "Linza masalalarida fokus masofasi, buyum va tasvir masofalari, optik kuch hamda kattalashtirish orasidagi bog‘lanishlar qo‘llanadi.",
           "K = f / d = H / h", "o‘lchovsiz", "Tasvir masofasining buyum masofasiga nisbati chiziqli kattalashtirishni beradi.",
           "Kamera obyektivi va proyektor tasvir o‘lchamini hisoblashda kattalashtirish ishlatiladi.",
           "Bir buyumning lupa orqali ko‘rinadigan o‘lchamini ikki masofada taqqoslab, qaysi holatda K kattaligini ayting.",
           "qavariq linzaga oid misollar tasvir masofa", "linza masala tajriba", "lens"),
    lesson("Laboratoriya: linzaning optik kuchi", 150, 150,
           "Yig‘uvchi linzaning fokus masofasi tajribada o‘lchanib, uning teskarisi orqali optik kuch aniqlanadi.",
           "D = 1 / F", "dptr", "F metrlarda o‘lchansa, D dioptriyada chiqadi.",
           "Ko‘zoynak linzalari ustidagi dioptriya belgisi ularning optik kuchini ko‘rsatadi.",
           "Lupa bilan uzoq obyekt tasvirini qog‘ozda tiniqlashtirib, linza-qog‘oz masofasini o‘lchang; Quyosh nurini ishlatmang.",
           "linzadan tasvirgacha fokus masofa optik kuch", "linza optik kuch tajriba", "lens"),
    lesson("Optik asboblar", 151, 153,
           "Lupa, mikroskop, teleskop, fotoapparat va proyektor linza yoki ko‘zgular tizimi orqali tasvirni kattalashtiradi yoki qayd etadi.",
           "K = K₁K₂", "o‘lchovsiz", "Ketma-ket optik bosqichlarda umumiy kattalashtirish alohida kattalashtirishlar ko‘paytmasiga teng.",
           "Mikroskop juda kichik, teleskop esa juda uzoq obyektlarni kuzatishga xizmat qiladi.",
           "Ikki lupani turli masofada tutib, uzoq obyekt tasvirining kattaligi va ravshanligini kuzating.",
           "bir nechta linzalar sistemasi optik asbob", "mikroskop teleskop tajriba", "optics"),
    lesson("Ko‘z va ko‘rish", 154, 155,
           "Ko‘z gavhari to‘r pardada haqiqiy tasvir hosil qiladi; akkomodatsiya fokusni, qorachiq esa kirayotgan yorug‘likni boshqaradi.",
           "D = 1 / F", "dptr", "Yaqinni ko‘rmaslik sochuvchi, uzoqni ko‘rmaslik yig‘uvchi linza bilan tuzatiladi.",
           "Ko‘zoynak va kontakt linzalar ko‘z optik tizimidagi fokus xatolarini tuzatadi.",
           "Bir ko‘zni yopib qalam uchlarini tutashtirishni sinab, ikki ko‘zli ko‘rish chuqurlikni sezishga yordam berishini kuzating.",
           "optik kuch abberatsiya odam ko‘zi", "ko‘z optik illuziya", "eye"),
    lesson("Masalalar yechish: optik asboblar va ko‘z", 156, 157,
           "Optik asbob va ko‘z masalalarida optik kuch, fokus masofasi, kattalashtirish va ko‘rish nuqsonini tuzatish turi aniqlanadi.",
           "D = 1 / F; K = H / h", "dptr", "Musbat D yig‘uvchi, manfiy D sochuvchi linzaga mos keladi.",
           "Retseptdagi dioptriya qiymatidan ko‘zoynak linzasining fokus masofasini hisoblash mumkin.",
           "Turli D qiymatlari uchun F ni hisoblab, qaysi linza kuchliroq ekanini jadvalda ko‘rsating.",
           "linza optik kuch odam ko‘zi misol", "ko‘z linza tajriba", "eye"),
    lesson("Geliotexnika. O‘zbekistonda quyosh energiyasidan foydalanish", 158, 159,
           "Geliotexnika Quyosh nurlanishini issiqlik yoki elektr energiyasiga aylantiradigan qurilmalarni o‘rganadi.",
           "η = Efoydali / Equyosh · 100%", "%", "Bir xil vaqt va yuza uchun tushayotgan nurlanish kuchli bo‘lsa olinadigan energiya ortadi.",
           "Quyosh paneli, kollektor, quyosh pechi va geliostansiya O‘zbekistonning serquyosh iqlimida samarali.",
           "Qora va oq qog‘ozni bir xil quyosh nurida qoldirib, qaysi biri tezroq qizishini termometr bilan taqqoslang.",
           "foton energiyasi Quyosh energiyasi Yer Quyosh", "quyosh energiya tajriba", "solar"),

    # VI bob — 58–59
    lesson("Olamning yagona fizik manzarasi", 164, 165,
           "Tabiat hodisalari modda tuzilishi, saqlanish qonunlari hamda gravitatsion, elektromagnit, kuchli va kuchsiz o‘zaro ta’sirlar orqali yagona tizimda tushuntiriladi.",
           "E = mc²", "J", "Massa energiyaning bir ko‘rinishi bo‘lib, yopiq tizimda umumiy energiya saqlanadi.",
           "Kosmosdan atom yadrosigacha bo‘lgan hodisalar umumiy fundamental qonunlarga bo‘ysunadi.",
           "Mayatnikda potensial va kinetik energiyaning almashinishini kuzatib, umumiy energiya haqida xulosa qiling.",
           "4 ta fundamental kuch Katta portlash olam", "energiya saqlanish mayatnik", "cosmos"),
    lesson("Fizika va texnika taraqqiyoti. O‘zbekistonda fizika sohasidagi tadqiqotlar", 166, 167,
           "Fizik kashfiyotlar energetika, aloqa, tibbiyot, materialshunoslik va kosmik texnologiyalarga aylanadi; O‘zbekistonda bu yo‘nalishlarda ilmiy institutlar ishlaydi.",
           "P = A / t", "W", "Bir xil vaqtda ko‘proq ish bajaradigan qurilmaning quvvati kattaroq.",
           "Quyosh energetikasi, yadro fizikasi, optika va issiqlik fizikasi mamlakatdagi muhim tadqiqot yo‘nalishlaridir.",
           "Uyda ishlatiladigan uch texnologiyani tanlab, ularning ortida qaysi fizik qonun turganini posterda ko‘rsating.",
           "fizika kirish ish energiya texnika taraqqiyoti", "fizika texnika qiziqarli tajriba", "innovation"),
]


VIDEO_OVERRIDES = {
    1: "MMzjmrpp0OU", 2: "NhErDy76R5Q", 3: "ywZ0tsWc7XE", 4: "YlLZNEKZrmo",
    5: "aW1gO5wFnhU", 6: "ZgnLrJqkXmk", 7: "-K40FGWIVXw", 8: "94b5Zzp_ohs", 9: "sgCyzVBElyQ",
    10: "cgmCM53J2Zk", 11: "do2MVV9KXWc", 12: "7Q9GoxaVxnQ",
    14: "uxv8V82tmSc", 15: "aqZdvRpy6b4", 16: "12kE2vcwrYI", 17: "4wvQrvir44o",
    18: "Ugh6oEQmmX8", 19: "uEK-GBLJi9c", 20: "M4rLnw9aKic", 21: "JQAjWSyOLdE",
    22: "S_g1aOUkoJA", 23: "K9UnmHnpFaE", 24: "0zE7-VGrzno",
    26: "R35eB2MPk8I", 27: "XzTMQRQkYjk", 28: "R97nzhZOL84", 29: "zVwSXAC875k", 30: "E2wlUJhjcG0",
    31: "iC0N3VePRRc", 32: "xgwkWJxVw54", 33: "YlP-fSsKsTo",
    35: "RPbpFl_Zkaw", 36: "SX38ozZfmNY", 37: "nnnTO5Oc3NA", 38: "3GOjgEIMO4o",
    39: "DhgdbB8d8VY", 40: "45KZFUbJV4g", 41: "eHeR5V188SQ", 43: "9wmZn45ua_E",
    44: "GMQCN63rWCE", 45: "AO2ZUqnbCcY", 46: "wkeXrutZPC8", 47: "BmzZSJAGHU0", 48: "Z7EDlXKXsMc",
    49: "lPQHZMZPsZU", 50: "xizixoPywmo", 51: "CEyd0WoB3Us", 52: "D8nD8iXdytI",
    53: "lGEFAm9j5XY", 54: "A5C9XPthBJY", 55: "EnOcFUsgfmw", 56: "_CLj7tEsnqE",
    57: "KDWz_N378QY", 58: "ekQgPOasTiI", 59: "LF98SpIWZac",
}

MANUAL_PRIMARY_VIDEOS = {
    "94b5Zzp_ohs": ("Gazlarda temperatura va molekula tezligi orasidagi bog‘liqlik. O‘rtacha kvadratik tezlik", "Razzaqov Xursand | fizika"),
    "do2MVV9KXWc": ("Izobarik jarayon", "TV FIZIKA"),
    "7Q9GoxaVxnQ": ("Izoxorik jarayon", "TV FIZIKA"),
    "K9UnmHnpFaE": ("Termodinamikaning birinchi qonuni va uning izojarayonlarga tatbiqi", "Fazliddinov Diyorbek o‘quv markazi"),
    "zVwSXAC875k": ("Issiqlik dvigatellari", "Razzaqov Xursand | fizika"),
    "xgwkWJxVw54": ("Ho‘llash va kapillyarlik hodisasi — 9-sinf", "FIZIKA DUNYOSI"),
    "3GOjgEIMO4o": ("Kristall jismlarning erishi va qotishi", "Razzaqov Xursand | fizika"),
    "DhgdbB8d8VY": ("Qattiq jismlarning erishi va solishtirma erish issiqligi", "Razzaqov Xursand | fizika"),
    "45KZFUbJV4g": ("Bug‘lanish va kondensatsiya", "Razzaqov Xursand | fizika"),
    "eHeR5V188SQ": ("Atmosferadagi hodisalar", "Zohidjon Esanov"),
    "9wmZn45ua_E": ("Havoning namligi va shudring nuqtasi", "Razzaqov Xursand | fizika"),
    "Z7EDlXKXsMc": ("Yorug‘likning to‘la ichki qaytish hodisasi va masalalar yechimi", "Razzaqov Xursand | fizika"),
}
MANUAL_PRIMARY_VIDEOS = [
    {
        "id": video_id,
        "title": title,
        "duration": "",
        "source": f"https://www.youtube.com/watch?v={video_id}",
        "embed": f"https://www.youtube-nocookie.com/embed/{video_id}?rel=0",
        "provider": provider,
        "type": "youtube",
    }
    for video_id, (title, provider) in MANUAL_PRIMARY_VIDEOS.items()
]

OFFICIAL_VIDEO_OVERRIDES = {
    13: {"id": "trm-1731567767", "title": "Molekulalarning o‘lchamlarini baholash", "embed": "https://raqamlitalim.trm.uz/uploads/lab_sim/1731567767.mp4", "source": "https://raqamlitalim.trm.uz/labs/fizika/9-sinf/1/15/80"},
    20: {"id": "trm-1731578148", "title": "Qattiq jismlarning solishtirma issiqlik sig‘imini aniqlash", "embed": "https://raqamlitalim.trm.uz/uploads/lab_sim/1731578148.mp4", "source": "https://raqamlitalim.trm.uz/labs/fizika/9-sinf/2/17/89"},
    25: {"id": "trm-1731579088", "title": "Turli temperaturali suv aralashtirilganda issiqlik miqdorlarini taqqoslash", "embed": "https://raqamlitalim.trm.uz/uploads/lab_sim/1731579088.mp4", "source": "https://raqamlitalim.trm.uz/labs/fizika/9-sinf/2/18/93"},
    34: {"id": "trm-1731579356", "title": "Suyuqlikning sirt taranglik koeffitsiyentini aniqlash", "embed": "https://raqamlitalim.trm.uz/uploads/lab_sim/1731579356.mp4", "source": "https://raqamlitalim.trm.uz/labs/fizika/9-sinf/3/19/97"},
    42: {"id": "trm-1731579597", "title": "Havoning nisbiy namligini aniqlash", "embed": "https://raqamlitalim.trm.uz/uploads/lab_sim/1731579597.mp4", "source": "https://raqamlitalim.trm.uz/labs/fizika/9-sinf/3/20/100"},
    49: {"id": "trm-1731579795", "title": "Shishaning nur sindirish ko‘rsatkichini aniqlash", "embed": "https://raqamlitalim.trm.uz/uploads/lab_sim/1731579795.mp4", "source": "https://raqamlitalim.trm.uz/labs/fizika/9-sinf/4/21/104"},
    53: {"id": "trm-1731583731", "title": "Linzalarning optik kuchini aniqlash", "embed": "https://raqamlitalim.trm.uz/uploads/lab_sim/1731583731.mp4", "source": "https://raqamlitalim.trm.uz/labs/fizika/9-sinf/4/22/109"},
}
for official in OFFICIAL_VIDEO_OVERRIDES.values():
    official.update({"duration": "", "provider": "Raqamli ta’lim — TRM", "type": "mp4"})


STOPWORDS = {
    "va", "bilan", "uchun", "haqida", "oid", "yoki", "hamda", "ning", "dagi", "bir",
    "qism", "fizika", "bob", "ushbu", "video", "dars", "masalalar", "yechish", "laboratoriya",
    "amaliy", "mashgulot", "aniqlash", "holat", "qonuni", "jarayon",
}


def normalize(value):
    value = str(value).lower()
    replacements = {"o‘": "o", "g‘": "g", "oʻ": "o", "gʻ": "g", "’": "", "ʻ": "", "‘": "", "-": " "}
    for old, new in replacements.items():
        value = value.replace(old, new)
    value = unicodedata.normalize("NFKD", value)
    value = "".join(char for char in value if not unicodedata.combining(char))
    return re.sub(r"[^a-z0-9]+", " ", value).strip()


def clean_video_title(value):
    value = re.sub(r"\s+Fizika\..*$", "", value).strip()
    value = re.sub(r"\s+Astronomiya\..*$", "", value).strip()
    return re.sub(r"^\d+\.\s*", "", value)


def score_match(query, item, experiment=False):
    query_tokens = [token for token in normalize(query).split() if token not in STOPWORDS and len(token) > 2]
    title = normalize(item.get("title", ""))
    title_tokens = set(title.split())
    score = 0
    for token in query_tokens:
        if token in title_tokens:
            score += 18
        elif len(token) >= 5 and any(word.startswith(token[:5]) or token.startswith(word[:5]) for word in title_tokens if len(word) >= 5):
            score += 9
    phrase = normalize(query)
    if phrase and phrase in title:
        score += 45
    if experiment:
        seconds = item.get("seconds", 9999)
        if 10 <= seconds <= 300:
            score += 8
        elif seconds > 600:
            score -= 14
        if any(word in title for word in ("tajriba", "eksperiment", "qiziqarli", "sinab")):
            score += 4
    return score


def choose_video(query, videos, used, forced_id=None):
    if forced_id:
        forced = next((video for video in videos if video.get("id") == forced_id), None)
        if forced:
            used.add(forced["id"])
            return forced, 999
    ranked = sorted(((score_match(query, video), video) for video in videos if video.get("id") not in used),
                    key=lambda pair: (pair[0], pair[1].get("post", 0)), reverse=True)
    score, selected = ranked[0]
    used.add(selected["id"])
    return selected, score


def choose_experiment(query, videos, used):
    ranked = sorted(((score_match(query, video, True), video) for video in videos if video.get("id") not in used),
                    key=lambda pair: (pair[0], -pair[1].get("seconds", 9999), pair[1].get("post", 0)), reverse=True)
    score, selected = ranked[0]
    used.add(selected["id"])
    return selected, score


def load_json(path):
    target = Path(path)
    if not target.is_absolute():
        target = ROOT / target
    return json.loads(target.read_text(encoding="utf-8-sig"))


physics_videos = load_json("tmp/kau_videos.json")
astronomy_videos = load_json("tmp/kau_astronomiya_videos.json")
primary_videos = physics_videos + astronomy_videos + MANUAL_PRIMARY_VIDEOS
topic_experiments = load_json("tmp/experiment_videos.json")
experiment_videos = load_json("tmp/pizik_lab_videos.json") + load_json("tmp/Fizikadan_tajribalar_videos.json")
raw_ocr_pages = load_json(OCR_PATH) if OCR_PATH.exists() else []
if isinstance(raw_ocr_pages, dict):
    raw_ocr_pages = [raw_ocr_pages]
ocr_pages = {int(page["page"]): page for page in raw_ocr_pages}
figure_manifest = load_json(FIGURE_MANIFEST_PATH) if FIGURE_MANIFEST_PATH.exists() else []
figures_by_lesson = {int(item["lesson"]): item for item in figure_manifest}

def duration_seconds(value):
    try:
        parts = [int(part) for part in str(value).split(":")]
        return sum(part * 60 ** power for power, part in enumerate(reversed(parts)))
    except Exception:
        return 90

for item in experiment_videos:
    if not item.get("seconds") or item.get("seconds") == 9999:
        item["seconds"] = duration_seconds(item.get("duration", ""))
    item.setdefault("id", f"tg-{item.get('post')}")

SAFE_EXPERIMENT_DENY = (
    "bomba", "portlash", "qurol", "yong'in to'pi", "mikroto'lqinli pech", "termoyadro",
    "olov", "snayper", "quruq muz", "raketa",
    "harbiy", "rekord tezlik", "raketa muz", "ammoniy", "reaktiv dvigatel bilan jihozlangan",
    "ingliz tilida", "english", "rus tilida", "russian", "на русском", "русский",
)

def is_safe_experiment(item):
    title = item.get("title", "")
    seconds = item.get("seconds") or duration_seconds(item.get("duration", ""))
    return (
        6 <= seconds <= 300
        and len(title) >= 12
        and not any(word in title.lower() for word in SAFE_EXPERIMENT_DENY)
    )

safe_experiments = [
    item for item in experiment_videos
    if is_safe_experiment(item)
]

chapter_index = 0
chapter_ends = [14, 25, 30, 43, 57, 59]
used_primary = set()
used_experiments = set()
content = []
report = []

for index, source in enumerate(LESSONS, start=1):
    while index > chapter_ends[chapter_index]:
        chapter_index += 1
    if index in OFFICIAL_VIDEO_OVERRIDES:
        primary, primary_score = OFFICIAL_VIDEO_OVERRIDES[index], 1000
    else:
        primary, primary_score = choose_video(source["videoQuery"], primary_videos, used_primary, VIDEO_OVERRIDES.get(index))
    searched = topic_experiments[index - 1] if len(topic_experiments) == len(LESSONS) else None
    searched_score = searched.get("matchScore", 0) if searched else 0
    searched_is_fallback = searched and searched.get("post") == 642 and searched.get("title", "").startswith("O‘zbekcha")
    if searched and searched_score >= 35 and not searched_is_fallback and is_safe_experiment(searched) and searched.get("id") not in used_experiments:
        experiment_video, experiment_score = searched, searched_score
        used_experiments.add(searched["id"])
    else:
        experiment_video, experiment_score = choose_experiment(source["experimentQuery"], safe_experiments, used_experiments)
    start = source["start"]
    end = REVIEW_PAGE_ENDS.get(index, source["end"])
    page_numbers = list(range(start, end + 1))
    theory_blocks = build_theory_blocks(page_numbers, source["title"], ocr_pages)
    figure_info = figures_by_lesson.get(index)
    reward = 100 + chapter_index * 15 + (20 if "Masalalar" in source["title"] else 0) + (30 if "Laboratoriya" in source["title"] else 0)
    content.append({
        "id": f"l{index}",
        "chapter": chapter_index,
        "number": index,
        "title": source["title"],
        "pages": str(start) if start == end else f"{start}–{end}",
        "pageNumbers": page_numbers,
        "summary": source["summary"],
        "paragraphs": [
            source["summary"],
            f"Asosiy bog‘lanish: {source['relationship']}",
            f"Amaliy ahamiyati: {source['application']}",
        ],
        "formula": source["formula"],
        "unit": source["unit"],
        "relationship": source["relationship"],
        "application": source["application"],
        "theoryBlocks": theory_blocks,
        "figure": figure_info.get("path") if figure_info else "",
        "figurePage": figure_info.get("page") if figure_info else None,
        "experiment": source["experiment"],
        "experimentQuestion": f"Kuzatuv natijasi nima sababdan aynan shunday bo‘ladi? Javobingizni “{source['title']}” mavzusidagi asosiy qoida bilan izohlang.",
        "experimentExplanation": f"Hodisaning sababi: {source['relationship']} {source['application']}",
        "simulation": source["simulation"],
        "reward": reward,
        "video": {
            "id": primary["id"],
            "title": clean_video_title(primary["title"]),
            "duration": primary.get("duration", ""),
            "source": primary["source"],
            "embed": primary["embed"],
            "provider": primary.get("provider", "Khan Academy O‘zbek"),
            "type": primary.get("type", "youtube"),
            "matchScore": primary_score,
        },
        "experimentVideo": {
            "id": experiment_video["id"],
            "title": clean_video_title(experiment_video["title"]) or "Qiziqarli fizika tajribasi",
            "duration": experiment_video.get("duration", ""),
            "source": experiment_video["source"],
            "embed": experiment_video["embed"],
            "provider": "Pizik Lab" if "pizik_lab" in experiment_video["source"] else "Fizikadan tajribalar",
            "match": "Mavzuga mos tajriba" if experiment_score >= 40 else "Qiziqarli fizika tanaffusi",
            "matchScore": experiment_score,
        },
    })
    report.append(
        f"{index:02}. {source['title']} [{start}-{end}]\n"
        f"    VIDEO ({primary_score}): {clean_video_title(primary['title'])} [{primary['id']}]\n"
        f"    TAJRIBA ({experiment_score}): {clean_video_title(experiment_video['title'])[:180]} [{experiment_video['source']}]"
    )

output = {
    "version": 4,
    "chapters": CHAPTERS,
    "lessons": content,
    "totalPages": 164,
}

(ROOT / "assets" / "physics").mkdir(parents=True, exist_ok=True)
(ROOT / "assets" / "physics" / "physics-content.js").write_text(
    "window.PHYSICS_COURSE = " + json.dumps(output, ensure_ascii=False, separators=(",", ":")) + ";\n",
    encoding="utf-8",
)
(ROOT / "tmp" / "physics-content-report.txt").write_text("\n".join(report), encoding="utf-8")
print(f"Built {len(content)} lessons in {len(CHAPTERS)} chapters -> assets/physics/physics-content.js")
print(f"Unique primary videos: {len(used_primary)}; unique experiment videos: {len(used_experiments)}")
print("Report -> tmp/physics-content-report.txt")
