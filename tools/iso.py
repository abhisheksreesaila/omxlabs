"""Isometric diagrams for the omxlabs homepage, drawn as inline SVG.

Each diagram is a few boxes, planes, arrows and labels in 3D grid units; this file projects them and
writes the SVG between <!-- iso:NAME --> and <!-- /iso:NAME --> markers in index.html, so the page keeps
its fonts and colours (classes are styled in index.html's <style>).

    python3 tools/iso.py        # rewrites every diagram in index.html
"""
import math, re, pathlib, html

U = 22                       # one grid unit, in px
C, S = math.cos(math.pi / 6), 0.5


class Iso:
    def __init__(self):
        self.out, self.xs, self.ys = [], [], []

    def p(self, x, y, z=0):
        sx, sy = (x - y) * C * U, (x + y) * S * U - z * U
        self.xs.append(sx); self.ys.append(sy)
        return sx, sy

    def poly(self, pts, cls):
        self.out.append(f'<polygon class="{cls}" points="{" ".join(f"{a:.1f},{b:.1f}" for a, b in pts)}"/>')

    def box(self, x, y, z, w, d, h, tone="grey", label=None, sub=None):
        P = self.p
        self.out.append(f'<g class="{tone}">')
        self.poly([P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)], "l")
        self.poly([P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)], "r")
        self.poly([P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)], "t")
        self.out.append('</g>')
        if label:
            self.label(x + w / 2, y + d / 2, z + h, label, sub)

    def plane_xz(self, x, y, z, w, h, cls="screen"):
        """an upright plane facing the viewer's left (a screen standing on the floor)"""
        P = self.p
        self.poly([P(x, y, z), P(x + w, y, z), P(x + w, y, z + h), P(x, y, z + h)], cls)

    def label(self, x, y, z, text, sub=None, cls="lb", dy=0):
        sx, sy = self.p(x, y, z)
        sy += dy
        self.out.append(f'<text class="{cls}" x="{sx:.1f}" y="{sy - (6 if sub else -4):.1f}">{html.escape(text)}</text>')
        if sub:
            self.out.append(f'<text class="sb" x="{sx:.1f}" y="{sy + 12:.1f}">{html.escape(sub)}</text>')

    def arrow(self, a, b, cls="ar", text=None, side=1, dashed=False):
        (x1, y1), (x2, y2) = self.p(*a), self.p(*b)
        self.out.append(f'<line class="{cls}{" da" if dashed else ""}" x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" marker-end="url(#ah)"/>')
        if text:
            mx, my = (x1 + x2) / 2, (y1 + y2) / 2
            anchor = "start" if side > 0 else "end"
            self.out.append(f'<text class="al" text-anchor="{anchor}" x="{mx + 12 * side:.1f}" y="{my - 7:.1f}">{html.escape(text)}</text>')

    def chip(self, x, y, z, text, cls="chip", dx=0, dy=0, w=None):
        """a flat rounded card anchored to a 3D point (tool cards, speech bubbles)"""
        sx, sy = self.p(x, y, z)
        sx += dx; sy += dy
        w = w or (len(text) * 7.4 + 26)
        self.xs += [sx - w / 2, sx + w / 2]; self.ys += [sy - 16, sy + 16]
        self.out.append(f'<g class="{cls}"><rect x="{sx - w / 2:.1f}" y="{sy - 15:.1f}" width="{w:.1f}" height="30" rx="15"/>'
                        f'<text x="{sx:.1f}" y="{sy + 5:.1f}">{html.escape(text)}</text></g>')
        return sx, sy

    def svg(self, title):
        m = 18
        x0, x1, y0, y1 = min(self.xs) - m, max(self.xs) + m, min(self.ys) - m - 10, max(self.ys) + m
        return (f'<svg class="iso" viewBox="{x0:.0f} {y0:.0f} {x1 - x0:.0f} {y1 - y0:.0f}" role="img" aria-label="{html.escape(title)}">'
                '<defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
                '<path d="M0,1 L9,5 L0,9 z" class="ahp"/></marker></defs>' + "".join(self.out) + '</svg>')


def gpu_today():
    d = Iso()
    steps = [("GPU", "computes"), ("CPU memory", "holds a copy"), ("Python server", "serializes"), ("browser", "parses, redraws")]
    for i, (name, sub) in enumerate(steps):
        d.box(0, -i * 5.4, i * 0.7, 3.6, 3.6, 0.9, "grey", name, sub)
    for i in range(3):
        y0, z0 = -i * 5.4, i * 0.7
        d.arrow((1.8, y0 - 0.1, z0 + 0.5), (1.8, y0 - 1.7, z0 + 1.1), cls="ar")
    d.chip(-2.5, -1.5, 3.2, "⏳ every hop waits", "bub", w=170)
    return d.svg("Today: the data is computed on the GPU, copied to the CPU, serialized by a server, parsed and redrawn by a browser")


def gpu_ours():
    d = Iso()
    d.box(0, 0, 0, 13, 7, 0.8, "pxs", None)
    d.label(0.4, 7, 0.0, "your GPU", cls="lb lp", dy=20)
    d.box(1, 1, 0.8, 11, 5, 0.25, "pxf")
    d.label(1.3, 1.2, 1.05, "one Mojo process", cls="lb lp", dy=-6)
    for i, (n, s) in enumerate([("data", "stays here"), ("kernels", "compute"), ("screen", "same process")]):
        d.box(1.8 + i * 3.6, 2.2, 1.05, 2.8, 3, 1.1, "px", n, s)
    d.plane_xz(8.4, -2.6, 3.6, 4.6, 2.8, "win")
    d.label(10.7, -2.6, 6.4, "the window", cls="lb", dy=-6)
    d.arrow((10.4, 2.6, 2.3), (10.6, -2.4, 3.7), cls="ar ok", text="only the answer", side=1)
    d.chip(0.5, -1.5, 3.6, "😎 nothing copied, nothing serialized", "bub good", w=270)
    return d.svg("omxplorer: the data and the kernels live on your GPU inside one Mojo process with the screen; only the answer travels to the window")


def agent_today():
    d = Iso()
    d.box(0, 0, 0, 12, 6, 0.3, "grey")
    d.plane_xz(1, 1, 0.3, 9, 6, "screen")
    for i, (bx, bz) in enumerate([(2, 5), (4.6, 5), (7.2, 5), (2, 3), (4.6, 3), (7.2, 3), (2, 1), (4.6, 1), (7.2, 1)]):
        d.plane_xz(bx, 1, bz + 0.3, 1.9, 1.0, "btn")
    sx, sy = d.p(5.55, 1, 3.8)
    d.out.append(f'<g class="cross"><circle cx="{sx:.1f}" cy="{sy:.1f}" r="13"/><line x1="{sx - 20:.1f}" y1="{sy:.1f}" x2="{sx + 20:.1f}" y2="{sy:.1f}"/><line x1="{sx:.1f}" y1="{sy - 20:.1f}" x2="{sx:.1f}" y2="{sy + 20:.1f}"/></g>')
    d.arrow((9.4, 7.4, 1.4), (5.9, 1.4, 3.6), cls="ar", dashed=True)
    d.label(9.6, 7.6, 0.4, "🤖", cls="emo")
    d.chip(9.6, 7.6, 0.4, "😵 is this Export? click (812, 344)", "bub", w=262, dx=-170, dy=-14)
    return d.svg("Today: an agent looks at a screenshot and guesses where to click")


def agent_ours():
    d = Iso()
    d.box(0, 0, 0, 12, 6, 0.3, "pxs")
    d.plane_xz(1, 1, 0.3, 9, 6, "screen")
    tools = ["set_word(\"Median\")", "split_clip(at=12.4)", "make_reel()"]
    for i, (bx, bz) in enumerate([(2, 5), (4.6, 5), (7.2, 5), (2, 3), (4.6, 3), (7.2, 3), (2, 1), (4.6, 1), (7.2, 1)]):
        d.plane_xz(bx, 1, bz + 0.3, 1.9, 1.0, "btn on" if i in (1, 4, 8) else ("btn off" if i == 6 else "btn"))
    for k, (i, (bx, bz)) in enumerate([(1, (4.6, 5)), (4, (4.6, 3)), (8, (7.2, 1))]):
        a = (bx + 1.9, 1, bz + 0.8)
        d.arrow(a, (bx + 6.4, 1 - 3.2, bz + 2.6 + k * 0.4), cls="ar ok")
        d.chip(bx + 6.4, 1 - 3.2, bz + 2.6 + k * 0.4, tools[k], "tool", dx=74)
    d.label(2.9, 1, 1.3, "disabled: no tool", cls="al off", dy=-2)
    d.label(9.6, 7.6, 0.4, "🤖", cls="emo")
    d.chip(9.6, 7.6, 0.4, "😄 I'll call make_reel()", "bub good", w=196, dx=-140, dy=-14)
    return d.svg("omxplorer: every button also publishes a tool with a name and its arguments; the agent reads the list and calls one")


def multi_today():
    d = Iso()
    apps = [("Excel", "the sheet", 0, 0), ("Spotfire", "the charts", 7, -1), ("a video editor", "the footage", 1, 7), ("a notebook", "the model", 8, 6)]
    for n, s, x, y in apps:
        d.box(x, y, 0, 4, 3.2, 1.0, "grey", n, s)
    d.arrow((4.2, 1.4, 0.8), (6.8, 0.3, 0.8), text="export.csv", side=1, dashed=True)
    d.arrow((9, 2.4, 0.6), (9.8, 5.8, 0.6), text="re-import", side=1, dashed=True)
    d.arrow((7.8, 7.6, 0.6), (5.2, 8.6, 0.6), text="upload", side=-1, dashed=True)
    d.arrow((2.6, 6.8, 0.6), (2.4, 3.4, 0.6), text="copy, paste", side=-1, dashed=True)
    d.chip(3.5, -3, 2.2, "😩 four apps, and copies between them", "bub", w=280)
    return d.svg("Today: a sheet in Excel, charts in Spotfire, footage in a video editor, a model in a notebook, with exports between them")


def multi_ours():
    d = Iso()
    d.box(0, 0, 0, 14, 9, 0.8, "pxs")
    d.label(1.4, 9, 0.0, "omxplorer · one GPU", cls="lb lp", dy=18)
    for k in range(4):
        d.box(1, 1, 0.8 + k * 0.32, 3.6, 3, 0.22, "px")
    d.label(2.8, 2.5, 2.1, "telemetry", "100M rows")
    d.box(6, 1, 0.8, 3.6, 3, 1.6, "px2", "video", "frames → rows")
    d.box(10.4, 1, 0.8, 2.8, 3, 1.2, "px3", "model", "next")
    d.box(1.6, 5.4, 0.8, 3.4, 2.6, 0.9, "px2", "chart")
    d.box(7.2, 5.4, 0.8, 3.4, 2.6, 0.6, "px3", "map")
    for a, b in [((4.6, 2.5, 1.4), (6.0, 2.5, 1.4)), ((9.6, 2.5, 1.4), (10.4, 2.5, 1.4)), ((2.8, 4.0, 1.0), (3.2, 5.4, 1.0)), ((7.8, 4.0, 1.0), (8.6, 5.4, 1.0))]:
        d.arrow(a, b, cls="ar ok")
    d.chip(2, -1.5, 3.4, "🤩 joined on time, one afternoon", "bub good", w=250)
    return d.svg("omxplorer: telemetry, video, a detection model, a chart and a map on one sheet, on one GPU, joined on time")


DIAGRAMS = {"gpu-today": gpu_today, "gpu-ours": gpu_ours, "agent-today": agent_today, "agent-ours": agent_ours,
            "multi-today": multi_today, "multi-ours": multi_ours}

if __name__ == "__main__":
    page = pathlib.Path(__file__).resolve().parent.parent / "index.html"
    s = page.read_text()
    for name, fn in DIAGRAMS.items():
        pat = re.compile(rf"<!-- iso:{name} -->.*?<!-- /iso:{name} -->", re.S)
        if not pat.search(s):
            raise SystemExit(f"index.html has no <!-- iso:{name} --> marker")
        s = pat.sub(lambda _: f"<!-- iso:{name} -->{fn()}<!-- /iso:{name} -->", s)
    page.write_text(s)
    print("drew", ", ".join(DIAGRAMS))
