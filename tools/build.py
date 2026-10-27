"""
Brigitte Rose static site builder.
Assembles root HTML pages from tools/layout.html + tools/pages/*.html.

Usage:  python tools/build.py
Each page file starts with a JSON comment:  <!-- meta {"title": "...", "description": "...", "script": "home"} -->
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOOLS = os.path.join(ROOT, "tools")
PAGES = os.path.join(TOOLS, "pages")

def cache_bust(m):
    # Append ?v=<file mtime> so browsers fetch the new file after every change
    path = os.path.join(ROOT, m.group(2))
    if not os.path.exists(path):
        return m.group(0)
    return f'{m.group(1)}?v={int(os.path.getmtime(path))}"'

def main():
    layout = open(os.path.join(TOOLS, "layout.html"), encoding="utf-8").read()
    built = []
    for fn in sorted(os.listdir(PAGES)):
        if not fn.endswith(".html"):
            continue
        src = open(os.path.join(PAGES, fn), encoding="utf-8").read()
        m = re.match(r"\s*<!--\s*meta\s*(\{.*?\})\s*-->\s*", src, re.S)
        if not m:
            sys.exit(f"{fn}: missing meta comment")
        meta = json.loads(m.group(1))
        content = src[m.end():]
        slug = os.path.splitext(fn)[0]
        scripts = f'<script src="assets/js/pages/{meta["script"]}.js"></script>' if meta.get("script") else ""
        html = (layout
                .replace("{{title}}", meta["title"])
                .replace("{{description}}", meta["description"])
                .replace("{{head_extra}}", meta.get("head_extra", ""))
                .replace("{{slug}}", slug)
                .replace("{{content}}", content.rstrip())
                .replace("{{scripts}}", scripts))
        html = re.sub(r'((?:src|href)="(assets/[^"?]+\.(?:css|js)))"', cache_bust, html)
        out = os.path.join(ROOT, fn)
        open(out, "w", encoding="utf-8", newline="\n").write(html)
        built.append(fn)
    print("Built:", ", ".join(built))

if __name__ == "__main__":
    main()
