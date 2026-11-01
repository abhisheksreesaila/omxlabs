<div align="center">

# 🧪 omxlabs

**Every kind of data. One GPU. Built for people and agents.**

### [🌐 omxlabs.tech →](https://omxlabs.tech) &nbsp;·&nbsp; [▶ The slides (2 min) →](https://omxlabs.tech/omxplorer/deck.html)

</div>

## 💡 Why

Your own hardware is enough. omxlabs builds software in Mojo that runs serious data and AI work on the GPU you already own,
and that an AI agent can use as easily as you can.

## ✨ The suite

**omxplorer and omxconsole are the apps**, powered by three technologies. Every product has one colour and one mark,
wherever it appears, the way Excel is always green.

| | | |
|---|---|---|
| 🟩 **P** [**omxplorer**](https://omxlabs.tech/omxplorer/) | app · data | ask your data in a sentence; every button is an agent tool |
| 🟧 **AI** [**omxconsole**](https://omxlabs.tech/omxconsole/) | app · local AI | your GPU as a private, OpenAI-compatible model server |
| 🟦 **C** [**omxcore**](https://omxlabs.tech/omxcore/) | the engine | SQL on your CPU and GPU, over the files you already have |
| 🟥 **&lt;/&gt;** [**omxcode**](https://omxlabs.tech/omxcode/) | the framework | write an app once in Mojo: native on Linux, the web and the Mac (CI Macs), Android on the emulator |
| 🟪 **Q** [**omxqua**](https://omxlabs.tech/omxqua/) | the design language | Google's surfaces, Apple's springs |

Each product has a cover page and a two-minute deck with the code. Read those; the READMEs stay short.

## 🛠️ This repo

The site itself: plain HTML, `assets/suite.css` (one cover layout; each product's colour and mark, `.px-*` and `.pm`), `assets/deck.css` + `deck.js`
(one reveal.js deck template), `assets/suite.js` (the suite list that draws every page's top nav, footer and suite row), `iso/` (the interactive isometric diagrams: JSON specs + `iso/build.sh`), `tools/check_site.py` (screenshots every page at 1440 and 390; fails on console errors, overflow, broken links).
`readmes/` holds the short README drafts for each product's repo. Preview: `python3 -m http.server` and open `/`.

Once omxplorer is hosted, every "Meet omxplorer" button becomes "Try omxplorer" and opens the live app; `omxplorer/` stays the deep dive.
