// The product marks come alive when you point at them (or at the link, pill or card around them). Each .pm whose own or nearest
// px-* class names a product with a live mark gets an inline svg in place of the masked icon; suite.css animates it while the
// mark has .on. One idea per mark: omxcode snaps together, omxplorer's lens finds the spike, omxcore's nine cores light in a
// wave, omxqua's tile wobbles onto its shadow, omxconsole's prompt types and sparks. At rest every mark holds still.
(() => {
  const svg = (k, body) => `<svg class="lm lm-${k}" viewBox="0 0 24 24" aria-hidden="true">${body}</svg>`;
  let n = 0;
  const MARKS = {
    code: () => svg("code", '<path class="s p1" d="m6 8-4 4 4 4"/><path class="s p2" d="m14.5 4-5 16"/><path class="s p3" d="m18 16 4-4-4-4"/><circle class="f k" cx="8" cy="12" r="1"/><circle class="f k" cx="16" cy="12" r="1"/>'),
    plorer: () => { const id = "lm-lens-" + (++n); return svg("plorer", `<defs><clipPath id="${id}"><circle cx="10.5" cy="10.5" r="5"/></clipPath></defs><path class="s ln" pathLength="1" clip-path="url(#${id})" d="M4 13 7 12 9 13.2 10.8 6.8 12.6 14.4 14.2 11.6 18 12.2"/><circle class="f hit" cx="10.8" cy="6.8" r="1.2"/><g class="lens"><circle class="s" cx="10.5" cy="10.5" r="6.5"/><path class="s" d="m15.3 15.3 5.2 5.2"/></g>`); },
    core: () => svg("core", '<rect class="s" x="5" y="5" width="14" height="14" rx="2.5"/><path class="s pin" d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>' +
      [[9,9,0],[12,9,1],[15,9,2],[9,12,1],[12,12,2],[15,12,3],[9,15,2],[12,15,3],[15,15,4]].map(([x, y, i]) => `<circle class="f d" style="--i:${i}" cx="${x}" cy="${y}" r="1.2"/>`).join("")),
    qua: () => svg("qua", '<rect class="f shad" x="6.5" y="7.5" width="13" height="13" rx="3.5"/><rect class="f front" x="4.5" y="4.5" width="13" height="13" rx="3.5"/><circle class="gl" cx="8" cy="8" r="1.3"/>'),
    console: () => svg("console", '<path class="s chev" d="m4 7 5 5-5 5"/><path class="s cur" d="M12 17h7"/><path class="f spark" d="M18 2.5c.3 1.6 1 2.3 2.5 2.5-1.5.2-2.2.9-2.5 2.5-.3-1.6-1-2.3-2.5-2.5 1.5-.2 2.2-.9 2.5-2.5Z"/>'),
  };
  const kind = pm => {
    const own = [...pm.classList].find(c => c.startsWith("px-")), host = pm.closest('[class^="px-"], [class*=" px-"]');
    return (own || (host && [...host.classList].find(c => c.startsWith("px-"))) || "").slice(3);
  };
  const play = pm => { pm.classList.remove("on"); void pm.offsetWidth; pm.classList.add("on"); };
  document.querySelectorAll(".pm").forEach(pm => {
    const k = kind(pm);
    if (!MARKS[k] || pm.querySelector(".lm")) return;
    pm.classList.add("is-live"); pm.innerHTML = MARKS[k]();
    const host = pm.closest("a, button, .card, .box, .n") || pm.parentElement || pm;
    host.addEventListener("pointerenter", () => play(pm));
    host.addEventListener("focusin", () => play(pm));
    host.addEventListener("pointerleave", () => pm.classList.remove("on"));
  });
})();
