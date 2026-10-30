/* omxqua · omxqua.js (no dependencies, ~4 KB)
   1. Press: every tappable thing squashes on pointer-down and springs back on release.
      The amount follows the size, so it feels the same everywhere: small 0.90 · medium 0.96 · large 0.985.
      An element (or its skin) can set --oq-press: ledge to sink 4 px instead (the Kids Sticker skin).
   2. Logo: .mark writes itself on press (its letters or icon are drawn as a stroke, then filled).
   3. Helpers on window.Omxqua for the moving parts: segmented thumbs, gentle menus, toasts,
      the Beacon morph and the Top nav pill (see AGENTS.md).
   Opt out with data-nopress. Respects prefers-reduced-motion. */
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const PRESS = "button, a.cta, a.more, [data-press], .tile, .blk, .day, .row, .row-demo, .chip, .nav, .mark, .brand-isl, .brand";
  const spring = el => getComputedStyle(el).getPropertyValue("--oq-spring-fast").trim() || "cubic-bezier(.2,.9,.3,1.15)";
  const amount = el => { const w = el.getBoundingClientRect().width; return w <= 48 ? 0.9 : w <= 260 ? 0.96 : 0.985; };

  addEventListener("pointerdown", e => {
    if (reduce || e.button > 0) return;
    const el = e.target.closest(PRESS);
    if (!el || el.disabled || el.closest("[data-nopress]")) return;
    const ledge = getComputedStyle(el).getPropertyValue("--oq-press").trim() === "ledge";
    const down = ledge ? { translate: "0 4px" } : { scale: String(amount(el)) }, rest = ledge ? { translate: "0 0" } : { scale: "1" };
    el.getAnimations().forEach(a => a.id === "oq-press" && a.cancel());
    const a = el.animate([rest, down], { duration: 110, easing: "ease-out", fill: "forwards" }); a.id = "oq-press";
    const up = () => {
      removeEventListener("pointerup", up); removeEventListener("pointercancel", up);
      const b = el.animate([down, rest], { duration: 320, easing: spring(el) }); b.id = "oq-press"; a.cancel();
    };
    addEventListener("pointerup", up); addEventListener("pointercancel", up);
    if (el.matches(".mark, .brand, .brand-isl")) writeLogo(el.matches(".mark") ? el : el.querySelector(".mark"));
  }, true);

  /* Logo: letters → <svg><text>, so the stroke can be drawn; icons keep their paths. */
  function prepare(mark) {
    if (!mark || mark.dataset.oqLogo) return;
    mark.dataset.oqLogo = "1";
    const txt = mark.textContent.trim();
    if (!mark.querySelector("svg") && txt) {
      const big = txt.length === 1;
      mark.innerHTML = `<svg viewBox="0 0 40 40" class="oq-logo" aria-label="${txt}"><text x="20" y="${big ? 27.5 : 25.5}" text-anchor="middle" font-size="${big ? 22 : 17}" font-weight="700" font-family="inherit">${txt}</text></svg>`;
    }
    mark.querySelectorAll("svg path, svg circle, svg text").forEach(p => { if (p.tagName !== "text") p.setAttribute("pathLength", "1"); });
  }
  function writeLogo(mark) {
    if (!mark || reduce) return;
    prepare(mark);
    mark.querySelectorAll("svg text").forEach(t => {
      t.getAnimations().forEach(a => a.cancel());
      t.animate([{ strokeDashoffset: 120, fillOpacity: 0 }, { strokeDashoffset: 0, fillOpacity: 0, offset: .75 }, { strokeDashoffset: 0, fillOpacity: 1 }],
        { duration: 900, easing: "cubic-bezier(.4,0,.2,1)" });
    });
    mark.querySelectorAll("svg path, svg circle").forEach(p => {
      p.getAnimations().forEach(a => a.cancel());
      p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 700, easing: "cubic-bezier(.4,0,.2,1)" });
    });
  }
  /* write each logo once when it first appears */
  const seen = new WeakSet();
  const scan = () => document.querySelectorAll(".mark").forEach(m => { if (!seen.has(m)) { seen.add(m); prepare(m); if (m.getClientRects().length) setTimeout(() => writeLogo(m), 250); } });
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
  addEventListener("DOMContentLoaded", scan); scan();

  /* ---- helpers (used by docs/showcase.html; same timings as LANGUAGE.md's motion budget) ---- */
  /* Segmented control, tabs, tab bar, top nav: the first child is the thumb; it slides under button.on. */
  /* Thumbs are liquid: moving to another button stretches the thumb along the way and lets it settle with a wobble
     (a re-layout of the same button just moves it). */
  function placeThumb(sg) {
    const on = sg.querySelector("button.on"), t = sg.firstElementChild; if (!on || !t) return;
    const from = parseFloat(t.style.left), to = on.offsetLeft, moved = t._on && t._on !== on; t._on = on;
    t.style.left = to + "px"; t.style.width = on.offsetWidth + "px";
    if (reduce || !moved || isNaN(from) || Math.abs(to - from) < 2 || !t.offsetParent) return;
    const k = Math.min(0.35, Math.abs(to - from) / sg.offsetWidth * 0.6);
    t.animate([{ scale: "1 1" }, { scale: `${1 + k} ${1 - k / 2}`, offset: 0.35 }, { scale: `${1 - k / 4} ${1 + k / 8}`, offset: 0.7 }, { scale: "1 1" }], { duration: 420, easing: "ease-out" });
  }

  /* Tab bar drag: hold the bar and slide; the thumb lifts, follows the finger, and drops on the tab you let go over.
     omxqua.js clicks that tab for you (your click handler runs as for a tap); a cancelled gesture puts everything back. */
  addEventListener("pointerdown", e => {
    const bar = e.target.closest(".tabbar"), t = bar && bar.querySelector(".tb-thumb");
    if (!t || e.button > 0 || !t.offsetParent || bar._drag) return;
    const id = e.pointerId, x0 = e.clientX, btns = [...bar.querySelectorAll("button")], was = bar.querySelector("button.on");
    let dragging = false, lx = x0; bar._drag = true; if (bar._follow) { bar._follow = null; t.style.transition = ""; }
    const near = x => btns.reduce((a, b) => { const r = b.getBoundingClientRect(), d = Math.abs(x - (r.left + r.right) / 2); return d < a[1] ? [b, d] : a; }, [null, Infinity])[0];
    const under = x => { const r = bar.getBoundingClientRect(); return x >= r.left && x <= r.right ? near(x) : null; }; /* gaps and padding count as the nearest tab */
    const mark = on => btns.forEach(x => x.classList.toggle("on", x === on));
    const move = ev => {
      if (ev.pointerId !== id || (!dragging && Math.abs(ev.clientX - x0) < 8)) return;
      if (!dragging) { dragging = true; t.style.transition = "none"; }
      const r = bar.getBoundingClientRect(), w = t.offsetWidth;
      t.style.left = Math.max(0, Math.min(r.width - w, ev.clientX - r.left - w / 2)) + "px";
      if (!reduce) { const k = Math.min(0.18, Math.abs(ev.clientX - lx) / 120); t.style.scale = `${1.12 + k} ${1.12 - k / 2}`; }
      lx = ev.clientX; const b = under(ev.clientX); if (b) mark(b);
    };
    const up = ev => {
      if (ev.pointerId !== id) return;
      removeEventListener("pointermove", move); removeEventListener("pointerup", up); removeEventListener("pointercancel", up); bar._drag = false;
      if (!dragging) return;
      t.style.transition = ""; t.style.scale = "";
      if (!reduce) t.animate([{ scale: "1.12 1.12" }, { scale: "1 1" }], { duration: 320, easing: spring(t) });
      const b = ev.type === "pointerup" && under(ev.clientX);
      if (!b) { if (was) mark(was); placeThumb(bar); return; }
      /* swallow the browser's own click that may follow the drag, then click the tab ourselves */
      const eat = c => { if (!c.isTrusted || !bar.contains(c.target)) return; c.stopPropagation(); c.preventDefault(); };
      addEventListener("click", eat, true); setTimeout(() => removeEventListener("click", eat, true), 300);
      mark(b); b.click(); placeThumb(bar);
    };
    addEventListener("pointermove", move); addEventListener("pointerup", up); addEventListener("pointercancel", up);
  }, true);
  /* Scroll edge: once content scrolls under the islands, the root gets .oq-scrolled (the bare logo frosts over). */
  addEventListener("scroll", e => {
    const el = e.target === document ? document.scrollingElement : e.target;
    const root = e.target === document ? document.querySelector("html.oq-root, body.oq-root") : el.matches(".oq-root .main") && el.closest(".oq-root");
    if (!root) return;
    const y = el.scrollTop, max = el.scrollHeight - el.clientHeight;
    root.classList.toggle("oq-scrolled", y > 4);
    /* Tab bar minimizes after 12 px of scrolling down, comes back after 12 px up or at the top.
       Distance counts from where the direction last flipped, so slow scrolls add up; the bottom rubber-band is ignored. */
    const st = scrollState.get(el) || { last: y, anchor: y, dir: 0 }; scrollState.set(el, st);
    const dir = Math.sign(y - st.last); if (dir && dir !== st.dir) { st.dir = dir; st.anchor = st.last; } st.last = y;
    let min = root.classList.contains("oq-tabs-min");
    if (y <= 4) min = false;
    else if (st.dir > 0 && y - st.anchor > 12 && y > 60) min = true;
    else if (st.dir < 0 && st.anchor - y > 12 && st.anchor <= max) min = false;
    if (min !== root.classList.contains("oq-tabs-min")) { root.classList.toggle("oq-tabs-min", min); root.querySelectorAll(".tabbar").forEach(b => followThumb(b, 320)); }
  }, { capture: true, passive: true });
  const scrollState = new WeakMap();
  /* While the tab bar resizes, keep its thumb on the active button frame by frame (one loop per bar; a drag owns the thumb). */
  function followThumb(bar, ms) {
    const t = bar.querySelector(".tb-thumb"); if (!t || !bar.offsetParent || bar._drag) return;
    const token = bar._follow = {}, end = performance.now() + ms; t.style.transition = "none";
    const step = () => {
      if (bar._follow !== token || bar._drag) return;
      const on = bar.querySelector("button.on"); if (on) { t.style.left = on.offsetLeft + "px"; t.style.width = on.offsetWidth + "px"; }
      if (performance.now() < end) requestAnimationFrame(step); else { t.style.transition = ""; bar._follow = null; }
    };
    step();
  }
  /* Settle tier: a panel or view arrives (fade + 12px rise, 280 ms, decelerating). */
  function settle(el) { if (!reduce) el.animate([{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], { duration: 280, easing: "cubic-bezier(.2,0,0,1)" }); }
  /* Gentle tier: menus, popovers, tooltips ease in over 220 ms and fade out in 150 ms (then [hidden]). */
  function gentleIn(el) { el.hidden = false; if (!reduce) el.animate([{ opacity: 0, transform: "translateY(-4px) scale(.97)" }, { opacity: 1, transform: "none" }], { duration: 220, easing: "cubic-bezier(.2,0,0,1)" }); }
  function gentleOut(el) { if (el.hidden) return; if (reduce) { el.hidden = true; return; } el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, easing: "cubic-bezier(.3,0,1,1)" }).onfinish = () => el.hidden = true; }
  /* Toast: shows msg in msgEl, rises in if it was hidden, fades out 2.6 s after the last call. */
  const toastTimers = new WeakMap();
  function toast(el, msg, msgEl = el.firstElementChild) {
    msgEl.textContent = msg; clearTimeout(toastTimers.get(el));
    if (el.hidden) { el.hidden = false; if (!reduce) el.animate([{ opacity: 0, transform: "translate(-50%, 8px)" }, { opacity: 1, transform: "translate(-50%, 0)" }], { duration: 220, easing: "cubic-bezier(.2,0,0,1)" }); }
    toastTimers.set(el, setTimeout(() => gentleOut(el), 2600));
  }
  /* Beacon: size the pill to its compact or open content; the CSS transition does the morph. */
  function sizeBeacon(b, animate) {
    const open = b.classList.contains("open"), el = b.querySelector(open ? ".bc-open" : ".bc-compact");
    const w = open ? el.offsetWidth : el.scrollWidth, h = open ? el.offsetHeight : 40;
    if (!animate || reduce) { const t = b.style.transition; b.style.transition = "none"; b.style.width = w + "px"; b.style.height = h + "px"; b.offsetWidth; b.style.transition = t; }
    else { b.style.width = w + "px"; b.style.height = h + "px"; }
  }
  /* Top nav pill: 4 items at rest (the 4th is the active extra if one is picked) · +N · the rest.
     openTopnav(nav, true) widens it to all; foldTopnavLater folds it back 3.5 s after you leave; holdTopnav cancels that. */
  const navTimers = new WeakMap();
  function layoutTopnav(nav, animate) {
    if (!nav) return;
    const btns = [...nav.querySelectorAll("button[data-i]")], more = nav.querySelector("[data-more]"), open = nav.classList.contains("open");
    const active = btns.findIndex(b => b.classList.contains("on"));
    const shown = active >= 4 ? [0, 1, 2, active] : [0, 1, 2, 3];
    btns.forEach((b, i) => { b.classList.toggle("keep", shown.includes(i)); b.style.order = shown.includes(i) ? shown.indexOf(i) : 10 + i; });
    more.style.order = open ? 99 : 5;
    btns.forEach(b => b.classList.toggle("extra", !shown.includes(+b.dataset.i)));
    more.querySelector("span").textContent = btns.length - 4;
    const pad = 10, w = open ? btns.reduce((a, b) => a + b.offsetWidth, 0) + pad : shown.reduce((a, i) => a + btns[i].offsetWidth, 0) + more.offsetWidth + pad;
    if (!animate || reduce) { const t = nav.style.transition; nav.style.transition = "none"; nav.style.width = w + "px"; nav.offsetWidth; nav.style.transition = t; } else nav.style.width = w + "px";
    requestAnimationFrame(() => placeThumb(nav));
  }
  function holdTopnav(nav) { if (nav) clearTimeout(navTimers.get(nav)); }
  function openTopnav(nav, on) { if (!nav) return; holdTopnav(nav); if (nav.classList.contains("open") === on) return; nav.classList.toggle("open", on); layoutTopnav(nav, true); }
  function foldTopnavLater(nav, ms = 3500) { if (!nav) return; holdTopnav(nav); navTimers.set(nav, setTimeout(() => openTopnav(nav, false), ms)); }

  window.Omxqua = Object.assign(window.Omxqua || {}, { writeLogo, placeThumb, settle, gentleIn, gentleOut, toast, sizeBeacon, layoutTopnav, openTopnav, foldTopnavLater, holdTopnav });
})();
