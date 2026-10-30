<div align="center">

# 🫧 omxqua

### The best of Apple and Google, and the taste to choose.

Google's solid surfaces and one soft shadow. Apple's springs. Touch first, on the phone and the web.

## 👉 [See the cover](https://omxlabs.tech/omxqua/) · [▶ Watch the slides](https://omxlabs.tech/omxqua/deck.html)

</div>

---

## 💡 Why

Most apps feel like forms. omxqua makes them feel like toys that do serious work: every button squishes and springs back, switches stretch when you hold them, and one live thing sits in a little black pill up top.

It's one design language for every omxlabs app, borrowed honestly and rebuilt from scratch, with no glass on anything you read.

## ✨ Five things

- 🧱 **Solid, not glass.** Opaque tonal surfaces and one soft shadow scale. Only the nav pill is frosted.
- 🌀 **Springs with weight.** Every tap squashes and springs back. The more often a thing happens, the less it moves.
- 🎨 **4 families, 4 skins.** Dev, travel, kids, money. One root class repaints it all, and 51 checks hold every pair to 4.5:1.
- 🤖 **Agents read it.** A skill and a Claude Code plugin, so "a trip planner in omxqua" comes out in the real parts.
- 📦 **Three files, no build.** `tokens.css`, `components.css`, `omxqua.js`: about 19 KB gzipped, plus fonts.

## 🚀 Try it

In Claude Code, one line:

```
/plugin install omxqua --marketplace abhisheksreesaila/omxqua
```

Then ask: *"a trip planner home screen in omxqua"*. Any other agent: copy `skills/omxqua/` into its skills folder.

By hand: link `fonts.css`, `tokens.css`, `components.css` and `omxqua.js`, then pick a theme, a family and a shell:

```html
<html class="oq-root oq-night oq-family-dev oq-top">
```

Shipping? `bin/omxqua-sync static/ --ref v0.1.5` copies it into your project, so nothing loads from a third party.

## 📚 Read on

- 🎛️ [The showcase](https://abhisheksreesaila.github.io/omxqua/docs/showcase.html): one app in every theme, web and phone side by side
- 🧭 [AGENTS.md](AGENTS.md): every part with its markup
- 📐 [LANGUAGE.md](LANGUAGE.md): the rules and why
- 📜 [CHANGELOG.md](CHANGELOG.md) · 🧪 the omxlabs suite: [omxlabs.tech](https://omxlabs.tech/)

## 🏷️ Licence

Code MIT. Fonts (Geist, Geist Mono, Fraunces, Nunito) SIL OFL 1.1, licences next to them in `fonts/`. Made with springs 🌀

