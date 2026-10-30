// omxlabs suite · the slides. Load after reveal.js and its highlight + notes plugins.
// Embedded in a cover page (an iframe), the deck drops its brand chip and only takes keys once clicked.
(() => {
  const embedded = window.self !== window.top;
  if (embedded) document.documentElement.classList.add("embedded");
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

  Reveal.initialize({
    width: 1600, height: 900, margin: 0.06, hash: !embedded, slideNumber: "c/t", controls: true, progress: true, center: true,
    transition: "fade", transitionSpeed: "fast", backgroundTransition: "none",
    autoAnimateDuration: still ? 0 : 0.7, autoAnimateEasing: "cubic-bezier(.2,0,0,1)",
    embedded, keyboardCondition: embedded ? "focused" : null,
    plugins: [RevealHighlight, RevealNotes],
  });

  // product names are always lowercase: wrap them inside labels the styles uppercase
  document.querySelectorAll(".eyebrow, .who, .role, .tag, .sub, .n, .note, .kicker").forEach(el => {
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), hits = [];
    while (w.nextNode()) if (/omx(labs|plorer|code|core|qua|console)/.test(w.currentNode.data) && !w.currentNode.parentElement.closest(".nm")) hits.push(w.currentNode);
    hits.forEach(t => { const f = document.createElement("span"); f.innerHTML = t.data.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/omx(labs|plorer|code|core|qua|console)/g, '<span class="nm">$&</span>'); t.replaceWith(...f.childNodes); });
  });
  // terminals type their lines once, the first time their slide arrives: <div class="term" data-type> with one line per child (a typed command: class "tc")
  const typed = new WeakSet();
  function type(slide) {
    slide.querySelectorAll(".term[data-type]").forEach(t => {
      if (typed.has(t)) return; typed.add(t);
      const lines = [...t.children]; lines.forEach(l => l.style.visibility = "hidden");
      if (still) { lines.forEach(l => l.style.visibility = ""); return; }
      let i = 0;
      const next = () => {
        if (i >= lines.length) return;
        const l = lines[i++], full = l.textContent, isCmd = l.classList.contains("tc");
        l.style.visibility = "";
        if (!isCmd) { setTimeout(next, 260); return; }
        const html = l.innerHTML; let n = 0; l.textContent = "";
        const tick = () => { n++; l.textContent = full.slice(0, n); if (n < full.length) setTimeout(tick, 28); else { l.innerHTML = html; setTimeout(next, 380); } };
        tick();
      };
      next();
    });
  }
  Reveal.on("ready", e => type(e.currentSlide));
  Reveal.on("slidechanged", e => type(e.currentSlide));
})();
