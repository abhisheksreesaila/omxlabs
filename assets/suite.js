// omxlabs suite: one list of products draws every page's top bar and suite row, so the five covers can't drift apart.
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
      // omxplorer up front; the four technologies wait behind one menu, so a first visit sees one product
      `<div class="suite"><a class="px-plorer${here === "plorer" ? " on" : ""}" href="${href("plorer")}"><i class="pm"></i>omxplorer</a>` +
      `<details class="techmenu${me && me.k !== "plorer" ? " on" : ""}"><summary>${me && me.k !== "plorer" ? `<i class="pm px-${me.k}"></i>${me.name}` : "Technology"}</summary>` +
      `<div class="menu">${SUITE.filter(p => p.k !== "plorer").map(p => `<a class="px-${p.k}${p.k === here ? " on" : ""}" href="${href(p.k)}"><i class="pm"></i><span><b>${p.name}</b>${p.role.replace("technology · ", "")}</span></a>`).join("")}</div></details></div>` +
      `<div class="right">${gh ? `<a class="gh" href="${gh}">GitHub</a>` : ""}<a class="cta" href="${ctaHref}">${cta}</a></div>`;
  }
  // the technology menu closes on a click outside it
  document.addEventListener("keydown", e => { if (e.key === "Escape") document.querySelectorAll("details.techmenu[open]").forEach(d => d.open = false); });
  document.addEventListener("click", e => document.querySelectorAll("details.techmenu[open]").forEach(d => { if (!d.contains(e.target)) d.open = false; }));
  document.querySelectorAll(".fam").forEach(fam => {
    const list = fam.dataset.only === "tech" ? SUITE.filter(p => p.k !== "plorer") : SUITE, anchor = fam.dataset.to === "anchor";
    fam.classList.toggle("four", list.length === 4);
    fam.innerHTML = list.map(p => {
      const on = p.k === here;
      return `<a class="px-${p.k}${on ? " here" : ""}" href="${on ? "#top" : anchor ? "#omx" + p.k : href(p.k)}"><i class="pm"></i><span class="role">${p.role}</span><b>${p.name}</b><p>${p.line}</p><span class="go">${on ? "You are here" : "Open"}</span></a>`;
    }).join("");
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
