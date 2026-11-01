# Checks every page of the site the way a visitor meets it: serve it, open each page at 1440 and 390 wide,
# screenshot it, and fail on console errors, sideways overflow, or a local link or asset that doesn't resolve.
# Run from a pixi env that has playwright, e.g.:
#   (cd ~/Projects/mxapp/mojo-ui-omxcode && pixi run python ~/Projects/omxlabs/tools/check_site.py)
# Shots land in build/shots/ (ignored by git).
import http.server, socketserver, threading, sys, os, functools, urllib.parse
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
SHOTS = ROOT / "build" / "shots"
PAGES = ["", "omxplorer/", "omxconsole/", "omxcore/", "omxcode/", "omxqua/",
         "deck.html", "omxplorer/deck.html", "omxconsole/deck.html", "omxcore/deck.html", "omxcode/deck.html", "omxqua/deck.html"]
WIDTHS = [1440, 390]

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass

def main():
    SHOTS.mkdir(parents=True, exist_ok=True)
    handler = functools.partial(Quiet, directory=str(ROOT))
    with socketserver.ThreadingTCPServer(("127.0.0.1", 0), handler) as srv:
        port = srv.server_address[1]
        threading.Thread(target=srv.serve_forever, daemon=True).start()
        base = f"http://127.0.0.1:{port}/"
        problems, links = [], set()
        with sync_playwright() as p:
            exe = os.environ.get("CHROME") or next((str(c) for c in sorted(Path.home().glob(".cache/ms-playwright/chromium_headless_shell-*/*/chrome-headless-shell"), reverse=True)), None)
            b = p.chromium.launch(executable_path=exe)
            for page_path in PAGES:
                for w in WIDTHS:
                    ctx = b.new_context(viewport={"width": w, "height": 900}, device_scale_factor=1)
                    pg = ctx.new_page()
                    errs, bad = [], []
                    pg.on("console", lambda m: m.type == "error" and errs.append(m.text))
                    pg.on("pageerror", lambda e: errs.append(str(e)))
                    pg.on("response", lambda r: r.url.startswith(base) and r.status >= 400 and bad.append(f"{r.status} {r.url[len(base)-1:]}"))
                    pg.goto(base + page_path, wait_until="networkidle")
                    deck = page_path.endswith("deck.html")
                    if not deck:   # scroll through so reveals and lazy media load, then come back
                        h = pg.evaluate("document.body.scrollHeight")
                        for y in range(0, h, 700):
                            pg.evaluate(f"scrollTo(0,{y})"); pg.wait_for_timeout(60)
                        pg.evaluate("document.querySelectorAll('.rv,.bt').forEach(e=>e.classList.add('in'))")
                        pg.evaluate("scrollTo(0,0)"); pg.wait_for_timeout(400)
                    else:
                        pg.wait_for_timeout(800)
                    over = pg.evaluate("document.documentElement.scrollWidth - innerWidth")
                    name = (page_path.rstrip("/").replace("/", "-") or "home").replace(".html", "")
                    pg.screenshot(path=str(SHOTS / f"{name}-{w}.png"), full_page=not deck)
                    for e in errs: problems.append(f"{name}@{w} console: {e}")
                    for e in bad: problems.append(f"{name}@{w} missing: {e}")
                    if over > 1: problems.append(f"{name}@{w} overflows sideways by {over}px")
                    if w == WIDTHS[0]:
                        here = base + page_path
                        for href in pg.eval_on_selector_all("a[href],video[src],video[poster],img[src],iframe[src],source[src]",
                                "els => els.map(e => e.getAttribute('href') || e.getAttribute('src') || e.getAttribute('poster'))"):
                            links.add((name, urllib.parse.urljoin(here, href)))
                        for v in pg.eval_on_selector_all("video[poster]", "els => els.map(e => e.getAttribute('poster'))"):
                            links.add((name, urllib.parse.urljoin(here, v)))
                    ctx.close()
            b.close()
        for name, url in sorted(links):
            if not url.startswith(base): continue
            path = urllib.parse.urlparse(url).path
            f = ROOT / urllib.parse.unquote(path).lstrip("/")
            if f.is_dir(): f = f / "index.html"
            if not f.exists(): problems.append(f"{name} broken link: {path}")
            frag = urllib.parse.urlparse(url).fragment
            if frag and f.suffix == ".html" and f.exists() and frag not in ("top", "/") and not frag.startswith("/") and f'id="{frag}"' not in f.read_text():
                problems.append(f"{name} broken anchor: {path}#{frag}")
        print(f"checked {len(PAGES)} pages x {len(WIDTHS)} widths, {len(links)} links; shots in {SHOTS}")
        for p_ in problems: print("  ✗", p_)
        sys.exit(1 if problems else 0)

if __name__ == "__main__":
    main()
