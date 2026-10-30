// omxlabs suite: one list of products draws every page's top bar (no product switcher: pages lead on by scrolling) and suite row, so the five covers can't drift apart.
// A page says who it is with <html data-here="plorer" data-root="..">; it marks <nav class="top"> and <div class="fam"> to fill.
// Every product has one colour and one mark (suite.css .px-* and .pm), like an Office icon: <i class="pm px-core"></i> anywhere.
// <div class="fam" data-only="tech"> lists only the four technologies; data-to="anchor" links cards to #omx<k> on the same page.
const SUITE = [
  { k: "plorer",  name: "omxplorer",  role: "the product",                line: "Ask your data in a sentence. A million rows answer in under a millisecond, and every button is a tool an agent can call." },
  { k: "core",    name: "omxcore",    role: "technology · the engine",    line: "SQL on your CPU and your GPU, over the files you already have. All 22 TPC-H queries at SF10 in 3.15 s (DuckDB 5.08 s)." },
  { k: "code",    name: "omxcode",    role: "technology · the framework", line: "Write an app once in Mojo; it opens natively on Linux, the web, Android and Mac, and an agent can drive it." },
  { k: "qua",     name: "omxqua",     role: "technology · the look",      line: "The design language this site is drawn in: Google's solid surfaces, Apple's springs, one colour per product." },
  { k: "console", name: "omxconsole", role: "technology · local AI",      line: "One command turns your GPU into a private, OpenAI-compatible model server: the AI supplier for every app." },
];
const GH = "https://github.com/abhisheksreesaila";
(() => {
  const html = document.documentElement, here = html.dataset.here || "labs", root = html.dataset.root || ".";
  const href = k => `${root}/${k === "labs" ? "" : "omx" + k + "/"}`;
  const me = SUITE.find(p => p.k === here);

  const top = document.querySelector("nav.top");
  if (top) {
    const cta = top.dataset.cta || "Watch the slides", ctaHref = top.dataset.ctaHref || "#slides", gh = top.dataset.gh;
    top.innerHTML =
      `<div class="trail"><span class="${me ? "pm" : "mark"}"></span>${me ? `<a href="${href("labs")}">omxlabs</a><span class="sep">›</span><b>${me.name}</b>` : `<b>omxlabs</b>`}</div>` +
      `<div class="right">${gh ? `<a class="gh" href="${gh}">GitHub</a>` : ""}<a class="cta" href="${ctaHref}">${cta}</a></div>`;
  }
  document.querySelectorAll(".fam").forEach(fam => {
    const list = fam.dataset.only === "tech" ? SUITE.filter(p => p.k !== "plorer") : SUITE, anchor = fam.dataset.to === "anchor";
    fam.classList.toggle("four", list.length === 4);
    fam.innerHTML = list.map(p => {
      const on = p.k === here;
      return `<a class="px-${p.k}${on ? " here" : ""}" href="${on ? "#top" : anchor ? "#omx" + p.k : href(p.k)}"><i class="pm"></i><span class="role">${p.role}</span><b>${p.name}</b><p>${p.line}</p><span class="go">${on ? "You are here" : "Open"}</span></a>`;
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
