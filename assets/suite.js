// omxlabs suite: one list of products draws every page's top bar and suite row, so the five covers can't drift apart.
// A page says who it is with <html data-here="plorer" data-root="..">; it marks <nav class="top"> and <div class="fam"> to fill.
const SUITE = [
  { k: "plorer",  name: "omxplorer",  role: "the flagship · data",   line: "Ask your data in a sentence. A million rows answer in under a millisecond, and every button is a tool an agent can call." },
  { k: "core",    name: "omxcore",    role: "powered by · engine",    line: "SQL on your CPU and your GPU, over the files you already have. All 22 TPC-H queries at SF10 in 3.15 s (DuckDB 5.08 s)." },
  { k: "code",    name: "omxcode",    role: "built with · framework", line: "Write an app once in Mojo; it opens natively on Linux, the web, Android and Mac, and an agent can drive it." },
  { k: "console", name: "omxconsole", role: "local AI",               line: "One command turns your GPU into a private, OpenAI-compatible model server. Its console has been rebuilt as an omxcode app." },
  { k: "qua",     name: "omxqua",     role: "the look · design",       line: "The design language this site is drawn in: Google's solid surfaces, Apple's springs, one accent per product." },
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
      `<div class="trail"><span class="mark"></span>${me ? `<a href="${href("labs")}">omxlabs</a><span class="sep">›</span><b>${me.name}</b>` : `<b>omxlabs</b>`}</div>` +
      `<div class="suite">${SUITE.map(p => `<a class="px-${p.k}${p.k === here ? " on" : ""}" href="${href(p.k)}"><i></i>${p.name}</a>`).join("")}</div>` +
      `<div class="right">${gh ? `<a class="gh" href="${gh}">GitHub</a>` : ""}<a class="cta" href="${ctaHref}">${cta}</a></div>`;
  }
  const fam = document.querySelector(".fam");
  if (fam) fam.innerHTML = SUITE.map(p =>
    `<a class="px-${p.k}${p.k === here ? " here" : ""}" href="${p.k === here ? "#top" : href(p.k)}"><span class="role">${p.role}</span><b>${p.name}</b><p>${p.line}</p><span class="go">${p.k === here ? "You are here" : "Open"}</span></a>`).join("");

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
