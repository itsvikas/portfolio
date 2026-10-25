"""
Freeze the Flask app into static HTML files for GitHub Pages deployment.
Output directory: build/
"""

from html.parser import HTMLParser
from email.utils import parsedate_to_datetime
from urllib.request import Request, urlopen
import re
import xml.etree.ElementTree as ET

from flask_frozen import Freezer
from app import app, DATA


class ArticleContentParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text_parts = []
        self.image = ""

    def handle_starttag(self, tag, attrs):
        if tag == "img" and not self.image:
            self.image = dict(attrs).get("src", "")

    def handle_data(self, data):
        if data.strip():
            self.text_parts.append(data.strip())


def fetch_medium_articles():
    """Use Medium's public RSS feed at build time, avoiding a browser-side proxy."""
    request = Request(
        DATA["medium_feed"],
        headers={"User-Agent": "VikasPortfolio/1.0 (public RSS reader)"},
    )
    content_namespace = "{http://purl.org/rss/1.0/modules/content/}encoded"
    with urlopen(request, timeout=20) as response:
        root = ET.parse(response).getroot()

    articles = []
    for item in root.findall("./channel/item"):
        title = (item.findtext("title") or "").strip()
        link = (item.findtext("link") or "").split("?", 1)[0]
        if not title or not link.startswith("https://"):
            continue

        content = item.findtext(content_namespace) or ""
        parser = ArticleContentParser()
        parser.feed(content)
        summary = re.sub(r"\s+", " ", " ".join(parser.text_parts)).strip()
        if len(summary) > 150:
            summary = summary[:150].rsplit(" ", 1)[0] + "…"

        date = "Medium article"
        pub_date = item.findtext("pubDate")
        if pub_date:
            try:
                date = parsedate_to_datetime(pub_date).strftime("%b %d, %Y")
            except (TypeError, ValueError):
                pass

        articles.append({
            "title": title,
            "url": link,
            "summary": summary or "Read this article on Medium.",
            "image": parser.image,
            "date": date,
        })
    if not articles:
        raise ValueError("Medium's feed contained no usable articles")
    return articles

app.config["FREEZER_DESTINATION"] = "build"
app.config["FREEZER_RELATIVE_URLS"] = True

freezer = Freezer(app)

if __name__ == "__main__":
    try:
        DATA["articles"] = fetch_medium_articles()
        DATA["articles_note"] = "Recent articles from Medium."
        print(f"✅ Loaded {len(DATA['articles'])} articles from Medium.")
    except Exception as error:
        DATA["articles_note"] = "Showing selected articles; the Medium feed could not be refreshed during this build."
        print(f"⚠️ Could not refresh Medium articles; using selected articles. ({error})")
    freezer.freeze()
    print("✅ Static site generated in build/")
