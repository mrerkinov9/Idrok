import html
import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path


CHANNELS = ["Fizikadan_tajribalar", "pizik_lab"]
QUERIES = [
    "diffuziya Broun harakati", "molekula o‘lchami", "modda miqdori mol", "molekula soni",
    "ideal gaz bosimi", "temperatura termometr", "gaz molekulalari tezligi", "harorat tezlik",
    "ideal gaz qonunlari", "izotermik jarayon", "izobarik jarayon", "izoxorik jarayon",
    "moy tomchisi molekula", "gaz qonunlari",
    "ichki energiya", "termodinamik ish nasos", "issiqlik miqdori", "issiqlik sig‘imi",
    "issiqlik muvozanati", "qattiq jism issiqlik sig‘imi", "yonish issiqligi",
    "termodinamikaning birinchi qonuni", "energiya balansi", "qaytmas jarayon entropiya",
    "suv aralashtirish issiqlik",
    "ichki yonuv dvigateli", "issiqlik dvigateli", "dvigatel FIK", "dvigatel ekologiya", "FIK yoqilg‘i",
    "sirt taranglik", "kapillyar hodisa", "suv bosimi", "sirt taranglik tomchi", "kristall",
    "elastiklik deformatsiya", "prujina", "muz erishi", "amorf jism erishi", "bug‘lanish kondensatsiya",
    "atmosfera tuman bulut", "namlik gigrometr", "fazaviy o‘tish",
    "yorug‘lik tezligi", "yorug‘lik qaytishi sinishi", "sinish burchagi", "to‘la ichki qaytish",
    "kritik burchak", "shisha nur sinishi", "linza fokus", "linza tasvir", "linza masala",
    "linza optik kuch", "mikroskop teleskop", "ko‘z optik illuziya", "ko‘z linza", "quyosh energiyasi",
    "energiya saqlanish", "fizika texnika tajriba",
]
HEADERS = {"User-Agent": "Mozilla/5.0 IdrokCourseBuilder/2.0"}
STOP = {"va", "yoki", "uchun", "bilan", "tajriba", "fizika", "hodisa", "qonuni", "jism"}


def normalize(value):
    value = value.lower().replace("o‘", "o").replace("g‘", "g").replace("oʻ", "o").replace("gʻ", "g")
    value = value.replace("’", "").replace("‘", "").replace("ʻ", "")
    return re.sub(r"[^a-z0-9]+", " ", value).strip()


def duration_seconds(value):
    try:
        parts = [int(part) for part in value.split(":")]
        return sum(part * 60 ** index for index, part in enumerate(reversed(parts)))
    except Exception:
        return 99999


def parse_results(source, channel):
    posts = list(re.finditer(fr'data-post="{re.escape(channel)}/(\d+)"', source))
    output = []
    for index, match in enumerate(posts):
        post = int(match.group(1))
        end = posts[index + 1].start() if index + 1 < len(posts) else len(source)
        block = source[match.start():end]
        if "tgme_widget_message_video_player" not in block:
            continue
        text_match = re.search(r'<div class="tgme_widget_message_text[^>]*>(.*?)</div>', block, re.S)
        raw = text_match.group(1) if text_match else "Qiziqarli fizika tajribasi"
        raw = re.sub(r"<br\s*/?>", " ", raw, flags=re.I)
        raw = re.sub(r"<[^>]+>", "", raw)
        title = re.sub(r"\s+", " ", html.unescape(raw)).strip() or "Qiziqarli fizika tajribasi"
        duration_match = re.search(r"message_video_duration[^>]*>([^<]+)", block)
        duration = duration_match.group(1).strip() if duration_match else ""
        output.append({
            "id": f"{channel}-{post}",
            "post": post,
            "channel": channel,
            "title": title[:260],
            "duration": duration,
            "seconds": duration_seconds(duration),
            "source": f"https://t.me/{channel}/{post}",
            "embed": f"https://t.me/{channel}/{post}?embed=1&mode=tme",
        })
    return output


def score(query, item):
    q_tokens = [word for word in normalize(query).split() if word not in STOP and len(word) > 2]
    title = normalize(item["title"])
    t_tokens = set(title.split())
    value = 0
    for token in q_tokens:
        if token in t_tokens:
            value += 20
        elif len(token) >= 5 and any(word.startswith(token[:5]) or token.startswith(word[:5]) for word in t_tokens if len(word) >= 5):
            value += 10
    if normalize(query) in title:
        value += 45
    seconds = item["seconds"]
    if 8 <= seconds <= 240:
        value += 12
    elif seconds > 600:
        value -= 20
    if any(word in title for word in ("ingliz tilida", "rus tilida", "bomba", "portlash", "yongin topi")):
        value -= 30
    if item["channel"] == "pizik_lab":
        value += 3
    return value


selected = []
used = set()
cache = {}

for query in QUERIES:
    candidates = []
    for channel in CHANNELS:
        cache_key = (channel, query)
        if cache_key not in cache:
            url = f"https://t.me/s/{channel}?q={urllib.parse.quote(query)}"
            request = urllib.request.Request(url, headers=HEADERS)
            try:
                with urllib.request.urlopen(request, timeout=30) as response:
                    cache[cache_key] = parse_results(response.read().decode("utf-8", "replace"), channel)
            except Exception:
                cache[cache_key] = []
            time.sleep(0.08)
        candidates.extend(cache[cache_key])
    ranked = sorted(candidates, key=lambda item: (score(query, item), -item["seconds"], item["post"]), reverse=True)
    choice = next((item for item in ranked if item["id"] not in used), None)
    if choice is None and ranked:
        choice = ranked[0]
    if choice is None:
        choice = {
            "id": "Fizikadan_tajribalar-642", "post": 642, "channel": "Fizikadan_tajribalar",
            "title": "O‘zbekcha qiziqarli fizika tajribasi", "duration": "", "seconds": 60,
            "source": "https://t.me/Fizikadan_tajribalar/642",
            "embed": "https://t.me/Fizikadan_tajribalar/642?embed=1&mode=tme",
        }
    used.add(choice["id"])
    selected.append({**choice, "query": query, "matchScore": score(query, choice)})

path = Path("tmp/experiment_videos.json")
path.write_text(json.dumps(selected, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Saved {len(selected)} topic experiment videos ({len(used)} unique posts) to {path}")
