import html
import json
import re
import time
import urllib.request
import sys
from pathlib import Path

CHANNEL = sys.argv[1] if len(sys.argv) > 1 else "kau_fizika"
BASE = f"https://t.me/s/{CHANNEL}?after={{}}"
UA = {"User-Agent": "Mozilla/5.0 IdrokCourseBuilder/1.0"}
videos = {}
after = 1

for _ in range(30):
    request = urllib.request.Request(BASE.format(after), headers=UA)
    with urllib.request.urlopen(request, timeout=30) as response:
        source = response.read().decode("utf-8", "replace")

    posts = list(re.finditer(fr'data-post="{re.escape(CHANNEL)}/(\d+)"', source))
    if not posts:
        break

    max_post = after
    for index, match in enumerate(posts):
        post_id = int(match.group(1))
        max_post = max(max_post, post_id)
        end = posts[index + 1].start() if index + 1 < len(posts) else len(source)
        block = source[match.start():end]
        youtube = re.search(r'(?:youtu\.be/|youtube\.com/watch\?v=)([A-Za-z0-9_-]{11})', block)
        has_native_video = 'tgme_widget_message_video_player' in block
        if not youtube and not has_native_video:
            continue
        text_match = re.search(r'<div class="tgme_widget_message_text[^>]*>(.*?)</div>', block, re.S)
        raw = text_match.group(1) if text_match else ""
        raw = re.sub(r'<br\s*/?>', '\n', raw, flags=re.I)
        raw = re.sub(r'<[^>]+>', '', raw)
        clean = html.unescape(raw)
        clean = re.sub(r'\s+', ' ', clean).strip()
        duration_match = re.search(r'message_video_duration[^>]*>([^<]+)', block)
        key = youtube.group(1) if youtube else f"tg-{post_id}"
        videos[key] = {
            "id": key,
            "youtubeId": youtube.group(1) if youtube else "",
            "post": post_id,
            "title": clean,
            "duration": duration_match.group(1).strip() if duration_match else "",
            "source": f"https://t.me/{CHANNEL}/{post_id}",
            "embed": f"https://www.youtube-nocookie.com/embed/{youtube.group(1)}?rel=0" if youtube else f"https://t.me/{CHANNEL}/{post_id}?embed=1&mode=tme"
        }

    if max_post <= after:
        break
    after = max_post
    time.sleep(0.15)

output = Path(f"tmp/{CHANNEL}_videos.json")
output.parent.mkdir(parents=True, exist_ok=True)
output.write_text(json.dumps(sorted(videos.values(), key=lambda item: item["post"]), ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Saved {len(videos)} videos from {CHANNEL} to {output}")
