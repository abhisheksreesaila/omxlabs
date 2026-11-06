<div align="center">

# 🔌 omxconsole

**Local AI on MAX, made easy. A desktop app: find a model, download it and serve it on your own GPU, behind one OpenAI-compatible endpoint.**

### [👉 See the cover](https://abhisheksreesaila.github.io/omxcode/omxconsole.html) · [⬇ Linux](https://github.com/abhisheksreesaila/omxcode/releases/download/gallery-apps/omxconsole-linux-x86_64.tar.gz) · [⬇ Mac](https://github.com/abhisheksreesaila/omxcode/releases/download/gallery-apps/omxconsole-mac-arm64.zip)

![public alpha](https://img.shields.io/badge/status-public%20alpha-f5b041) ![platform](https://img.shields.io/badge/platform-Linux%20%C2%B7%20Mac-555) ![MAX](https://img.shields.io/badge/needs-Modular%20MAX-0d7d70)

</div>

## 💡 Why

MAX already serves models well. omxconsole is the convenience around it: it finds models on Hugging Face and downloads them,
keeps every model behind one local URL with a key per app, and measures them. Private, and offline once a model is downloaded.

## ✨ What it does

- 🔎 **Find and download.** Search Hugging Face by name. It checks that MAX supports the model's architecture before any weights come down; downloads resume where they stopped and are checked against the Hub's file sizes.
- 🔌 **One endpoint.** Every model behind `http://127.0.0.1:11435/v1` (chat, completions, embeddings, models). A model starts on its first request and unloads after 5 idle minutes.
- ✅ **Ready means it answered.** After a download the app starts the model and asks it a first question; the Ready card comes after the reply.
- 🔑 **One key per app.** Shown once, stored only as a hash; revoke one and only that app stops.
- ⏱️ **Benchmarks.** A 512-token prompt, 128 tokens back, five timed runs through the same endpoint your apps use.

## 🚀 Try it

It needs MAX ([docs.modular.com/max/packages](https://docs.modular.com/max/packages)): `max` on your PATH, or `MXC_MAX=/path/to/max`.

- **Linux** (x86_64, GTK 4): download, unpack, `./omxconsole`.
- **Mac** (Apple Silicon): download, unzip, `xattr -dr com.apple.quarantine omxconsole.app`, then open it.

Then point any OpenAI client at `http://127.0.0.1:11435/v1` with a key from the Keys page. 🎉

## 🧱 Inside

All [omxcode](https://github.com/abhisheksreesaila/omxcode): the app (GTK on Linux, AppKit on the Mac) and `consoled`, a Mojo
service the app starts beside itself and stops when it closes. MAX runs the models. Source:
[examples/console](https://github.com/abhisheksreesaila/omxcode/tree/main/examples/console) and
[examples/consoled](https://github.com/abhisheksreesaila/omxcode/tree/main/examples/consoled).

## 🧭 Honest edges

- An alpha. On the Mac it has opened and started its service on GitHub's macOS runners; serving a model on Apple silicon through MAX hasn't been tried yet.
- No chat window of its own yet: talk to a model through the endpoint, from any OpenAI client.
- The earlier Python version (`mxc`, in [mxstudio](https://github.com/abhisheksreesaila/mxstudio)) is archived.

## 📄 Licence

MIT. MAX and Mojo are Modular's; omxlabs is independent. Part of [omxlabs](https://omxlabs.tech/).
