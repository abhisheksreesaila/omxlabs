<div align="center">

# 🔌 omxconsole

**Your GPU, as a private model server. One command, one OpenAI-compatible endpoint.**

### [👉 See the cover](https://omxlabs.tech/omxconsole/) · [▶ Watch the slides](https://omxlabs.tech/omxconsole/deck.html)

![public alpha](https://img.shields.io/badge/status-public%20alpha-f5b041) ![platform](https://img.shields.io/badge/platform-Linux%20%C2%B7%20NVIDIA-555) ![MAX](https://img.shields.io/badge/Modular%20MAX-26.7%20nightly-0d7d70)

</div>

## 💡 Why

Cloud AI bills you per token and sends your prompts away. The usual local setup runs one server per model, each holding GPU memory all day.
omxconsole puts every model behind one local URL on Modular MAX. Models wake on the first call and sleep when idle. Private, offline once downloaded, and no meter running.

## ✨ Five things

- 🔌 **One command, one endpoint.** `mxc serve qwen2.5-0.5b` prints a URL, a key and a curl line. Any OpenAI client works.
- 💤 **Models sleep when idle.** A model starts on its first request and unloads after 5 idle minutes. Pin the ones you want kept loaded.
- 🔑 **Safe to share.** One revocable key per app, stored as a hash. `mxc expose` puts the four `/v1` routes on your LAN over HTTPS.
- 🧬 **MAX can't run it? Port it.** `mxc port <repo> --auto` has Claude Code write a MAX version in a sandbox, checked against Hugging Face. 8 architectures so far, text models only.
- 🖥️ **A console written in Mojo.** Rebuilt with [omxcode](https://omxlabs.tech/omxcode/): native on Linux and Mac, and on the web it matches the original to 99.2 % of pixels.

## 🚀 Try it

Linux with an NVIDIA GPU:

```bash
git clone https://github.com/abhisheksreesaila/mxstudio.git && cd mxstudio
pixi install && pixi run mxc serve qwen2.5-0.5b   # prints a URL, a key and a curl line
```

Then point any OpenAI client at `http://127.0.0.1:11435/v1`. 🎉

## 📚 Read on

- 🧭 [User guide](docs/USER_GUIDE.md): install, first ten minutes, the console, LAN access
- ⌨️ [CLI reference](docs/CLI.md) · 🌐 [HTTP API](docs/API.md) · 🧬 [Porting](docs/PORTING.md) · 🏗️ [How it works](docs/ARCHITECTURE.md)
- 🖱️ [Console tour](https://abhisheksreesaila.github.io/mxstudio/site/console.html), every screen, clickable
- 🧪 Part of [omxlabs](https://omxlabs.tech/): omxplorer · omxcore · omxcode · omxconsole · omxqua

## 📄 Licence

MIT. Built on [Modular MAX](https://www.modular.com/max).
