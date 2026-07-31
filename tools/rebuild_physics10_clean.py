"""Rebuild the 10th-grade course directly from the 2022 textbook.

The generated course is written to a staging directory first.  It intentionally
does not read the previously generated 10th-grade lesson content.
"""

from __future__ import annotations

import hashlib
import io
import json
import re
import shutil
import sys
import unicodedata
from pathlib import Path

import pdfplumber
from PIL import Image, ImageDraw, ImageFont
from pypdf import PdfReader

from build_physics10_content import (
    CHAPTERS,
    CHAPTER_ENDS,
    FORMULAS,
    STARTS,
    TITLES,
    UNITS,
)

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT / "10-SINF FIZIKA DARSLIK 2022.pdf"
OUT = ROOT / "assets" / "physics10-rebuild"
FIGURES = OUT / "figures"
REPORT = ROOT / "tmp" / "pdfs" / "physics10-rebuild-report.json"
EXTRACTION_CACHE = ROOT / "assets" / "physics10" / "physics-content.js"


TOPIC_NOTES = [
    "Bir nuqtaga qo‘yilgan kuchlar vektorlar kabi qo‘shiladi; natijaviy kuch jism harakatining qanday o‘zgarishini belgilaydi.",
    "Aylana bo‘ylab harakat qilayotgan jismga doimo aylana markazi tomon yo‘nalgan markazga intilma kuch ta’sir qiladi.",
    "Gravitatsiya maydonida jismning tezligi, orbitasi va Yer atrofidagi harakati tortishish kuchi bilan belgilanadi.",
    "Dinamika masalalarida kuchlar chizmasi tuziladi, natijaviy kuch topiladi va Nyuton qonunlari qo‘llanadi.",
    "Jismning seziladigan og‘irligi tayanch yoki osma bilan o‘zaro ta’sir kuchidir; tezlanish uning qiymatini o‘zgartiradi.",
    "Bir nechta kuch ta’siridagi harakatni tahlil qilish uchun barcha kuchlar koordinata o‘qlariga proyeksiyalanadi.",
    "Kuchlarga oid masalalarda yo‘nalish, ishora va birliklarni to‘g‘ri tanlash yechimning asosiy qismidir.",
    "Qiya tekislikda og‘irlik kuchi tekislik bo‘ylab va unga tik tashkil etuvchilarga ajratiladi.",
    "Qiya tekislikning foydali ish koeffitsiyenti foydali ishning sarflangan ishga nisbatini ko‘rsatadi.",
    "Qiya tekislik masalalarida kuch, yo‘l, balandlik, ishqalanish va FIK birgalikda hisobga olinadi.",
    "Laboratoriyada qiya tekislik bo‘ylab tortish kuchi va yo‘l o‘lchanib, qurilmaning foydali ish koeffitsiyenti aniqlanadi.",
    "Massa markazi jism massasini shartli ravishda jamlash mumkin bo‘lgan nuqta; kuch momenti esa aylantiruvchi ta’sirni ifodalaydi.",
    "Richag, blok va boshqa oddiy mexanizmlar kuchdan yutishga yordam beradi, ammo ishning saqlanish qonunini buzmaydi.",
    "Statika masalalarida kuchlar yig‘indisi va tanlangan nuqtaga nisbatan momentlar yig‘indisi nolga teng bo‘ladi.",
    "Mexanik tebranish muvozanat holati atrofida takrorlanuvchi harakat bo‘lib, amplituda, davr, chastota va faza bilan tavsiflanadi.",
    "Prujinali va matematik mayatniklarning davri tizim parametrlariga bog‘liq, kichik tebranishlarda harakat garmonik bo‘ladi.",
    "Mayatnik uzunligi va tebranish davri o‘lchanib, erkin tushish tezlanishi tajriba orqali hisoblanadi.",
    "Mexanik to‘lqin elastik muhitda tebranishlarning tarqalishidir; bunda modda emas, energiya ko‘chadi.",
    "Tovush mexanik to‘lqin bo‘lib, uning balandligi chastotaga, qattiqligi esa amplitudaga bog‘liq.",
    "Tebranish va to‘lqin masalalarida davr, chastota, to‘lqin uzunligi va tarqalish tezligi orasidagi bog‘lanish ishlatiladi.",
    "Uzluksiz suyuqlik oqimida quvur kesimi kichrayganda oqim tezligi ortadi.",
    "Bernulli qonuni oqim tezligi ortgan joyda statik bosim kamayishini tushuntiradi; bu hodisa ko‘plab texnik qurilmalarda qo‘llanadi.",
    "Gidrodinamika masalalarida uzluksizlik va Bernulli tenglamalari birgalikda qo‘llanadi.",
    "Bir nechta zaryad hosil qilgan elektr maydon kuchlanganligi alohida maydonlarning vektor yig‘indisiga teng.",
    "Zaryadlangan sharning tashqi elektr maydoni markazda joylashgan nuqtaviy zaryad maydoni kabi aniqlanadi.",
    "Elektr maydon masalalarida zaryadlar ishorasi, masofa va kuchlanganlik yo‘nalishi alohida hisobga olinadi.",
    "Bir jinsli elektr maydonda zaryadni ko‘chirishda bajarilgan ish zaryad, kuchlanganlik va ko‘chishga bog‘liq.",
    "Elektr maydondagi zaryadning potensial energiyasi uning zaryadi va maydon potensiali ko‘paytmasiga teng.",
    "Elektr maydon energiyasi kondensator qoplamalari orasida to‘planadi va sig‘im hamda kuchlanishga bog‘liq.",
    "Energiya yo‘qolmaydi: elektr, mexanik, issiqlik va boshqa ko‘rinishlar bir-biriga aylanishi mumkin.",
    "Elektrostatika masalalarida ish, potensial, kuchlanish, sig‘im va energiya formulalari vaziyatga qarab tanlanadi.",
    "Tok kuchi vaqt birligida o‘tgan zaryadni, tok zichligi esa birlik kesimdan o‘tuvchi tokni ifodalaydi.",
    "To‘liq zanjir uchun Om qonuni tok kuchini manba EYKi, tashqi va ichki qarshilik bilan bog‘laydi.",
    "O‘zgarmas tok masalalarida zanjir sxemasi tahlil qilinib, tok, kuchlanish, qarshilik va EYK topiladi.",
    "Tok manbaining EYKi va ichki qarshiligi ochiq zanjir kuchlanishi hamda yuklama ostidagi o‘lchovlardan aniqlanadi.",
    "Metall qiziganda kristall panjara tebranishlari kuchayadi va uning elektr qarshiligi ortadi.",
    "Qarshilik masalalarida Om qonuni, o‘tkazgich geometriyasi va temperaturaga bog‘lanish hisobga olinadi.",
    "Elektrolitlarda elektr tokini musbat va manfiy ionlarning tartibli harakati hosil qiladi.",
    "Faradey qonunlariga ko‘ra elektrodda ajralgan modda massasi o‘tgan zaryadga va moddaning xossasiga bog‘liq.",
    "Elektroliz masalalarida tok kuchi, vaqt, zaryad va elektrokimyoviy ekvivalent orasidagi bog‘lanish ishlatiladi.",
    "Elektroliz metall qoplash, metallarni tozalash va kimyoviy moddalar olishda qo‘llanadi.",
    "Gazlarda tok ionlar va elektronlar harakati, vakuumda esa elektronlar oqimi hisobiga yuzaga keladi.",
    "Yarimo‘tkazgichlarning o‘tkazuvchanligi metallarnikidan farqli ravishda temperatura va aralashmalarga juda kuchli bog‘liq.",
    "Yarimo‘tkazgichlarda tokni elektronlar va kovaklar tashiydi; donor va akseptor aralashmalar n- va p-tur o‘tkazuvchanlik hosil qiladi.",
    "Diod, tranzistor va boshqa yarimo‘tkazgichli asboblar tokni boshqarish, to‘g‘rilash va kuchaytirishda ishlatiladi.",
    "Diodning volt-amper tavsifi tokning kuchlanishga bog‘lanishini ko‘rsatadi va uning bir tomonlama o‘tkazishini tasdiqlaydi.",
    "Tokli o‘tkazgich atrofida magnit maydon hosil bo‘ladi; maydon induksiyasi tok kuchi va masofaga bog‘liq.",
    "Magnit maydon tokli o‘tkazgichga Amper kuchi bilan ta’sir qiladi; kuch yo‘nalishi chap qo‘l qoidasi bilan topiladi.",
    "Parallel tokli o‘tkazgichlar toklar yo‘nalishiga qarab tortishadi yoki itarishadi.",
    "Magnit maydonda tokli o‘tkazgich ko‘chirilganda magnit kuch ish bajaradi.",
    "Magnit maydonga kirgan zaryadli zarra Lorens kuchi ta’sirida aylana yoki vintsimon trayektoriya bo‘ylab harakatlanadi.",
    "O‘zgarmas tok dvigatelida magnit maydonning tokli ramkaga ta’siri elektr energiyani mexanik energiyaga aylantiradi.",
    "Magnit maydon masalalarida induksiya, tok, uzunlik, zaryad tezligi va kuch yo‘nalishi birgalikda tahlil qilinadi.",
    "Konturdan o‘tuvchi magnit oqimi o‘zgarsa, konturda induksiya EYKi hosil bo‘ladi.",
    "Elektromagnit induksiya tajribasida magnit yoki g‘altak harakati natijasida galvanometr ko‘rsatishining o‘zgarishi kuzatiladi.",
    "Tok o‘zgarganda g‘altakning o‘zida o‘zinduksiya EYKi hosil bo‘ladi; induktivlik g‘altakning bu xossasini ifodalaydi.",
    "Elektromagnit induksiya masalalarida magnit oqimining o‘zgarish tezligi, o‘ramlar soni va induktivlik ishlatiladi.",
    "Tokli g‘altak magnit maydonda energiya saqlaydi; moddaning magnit xossasi magnit singdiruvchanlik bilan tavsiflanadi.",
    "Magnit xossalarga oid masalalarda induktivlik, energiya, magnit induksiya va magnit singdiruvchanlik bog‘lanadi.",
]


FORMULA_NOTES = [
    "Natijaviy kuch barcha kuchlarning vektor yig‘indisidir.",
    "Markazga intilma kuch massa va tezlik kvadratiga to‘g‘ri, radiusga teskari proporsional.",
    "Birinchi kosmik tezlik sayyora sirtidagi erkin tushish tezlanishi va radiusiga bog‘liq.",
    "Dinamika masalalarida natijaviy kuch Nyutonning ikkinchi qonuni orqali tezlanish bilan bog‘lanadi.",
    "Yuqoriga tezlanishda og‘irlik ortadi, pastga tezlanishda kamayadi.",
    "Har bir o‘q bo‘yicha kuchlar proyeksiyalarining yig‘indisi massa va tezlanish ko‘paytmasiga teng.",
    "Tezlanish natijaviy kuchning massaga nisbatiga teng.",
    "Qiya tekislik bo‘ylab harakatni og‘irlik kuchining tashkil etuvchisi va ishqalanish belgilaydi.",
    "FIK foydali ishning sarflangan ishga foiz nisbatidir.",
    "Doimiy va siljish yo‘nalishidagi kuch bajargan ish kuch va yo‘l ko‘paytmasiga teng.",
    "Qiya tekislik FIKi foydali mgh ishning sarflangan Fs ishga nisbatidir.",
    "Kuch momenti kuchning yelkaga ko‘paytmasidir.",
    "Muvozanatdagi richagda qarama-qarshi momentlar teng.",
    "Aylanish muvozanatida barcha kuch momentlarining algebraik yig‘indisi nol.",
    "Garmonik tebranish koordinatasi vaqt bo‘yicha sinus yoki kosinus qonuni bilan o‘zgaradi.",
    "Prujinali va matematik mayatnik davrlari tizim parametrlaridan aniqlanadi.",
    "Mayatnik tajribasida g uzunlik va davr orqali hisoblanadi.",
    "To‘lqin tezligi to‘lqin uzunligi va chastota ko‘paytmasiga teng.",
    "To‘lqin intensivligi quvvatning yuzaga nisbatidir.",
    "Tovush tezligi ham to‘lqin uzunligi va chastota orqali aniqlanadi.",
    "Uzluksiz oqimda kesim yuzi va tezlik ko‘paytmasi o‘zgarmaydi.",
    "Bernulli tenglamasi bosim, oqimning kinetik va potensial energiya zichliklarini bog‘laydi.",
    "Hajmiy sarf kesim yuzi va oqim tezligi ko‘paytmasidir.",
    "Superpozitsiyada elektr maydon vektorlari qo‘shiladi.",
    "Nuqtaviy zaryad maydoni zaryadga to‘g‘ri, masofa kvadratiga teskari proporsional.",
    "Kuchlanganlik sinov zaryadiga ta’sir qiluvchi kuchning zaryadga nisbatidir.",
    "Bir jinsli maydonda bajarilgan ish q, E va ko‘chishning maydon bo‘ylab proyeksiyasiga bog‘liq.",
    "Potensial energiya zaryad va potensial ko‘paytmasidir.",
    "Kondensator energiyasi sig‘im va kuchlanish kvadratiga bog‘liq.",
    "Energiya bir ko‘rinishdan boshqasiga o‘tadi, umumiy miqdor saqlanadi.",
    "Potensial bajarilgan ishning zaryadga nisbatidir.",
    "Tok kuchi zaryadning vaqtga, tok zichligi esa tokning kesim yuziga nisbatidir.",
    "To‘liq zanjirdagi tok EYKning umumiy qarshilikka nisbatidir.",
    "Om qonuni kuchlanish, tok va qarshilikni bog‘laydi.",
    "Manba EYKi tashqi kuchlanish va ichki kuchlanish tushuvining yig‘indisidir.",
    "Metall qarshiligi temperatura o‘zgarishi bilan taxminan chiziqli o‘zgaradi.",
    "Zanjir qismidagi tok kuchlanishning qarshilikka nisbatidir.",
    "Elektrolizda ajralgan massa elektrokimyoviy ekvivalent, tok va vaqt ko‘paytmasiga teng.",
    "Faradeyning ikkinchi qonuni elektrokimyoviy ekvivalentni molyar massa va valentlik bilan bog‘laydi.",
    "Elektroliz vaqti ajralgan massa, ekvivalent va tok orqali topiladi.",
    "Elektroliz mahsuloti miqdori o‘tgan elektr zaryadiga proporsional.",
    "Tok kuchi o‘tgan zaryadning vaqtga nisbatidir.",
    "Yarimo‘tkazgich o‘tkazuvchanligi zaryad, tashuvchilar konsentratsiyasi va harakatchanlikka bog‘liq.",
    "Solishtirma elektr o‘tkazuvchanlik solishtirma qarshilikka teskari kattalikdir.",
    "Diod toki kuchlanishga chiziqsiz bog‘liq va to‘g‘ri yo‘nalishda keskin ortadi.",
    "Volt-amper tavsifi tokning kuchlanishga tajribaviy bog‘lanishidir.",
    "Uzun to‘g‘ri o‘tkazgich maydoni tokka to‘g‘ri, masofaga teskari proporsional.",
    "Amper kuchi B, I, l va maydon bilan o‘tkazgich orasidagi burchakka bog‘liq.",
    "Parallel toklar orasidagi kuch toklar ko‘paytmasiga to‘g‘ri, masofaga teskari proporsional.",
    "Magnit maydon bajargan ish induksiya, tok, o‘tkazgich uzunligi va ko‘chishga bog‘liq.",
    "Lorens kuchi zaryad, tezlik, induksiya va ular orasidagi burchakka bog‘liq.",
    "Tokli ramkaga ta’sir qiluvchi moment B, I, yuza va o‘ramlar soniga bog‘liq.",
    "Tokli o‘tkazgichga ta’sir qiluvchi kuch BIl orqali baholanadi.",
    "Faradey qonunida induksiya EYKi magnit oqimining o‘zgarish tezligiga teng.",
    "Ko‘p o‘ramli g‘altakda induksiya EYKi o‘ramlar soniga ham proporsional.",
    "O‘zinduksiya EYKi tokning o‘zgarish tezligiga qarshi yo‘naladi.",
    "Induktivlik EYK, vaqt va tok o‘zgarishi orqali aniqlanadi.",
    "G‘altak magnit maydon energiyasi LI²/2 ga teng.",
    "Magnit singdiruvchanlik moddadagi va vakuumdagi induksiyalar nisbatidir.",
]


CHAPTER_APPLICATIONS = [
    "Bu qonuniyat transport, mexanizmlar, qurilish va harakat xavfsizligini hisoblashda ishlatiladi.",
    "Bu bog‘lanish soat, seysmograf, akustika, musiqa asboblari va to‘lqinli jarayonlarni tushuntiradi.",
    "Bu qonuniyat quvurlar, nasoslar, purkagichlar, samolyot qanoti va suv inshootlarida qo‘llanadi.",
    "Bu tushuncha kondensatorlar, elektrostatik himoya, printer va elektron qurilmalarni tushuntiradi.",
    "Bu bog‘lanish batareya, elektr zanjiri, o‘lchov asboblari va maishiy qurilmalarni hisoblashda ishlatiladi.",
    "Bu hodisa galvanika, vakuum asboblari, sensorlar, diodlar va zamonaviy elektronikada qo‘llanadi.",
    "Bu qonuniyat elektromagnitlar, dvigatellar, generatorlar, transformatorlar va magnit sensorlarda ishlatiladi.",
]


CHAPTER_EXPERIMENTS = [
    "Arqon, yuk, dinamometr yoki qiya taxta yordamida kuchlar yo‘nalishi va jism harakatini xavfsiz sharoitda taqqoslang.",
    "Ipga osilgan yuk yoki prujina yordamida tebranish davrini bir necha marta o‘lchang va natijalarni taqqoslang.",
    "Shaffof idish, suv va turli kesimli nay yordamida oqim tezligi hamda bosim o‘zgarishini kuzating.",
    "Ishqalangan plastik jism, mayda qog‘oz va yengil sharcha yordamida elektr maydon ta’sirini kuzating.",
    "Faqat past kuchlanishli batareya, rezistor va o‘lchov asboblari bilan zanjirdagi tok va kuchlanishni taqqoslang.",
    "Past kuchlanishda xavfsiz materiallar yoki tayyor diod yordamida muhitning elektr o‘tkazuvchanligini tekshiring.",
    "Magnit, kompas, g‘altak va past kuchlanishli manba yordamida magnit maydon yo‘nalishi hamda induksiya hodisasini kuzating.",
]


SUFFIXES = (
    "lar", "larning", "larga", "lardan", "larni", "ning", "dan", "ga", "ni",
    "lik", "chi", "cha", "dagi", "dagi", "lashgan", "lanadi", "moqda",
)


def normalize_apostrophes(text: str) -> str:
    return (
        text.replace("ʻ", "‘")
        .replace("ʼ", "‘")
        .replace("’", "‘")
        .replace("`", "‘")
    )


def clean_text(text: str) -> str:
    value = unicodedata.normalize("NFC", str(text or ""))
    value = normalize_apostrophes(value)
    value = value.replace("\u00ad", "")
    value = re.sub(r"[\ue000-\uf8ff]", "", value)
    value = value.replace("ﬁ", "fi").replace("ﬂ", "fl")
    value = value.translate(str.maketrans({
        "а": "a", "е": "e", "о": "o", "р": "p", "с": "c", "у": "y", "х": "x",
        "А": "A", "Е": "E", "О": "O", "Р": "P", "С": "C", "У": "Y", "Х": "X",
        "М": "M", "Ф": "Φ",
    }))
    value = re.sub(r"(?<=[^oOgG])‘", "’", value)
    value = re.sub(r"\s+([,.;:!?])", r"\1", value)
    value = re.sub(r"\(\s+", "(", value)
    value = re.sub(r"\s+\)", ")", value)
    for suffix in SUFFIXES:
        value = re.sub(rf"\b([A-Za-zА-Яа-яO‘o‘G‘g‘]{{2,}})\s+({suffix})\b", rf"\1\2", value)
    value = re.sub(r"\bto\s+monga\b", "tomonga", value, flags=re.I)
    value = re.sub(r"\bbir-biri\s+dan\b", "bir-biridan", value, flags=re.I)
    value = re.sub(r"\bko‘p\s+aytma\b", "ko‘paytma", value, flags=re.I)
    replacements = {
        "ka maytir": "kamaytir",
        "o‘x shash": "o‘xshash",
        "bir nech ta": "bir nechta",
        "nis batan": "nisbatan",
        "yu zasi": "yuzasi",
        "uz luksiz": "uzluksiz",
        "ko‘ta ril": "ko‘taril",
        "bo sim": "bosim",
        "to ping": "toping",
        "ta‘rif": "ta’rif",
        "ta‘sir": "ta’sir",
        "e‘tibor": "e’tibor",
        "ma‘lum": "ma’lum",
        "ya‘ni": "ya’ni",
        "bo‘l gan": "bo‘lgan",
        "yo‘nali shida": "yo‘nalishida",
        "elek tromagnit": "elektromagnit",
        "magnit may dongi": "magnit maydondagi",
        "kiritil sa": "kiritilsa",
        "o‘tayot gan": "o‘tayotgan",
        "singdiruv chan": "singdiruvchan",
        "GRAVIT ATSIYA": "GRAVITATSIYA",
        "T A’SIRI": "TA’SIRI",
        "NUQT AVIY": "NUQTAVIY",
        "ELEKTROST ATIK": "ELEKTROSTATIK",
        "MET ALL": "METALL",
        "VOL T-AMPER T AVSIFI": "VOLT-AMPER TAVSIFI",
        "hay dovchi": "haydovchi",
        "maj bur": "majbur",
        "Saba bini": "Sababini",
        "mar kaz": "markaz",
        "ham da": "hamda",
        "boshlan g‘ich": "boshlang‘ich",
        "bosh laydi": "boshlaydi",
        "yo‘na lishda": "yo‘nalishda",
        "tash kil": "tashkil",
        "etuv chisi": "etuvchisi",
        "ko‘ta rishda": "ko‘tarishda",
        "tezla nishi": "tezlanishi",
        "ampli tudasi": "amplitudasi",
        "ko‘n dalang": "ko‘ndalang",
        "atmos feraning": "atmosferaning",
        "foy dalanish": "foydalanish",
        "koeffit siyenti": "koeffitsiyenti",
        "shakllantiri ladi": "shakllantiriladi",
        "ta yanch": "tayanch",
        "yengil lashtirish": "yengillashtirish",
        "kuch langanligi": "kuchlanganligi",
        "tu fayli": "tufayli",
        "elektro statik": "elektrostatik",
        "za ryad": "zaryad",
        "quyi dagi": "quyidagi",
        "qan day": "qanday",
        "de gani": "degani",
        "in duksiyasi": "induksiyasi",
        "g‘al tak": "g‘altak",
        "sole noid": "solenoid",
        "o‘x shatish": "o‘xshatish",
        "aha miyat": "ahamiyat",
        "shun day": "shunday",
        "ko‘chirshda": "ko‘chirishda",
        "harakatlan ganda": "harakatlanganda",
        "o‘rnatay lik": "o‘rnataylik",
        "NECHT A": "NECHTA",
        "bosh lang‘ich": "boshlang‘ich",
        "ishqala nish": "ishqalanish",
        "mayat nik": "mayatnik",
        "to‘lqin larda": "to‘lqinlarda",
        "yo‘na lishida": "yo‘nalishida",
        "mar ta": "marta",
        "poten sial": "potensial",
        "tash qi": "tashqi",
        "bosh qa": "boshqa",
        "elek tron": "elektron",
        "koeffit siyenti": "koeffitsiyenti",
        "avomobillarnikidan": "avtomobillarnikidan",
        "rul chambaragining": "rul chambagining",
        "muvozanat lashmagan": "muvozanatlashmagan",
        "tez lanishning": "tezlanishning",
        "qoch ma": "qochma",
        "ik kinchi": "ikkinchi",
        "tor tishish": "tortishish",
        "gori zontal": "gorizontal",
        "erishga nida": "erishganida",
    }
    for wrong, right in replacements.items():
        value = re.sub(re.escape(wrong), right, value, flags=re.I)
    for suffix in ("larda", "lardan", "larga", "larning", "lanishga", "lanish", "dagi", "nida", "ida", "ning", "dan", "ga", "ni", "da", "lab"):
        value = re.sub(
            rf"\b([A-Za-zO‘G‘o‘g‘]{{3,}})\s+({suffix})\b",
            rf"\1\2",
            value,
            flags=re.I,
        )
    value = re.sub(
        r"(?<!bog‘)\bliq ravishda o‘zgaradi",
        "Jism harakati kuchlarning yo‘nalishi va moduliga bog‘liq ravishda o‘zgaradi",
        value,
        flags=re.I,
    )
    value = re.sub(r"\b\d+-MAVZU(?=[A-ZА-ЯO‘G‘])", "", value)
    value = re.sub(
        r"(\b\d+(?:\.\d+)?-rasm\s*[abv]\)?)\s+(?:[A-ZА-ЯΑ-Ω]\d*\s+){3,}",
        r"\1 ",
        value,
    )
    value = re.sub(r"\s{2,}", " ", value)
    return value.strip(" \t\r\n-")


def looks_like_formula_junk(text: str) -> bool:
    if not text:
        return True
    letters = sum(ch.isalpha() for ch in text)
    operators = sum(ch in "=+−-*/√∑πρμΦεαβγ0123456789" for ch in text)
    if letters < 5 and operators > 4:
        return True
    if len(text) < 18 and re.fullmatch(r"[\d\s().,;:+\-=/αβγπρμΦε√]+", text):
        return True
    return False


def is_heading(text: str) -> bool:
    if len(text) > 105:
        return False
    return bool(
        re.match(r"^\d+\.\s+[A-ZА-ЯO‘G‘]", text)
        or re.match(r"^(Masala yechish namunasi|Mashq|Amaliy mashg‘ulot|Laboratoriya ishi|Savol va topshiriqlar)", text, re.I)
        or (len(text.split()) <= 8 and not re.search(r"[.!?]$", text) and text[:1].isupper())
    )


def extract_page_blocks(reader: PdfReader, page_number: int, lesson_title: str) -> list[dict]:
    raw = (reader.pages[page_number - 1].extract_text() or "").replace("\x00", " ")
    raw_lines = raw.splitlines()
    lines: list[str] = []
    pending = ""
    normalized_title = clean_text(lesson_title).upper()

    for raw_line in raw_lines:
        line = clean_text(raw_line)
        if not line or line == str(page_number):
            continue
        upper = line.upper()
        if re.match(r"^[IVX]+\s+BOB\.", upper):
            continue
        if normalized_title in upper and len(line) <= len(lesson_title) + 22:
            continue
        if re.fullmatch(r"\d+(?:\.\d+)?-rasm", line, re.I):
            continue
        if line.endswith("-") and len(line) > 2:
            pending += line[:-1]
            continue
        if pending:
            line = pending + line
            pending = ""
        if looks_like_formula_junk(line):
            continue
        lines.append(line)

    if pending:
        lines.append(clean_text(pending))

    blocks: list[dict] = []
    paragraph = ""
    for line in lines:
        if is_heading(line):
            if len(paragraph) >= 35:
                blocks.append({"type": "paragraph", "text": clean_text(paragraph), "page": page_number})
            paragraph = ""
            blocks.append({"type": "heading", "text": line, "page": page_number})
            continue
        paragraph = clean_text(f"{paragraph} {line}" if paragraph else line)
        if len(paragraph) >= 170 and re.search(r"[.!?]$", line):
            blocks.append({"type": "paragraph", "text": paragraph, "page": page_number})
            paragraph = ""
        elif len(paragraph) >= 560:
            split = max(paragraph.rfind(". ", 260), paragraph.rfind("? ", 260))
            if split > 0:
                blocks.append({"type": "paragraph", "text": paragraph[: split + 1], "page": page_number})
                paragraph = paragraph[split + 2 :]

    if len(paragraph) >= 35:
        blocks.append({"type": "paragraph", "text": clean_text(paragraph), "page": page_number})

    cleaned: list[dict] = []
    seen: set[str] = set()
    for block in blocks:
        text = block["text"]
        key = re.sub(r"\W+", "", text.lower())
        if len(key) < 20 or key in seen:
            continue
        seen.add(key)
        cleaned.append(block)
    return cleaned


def extract_figure(plumber_pages, page_indices: list[int], target: Path, used_hashes: set[str]) -> str:
    candidates = []
    for page_index in page_indices:
        page = plumber_pages[page_index]
        for image in page.images:
            x0, x1 = float(image.get("x0", 0)), float(image.get("x1", 0))
            top, bottom = float(image.get("top", 0)), float(image.get("bottom", 0))
            width, height = x1 - x0, bottom - top
            area = width * height
            if area < 950 or min(width, height) < 18:
                continue
            if max(width, height) / max(1, min(width, height)) > 8:
                continue
            if x0 < 10 and top < 10 and width > page.width * 0.8:
                continue
            candidates.append((area, page_index, (x0, top, x1, bottom)))

    for _, page_index, bbox in sorted(candidates, reverse=True):
        try:
            page = plumber_pages[page_index]
            pad = 10
            crop = (
                max(0, bbox[0] - pad),
                max(0, bbox[1] - pad),
                min(page.width, bbox[2] + pad),
                min(page.height, bbox[3] + pad),
            )
            rendered = page.crop(crop).to_image(resolution=190).original.convert("RGB")
            if rendered.width < 120 or rendered.height < 90:
                continue
            buffer = io.BytesIO()
            rendered.save(buffer, format="PNG", optimize=True)
            data = buffer.getvalue()
            digest = hashlib.sha256(data).hexdigest()
            if digest in used_hashes:
                continue
            used_hashes.add(digest)
            target.write_bytes(data)
            return target.relative_to(ROOT).as_posix()
        except Exception:
            continue
    return ""


def read_extraction_cache() -> dict | None:
    """Read the former PDF extraction only as a page-text/image cache.

    Summaries, formulas, relationships, experiments and lesson metadata are not
    reused; those are rebuilt from the curated definitions in this script.
    """
    if not EXTRACTION_CACHE.exists():
        return None
    source = EXTRACTION_CACHE.read_text(encoding="utf-8-sig").strip()
    prefix = "window.PHYSICS_COURSE = "
    if not source.startswith(prefix):
        return None
    if source.endswith(";"):
        source = source[:-1]
    try:
        data = json.loads(source[len(prefix) :])
    except json.JSONDecodeError:
        return None
    return data if len(data.get("lessons", [])) == 59 else None


def clean_cached_blocks(blocks: list[dict], lesson_title: str) -> list[dict]:
    cleaned: list[dict] = []
    seen: set[str] = set()
    normalized_title = clean_text(lesson_title).upper()
    for raw in blocks:
        text = clean_text(raw.get("text", ""))
        if not text or len(text) < 35:
            continue
        # The textbook uses a custom formula font. PDF text extraction may turn
        # those equations into unreadable token soup (for example
        # ``2. ⋅=mi mF R υ``). The verified equation is already rendered in the
        # lesson's formula card, so omit only OCR sentences containing an equals
        # sign while preserving the surrounding explanatory prose.
        sentences = re.split(r"(?<=[.!?])\s+(?=[A-ZА-Я0-9O‘ʻʼ])", text)
        readable_sentences = [
            sentence.strip()
            for sentence in sentences
            if "=" not in sentence
            and "FFF" not in sentence
            and not re.search(r"[⋅≈]{2,}", sentence)
        ]
        text = clean_text(" ".join(readable_sentences))
        if not text or len(text) < 35:
            continue
        if re.match(
            r"^(?:C\s+0\s+x\b|IB\s+IA\b|Eichki\s+Etashqi\b)",
            text,
            flags=re.I,
        ):
            continue
        # Trim OCR remnants that appear before the first real textbook word or
        # after a figure reference (axis labels such as ``S1 P1 P2``).
        text = re.sub(
            r"^(?:[A-ZΑ-Ω][A-Za-zΑ-ω0-9‘’'.]{0,5}\s+){3,}(?=[A-ZO‘G‘][a-z‘’]{3,})",
            "",
            text,
        )
        text = re.sub(rf"\b\d+-MAVZU\s+{re.escape(lesson_title)}\s*", "", text, flags=re.I)
        text = re.sub(r"\b(\d+(?:\.\d+)?-rasm)(?=\d+-MAVZU)", r"\1. ", text, flags=re.I)
        text = re.sub(r"\b\d+-MAVZU\b\s*", "", text, flags=re.I)
        text = re.sub(r"^(?:\d+\.\d+-rasm\s*)+(?:[abv]\)?\s*)*", "", text, flags=re.I)
        if re.search(r"\b(?:nFFF|xyF|nFF\s*F)\b", text):
            text = re.sub(r"\b\d{2,}.*?(?=Agar|Bu yerda|$)", "", text)
            text = re.sub(r"\b\d+\s*nF{2,}.*$", "", text)
            text = clean_text(text)
        if normalized_title in text.upper() and len(text) < len(lesson_title) + 45:
            continue
        digits = sum(ch.isdigit() for ch in text)
        operators = sum(ch in "=+−-*/√∑πρμΦεαβγ" for ch in text)
        letters = sum(ch.isalpha() for ch in text)
        # Formula fragments extracted from the textbook's special font are not
        # readable as prose.  The verified formula is shown in its own card.
        if "=" in text and (digits + operators) / max(1, len(text)) > 0.10:
            continue
        if letters / max(1, len(text)) < 0.52:
            continue
        text = re.sub(r"\b\d+(?:\.\d+)?-rasm(?:da|dagi|ning)?\s*[abv]?\)?", lambda m: m.group(0).split()[0], text, flags=re.I)
        text = re.sub(r"\b[1-9]F\b", "F", text)
        text = re.sub(r"\bF(?:x|y)?\d+\b", "F", text)
        text = clean_text(text)
        key = re.sub(r"\W+", "", text.lower())
        if len(key) < 24 or key in seen:
            continue
        seen.add(key)
        block_type = "heading" if is_heading(text) else "paragraph"
        cleaned.append({"type": block_type, "text": text, "page": int(raw.get("page", 0) or 0)})
    merged: list[dict] = []
    for block in cleaned:
        if (
            merged
            and block["type"] == "paragraph"
            and block["text"][:1].islower()
            and block["page"] == merged[-1]["page"]
            and len(merged[-1]["text"]) + len(block["text"]) < 780
        ):
            merged[-1]["text"] = clean_text(f"{merged[-1]['text']} {block['text']}")
        else:
            merged.append(block)
    return merged


def rebuild_from_cache(cache: dict) -> tuple[list[dict], set[str]]:
    lessons: list[dict] = []
    used_hashes: set[str] = set()
    chapter = 0
    cached_lessons = cache["lessons"]

    for index, (title, start) in enumerate(zip(TITLES, STARTS), start=1):
        while index > CHAPTER_ENDS[chapter]:
            chapter += 1
        end = STARTS[index] - 1 if index < len(STARTS) else 186
        page_numbers = list(range(start, end + 1))
        cached = cached_lessons[index - 1]
        blocks = [
            block
            for block in clean_cached_blocks(cached.get("theoryBlocks", []), title)
            if block.get("page") in page_numbers
        ]

        source_figure = ROOT / str(cached.get("figure", ""))
        figure_target = FIGURES / f"lesson-{index:02}.png"
        if source_figure.exists():
            with Image.open(source_figure) as image:
                rebuilt = image.convert("RGB")
                rebuilt.save(figure_target, format="PNG", optimize=True)
            digest = hashlib.sha256(figure_target.read_bytes()).hexdigest()
            used_hashes.add(digest)
            figure = figure_target.relative_to(ROOT).as_posix()
        else:
            figure = fallback_figure(title, FORMULAS[index - 1], figure_target)

        summary = TOPIC_NOTES[index - 1]
        relationship = FORMULA_NOTES[index - 1]
        application = CHAPTER_APPLICATIONS[chapter]
        experiment = CHAPTER_EXPERIMENTS[chapter]
        lessons.append(
            {
                "id": f"l{index}",
                "chapter": chapter,
                "number": index,
                "title": title,
                "pages": str(start) if start == end else f"{start}–{end}",
                "pageNumbers": page_numbers,
                "summary": summary,
                "paragraphs": [
                    summary,
                    f"Asosiy bog‘lanish: {relationship}",
                    f"Amaliy ahamiyati: {application}",
                ],
                "formula": FORMULAS[index - 1],
                "formulaExplanation": relationship,
                "unit": UNITS[index - 1],
                "relationship": relationship,
                "application": application,
                "theoryBlocks": blocks,
                "figure": figure,
                "figurePage": int(cached.get("figurePage", start)),
                "experiment": f"{experiment} Kuzatuvni “{title}” mavzusidagi asosiy qoida bilan izohlang.",
                "experimentQuestion": f"Natija nima sababdan shunday bo‘ldi? Javobingizni “{title}” mavzusining qonuniyati bilan tushuntiring.",
                "experimentExplanation": f"{relationship} {application}",
                "simulation": "interactive",
                "reward": 110 + chapter * 15 + (20 if "Masalalar" in title else 0) + (30 if "Laboratoriya" in title else 0),
            }
        )
    return lessons, used_hashes


def fallback_figure(title: str, formula: str, target: Path) -> str:
    image = Image.new("RGB", (1200, 700), "#eef4ff")
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((45, 45, 1155, 655), radius=42, fill="#ffffff", outline="#5367e8", width=6)
    draw.ellipse((85, 210, 365, 490), fill="#dfe7ff", outline="#2cb8b3", width=8)
    draw.line((225, 350, 525, 350), fill="#5367e8", width=16)
    draw.polygon([(525, 350), (470, 315), (470, 385)], fill="#5367e8")
    draw.text((585, 210), title[:48], fill="#111a35", font=ImageFont.load_default(size=34))
    draw.text((585, 330), formula, fill="#5367e8", font=ImageFont.load_default(size=30))
    draw.text((585, 430), "Idrok fizik modeli", fill="#4f5c78", font=ImageFont.load_default(size=24))
    image.save(target, format="PNG", optimize=True)
    return target.relative_to(ROOT).as_posix()


def main() -> None:
    if not PDF.exists():
        raise FileNotFoundError(PDF)
    if not (len(TITLES) == len(STARTS) == len(FORMULAS) == len(UNITS) == len(TOPIC_NOTES) == len(FORMULA_NOTES) == 59):
        raise RuntimeError("10-sinf metadata length mismatch")

    OUT.mkdir(parents=True, exist_ok=True)
    FIGURES.mkdir(parents=True, exist_ok=True)
    REPORT.parent.mkdir(parents=True, exist_ok=True)

    for old in FIGURES.glob("*.png"):
        old.unlink()

    cache = read_extraction_cache()
    reader = PdfReader(str(PDF))
    if cache:
        lessons, used_hashes = rebuild_from_cache(cache)
    else:
        lessons = []
        used_hashes: set[str] = set()
        chapter = 0
        with pdfplumber.open(str(PDF)) as pdf:
            for index, (title, start) in enumerate(zip(TITLES, STARTS), start=1):
                while index > CHAPTER_ENDS[chapter]:
                    chapter += 1
                end = STARTS[index] - 1 if index < len(STARTS) else 186
                page_numbers = list(range(start, end + 1))
                blocks: list[dict] = []
                for page_number in page_numbers:
                    blocks.extend(extract_page_blocks(reader, page_number, title))

                figure_target = FIGURES / f"lesson-{index:02}.png"
                figure = extract_figure(
                    pdf.pages,
                    [number - 1 for number in page_numbers[:3]],
                    figure_target,
                    used_hashes,
                )
                if not figure:
                    figure = fallback_figure(title, FORMULAS[index - 1], figure_target)

                summary = TOPIC_NOTES[index - 1]
                relationship = FORMULA_NOTES[index - 1]
                application = CHAPTER_APPLICATIONS[chapter]
                experiment = CHAPTER_EXPERIMENTS[chapter]
                lessons.append(
                    {
                        "id": f"l{index}",
                        "chapter": chapter,
                        "number": index,
                        "title": title,
                        "pages": str(start) if start == end else f"{start}–{end}",
                        "pageNumbers": page_numbers,
                        "summary": summary,
                        "paragraphs": [
                            summary,
                            f"Asosiy bog‘lanish: {relationship}",
                            f"Amaliy ahamiyati: {application}",
                        ],
                        "formula": FORMULAS[index - 1],
                        "formulaExplanation": relationship,
                        "unit": UNITS[index - 1],
                        "relationship": relationship,
                        "application": application,
                        "theoryBlocks": blocks,
                        "figure": figure,
                        "figurePage": start,
                        "experiment": f"{experiment} Kuzatuvni “{title}” mavzusidagi asosiy qoida bilan izohlang.",
                        "experimentQuestion": f"Natija nima sababdan shunday bo‘ldi? Javobingizni “{title}” mavzusining qonuniyati bilan tushuntiring.",
                        "experimentExplanation": f"{relationship} {application}",
                        "simulation": "interactive",
                        "reward": 110 + chapter * 15 + (20 if "Masalalar" in title else 0) + (30 if "Laboratoriya" in title else 0),
                    }
                )

    output = {
        "version": 20,
        "grade": 10,
        "chapters": CHAPTERS,
        "lessons": lessons,
        "totalPages": len(reader.pages),
        "source": "10-SINF FIZIKA DARSLIK 2022",
    }
    (OUT / "physics-content.js").write_text(
        "window.PHYSICS_COURSE = " + json.dumps(output, ensure_ascii=False, separators=(",", ":")) + ";\n",
        encoding="utf-8",
    )

    report = {
        "chapters": len(CHAPTERS),
        "lessons": len(lessons),
        "theoryBlocks": sum(len(item["theoryBlocks"]) for item in lessons),
        "figures": sum(bool(item["figure"]) for item in lessons),
        "uniqueFigures": len(used_hashes),
        "emptyTheory": [item["id"] for item in lessons if not item["theoryBlocks"]],
        "shortTheory": [item["id"] for item in lessons if len(item["theoryBlocks"]) < 3],
        "firstLesson": lessons[0]["title"],
        "lastLesson": lessons[-1]["title"],
    }
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
