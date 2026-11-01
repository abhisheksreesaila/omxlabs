<div align="center">

# 💬 omxplorer

**Ask your data in a sentence. A million rows answer in under a millisecond.**

### [🌐 The cover →](https://omxlabs.tech/omxplorer/) &nbsp;·&nbsp; [▶ The slides (2 min) →](https://omxlabs.tech/omxplorer/deck.html)

</div>

## 💡 Why

Spreadsheets choke past a million rows, warehouses send a bill, and AI agents drive apps by screenshot.
omxplorer is a data workspace that runs on the GPU you already own, and every button in it is a tool an agent can call.
Written in Mojo with omxcode, powered by omxcore.

## ✨ Five things

- 💬 **The title is the chart.** "Sum of revenue by product, top 5, as bars": tap a word, or type "median", and the bars move.
- 🤖 **Every button is a tool.** It's an MCP server from the first line. A disabled button is no tool.
- ⚡ **Your GPU does the work.** A chart over 1M rows in 0.5–0.7 ms; a median per group in 6.4 ms (RTX 3090).
- 📂 **100M rows, no warehouse.** CSV and Parquet straight from disk; a 100M-row file opens in 0.2 s, streamed.
- 🖥️ **Native everywhere.** Linux and the web run today, and the Mac runs on CI Macs (GitHub's macOS runners), from one Mojo app. Phones are next.

🏁 A dashboard over 100M rows: **30.3 ms** a click (Rust + Polars 37.0, JS + DuckDB-WASM 104.9; goal 38, measured at 856a7e9, before the release build, `docs/data-benchmark.md`).

## 🚀 Try it

```sh
scripts/build.sh omxplorer linux    # a native Linux window
scripts/agent.sh omxplorer          # hand it to Claude Code as MCP tools
```

## 📚 Read on

[🌐 The cover](https://omxlabs.tech/omxplorer/) · [▶ The slides](https://omxlabs.tech/omxplorer/deck.html) · [🤖 The agent docs](https://github.com/abhisheksreesaila/omxcode/blob/main/docs/agent.md) · [🧪 omxlabs](https://omxlabs.tech)

MIT · part of [omxlabs](https://omxlabs.tech)
