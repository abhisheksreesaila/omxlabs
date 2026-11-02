// omxlabs suite: omxlabs.tech is omxplorer's site; the other products live on their own sites (site:), and the cards and footer link out to them.
// A page says who it is with <html data-here="plorer" data-root="..">; it marks <nav class="top"> and <div class="fam"> to fill.
// Every product has one colour and one mark (suite.css .px-* and .pm), like an Office icon: <i class="pm px-core"></i> anywhere.
// <div class="fam" data-only="tech"> lists only the three technologies (data-only="apps": the two apps); data-to="anchor" links cards to #omx<k> on the same page.
const SUITE = [
  { k: "plorer",  name: "omxplorer",  role: "app · data and robotics",     site: "", home: "https://github.com/abhisheksreesaila/omxcode", line: "Ask your data in a sentence: sheets, charts, video and documents on one GPU, joined by links you confirm. Every button is a tool an agent can call." },
  { k: "console", name: "omxconsole", role: "app · local AI",              site: "https://abhisheksreesaila.github.io/mxstudio/site/console.html", home: "https://github.com/abhisheksreesaila/mxstudio", line: "One command turns your GPU into a private, OpenAI-compatible model server: the AI supplier for every app." },
  { k: "core",    name: "omxcore",    role: "technology · the engine",    site: "https://abhisheksreesaila.github.io/omxcore/", home: "https://abhisheksreesaila.github.io/omxcore/", line: "SQL on your CPU and your GPU, over the files you already have. All 22 TPC-H queries at SF10 in 3.15 s (DuckDB 5.08 s)." },
  { k: "code",    name: "omxcode",    role: "technology · the framework", site: "https://abhisheksreesaila.github.io/omxcode/", home: "https://abhisheksreesaila.github.io/omxcode/", line: "Write an app once in Mojo: native on Linux and the Mac, the web host today, phones next, and an agent can drive it." },
  { k: "qua",     name: "omxqua",     role: "technology · the look",      site: "https://abhisheksreesaila.github.io/omxqua/", home: "https://abhisheksreesaila.github.io/omxqua/", line: "The design language this site is drawn in: Google's solid surfaces, Apple's springs, one colour per product." },
];
const GH = "https://github.com/abhisheksreesaila";
(() => {
  const html = document.documentElement, here = html.dataset.here || "labs", root = html.dataset.root || ".";
  const href = k => { const p = SUITE.find(q => q.k === k); return p && p.site ? p.site : `${root}/${k === "labs" ? "" : "omx" + k + "/"}`; };
  const me = SUITE.find(p => p.k === here);

  // the top nav: omxlabs, then GitHub and one call to action (no product switcher: this site is omxplorer's)
  const top = document.querySelector("nav.top");
  if (top) {
    const cta = top.dataset.cta || "Meet omxplorer", ctaHref = top.dataset.ctaHref || href("plorer"), gh = top.dataset.gh;
    top.innerHTML =
      `<a class="brand" href="${href("labs")}"><span class="mark"></span>omxlabs</a>` +
      `<div class="right">${gh ? `<a class="gh" href="${gh}">GitHub</a>` : ""}<a class="cta" href="${ctaHref}">${cta}</a></div>`;
  }
  // the footer, the same on every page
  const foot = document.querySelector("footer[data-suite]");
  if (foot) {
    const li = (u, t, k) => `<li><a ${k ? `class="px-${k}" ` : ""}href="${u}">${k ? '<i class="pm"></i>' : ""}${t}</a></li>`;
    foot.innerHTML = `<div class="wrap">
      <p class="note">Every number here comes from a script, on one Linux machine with an NVIDIA RTX 3090; Mac results come from GitHub's macOS runners ("runs on CI Macs"). "Runs" means a script drives the app on that platform today. Each number names its source.</p>
      <div class="cols">
        <div><h4>omxplorer</h4><ul>${li(href("labs"), "Home")}${li(`${root}/omxplorer/`, "The full story")}${li(`${root}/omxplorer/#slides`, "The slides")}${li(GH + "/omxcode", "GitHub")}</ul></div>
        <div><h4>Under the hood</h4><ul>${SUITE.filter(p => p.role.startsWith("technology")).map(p => li(p.site, p.name + " ↗", p.k)).join("")}</ul></div>
        <div><h4>Also from omxlabs</h4><ul>${li(href("console"), "omxconsole ↗", "console")}</ul></div>
        <div><h4>Follow along</h4><ul>${li("https://x.com/ablearn23", "X: @ablearn23")}${li("https://www.youtube.com/@mojomondayai", "Mojo Monday")}${li(GH, "GitHub")}</ul></div>
      </div>
      <div class="fine"><span>${me ? me.name + " · " : ""}omxlabs · built in Mojo, 2026 · styled with <a href="${href("qua")}">omxqua</a></span><a href="${GH}/omxcode/issues">Report an issue</a></div></div>`;
  }
  document.querySelectorAll(".fam").forEach(fam => {
    const list = fam.dataset.only === "tech" ? SUITE.filter(p => p.role.startsWith("technology")) : fam.dataset.only === "apps" ? SUITE.filter(p => p.role.startsWith("app")) : SUITE, anchor = fam.dataset.to === "anchor";
    fam.classList.toggle("four", list.length === 4); fam.classList.toggle("three", list.length === 3); fam.classList.toggle("two", list.length === 2);
    fam.innerHTML = list.map(p => {
      const on = p.k === here;
      return `<a class="px-${p.k}${on ? " here" : ""}" href="${on ? "#top" : anchor ? "#omx" + p.k : href(p.k)}"><i class="pm"></i><span class="role">${p.role}</span><b>${p.name}</b><p>${p.line}</p><span class="go">${on ? "You are here" : p.site ? "Visit its site" : "Open"}</span></a>`;
    }).join("");
  });

  // the omxlabs flask brews: liquid and five bubbles, one per product colour (styled in suite.css)
  document.querySelectorAll(".mark").forEach(m => { if (!m.querySelector(".liq")) m.innerHTML = '<i class="liq"></i>' + '<b class="fizz"></b>'.repeat(5); });
  // product names are always lowercase: wrap them inside labels the styles uppercase
  document.querySelectorAll(".eyebrow, .who, .role, .tag, .sub, .n, .note, .kicker").forEach(el => {
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), hits = [];
    while (w.nextNode()) if (/omx(labs|plorer|code|core|qua|console)/.test(w.currentNode.data) && !w.currentNode.parentElement.closest(".nm")) hits.push(w.currentNode);
    hits.forEach(t => { const f = document.createElement("span"); f.innerHTML = t.data.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/omx(labs|plorer|code|core|qua|console)/g, '<span class="nm">$&</span>'); t.replaceWith(...f.childNodes); });
  });
  // walkthroughs: a recording told as a guided tour (styled in suite.css .walk). Each step plays its stretch of the video slowly,
  // zoomed gently to the part that matters, then holds with its caption so it can be read; after the last step a closing card
  // (<template class="finale">) says what it all means. The step markers sit above the video; tap one to go there.
  document.querySelectorAll(".walk").forEach(w => {
    const v = w.querySelector("video"), stage = w.querySelector(".stage");
    const steps = JSON.parse(w.querySelector("script[type='application/json']").textContent);
    const rate = +(w.dataset.rate || 0.6), hold = +(w.dataset.hold || 3200), maxZoom = +(w.dataset.zoom || 1.8);
    const fin = w.querySelector("template.finale");
    stage.insertAdjacentHTML("beforeend", '<div class="cap2"><span class="k"></span><h3></h3><p></p></div><div class="fin"></div>');
    const cap = stage.querySelector(".cap2"), finEl = stage.querySelector(".fin");
    if (fin) finEl.appendChild(fin.content.cloneNode(true));
    const rail = document.createElement("div"); rail.className = "steps";
    rail.innerHTML = steps.map((s, i) => `<button><b>${i + 1}</b>${s.title}<i></i></button>`).join("") + (fin ? '<button class="end"><b>✓</b>Why<i></i></button>' : "");
    w.insertBefore(rail, stage);
    const btns = [...rail.children];
    let cur = -1, timer = 0, onScreen = false, holding = false;
    const zoom = s => {
      const kx = 1 / (s.x1 - s.x0), ky = 1 / (s.y1 - s.y0), z = Math.max(1, Math.min(maxZoom, kx, ky));
      const cx = (s.x0 + s.x1) / 2, cy = (s.y0 + s.y1) / 2;
      const tx = Math.min(0, Math.max(1 - z, 0.5 - z * cx)), ty = Math.min(0, Math.max(1 - z, 0.5 - z * cy));
      v.style.transform = `translate(${tx * 100}%, ${ty * 100}%) scale(${z})`;
    };
    const mark = i => btns.forEach((b, j) => { b.classList.toggle("on", j === i); b.classList.toggle("done", j < i); });
    const go = i => {
      clearTimeout(timer); holding = false; cur = i; mark(i);
      if (i >= steps.length) {                         // the closing card
        w.classList.add("finished"); v.pause(); v.style.transform = "";
        timer = setTimeout(() => onScreen && go(0), 14000); return;
      }
      w.classList.remove("finished");
      const s = steps[i]; zoom(s);
      cap.classList.add("swap");
      setTimeout(() => { cap.querySelector(".k").textContent = `Step ${i + 1} of ${steps.length}`; cap.querySelector("h3").textContent = s.long || s.title; cap.querySelector("p").textContent = s.text; cap.classList.remove("swap"); }, 250);
      v.currentTime = s.t; v.playbackRate = s.rate || rate;
      if (onScreen) v.play().catch(() => {});
    };
    v.addEventListener("timeupdate", () => {
      if (cur < 0 || cur >= steps.length || holding) return;
      const s = steps[cur], f = Math.min(1, (v.currentTime - s.t) / (s.end - s.t));
      btns[cur].style.setProperty("--f", f);
      if (v.currentTime >= s.end - 0.05) {             // the stretch is done: hold the frame so the caption can be read
        holding = true; v.pause();
        timer = setTimeout(() => onScreen && go(cur + 1), s.hold || hold);
      }
    });
    btns.forEach((b, i) => b.onclick = () => go(i));
    finEl.addEventListener("click", e => { if (e.target.closest("[data-replay]")) go(0); });
    go(0);
    // the tour runs only while it's on screen
    new IntersectionObserver(es => es.forEach(e => {
      onScreen = e.isIntersecting;
      if (!onScreen) { v.pause(); clearTimeout(timer); }
      else if (cur < steps.length) { if (holding) timer = setTimeout(() => go(cur + 1), 1200); else v.play().catch(() => {}); }
      else timer = setTimeout(() => go(0), 14000);
    }), { threshold: .5 }).observe(stage);
  });
  // clips play only while on screen (and never on their own when motion is reduced)
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const vio = new IntersectionObserver(es => es.forEach(e => { const v = e.target; if (e.isIntersecting && !reduce) { v.preload = "auto"; v.play().catch(() => {}); } else v.pause(); }), { threshold: .4 });
  document.querySelectorAll("video[data-play]").forEach(v => { vio.observe(v); if (reduce) v.controls = true; });
  // isometric diagrams: a segmented switch swaps the frame (<div class="isoframe" data-iso='[["a.html","caption"],…]'>)
  document.querySelectorAll(".isoframe[data-iso]").forEach(f => {
    const ISO = JSON.parse(f.dataset.iso), seg = f.querySelector(".seg2"), ifr = f.querySelector("iframe"), open = f.querySelector(".open"), cap = f.querySelector(".isocap");
    if (!seg) return;
    const knob = seg.querySelector(".knob"), bs = [...seg.querySelectorAll("button")];
    const pick = (i, user) => { bs.forEach((b, j) => { b.classList.toggle("on", i === j); b.setAttribute("aria-pressed", i === j); });
      knob.style.width = bs[i].offsetWidth + "px"; knob.style.transform = `translateX(${bs[i].offsetLeft - 3}px)`;
      if (user) { ifr.src = ISO[i][0]; if (open) open.href = ISO[i][0]; if (cap) cap.textContent = ISO[i][1]; } };
    bs.forEach((b, i) => b.addEventListener("click", () => pick(i, true)));
    addEventListener("resize", () => { const i = bs.findIndex(b => b.classList.contains("on")); if (i >= 0) pick(i, false); });
    requestAnimationFrame(() => pick(0, false));
  });
  // sections rise as they enter; hero words rise once
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .15 });
  document.querySelectorAll(".rv").forEach(el => io.observe(el));
  document.querySelectorAll(".rise > span").forEach((s, i) => s.style.animationDelay = i * 80 + "ms");
  // copy buttons
  document.querySelectorAll("[data-copy]").forEach(b => b.onclick = () => { navigator.clipboard?.writeText(b.dataset.copy); const t = b.textContent; b.textContent = "Copied"; setTimeout(() => b.textContent = t, 1400); });
  // chapter buttons jump the embedded deck to a slide (same origin: reach into the iframe's Reveal)
  const deck = document.querySelector(".deck iframe");
  document.querySelectorAll(".chapters [data-slide]").forEach(b => b.onclick = () => {
    const R = deck?.contentWindow?.Reveal; if (!R) return;
    R.slide(+b.dataset.slide); deck.focus(); deck.scrollIntoView({ block: "center" });
  });
})();
