<div align="center">

# ⚡ omxcore

**SQL on your CPU *and* your GPU, over the files you already have.**

### [🌐 The cover →](https://omxlabs.tech/omxcore/) &nbsp;·&nbsp; [▶ The slides (3 min) →](https://omxlabs.tech/omxcore/deck.html)

</div>

## 💡 Why

Your data lives in CSV and Parquet files, your GPU sits idle, and your AI agent can't squint at a wrong answer.
omxcore is one native library, written in Mojo with no Python inside. You point it at a file and ask in SQL.
Apps link it like SQLite; agents get JSON back, with exact decimals and errors they can fix.

## ✨ Five things

- 📂 **Your files stay yours.** No import, no new format. Files bigger than memory stream through (a 1.6 GB file in 72 MB).
- ⚡ **Your hardware, all of it.** CPU or GPU, chosen per query, and the answer says why.
- 🤖 **Answers an agent can trust.** JSON out, exact decimals, errors with a line, a column and a "did you mean".
- 🔥 **Mojo, top to bottom.** Parser, planner, CPU and GPU kernels in one language. It runs inside omxplorer.
- 🧩 **Real SQL.** Joins, CTEs, subqueries, windows, QUALIFY. 21 of 22 TPC-H queries through `mx` equal DuckDB's answers.

🏁 All 22 TPC-H queries at scale factor 10: **3.15 s** (DuckDB 5.08 s, Polars 14.40 s; v0.6.0, `docs/bench/m2s-engine.csv`).
Honestly, Q21 carries that lead, and DuckDB is still faster on 12 of the 22. [Every query →](https://abhisheksreesaila.github.io/omxcore/benchmarks.html)

## 🚀 Try it

```sh
mx sql "SELECT region, sum(revenue) AS revenue FROM 'orders.csv' GROUP BY region"   # JSON out, no Python
```

```sh
pip install "mxframe[runtime,sql]"   # the Python package (0.6.0 imports as mxframe)
```

Build `mx` from source with [pixi](https://pixi.sh): `pixi install && pixi run bash scripts/build_mx.sh` → `build/mx`.

## 📚 Read on

- 🌐 [The cover](https://omxlabs.tech/omxcore/) · ▶ [the slides](https://omxlabs.tech/omxcore/deck.html)
- 📊 [Benchmarks, query by query](https://abhisheksreesaila.github.io/omxcore/benchmarks.html) · ⚡ [the engine and its gaps](https://abhisheksreesaila.github.io/omxcore/engine.html)
- 📘 [Reference: install and the Python API](docs/reference.md) · 🔥 [the Mojo API](docs/omxcore-mojo-api.md)
- 🧭 [How AUTO picks CPU or GPU](https://abhisheksreesaila.github.io/omxcore/auto-mode.html) · 🧱 [STABLE.md](STABLE.md) for app builders

---

<div align="center">Apache-2.0 · built in Mojo by <a href="https://omxlabs.tech">omxlabs</a></div>
