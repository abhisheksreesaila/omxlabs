# omxcode cover and deck: prints the two-lane diagram and the frame strips (ticks from the measured frame counts in
# mojo-ui-omxcode docs/ui-threads.md) as JSON {lanes, strips}; paste them into omxcode/index.html and omxcode/deck.html.
import json, sys
def lanes():
    g = lambda r, c: f'style="grid-row:{r};grid-column:{c}"'
    return f'''<div class="lanes">
  <span class="ln" {g(1,1)}>UI thread<small>16 ms a frame at 60 Hz</small></span>
  <span class="c" {g(1,2)}>input<small>a tap, a key</small></span><i class="to" {g(1,3)}></i>
  <span class="c hot" {g(1,4)}><code>update()</code><small>changes state</small></span><i class="to" {g(1,5)}></i>
  <span class="c" {g(1,6)}><code>view()</code><small>describes the screen</small></span><i class="to" {g(1,7)}></i>
  <span class="c" {g(1,8)}>diff<small>old vs new</small></span><i class="to" {g(1,9)}></i>
  <span class="c" {g(1,10)}>patch native widgets<small>only what changed</small></span>
  <i class="up" {g(2,4)}></i><span class="note" style="grid-row:2">update() starts the slow work and never waits for it</span>
  <span class="ln" {g(3,1)}>Worker threads<small>as long as it takes</small></span>
  <span class="c ev" {g(3,4)}>“done” event<small>back on the UI thread</small></span><i class="fro" {g(3,5)}></i>
  <span class="c wk" style="grid-row:3;grid-column:6 / -1">Slow work, each on its own thread<small>HTTP requests · timers · data jobs: query, import, sort</small></span>
</div>'''
def strip(cls, who, sub, n, gap_ms, res, ressub, label=None):
    T = 1500.0
    if n == 1:
        ticks = [0.6]; g0, g1 = 0.6, 100.0
    else:
        step = (T - gap_ms) / (n - 2) if n > 2 else T
        t, ticks = 10.0, []
        for k in range(n):
            ticks.append(t / T * 100)
            t += gap_ms if k == n // 2 else step
        g0, g1 = ticks[n // 2], ticks[n // 2 + 1]
    ts = "".join(f'<i style="left:{x:.2f}%"></i>' for x in ticks if x <= 99.7)
    lab = f'<span>{label}</span>' if label else ""
    return (f'<div class="fstrip {cls}"><span class="who">{who}<small>{sub}</small></span>'
            f'<div class="trk"><b class="gap" style="left:{g0:.2f}%;width:{g1 - g0:.2f}%">{lab}</b>{ts}</div>'
            f'<span class="res">{res}<small>{ressub}</small></span></div>')
def strips():
    return '<div class="fstrips">' + "".join([
        strip("bad", "Mac, before", "the job on the UI thread", 1, 0, "1 frame", "1,516–1,527 ms gap", "1.5 s without a frame: frozen"),
        strip("good", "Mac, after", "the job on its own thread", 33, 83, "28–38 frames", "longest gap 71–83 ms"),
        strip("good", "Linux", "the job on its own thread", 90, 17, "90 frames", "longest gap 17 ms"),
    ]) + '</div>'
print(json.dumps({"lanes": lanes(), "strips": strips()}))
