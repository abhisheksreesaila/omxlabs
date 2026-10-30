<p align="center">
  <img src="docs/img/logo.svg" width="72" alt="omxcode">
</p>

<h1 align="center">🧩 omxcode</h1>

<p align="center">
  <b>Write an app once in Mojo. It opens natively everywhere, with the GPU in the same file.</b>
</p>

<p align="center">
  <a href="https://omxlabs.tech/omxcode/"><b>👉 See the cover → omxlabs.tech/omxcode</b></a><br>
  <a href="https://omxlabs.tech/omxcode/deck.html"><b>▶ Watch the slides (16, about three minutes)</b></a>
</p>

---

## 💡 Why

Today one app means three languages: Swift, Kotlin and JavaScript for the screens, CUDA or shaders for speed. And AI agents still drive it through screenshots.
omxcode is one readable language from the button to the GPU kernel. Every app is already a tool server an agent can call.

## ✨ Five things

- 🧩 **Two functions, every screen.** `view()` draws the screen from your state; `update()` changes it. Each host patches only what changed.
- 🖥️ **Native, not imitated.** GTK 4, HTML, Android views and AppKit. iPhone builds and signs, but it hasn't run on a phone yet.
- ⚡ **The GPU, in the same file.** A plain Mojo function becomes a GPU kernel: `gpu.render[mandelbrot]`. 20M points draw in 1.5 ms a frame on an RTX 3090.
- 🤖 **Every app is an MCP server.** A button's tag is its tool's name. A disabled button is no tool.
- 🪄 **Agents build UI as data.** Over AG-UI an agent sends a UI as JSON. It's checked, then drawn natively, or refused with a reason.

## 🚀 Try it

```bash
git clone https://github.com/abhisheksreesaila/omxcode && cd omxcode && pixi install
scripts/build.sh hello all     # one app.mojo → GTK, web, Mac and iPhone builds
scripts/agent.sh hello         # prints the one command that gives it to Claude Code
```

You need x86-64 Linux with GTK 4 and [pixi](https://pixi.sh). The GPU path needs an NVIDIA card; without one, the same functions run on the CPU.

## 📚 Read on

- 🌐 [The cover](https://omxlabs.tech/omxcode/) and 🎞️ [the slides](https://omxlabs.tech/omxcode/deck.html)
- 📖 [Reference](docs/reference.md) · 🏗️ [How it works](docs/architecture.md) · 🤖 [The agent host](docs/agent.md) · 🪄 [AG-UI](docs/agui.md)
- 🧱 [Components × platforms](docs/components.md) · 📊 [Benchmarks, every loss stated](docs/benchmarks.md) · 🧭 [Decisions](docs/decisions.md)
- 📊 Built with it: [omxplorer](https://omxlabs.tech/omxplorer/), the flagship data app, and omxconsole's console

## 📄 Licence

MIT: see [LICENSE](LICENSE). Vendored files keep their own licences (HTMX: BSD 0-Clause; Lucide icons: ISC).
