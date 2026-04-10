#!/usr/bin/env python3
"""
nasa_gif.py — Python version of the NASA image terminal tool
Bonus: renders images as ASCII art in terminal if `chafa` is installed.

Usage:
  python3 nasa_gif.py search <query>
  python3 nasa_gif.py apod [YYYY-MM-DD]
  python3 nasa_gif.py random
  python3 nasa_gif.py download <url> <filename>
  python3 nasa_gif.py ascii <url>        # Render image as terminal ASCII

Requirements: Python 3.8+, no third-party packages required.
Optional: brew install chafa  (for ASCII art rendering)
"""

import sys
import os
import json
import urllib.request
import urllib.parse
import subprocess
import shutil
import random as rand_module
from datetime import date, timedelta

NASA_API_KEY = os.environ.get('NASA_API_KEY', 'DEMO_KEY')
NASA_IMAGES_BASE = 'https://images-api.nasa.gov'
NASA_APOD_BASE = f'https://api.nasa.gov/planetary/apod?api_key={NASA_API_KEY}'
DOWNLOAD_DIR = os.path.join(os.path.dirname(__file__), 'downloads')

# ── helpers ────────────────────────────────────────────────────────────────────

def fetch_json(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'lobit-hydra/1.0'})
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode())

def divider():
    print('─' * 60)

def print_item(item, idx):
    data = item.get('data', [{}])[0]
    links = item.get('links', [])
    preview = next((l['href'] for l in links if l.get('rel') == 'preview'),
                   links[0]['href'] if links else '(no preview)')
    divider()
    print(f"[{idx+1}] {data.get('title', 'Untitled')}")
    print(f"    Type: {data.get('media_type','image')} | Date: {str(data.get('date_created',''))[:10]}")
    desc = (data.get('description') or '').replace('\n', ' ')[:120]
    print(f"    {desc}...")
    print(f"    Preview: {preview}")
    print(f"    NASA ID: {data.get('nasa_id', 'n/a')}")

def download_file(url, dest):
    os.makedirs(DOWNLOAD_DIR, exist_ok=True)
    path = os.path.join(DOWNLOAD_DIR, dest)
    print(f"Downloading to {path}...")
    urllib.request.urlretrieve(url, path)
    print(f"Saved: {path}")
    return path

# ── commands ───────────────────────────────────────────────────────────────────

def cmd_search(query, media_type=''):
    type_param = f'&media_type={media_type}' if media_type else ''
    url = f"{NASA_IMAGES_BASE}/search?q={urllib.parse.quote(query)}{type_param}&page_size=12"
    print(f'\nSearching NASA library for: "{query}"\n')
    data = fetch_json(url)
    items = data.get('collection', {}).get('items', [])
    if not items:
        print('No results found.')
        return
    for idx, item in enumerate(items):
        print_item(item, idx)
    divider()
    print(f'\n{len(items)} results. Download: python3 nasa_gif.py download <url> <filename>')

def cmd_apod(date_str=None):
    date_param = f'&date={date_str}' if date_str else ''
    url = f'{NASA_APOD_BASE}{date_param}'
    label = f'for {date_str}' if date_str else '(today)'
    print(f'\nFetching APOD {label}...\n')
    data = fetch_json(url)
    divider()
    print(f"Title: {data.get('title')}")
    print(f"Date:  {data.get('date')}")
    print(f"Type:  {data.get('media_type')}")
    asset_url = data.get('hdurl') or data.get('url', '')
    print(f"URL:   {asset_url}")
    if data.get('thumbnail_url'):
        print(f"Thumb: {data['thumbnail_url']}")
    divider()
    print(f"\n{str(data.get('explanation',''))[:300]}...\n")
    ext = asset_url.split('.')[-1].split('?')[0]
    print(f"Download: python3 nasa_gif.py download \"{asset_url}\" \"apod_{data.get('date')}.{ext}\"")

def cmd_random():
    start = date(1995, 6, 16)
    end = date.today() - timedelta(days=1)
    delta = (end - start).days
    rand_date = start + timedelta(days=rand_module.randint(0, delta))
    print(f'Random APOD date: {rand_date}')
    cmd_apod(str(rand_date))

def cmd_download(url, filename):
    if not url or not filename:
        print('Usage: python3 nasa_gif.py download <url> <filename>')
        sys.exit(1)
    download_file(url, filename)

def cmd_ascii(url):
    """Download image and render as ASCII art using chafa if available."""
    if not shutil.which('chafa'):
        print('Install chafa for ASCII rendering: brew install chafa')
        print(f'URL: {url}')
        return
    tmp = '/tmp/lobit_nasa_preview.jpg'
    urllib.request.urlretrieve(url, tmp)
    subprocess.run(['chafa', '--size', '80x40', tmp])

def cmd_gif(query):
    print('NASA Images API does not index GIFs directly.')
    print('Searching for videos and animated content...\n')
    cmd_search(query, media_type='video')

# ── main ───────────────────────────────────────────────────────────────────────

def usage():
    print("""
lobit-hydra :: NASA image tool (Python)

  python3 nasa_gif.py search <query>
  python3 nasa_gif.py gif <query>          Search videos/animations
  python3 nasa_gif.py apod                 Today's APOD
  python3 nasa_gif.py apod <YYYY-MM-DD>    APOD for a date
  python3 nasa_gif.py random               Random APOD
  python3 nasa_gif.py download <url> <f>   Download to ./downloads/
  python3 nasa_gif.py ascii <url>          Render in terminal (needs chafa)

Set NASA_API_KEY env var for higher rate limits.
""")

if __name__ == '__main__':
    args = sys.argv[1:]
    if not args:
        usage()
        sys.exit(0)

    cmd = args[0]
    rest = args[1:]

    if cmd == 'search':
        cmd_search(' '.join(rest) or 'nebula')
    elif cmd in ('gif', 'gifs'):
        cmd_gif(' '.join(rest) or 'space')
    elif cmd == 'apod':
        cmd_apod(rest[0] if rest else None)
    elif cmd == 'random':
        cmd_random()
    elif cmd == 'download':
        cmd_download(rest[0] if rest else None, rest[1] if len(rest) > 1 else None)
    elif cmd == 'ascii':
        cmd_ascii(rest[0] if rest else '')
    else:
        usage()
