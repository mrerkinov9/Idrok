"""Build the 11th-grade Idrok physics course from the supplied Uzbek textbook.

The source PDF is read page-by-page.  The generated course keeps the textbook
topic order, explanatory prose and selected diagrams while adding concise
formula cards, problems, safe experiments and carefully matched Uzbek videos.
"""

from __future__ import annotations

import hashlib
import io
import json
import math
import re
import sys
import unicodedata
from pathlib import Path

import pdfplumber
from PIL import Image, ImageDraw, ImageFont

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parents[1]
PDF = Path(r"C:\Users\ANUBIS PC\Downloads\Telegram Desktop\fizika_11_uzb (2).pdf")
OUT = ROOT / "assets" / "physics11"
FIGURES = OUT / "figures"
REPORT = ROOT / "tmp" / "pdfs" / "physics11-build-report.json"

TITLES = [
    "Magnit maydon. Magnit maydonni tavsiflovchi kattaliklar",
    "Bir jinsli magnit maydonning tokli ramkani aylantiruvchi momenti",
    "Tokli to‘g‘ri o‘tkazgich, halqa va g‘altakning magnit maydoni",
    "Tokli o‘tkazgichni magnit maydonda ko‘chirishda bajarilgan ish",
    "Tokli o‘tkazgichlarning o‘zaro ta’sir kuchi",
    "Bir jinsli magnit maydonda zaryadli zarraning harakati. Lorens kuchi",
    "Elektromagnit induksiya hodisasi. Faradey qonuni",
    "O‘zinduksiya hodisasi. O‘zinduksiya EYuK va induktivlik",
    "Moddalarning magnit xossalari",
    "Magnit maydon energiyasi",
    "Erkin elektromagnit tebranishlar va tebranish konturi",
    "Tebranishlarni grafik tasvirlash. So‘nuvchi elektromagnit tebranishlar",
    "Tranzistorli elektromagnit tebranishlar generatori",
    "O‘zgaruvchan tok zanjiridagi aktiv qarshilik",
    "O‘zgaruvchan tok zanjiridagi kondensator",
    "O‘zgaruvchan tok zanjiridagi induktiv g‘altak",
    "R, L va C ketma-ket ulangan zanjir uchun Om qonuni",
    "O‘zgaruvchan tok zanjirida rezonans hodisasi",
    "Laboratoriya: o‘zgaruvchan tok zanjirida rezonans",
    "O‘zgaruvchan tokning ishi va quvvati. Quvvat koeffitsiyenti",
    "Elektromagnit tebranishlarning tarqalishi va to‘lqin tezligi",
    "Elektromagnit to‘lqinlarning umumiy xossalari",
    "Radioaloqaning fizik asoslari va radiolokatsiya",
    "Teleko‘rsatuvlarning fizik asoslari. Toshkent - televideniye vatani",
    "Yorug‘lik interferensiyasi va difraksiyasi",
    "Laboratoriya: difraksion panjara yordamida to‘lqin uzunligini aniqlash",
    "Yorug‘lik dispersiyasi. Spektral analiz",
    "Yorug‘likning qutblanishi",
    "Infraqizil, ultrabinafsha va rentgen nurlanishlari",
    "Yorug‘lik oqimi, yorug‘lik kuchi va yoritilganlik qonuni",
    "Laboratoriya: yoritilganlikning yorug‘lik kuchiga bog‘liqligi",
    "Maxsus nisbiylik nazariyasi va tezliklarni relyativistik qo‘shish",
    "Massaning tezlikka bog‘liqligi. Massa va energiya bog‘lanishi",
    "Kvant fizikasining paydo bo‘lishi",
    "Fotoelektrik effekt. Fotonlar",
    "Foton impulsi, yorug‘lik bosimi va fotoeffektning qo‘llanilishi",
    "Atomning Bor modeli. Bor postulatlari",
    "Lazerlar va ularning turlari",
    "Atom yadrosining tarkibi. Bog‘lanish energiyasi va massa defekti",
    "Radioaktiv nurlanish va zarralarni qayd qilish usullari",
    "Radioaktiv yemirilish qonuni",
    "Yadro reaksiyalari. Siljish qonuni",
    "Elementar zarralar",
    "Atom energetikasining fizik asoslari va xavfsizlik",
    "O‘zbekistonda yadro fizikasi tadqiqotlari va ularning tatbiqi",
]

STARTS = [4, 7, 10, 13, 15, 17, 26, 29, 32, 35, 42, 45, 48, 51, 55, 57, 59, 62, 65, 66, 76, 79, 83, 87, 91, 96, 98, 103, 107, 110, 115, 124, 128, 135, 137, 142, 151, 156, 160, 164, 167, 170, 173, 177, 182]
CHAPTER_ENDS = [6, 10, 20, 31, 33, 36, 45]
CHAPTERS = [
    {"title": "Magnit maydon", "icon": "magnet", "accent": "#5268ef"},
    {"title": "Elektromagnit induksiya", "icon": "induction", "accent": "#1cb7a6"},
    {"title": "Elektromagnit tebranishlar", "icon": "wave", "accent": "#e45f91"},
    {"title": "Elektromagnit to‘lqinlar va to‘lqin optikasi", "icon": "prism", "accent": "#f0a33b"},
    {"title": "Nisbiylik nazariyasi", "icon": "relativity", "accent": "#755ce7"},
    {"title": "Kvant fizikasi", "icon": "quantum", "accent": "#2f8bd8"},
    {"title": "Atom va yadro fizikasi", "icon": "nucleus", "accent": "#e35a4f"},
]

FORMULAS = [
    "Φ = B·S·cosα", "M = I·B·S·sinα", "B = μ₀I/(2πr)", "A = I·ΔΦ", "F = μ₀I₁I₂l/(2πd)", "Fᴸ = qvB·sinα",
    "εᵢ = -ΔΦ/Δt", "εᴸ = -L·ΔI/Δt", "μ = B/B₀", "W = LI²/2",
    "T = 2π√(LC)", "q = qₘcos(ωt + φ)", "ν = 1/(2π√(LC))", "P = UI", "X꜀ = 1/(ωC)", "Xᴸ = ωL",
    "Z = √(R² + (Xᴸ - X꜀)²)", "Xᴸ = X꜀", "ω₀ = 1/√(LC)", "P = UI·cosφ",
    "c = λν", "n = c/v", "c = λν", "fₖ = 25 Hz", "Δd = kλ; a·sinφ = kλ", "λ = d·sinφ/k",
    "n = n(λ)", "I = I₀cos²α", "E = hν", "E = I·cosα/r²", "E = I·cosα/r²",
    "u = (v₁ + v₂)/(1 + v₁v₂/c²)", "E = mc²", "E = hν", "hν = A + mv²/2", "p = h/λ = hν/c",
    "mvr = nℏ", "hν = E₂ - E₁", "Eᵦ = Δm·c²", "A = ΔN/Δt", "N = N₀·2⁻ᵗ⁄ᵀ", "ΣE = const; Σp = const",
    "E² = p²c² + m²c⁴", "E = Δm·c²", "E = Δm·c²",
]

UNITS = [
    "Wb; T", "N·m", "T", "J", "N", "N", "V", "V; H", "-", "J", "s", "C", "Hz", "W", "Ω", "Ω", "Ω", "Ω", "rad/s", "W",
    "m/s", "-", "m/s", "Hz", "m", "m", "-", "W/m²", "J", "lx", "lx", "m/s", "J", "J", "J", "kg·m/s", "J", "J", "J", "Bq", "ta", "J; kg·m/s", "J", "J", "J",
]

SUMMARIES = [
    "Magnit induksiya maydonning kuch xarakteristikasi, magnit oqimi esa sirtni kesib o‘tuvchi magnit maydonni tavsiflaydi.",
    "Tokli ramkaga qarama-qarshi yo‘nalgan Amper kuchlari ta’sir qilib, uni aylantiruvchi moment hosil qiladi.",
    "To‘g‘ri tok, halqa va g‘altak atrofidagi magnit maydon tok kuchi, masofa, radius va o‘ramlar soniga bog‘liq.",
    "Magnit maydonda tokli o‘tkazgich ko‘chirilganda Amper kuchi ish bajaradi va magnit oqimi o‘zgaradi.",
    "Parallel toklar bir yo‘nalishda oqsa tortishadi, qarama-qarshi yo‘nalishda oqsa itarishadi.",
    "Magnit maydonga kirgan zaryadli zarra Lorens kuchi ta’sirida aylana yoki vintsimon trayektoriya bo‘ylab harakat qiladi.",
    "Konturdan o‘tuvchi magnit oqimi o‘zgarsa, unda induksiya EYuK va induksion tok hosil bo‘ladi.",
    "Tokning o‘zgarishi g‘altakning o‘zida o‘zinduksiya EYuK hosil qiladi; induktivlik shu xossani tavsiflaydi.",
    "Diamagnetik, paramagnetik va ferromagnetik moddalar tashqi magnit maydonga turlicha javob beradi.",
    "Tokli g‘altak magnit maydonida energiya saqlaydi va bu energiya induktivlik hamda tok kuchiga bog‘liq.",
    "Kondensator va g‘altakdan tuzilgan konturda elektr hamda magnit energiyalar davriy ravishda bir-biriga aylanadi.",
    "Elektromagnit tebranishlar grafikda davriy ko‘rinadi; qarshilik energiyani yutgani sabab amplituda vaqt o‘tishi bilan kamayadi.",
    "Tranzistorli generator manba energiyasi hisobiga tebranish konturida so‘nmas elektromagnit tebranishlarni saqlaydi.",
    "Aktiv qarshilikli zanjirda tok va kuchlanish bir xil fazada bo‘ladi hamda elektr energiya issiqlikka aylanadi.",
    "Kondensator o‘zgaruvchan tokka sig‘im qarshiligi ko‘rsatadi; chastota oshganda bu qarshilik kamayadi.",
    "Induktiv g‘altak o‘zgaruvchan tokka induktiv qarshilik ko‘rsatadi; chastota oshganda qarshilik ortadi.",
    "Ketma-ket RLC zanjirining to‘liq qarshiligi aktiv va reaktiv qarshiliklarning birgalikdagi ta’siri bilan aniqlanadi.",
    "Induktiv va sig‘im qarshiliklari tenglashganda rezonans yuz beradi va zanjirdagi tok maksimal bo‘ladi.",
    "Laboratoriyada generator chastotasi o‘zgartirilib, rezonans paytidagi maksimal tok tajribada aniqlanadi.",
    "O‘zgaruvchan tokning foydali quvvati kuchlanish, tok va fazalar siljishining kosinusiga bog‘liq.",
    "O‘zgaruvchan elektr va magnit maydonlar fazoda elektromagnit to‘lqin sifatida yorug‘lik tezligida tarqaladi.",
    "Elektromagnit to‘lqinlar qaytadi, sinadi, yutiladi, interferensiya va difraksiya hodisalarini namoyon qiladi.",
    "Radioaloqada axborot yuqori chastotali elektromagnit to‘lqinga yuklanib, antenna orqali uzatiladi va qabul qilinadi.",
    "Televideniyeda tasvir va tovush elektr signallariga aylantirilib, elektromagnit to‘lqinlar orqali uzatiladi.",
    "Kogerent yorug‘lik to‘lqinlari ustma-ust tushganda interferensiya, to‘siq va tirqishlarda esa difraksiya kuzatiladi.",
    "Difraksion panjara maksimumlarining burchagi orqali yorug‘likning to‘lqin uzunligi tajribada aniqlanadi.",
    "Muhitning sindirish ko‘rsatkichi to‘lqin uzunligiga bog‘liq bo‘lgani uchun oq yorug‘lik rangli spektrga ajraladi.",
    "Qutblanish yorug‘likning ko‘ndalang to‘lqin ekanini ko‘rsatadi va tebranish yo‘nalishini ajratishga imkon beradi.",
    "Elektromagnit spektrning infraqizil, ultrabinafsha va rentgen sohalari energiyasi hamda qo‘llanishi bilan farqlanadi.",
    "Yorug‘lik oqimi manba nurlanishini, yorug‘lik kuchi yo‘nalishdagi ulushni, yoritilganlik esa sirtga tushgan oqimni tavsiflaydi.",
    "Fotometr yordamida sirt yoritilganligining manba kuchi, masofa va tushish burchagiga bog‘liqligi tekshiriladi.",
    "Yorug‘lik tezligi barcha inersial sistemalarda o‘zgarmas; katta tezliklarda tezliklar relyativistik qonun bilan qo‘shiladi.",
    "Relyativistik tezliklarda energiya va impuls klassik mexanikadan farq qiladi; massa va energiya E=mc² orqali bog‘langan.",
    "Kvant nazariyasida energiya uzluksiz emas, balki hν ga teng alohida porsiyalar - kvantlar orqali yutiladi va chiqariladi.",
    "Fotoeffektda yorug‘lik metaldan elektron chiqaradi; jarayon foton energiyasi va metallning chiqish ishiga bog‘liq.",
    "Foton energiya bilan birga impulsga ham ega, shu sabab yorug‘lik jismlarga bosim ko‘rsatadi.",
    "Bor modelida elektronlar faqat ruxsat etilgan stasionar orbitalarda bo‘ladi va sathlar o‘zgarganda foton chiqaradi yoki yutadi.",
    "Lazer majburiy nurlanish orqali bir xil chastota, faza va yo‘nalishga ega kuchli kogerent yorug‘lik hosil qiladi.",
    "Yadro proton va neytronlardan tuzilgan; massa defekti yadroning bog‘lanish energiyasiga mos keladi.",
    "Radioaktiv zarralar ionlash, chaqnash, iz yoki elektr impulsi hosil qilishi orqali maxsus detektorlarda qayd etiladi.",
    "Radioaktiv yadrolar tasodifiy yemiriladi, ammo katta to‘plamdagi yadrolar soni eksponensial qonun bo‘yicha kamayadi.",
    "Yadro reaksiyalarida zaryad, nuklonlar soni, energiya va impuls saqlanadi; siljish qonuni yangi yadroni aniqlaydi.",
    "Elementar zarralar moddaning eng asosiy tarkibiy qismlari bo‘lib, fermionlar va bozonlar guruhlariga ajratiladi.",
    "Yadro bo‘linishida katta energiya ajraladi; reaktor bu jarayonni boshqaradi va qat’iy radiatsion xavfsizlikni talab qiladi.",
    "O‘zbekistondagi yadro fizikasi tadqiqotlari tibbiyot, sanoat, qishloq xo‘jaligi va materialshunoslikda qo‘llanmoqda.",
]

APPLICATIONS = [
    "elektr dvigatellar, o‘lchov asboblari va magnit sensorlar", "generatorlar, transformatorlar va induksion qurilmalar",
    "radioelektronika, energetika va signal generatorlari", "aloqa, optik asboblar, tibbiy tasvirlash va yoritish texnikasi",
    "tezlatkichlar, sun’iy yo‘ldoshlar va yuqori tezlik fizikasi", "fotoelementlar, kvant elektronika va lazer texnologiyasi",
    "yadro tibbiyoti, energetika, detektorlar va radiatsion nazorat",
]

EXPERIMENTS = [
    "Magnit, kompas va temir kukunlari bilan maydon chiziqlarining shakli hamda yo‘nalishini xavfsiz kuzating.",
    "Magnit va izolyatsiyalangan g‘altakni nisbiy harakatlantirib, galvanometr yoki LED javobini kuzating.",
    "Past kuchlanishli RLC modelida chastota, sig‘im yoki induktivlikni o‘zgartirib tokning javobini taqqoslang.",
    "Lazer ko‘rsatkichini tor tirqish, panjara yoki shaffof muhitdan o‘tkazib, faqat ekrandagi xavfsiz tasvirni kuzating.",
    "Yorug‘lik impulsi vaqtini tasvirlovchi modelda klassik va relyativistik tezlik qo‘shilishini taqqoslang.",
    "LED va turli rangli filtrlar bilan yorug‘lik energiyasi hamda fotoeffekt modelining chegaraviy chastotasini taqqoslang.",
    "Virtual detektorda alfa, beta va gamma nurlanishlarning o‘tuvchanligi hamda qayd etilish usullarini taqqoslang.",
]

# Carefully verified matches from the existing Khan Academy O‘zbek archive.
VIDEO_NUMBERS = {
    1: 258, 2: 264, 3: 265, 4: 279, 5: 266, 6: 259, 7: 276, 8: 277, 10: 275,
    21: 281, 22: 293, 25: 283, 26: 286, 27: 298, 28: 282,
    32: 329, 33: 333, 34: 334, 35: 336, 36: 335, 37: 341, 38: 344,
    39: 349, 41: 353, 42: 352, 44: 350,
}

PROBLEMS = [
    ("Magnit oqimi", "B = 0.5 T, S = 0.2 m², α = 60°.", ["Φ = BS cosα", "Φ = 0.5·0.2·0.5", "Φ = 0.05 Wb"], 0.05, "Wb", "B = 0.4 T, S = 0.3 m², α = 60° bo‘lsa, Φ ni toping.", 0.06),
    ("Aylantiruvchi moment", "I = 2 A, B = 0.4 T, S = 0.25 m², α = 90°.", ["M = IBS sinα", "M = 2·0.4·0.25·1", "M = 0.2 N·m"], 0.2, "N·m", "I = 3 A, B = 0.2 T, S = 0.5 m², α = 90° bo‘lsa, M ni toping.", 0.3),
    ("To‘g‘ri tokning magnit maydoni", "I = 5 A, r = 0.1 m, μ₀ = 4π·10⁻⁷ T·m/A.", ["B = μ₀I/(2πr)", "B = 4π·10⁻⁷·5/(2π·0.1)", "B = 1·10⁻⁵ T"], 1e-5, "T", "I = 4 A va r = 0.2 m bo‘lsa, B ni toping.", 4e-6),
    ("Magnit maydon bajargan ish", "I = 2 A, ΔΦ = 0.3 Wb.", ["A = IΔΦ", "A = 2·0.3", "A = 0.6 J"], 0.6, "J", "I = 3 A va ΔΦ = 0.2 Wb bo‘lsa, A ni toping.", 0.6),
    ("Parallel toklarning kuchi", "I₁ = I₂ = 10 A, l = 1 m, d = 0.1 m.", ["F = μ₀I₁I₂l/(2πd)", "F = 2·10⁻⁷·10·10·1/0.1", "F = 2·10⁻⁴ N"], 2e-4, "N", "I₁ = 5 A, I₂ = 8 A, l = 2 m, d = 0.2 m bo‘lsa, F ni toping.", 8e-5),
    ("Lorens kuchi", "q = 2·10⁻⁶ C, v = 3·10⁴ m/s, B = 0.5 T, α = 90°.", ["F = qvB sinα", "F = 2·10⁻⁶·3·10⁴·0.5", "F = 0.03 N"], 0.03, "N", "q = 1·10⁻⁶ C, v = 2·10⁴ m/s, B = 0.4 T, α = 90° bo‘lsa, F ni toping.", 0.008),
    ("Induksiya EYuK", "ΔΦ = 0.8 Wb, Δt = 0.2 s.", ["|ε| = ΔΦ/Δt", "|ε| = 0.8/0.2", "|ε| = 4 V"], 4, "V", "ΔΦ = 0.6 Wb va Δt = 0.3 s bo‘lsa, |ε| ni toping.", 2),
    ("O‘zinduksiya EYuK", "L = 0.4 H, ΔI = 3 A, Δt = 0.2 s.", ["|ε| = LΔI/Δt", "|ε| = 0.4·3/0.2", "|ε| = 6 V"], 6, "V", "L = 0.5 H, ΔI = 2 A, Δt = 0.25 s bo‘lsa, |ε| ni toping.", 4),
    ("Nisbiy magnit singdiruvchanlik", "B = 0.6 T, B₀ = 0.2 T.", ["μᵣ = B/B₀", "μᵣ = 0.6/0.2", "μᵣ = 3"], 3, "", "B = 0.8 T va B₀ = 0.2 T bo‘lsa, μᵣ ni toping.", 4),
    ("Magnit maydon energiyasi", "L = 0.5 H, I = 4 A.", ["W = LI²/2", "W = 0.5·4²/2", "W = 4 J"], 4, "J", "L = 0.8 H va I = 5 A bo‘lsa, W ni toping.", 10),
    ("Tebranish konturi davri", "L = 0.1 H, C = 1·10⁻⁴ F.", ["T = 2π√(LC)", "T = 2π√(10⁻⁵)", "T ≈ 0.0199 s"], 0.0199, "s", "L = 0.2 H va C = 2·10⁻⁴ F bo‘lsa, T ni toping.", 0.0397),
    ("Zaryad tebranishi", "qₘ = 5 C, ωt = 0.", ["q = qₘcos(ωt)", "cos0 = 1", "q = 5 C"], 5, "C", "qₘ = 8 C va ωt = 0 bo‘lsa, q ni toping.", 8),
    ("Generator chastotasi", "L = 0.1 H, C = 1·10⁻⁴ F.", ["f = 1/(2π√(LC))", "f = 1/(2π√10⁻⁵)", "f ≈ 50.33 Hz"], 50.33, "Hz", "L = 0.2 H va C = 2·10⁻⁴ F bo‘lsa, f ni toping.", 25.16),
    ("Aktiv qarshilikdagi quvvat", "U = 220 V, I = 2 A.", ["P = UI", "P = 220·2", "P = 440 W"], 440, "W", "U = 110 V va I = 3 A bo‘lsa, P ni toping.", 330),
    ("Sig‘im qarshiligi", "f = 50 Hz, C = 100 μF.", ["X꜀ = 1/(2πfC)", "C = 100·10⁻⁶ F", "X꜀ ≈ 31.83 Ω"], 31.83, "Ω", "f = 100 Hz va C = 50 μF bo‘lsa, X꜀ ni toping.", 31.83),
    ("Induktiv qarshilik", "f = 50 Hz, L = 0.2 H.", ["Xʟ = 2πfL", "Xʟ = 2π·50·0.2", "Xʟ ≈ 62.83 Ω"], 62.83, "Ω", "f = 60 Hz va L = 0.3 H bo‘lsa, Xʟ ni toping.", 113.1),
    ("RLC zanjir impedansi", "R = 6 Ω, Xʟ = 8 Ω, X꜀ = 0 Ω.", ["Z = √(R² + (Xʟ-X꜀)²)", "Z = √(6²+8²)", "Z = 10 Ω"], 10, "Ω", "R = 3 Ω, Xʟ = 4 Ω va X꜀ = 0 Ω bo‘lsa, Z ni toping.", 5),
    ("Rezonans chastotasi", "L = 0.1 H, C = 1·10⁻⁴ F.", ["f₀ = 1/(2π√(LC))", "f₀ = 1/(2π√10⁻⁵)", "f₀ ≈ 50.33 Hz"], 50.33, "Hz", "L = 0.2 H va C = 2·10⁻⁴ F bo‘lsa, f₀ ni toping.", 25.16),
    ("Rezonansni tajribada aniqlash", "L = 0.1 H, C = 1·10⁻⁴ F.", ["Rezonansda Xʟ = X꜀", "f₀ = 1/(2π√(LC))", "f₀ ≈ 50.33 Hz"], 50.33, "Hz", "L = 0.2 H va C = 2·10⁻⁴ F bo‘lsa, rezonans chastotasini toping.", 25.16),
    ("O‘zgaruvchan tok quvvati", "U = 220 V, I = 2 A, cosφ = 0.8.", ["P = UIcosφ", "P = 220·2·0.8", "P = 352 W"], 352, "W", "U = 230 V, I = 1.5 A va cosφ = 0.9 bo‘lsa, P ni toping.", 310.5),
    ("Elektromagnit to‘lqin uzunligi", "c = 3·10⁸ m/s, f = 1·10⁸ Hz.", ["λ = c/f", "λ = 3·10⁸/10⁸", "λ = 3 m"], 3, "m", "f = 6·10⁸ Hz bo‘lsa, λ ni toping.", 0.5),
    ("Muhitning sindirish ko‘rsatkichi", "c = 3·10⁸ m/s, v = 2·10⁸ m/s.", ["n = c/v", "n = 3·10⁸/(2·10⁸)", "n = 1.5"], 1.5, "", "v = 1.5·10⁸ m/s bo‘lsa, n ni toping.", 2),
    ("Radio to‘lqin uzunligi", "f = 100 MHz.", ["λ = c/f", "f = 100·10⁶ Hz", "λ = 3 m"], 3, "m", "f = 75 MHz bo‘lsa, λ ni toping.", 4),
    ("Televideniye kadrlari", "Kadrlar chastotasi 25 Hz, vaqt 2 s.", ["N = ft", "N = 25·2", "N = 50 ta"], 50, "ta", "Chastota 30 Hz va vaqt 3 s bo‘lsa, kadrlar sonini toping.", 90),
    ("Interferensiya maksimumi", "k = 2, λ = 600 nm.", ["Δ = kλ", "Δ = 2·600", "Δ = 1200 nm"], 1200, "nm", "k = 3 va λ = 500 nm bo‘lsa, Δ ni toping.", 1500),
    ("Difraksion panjara", "d = 2·10⁻⁶ m, sinφ = 0.5, k = 2.", ["d sinφ = kλ", "λ = d sinφ/k", "λ = 5·10⁻⁷ m"], 5e-7, "m", "d = 1.6·10⁻⁶ m, sinφ = 0.5 va k = 2 bo‘lsa, λ ni toping.", 4e-7),
    ("Dispersiyada yorug‘lik tezligi", "n = 1.5, c = 3·10⁸ m/s.", ["v = c/n", "v = 3·10⁸/1.5", "v = 2·10⁸ m/s"], 2e8, "m/s", "n = 1.6 bo‘lsa, v ni toping.", 1.875e8),
    ("Malyus qonuni", "I₀ = 100 W/m², α = 60°.", ["I = I₀cos²α", "cos²60° = 0.25", "I = 25 W/m²"], 25, "W/m²", "I₀ = 80 W/m² va α = 45° bo‘lsa, I ni toping.", 40),
    ("Nurlanish kvanti energiyasi", "h = 6.63·10⁻³⁴ J·s, ν = 5·10¹⁴ Hz.", ["E = hν", "E = 6.63·10⁻³⁴·5·10¹⁴", "E = 3.315·10⁻¹⁹ J"], 3.315e-19, "J", "ν = 4·10¹⁴ Hz bo‘lsa, E ni toping.", 2.652e-19),
    ("Yoritilganlik", "I = 100 cd, r = 2 m, nurlar sirtga tik tushadi.", ["E = I/r²", "E = 100/2²", "E = 25 lx"], 25, "lx", "I = 180 cd va r = 3 m bo‘lsa, E ni toping.", 20),
    ("Yorug‘lik oqimidan yoritilganlik", "Φ = 600 lm, S = 12 m².", ["E = Φ/S", "E = 600/12", "E = 50 lx"], 50, "lx", "Φ = 450 lm va S = 9 m² bo‘lsa, E ni toping.", 50),
    ("Tezliklarni relyativistik qo‘shish", "u = 0.6c, v = 0.6c.", ["w/c = (0.6+0.6)/(1+0.6·0.6)", "w/c = 1.2/1.36", "w ≈ 0.882c"], 0.882, "c", "u = 0.5c va v = 0.4c bo‘lsa, w/c ni toping.", 0.75),
    ("Massa va energiya bog‘lanishi", "m = 0.001 kg, c = 3·10⁸ m/s.", ["E = mc²", "E = 0.001·(3·10⁸)²", "E = 9·10¹³ J"], 9e13, "J", "m = 0.002 kg bo‘lsa, E ni toping.", 1.8e14),
    ("Foton energiyasi", "h = 6.63·10⁻³⁴ J·s, ν = 5·10¹⁴ Hz.", ["E = hν", "E = 6.63·10⁻³⁴·5·10¹⁴", "E = 3.315·10⁻¹⁹ J"], 3.315e-19, "J", "ν = 4·10¹⁴ Hz bo‘lsa, E ni toping.", 2.652e-19),
    ("Fotoeffektda maksimal kinetik energiya", "hν = 4·10⁻¹⁹ J, A = 1.5·10⁻¹⁹ J.", ["Eₖ = hν-A", "Eₖ = (4-1.5)·10⁻¹⁹", "Eₖ = 2.5·10⁻¹⁹ J"], 2.5e-19, "J", "hν = 5·10⁻¹⁹ J va A = 2·10⁻¹⁹ J bo‘lsa, Eₖ ni toping.", 3e-19),
    ("Foton impulsi", "h = 6.63·10⁻³⁴ J·s, λ = 6.63·10⁻⁷ m.", ["p = h/λ", "p = 6.63·10⁻³⁴/(6.63·10⁻⁷)", "p = 1·10⁻²⁷ kg·m/s"], 1e-27, "kg·m/s", "λ = 3.315·10⁻⁷ m bo‘lsa, p ni toping.", 2e-27),
    ("Bor orbitasidagi impuls momenti", "n = 3.", ["L = nħ", "L = 3ħ", "L/ħ = 3"], 3, "ħ", "n = 5 bo‘lsa, L/ħ ni toping.", 5),
    ("Lazer nurlanish chastotasi", "ΔE = 3.315·10⁻¹⁹ J, h = 6.63·10⁻³⁴ J·s.", ["ν = ΔE/h", "ν = 3.315·10⁻¹⁹/(6.63·10⁻³⁴)", "ν = 5·10¹⁴ Hz"], 5e14, "Hz", "ΔE = 1.989·10⁻¹⁹ J bo‘lsa, ν ni toping.", 3e14),
    ("Yadro bog‘lanish energiyasi", "Massa defekti Δm = 0.01 u.", ["E = Δm·931.5 MeV", "E = 0.01·931.5", "E = 9.315 MeV"], 9.315, "MeV", "Δm = 0.02 u bo‘lsa, E ni toping.", 18.63),
    ("Detektor qayd etgan faollik", "60 s ichida 600 ta yemirilish qayd etildi.", ["A = N/t", "A = 600/60", "A = 10 Bq"], 10, "Bq", "30 s ichida 900 ta yemirilish bo‘lsa, A ni toping.", 30),
    ("Yarim yemirilish", "N₀ = 800 ta, t = 3T.", ["N = N₀/2³", "N = 800/8", "N = 100 ta"], 100, "ta", "N₀ = 1600 ta va t = 4T bo‘lsa, N ni toping.", 100),
    ("Alfa yemirilishdagi massa soni", "²³⁸U yadrosi alfa zarra chiqardi.", ["Alfa zarraning massa soni 4", "A₂ = 238-4", "A₂ = 234"], 234, "", "²²⁶Ra alfa zarra chiqarsa, yangi yadroning massa sonini toping.", 222),
    ("Elementar zarralarning kvark tarkibi", "Baryon uchta kvarkdan tuzilgan.", ["Baryon = qqq", "Kvarklar soni = 3", "Javob: 3"], 3, "ta", "Neytron baryon bo‘lsa, undagi kvarklar sonini kiriting.", 3),
    ("Yadro energiyasi", "Massa defekti Δm = 0.001 kg.", ["E = Δmc²", "E = 0.001·(3·10⁸)²", "E = 9·10¹³ J"], 9e13, "J", "Δm = 0.002 kg bo‘lsa, E ni toping.", 1.8e14),
    ("O‘zbekistonda yadro fizikasi", "Yadro fizikasi instituti tashkil etilgan yilni aniqlang.", ["Darslikdagi tarixiy ma’lumotni topamiz", "Institut 1956-yilda tashkil etilgan", "Javob: 1956"], 1956, "yil", "Muntazam yadro fizikasi tadqiqotlari boshlangan yilni kiriting.", 1949),
]

CYRILLIC_LOOKALIKES = str.maketrans({
    "а": "a", "е": "e", "о": "o", "р": "p", "с": "c", "у": "y", "х": "x",
    "А": "A", "Е": "E", "О": "O", "Р": "P", "С": "C", "У": "Y", "Х": "X", "М": "M", "Т": "T",
    "В": "B", "К": "K", "Н": "H", "Ф": "Φ", "к": "k", "п": "n",
})


def clean_text(value: str) -> str:
    text = unicodedata.normalize("NFC", str(value or "")).translate(CYRILLIC_LOOKALIKES)
    text = text.replace("\u00ad", "").replace("ﬁ", "fi").replace("ﬂ", "fl")
    text = text.replace("`", "‘").replace("ʼ", "’").replace("ʻ", "‘")
    text = "".join(char for char in text if not (0xE000 <= ord(char) <= 0xF8FF) and ord(char) != 0xA700)
    text = re.sub(r"\s+([,.;:!?])", r"\1", text)
    text = re.sub(r"\(\s+", "(", text)
    text = re.sub(r"\s+\)", ")", text)
    text = re.sub(r"\s+", " ", text).strip()
    replacements = {
        "bo‘l gan": "bo‘lgan", "yo‘na lishi": "yo‘nalishi", "o‘tkаz gich": "o‘tkazgich",
        "mаydоn": "maydon", "mаgnit": "magnit", "tоk": "tok", "kаttаlik": "kattalik",
        "tа’sir": "ta’sir", "tаjribа": "tajriba", "fоrmulа": "formula", "аniqlаnаdi": "aniqlanadi",
        "bоg‘liq": "bog‘liq", "bo‘lgаn": "bo‘lgan", "o‘zgаrish": "o‘zgarish",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    # The PDF occasionally inserts spaces inside Uzbek words. Rejoin only
    # unmistakable suffix fragments after alphabetic stems of at least 3 letters.
    suffixes = r"ning|lar|lib|ril|sa|digan|kasi|chanligi|lanadi|laydi|lash|ishi|gan|dan|dagi|ga|da|ni|si|cha|lik|li|may|uvchi|dir|di|miz|siz|lari|ladi|lsa"
    for _ in range(2):
        text = re.sub(rf"\b([A-Za-zÀ-ž‘’]{{3,}})\s+({suffixes})\b", r"\1\2", text, flags=re.I)
    return text.strip(" -")


def normalize(value: str) -> str:
    text = unicodedata.normalize("NFKD", clean_text(value).lower())
    text = "".join(char for char in text if not unicodedata.combining(char))
    return re.sub(r"[^a-z0-9]+", " ", text.replace("‘", "").replace("’", "")).strip()


def readable(text: str) -> bool:
    if len(text) < 28:
        return False
    letters = sum(char.isalpha() for char in text)
    odd = sum(char in "=+−*/√∑πρμΦεαβγ0123456789" for char in text)
    return letters / max(1, len(text)) > 0.48 and not ("=" in text and odd / len(text) > 0.12)


def page_blocks(page, book_page: int, title: str, topic_index: int | None = None) -> list[dict]:
    raw = page.extract_text(x_tolerance=2, y_tolerance=3) or ""
    if topic_index is not None:
        marker = re.search(rf"\b{topic_index}\s*[-–]?\s*mavzu\.?", raw, re.I)
        if marker:
            raw = raw[marker.end():]
    title_key = normalize(title)
    lines: list[str] = []
    pending = ""
    for raw_line in raw.splitlines():
        line = clean_text(raw_line)
        if not line or line == str(book_page) or re.match(r"^[IVX]+ bob\.", line, re.I):
            continue
        line = re.sub(r"^\d+-\s*mavzu\.\s*", "", line, flags=re.I)
        if title_key and title_key in normalize(line) and len(line) <= len(title) + 35:
            continue
        if re.fullmatch(r"\d+(?:\.\d+)?-rasm\.?", line, re.I):
            continue
        if line.endswith("-"):
            pending += line[:-1]
            continue
        if pending:
            line = pending + line
            pending = ""
        lines.append(line)

    blocks: list[dict] = []
    paragraph = ""
    for line in lines:
        heading = len(line) < 90 and (
            re.match(r"^(Masala yechish namunasi|Laboratoriya ishi|Amaliy ish|Savol va topshiriqlar|\d+\.(?!\d))", line, re.I)
            or (len(line.split()) <= 7 and line.isupper())
        )
        if heading:
            if readable(paragraph):
                blocks.append({"type": "paragraph", "text": clean_text(paragraph), "page": book_page})
            paragraph = ""
            if readable(line + " mavzusi"):
                blocks.append({"type": "heading", "text": line, "page": book_page})
            continue
        paragraph = clean_text(f"{paragraph} {line}" if paragraph else line)
        if len(paragraph) >= 190 and re.search(r"[.!?]$", line):
            if readable(paragraph):
                blocks.append({"type": "paragraph", "text": paragraph, "page": book_page})
            paragraph = ""
        elif len(paragraph) > 650:
            cut = max(paragraph.rfind(". ", 280), paragraph.rfind("? ", 280))
            if cut > 0:
                piece, paragraph = paragraph[:cut + 1], paragraph[cut + 2:]
                if readable(piece):
                    blocks.append({"type": "paragraph", "text": piece, "page": book_page})
    if readable(paragraph):
        blocks.append({"type": "paragraph", "text": clean_text(paragraph), "page": book_page})

    seen, result = set(), []
    for block in blocks:
        key = re.sub(r"\W+", "", block["text"].lower())
        if len(key) < 24 or key in seen:
            continue
        seen.add(key)
        result.append(block)
    return result


def font(size: int, bold: bool = False):
    names = [
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
    ]
    for name in names:
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            pass
    return ImageFont.load_default()


def fallback_figure(index: int, chapter: int, title: str, formula: str, target: Path) -> str:
    colors = [(48, 102, 235), (25, 177, 156), (226, 85, 143), (237, 157, 48), (116, 86, 224), (42, 135, 213), (224, 79, 71)]
    accent = colors[chapter]
    image = Image.new("RGB", (1200, 700), (8, 18, 35))
    draw = ImageDraw.Draw(image)
    for x in range(0, 1200, 40):
        draw.line((x, 0, x, 700), fill=(18, 34, 57), width=1)
    for y in range(0, 700, 40):
        draw.line((0, y, 1200, y), fill=(18, 34, 57), width=1)
    draw.rounded_rectangle((45, 45, 1155, 655), 38, fill=(13, 29, 49), outline=accent, width=4)
    cx, cy = 320, 350
    if index == 29:
        spectrum = [(116, 79, 198), (60, 104, 230), (38, 180, 220), (50, 196, 102), (245, 210, 54), (245, 142, 45), (229, 65, 70)]
        for offset, color in enumerate(spectrum):
            x = 105 + offset * 62
            draw.rounded_rectangle((x, 235, x + 52, 470), 12, fill=color)
        draw.line((105, 500, 535, 500), fill=(220, 232, 248), width=4)
        draw.text((110, 520), "infraqizil", font=font(18), fill=(170, 186, 208))
        draw.text((430, 520), "ultrabinafsha", font=font(18), fill=(170, 186, 208))
    elif index == 32:
        draw.line((100, cy, 540, cy), fill=(184, 202, 227), width=4)
        draw.line((cx, 120, cx, 580), fill=(184, 202, 227), width=4)
        draw.polygon([(cx, cy), (170, 130), (470, 130)], outline=accent)
        draw.polygon([(cx, cy), (170, 570), (470, 570)], outline=(81, 225, 207))
        draw.line((cx, cy, 475, 195), fill=(255, 198, 75), width=8)
        draw.text((480, 170), "c", font=font(28, True), fill=(255, 218, 116))
        draw.text((500, 360), "x", font=font(24, True), fill="white")
        draw.text((335, 120), "ct", font=font(24, True), fill="white")
    elif index == 34:
        for level, y0 in enumerate((505, 425, 335, 235), start=1):
            draw.line((105, y0, 505, y0), fill=(76 + level * 25, 120 + level * 20, 230), width=5)
            draw.text((70, y0 - 14), f"E{level}", font=font(18, True), fill=(195, 211, 235))
        draw.line((270, 495, 270, 255), fill=(255, 188, 66), width=8)
        draw.polygon([(255, 275), (285, 275), (270, 235)], fill=(255, 188, 66))
        for x in range(300, 500, 18):
            y = 260 + math.sin((x - 300) / 18) * 20
            draw.ellipse((x-3, y-3, x+3, y+3), fill=(85, 225, 210))
        draw.text((320, 285), "hν", font=font(26, True), fill=(85, 225, 210))
    elif index == 37:
        for radius, color in ((70, accent), (125, (81, 225, 207)), (180, (255, 188, 66))):
            draw.ellipse((cx-radius, cy-radius, cx+radius, cy+radius), outline=color, width=5)
        draw.ellipse((cx-34, cy-34, cx+34, cy+34), fill=(224, 79, 71))
        draw.ellipse((cx+155, cy-12, cx+179, cy+12), fill="white")
        draw.text((118, 555), "n = 1     n = 2     n = 3", font=font(22, True), fill=(190, 207, 230))
    elif index == 42:
        draw.ellipse((105, 245, 305, 445), fill=(35, 70, 112), outline=accent, width=5)
        for px, py, color in ((155,300,(229,75,70)),(220,330,(255,190,70)),(180,385,(82,218,204)),(250,390,(229,75,70))):
            draw.ellipse((px-22, py-22, px+22, py+22), fill=color)
        draw.line((315, 345, 500, 260), fill=(255, 188, 66), width=8)
        draw.polygon([(475, 247), (515, 252), (490, 283)], fill=(255, 188, 66))
        draw.text((390, 210), "α", font=font(42, True), fill=(255, 206, 104))
        draw.text((105, 475), "A → A−4     Z → Z−2", font=font(23, True), fill=(195, 211, 235))
    elif index == 43:
        points = [(320, 175), (145, 470), (495, 470)]
        draw.polygon(points, outline=accent)
        for (x, y), label, color in zip(points, ("u", "u", "d"), ((255,90,100),(74,205,232),(255,193,73))):
            draw.ellipse((x-55, y-55, x+55, y+55), fill=color)
            draw.text((x-15, y-27), label, font=font(42, True), fill=(8,18,35))
        draw.text((220, 540), "proton = uud", font=font(25, True), fill=(218, 231, 248))
    elif index == 45:
        draw.rounded_rectangle((105, 245, 525, 485), 22, fill=(29, 63, 94), outline=accent, width=5)
        for x in (155, 245, 335, 425):
            draw.rectangle((x, 300, x+48, 485), fill=(80, 218, 202))
            draw.rectangle((x+8, 320, x+40, 370), fill=(13, 29, 49))
        draw.polygon([(85,245),(315,120),(545,245)], fill=(224,79,71), outline=accent)
        draw.ellipse((270,165,360,255), fill=(255,190,70), outline=(255,235,170), width=4)
        draw.text((286, 183), "UZ", font=font(26, True), fill=(13,29,49))
        draw.text((130, 520), "FAN • TIBBIYOT • SANOAT", font=font(21, True), fill=(195,211,235))
    elif chapter in (0, 1):
        draw.rounded_rectangle((170, 300, 470, 400), 35, fill=(220, 65, 75))
        draw.text((205, 323), "N", font=font(42, True), fill="white")
        draw.text((410, 323), "S", font=font(42, True), fill="white")
        for angle in range(0, 360, 30):
            rad = math.radians(angle)
            draw.line((cx, cy, cx + math.cos(rad) * 190, cy + math.sin(rad) * 120), fill=accent, width=3)
    elif chapter in (2, 3):
        points = []
        for x in range(90, 550):
            y = cy + math.sin((x - 90) / 42 + index * .27) * 105
            points.append((x, y))
        draw.line(points, fill=accent, width=8)
        draw.line((90, cy, 550, cy), fill=(86, 107, 135), width=2)
    elif chapter == 4:
        draw.ellipse((155, 185, 485, 515), outline=accent, width=7)
        draw.ellipse((215, 245, 425, 455), outline=(81, 225, 207), width=4)
        draw.line((cx, cy, 500, 210), fill="white", width=5)
    elif chapter == 5:
        for radius in (55, 110, 165):
            draw.ellipse((cx-radius, cy-radius, cx+radius, cy+radius), outline=accent, width=4)
        draw.ellipse((cx-23, cy-23, cx+23, cy+23), fill=(255, 182, 69))
    else:
        draw.ellipse((cx-55, cy-55, cx+55, cy+55), fill=accent)
        for angle in (0, 60, 120):
            box = (cx-190, cy-75, cx+190, cy+75)
            draw.ellipse(box, outline=(84, 225, 208), width=4)
        draw.ellipse((cx+135, cy-16, cx+167, cy+16), fill="white")
    draw.text((610, 155), f"{index:02d} / 11-SINF", font=font(22, True), fill=accent)
    wrapped = []
    words = title.split()
    line = ""
    for word in words:
        candidate = f"{line} {word}".strip()
        if draw.textlength(candidate, font=font(31, True)) > 500 and line:
            wrapped.append(line); line = word
        else:
            line = candidate
    if line:
        wrapped.append(line)
    y = 205
    for line in wrapped[:4]:
        draw.text((610, y), line, font=font(31, True), fill=(241, 246, 255)); y += 43
    draw.rounded_rectangle((610, 455, 1095, 555), 18, fill=(22, 43, 69), outline=accent, width=2)
    draw.text((638, 484), formula, font=font(29, True), fill=(102, 231, 215))
    draw.text((610, 590), "IDROK • INTERAKTIV FIZIKA", font=font(17, True), fill=(105, 124, 151))
    image.save(target, "PNG", optimize=True)
    return target.relative_to(ROOT).as_posix()


def extract_figure(pages, page_indices: list[int], index: int, chapter: int, title: str, formula: str, target: Path, used: set[str]) -> str:
    candidates = []
    for page_index in page_indices[:4]:
        page = pages[page_index]
        for item in page.images:
            x0, x1 = float(item.get("x0", 0)), float(item.get("x1", 0))
            top, bottom = float(item.get("top", 0)), float(item.get("bottom", 0))
            width, height = x1 - x0, bottom - top
            if width * height >= 900 and min(width, height) >= 18 and max(width, height) / max(1, min(width, height)) < 7:
                candidates.append((width * height, page_index, (x0, top, x1, bottom)))
    for _, page_index, bbox in sorted(candidates, reverse=True):
        try:
            page = pages[page_index]
            pad = 10
            crop = (max(0, bbox[0]-pad), max(0, bbox[1]-pad), min(page.width, bbox[2]+pad), min(page.height, bbox[3]+pad))
            rendered = page.crop(crop).to_image(resolution=210).original.convert("RGB")
            if rendered.width < 150 or rendered.height < 90:
                continue
            buffer = io.BytesIO(); rendered.save(buffer, "PNG", optimize=True)
            data = buffer.getvalue(); digest = hashlib.sha256(data).hexdigest()
            if digest in used:
                continue
            used.add(digest); target.write_bytes(data)
            return target.relative_to(ROOT).as_posix()
        except Exception:
            continue
    return fallback_figure(index, chapter, title, formula, target)


def load_video_archive() -> dict[int, dict]:
    source = ROOT / "tmp" / "kau_videos.json"
    if not source.exists():
        return {}
    rows = json.loads(source.read_text(encoding="utf-8-sig"))
    result = {}
    for row in rows:
        match = re.match(r"^(\d+)\.", row.get("title", ""))
        if match:
            result[int(match.group(1))] = row
    return result


def video_for(lesson_number: int, archive: dict[int, dict]):
    row = archive.get(VIDEO_NUMBERS.get(lesson_number, -1))
    if not row:
        return None
    short_title = re.sub(r"\s+Fizika\..*$", "", row.get("title", "")).strip()
    return {
        "id": row.get("id"), "title": short_title, "duration": row.get("duration", ""),
        "source": row.get("source", ""), "embed": row.get("embed", ""),
        "provider": "Khan Academy O‘zbek", "type": "youtube", "verified": True,
    }


def problem_for(index: int, formula: str, unit: str, title: str):
    name, given, steps, answer, answer_unit, prompt, practice = PROBLEMS[index-1]
    return {"title": name, "given": given, "steps": steps, "answer": answer, "unit": answer_unit, "prompt": prompt, "practice": practice}


def main() -> None:
    if not PDF.exists():
        raise FileNotFoundError(PDF)
    lengths = [len(TITLES), len(STARTS), len(FORMULAS), len(UNITS), len(SUMMARIES)]
    if len(set(lengths)) != 1 or lengths[0] != 45:
        raise RuntimeError(f"11-sinf metadata length mismatch: {lengths}")

    OUT.mkdir(parents=True, exist_ok=True)
    FIGURES.mkdir(parents=True, exist_ok=True)
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    for old in FIGURES.glob("*.png"):
        old.unlink()

    archive = load_video_archive()
    lessons, used_figures = [], set()
    chapter = 0
    with pdfplumber.open(str(PDF)) as pdf:
        for index, (title, start) in enumerate(zip(TITLES, STARTS), start=1):
            while index > CHAPTER_ENDS[chapter]:
                chapter += 1
            end = STARTS[index] - 1 if index < len(STARTS) else 187
            book_pages = list(range(start, end + 1))
            # The PDF has one unnumbered cover page before textbook page 1.
            page_indices = [number for number in book_pages]
            blocks = []
            for book_page, page_index in zip(book_pages, page_indices):
                blocks.extend(page_blocks(pdf.pages[page_index], book_page, title, index if book_page == start else None))
            figure_target = FIGURES / f"lesson-{index:02}.png"
            figure = extract_figure(pdf.pages, page_indices, index, chapter, title, FORMULAS[index-1], figure_target, used_figures)
            relationship = f"{FORMULAS[index-1]} munosabati mavzudagi asosiy fizik kattaliklarning bog‘lanishini ifodalaydi."
            application = f"Ushbu qonuniyat {APPLICATIONS[chapter]}da qo‘llanadi."
            experiment = EXPERIMENTS[chapter]
            lessons.append({
                "id": f"l{index}", "chapter": chapter, "number": index, "title": title,
                "pages": str(start) if start == end else f"{start}–{end}", "pageNumbers": book_pages,
                "summary": SUMMARIES[index-1],
                "paragraphs": [SUMMARIES[index-1], f"Asosiy bog‘lanish: {relationship}", f"Amaliy ahamiyati: {application}"],
                "formula": FORMULAS[index-1], "formulaExplanation": relationship, "unit": UNITS[index-1],
                "relationship": relationship, "application": application, "theoryBlocks": blocks,
                "figure": figure, "figurePage": start,
                "experiment": f"{experiment} Kuzatuvni “{title}” mavzusidagi qonuniyat bilan izohlang.",
                "experimentQuestion": f"Natija nima sababdan shunday bo‘ldi? Javobingizni “{title}” mavzusining asosiy qoidasi bilan tushuntiring.",
                "experimentExplanation": f"{SUMMARIES[index-1]} {application}",
                "reward": 130 + chapter * 15 + (25 if title.startswith("Laboratoriya") else 0),
                "video": video_for(index, archive), "experimentVideo": None,
                "problem": problem_for(index, FORMULAS[index-1], UNITS[index-1], title),
            })

    output = {"version": 11, "grade": 11, "chapters": CHAPTERS, "lessons": lessons, "totalPages": 193, "source": "11-sinf fizika darsligi, 2018"}
    (OUT / "physics-content.js").write_text("window.PHYSICS_COURSE = " + json.dumps(output, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
    report = {
        "chapters": len(CHAPTERS), "lessons": len(lessons), "theoryBlocks": sum(len(item["theoryBlocks"]) for item in lessons),
        "figures": sum(bool(item["figure"]) for item in lessons), "uniqueFigures": len(used_figures),
        "verifiedVideos": sum(bool(item.get("video")) for item in lessons),
        "emptyTheory": [item["id"] for item in lessons if not item["theoryBlocks"]],
        "shortTheory": [item["id"] for item in lessons if len(item["theoryBlocks"]) < 3],
        "firstLesson": lessons[0]["title"], "lastLesson": lessons[-1]["title"],
    }
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
