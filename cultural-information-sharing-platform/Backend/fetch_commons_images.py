"""
Downloads the food photos chosen for Culture Nepal from Wikimedia Commons
into Backend/media/cultural/ (saved as <slug>.jpg, which seed_cultural.py
looks for).

Run it ONCE from the Backend folder on a computer with internet access:

    python fetch_commons_images.py
    python seed_cultural.py        # attaches the downloaded images

BEFORE you publish the images, open each Commons page, check the author and
the license, and add the credit to your site (see IMAGE_CREDITS.md).
These are Creative Commons licensed files and need attribution.
"""

import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

MEDIA_CULTURAL_DIR = Path(__file__).resolve().parent / "media" / "cultural"

# slug -> file name on Wikimedia Commons
IMAGES = {
    "dhikri": "Dhikri Tharu Food.jpg",
    "sel-roti": "Sel Roti.jpg",
    "gundruk": "Gundruk Sadeko.jpg",
    "khapse": "Khapse.JPG",
}

HEADERS = {
    "User-Agent": "CultureNepalStudentProject/1.0 (college project; contact: your-email@example.com)"
}


def download(slug, commons_file):
    destination = MEDIA_CULTURAL_DIR / f"{slug}.jpg"

    if destination.exists():
        print(f"Skipped {slug}: {destination.name} already exists")
        return

    url = (
        "https://commons.wikimedia.org/wiki/Special:FilePath/"
        + urllib.parse.quote(commons_file.replace(" ", "_"))
        + "?width=1200"
    )

    request = urllib.request.Request(url, headers=HEADERS)

    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            data = response.read()
    except (urllib.error.URLError, TimeoutError) as error:
        print(f"FAILED {slug}: {error}")
        return

    destination.write_bytes(data)
    print(f"Downloaded {slug}: {destination.name} ({len(data) // 1024} KB)")
    print(
        "   Check author and license: "
        "https://commons.wikimedia.org/wiki/File:"
        + urllib.parse.quote(commons_file.replace(" ", "_"))
    )


if __name__ == "__main__":
    MEDIA_CULTURAL_DIR.mkdir(parents=True, exist_ok=True)

    for slug, commons_file in IMAGES.items():
        download(slug, commons_file)

    print()
    print("Now run: python seed_cultural.py")
