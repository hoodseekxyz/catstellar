import { useEffect, useMemo, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { Area, AreaChart, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  chain,
  curveSeries,
  facts,
  formatPicture,
  illustrativePrice,
  links,
  preflight,
} from "@/data/mission";

const PREFLIGHT_KEY = "catstellar-preflight";

export function CurveDesk() {
  const series = useMemo(() => curveSeries(), []);
  const [fill, setFill] = useState(28);
  const [mounted, setMounted] = useState(false);
  const [tax, setTax] = useState(99);
  const [running, setRunning] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(PREFLIGHT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) {
          setChecked(parsed.filter((item) => typeof item === "string"));
        }
      }
    } catch {
      /* a private window can refuse storage; the desk still works */
    }
  }, []);

  useEffect(() => {
    if (!running) return;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 5000);
      setTax(99 * (1 - p));
      if (p < 1) frame = requestAnimationFrame(tick);
      else setRunning(false);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  const snapped = Math.round(fill / 2) * 2;
  const open = illustrativePrice(0);
  const now = illustrativePrice(fill / 100);
  const multiple = now / open;
  const cleared = preflight.every((item) => checked.includes(item.id));

  function toggle(id: string) {
    setChecked((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem(PREFLIGHT_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  return (
    <section id="curve" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-xs tracking-widest text-gold uppercase">Curve desk</p>
            <h2 className="mt-3 font-display text-4xl leading-tight font-medium italic sm:text-6xl">
              The wormhole is a curve.
            </h2>
            <p className="mt-4 text-mist">
              The litter launches on {chain.venue}. This slider is a drawing of a
              line getting steeper. It is not a price, not a pool, and not a promise.
            </p>
            <dl className="mt-8 divide-y divide-line border-y border-line">
              {facts.map((fact) => (
                <div key={fact.term} className="grid gap-1 py-4 sm:grid-cols-12">
                  <dt className="text-xs tracking-widest text-gold uppercase sm:col-span-4">
                    {fact.term}
                  </dt>
                  <dd className="text-sm text-cream sm:col-span-8">{fact.detail}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="border border-line bg-panel p-5 sm:p-6 lg:col-span-7">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs tracking-widest text-mist uppercase">Illustrative multiple</p>
                <p className="mt-1 font-display text-5xl tabular-nums italic">
                  {multiple.toFixed(2)}
                  <span className="text-2xl text-mist">×</span>
                </p>
              </div>
              <p className="text-right text-sm text-mist">
                Picture units {formatPicture(now)}
                <span className="block">not a live price</span>
              </p>
            </div>

            <div className="mt-6 h-56 w-full">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={series} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
                    <XAxis dataKey="fill" hide />
                    <YAxis hide domain={["auto", "auto"]} />
                    <ReferenceLine x={snapped} stroke="var(--color-cream)" strokeDasharray="2 4" />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="var(--color-gold)"
                      strokeWidth={2}
                      fill="var(--color-gold)"
                      fillOpacity={0.16}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-end border-b border-line">
                  <p className="pb-3 text-sm text-mist">Drawing the curve…</p>
                </div>
              )}
            </div>

            <label className="mt-6 block">
              <span className="flex items-baseline justify-between text-sm">
                <span className="text-mist">Curve filled</span>
                <span className="tabular-nums text-cream">{fill}%</span>
              </span>
              <Slider.Root
                className="relative mt-3 flex h-11 w-full touch-none items-center select-none"
                value={[fill]}
                max={100}
                step={1}
                onValueChange={(value) => setFill(value[0] ?? 0)}
                aria-label="Illustrative curve fill"
              >
                <Slider.Track className="relative h-px grow bg-line">
                  <Slider.Range className="absolute h-full bg-gold" />
                </Slider.Track>
                <Slider.Thumb className="block size-4 bg-cream shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold" />
              </Slider.Root>
            </label>

            <p className="mt-2 text-sm text-mist" aria-live="polite">
              {fill >= 100
                ? "Far end of the drawing. The real pool is the one that opens with the launch. This page does not open it."
                : `${100 - fill}% of this drawing is still on the curve. Graduation is the far end, not a vibe.`}
            </p>

            <div className="mt-8 border-t border-line pt-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs tracking-widest text-mist uppercase">Snipe tax, replayed</p>
                  <p className="mt-1 font-display text-4xl tabular-nums italic">
                    {tax.toFixed(0)}
                    <span className="text-xl text-mist">%</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTax(99);
                    setRunning(true);
                  }}
                  disabled={running}
                  className="min-h-11 border border-line px-4 py-2 text-sm text-cream hover:border-gold disabled:text-mist"
                >
                  {running ? "Decaying…" : "Replay five seconds"}
                </button>
              </div>
              <div className="mt-4 h-px bg-line">
                <div className="h-px bg-gold" style={{ width: `${tax}%` }} />
              </div>
              <p className="mt-3 text-sm text-mist">
                A five-second hurry, replayed. A gag. Not the launch rule.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-8 border-t border-line pt-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-xs tracking-widest text-gold uppercase">Token</p>
            <p className="mt-3 font-display text-3xl italic sm:text-4xl">Address not on this page.</p>
            <p className="mt-3 text-mist">
              When the launch is real, the line lands on{" "}
              <a className="text-cream underline decoration-line underline-offset-4 hover:text-gold" href={links.x}>
                @catstellarX
              </a>
              . Until then, a ticker is a costume. Nothing here is the token.
            </p>
          </div>
          <fieldset className="lg:col-span-7">
            <legend className="text-xs tracking-widest text-mist uppercase">
              Preflight · optional · this device only
            </legend>
            <ul className="mt-4 space-y-3">
              {preflight.map((item) => {
                const on = checked.includes(item.id);
                return (
                  <li key={item.id}>
                    <label className="flex min-h-11 cursor-pointer items-start gap-3 text-sm">
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggle(item.id)}
                        className="mt-1 size-4 accent-gold"
                      />
                      <span className={on ? "text-cream" : "text-mist"}>{item.label}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
            <p className="mt-5 text-sm" aria-live="polite">
              {cleared ? (
                <a className="text-gold hover:text-cream" href={links.x}>
                  Cleared. Watch the curve on X. Still not a buy button.
                </a>
              ) : (
                <span className="text-mist">Four boxes. Then the only honest button is a link.</span>
              )}
            </p>
          </fieldset>
        </div>
      </div>
    </section>
  );
}
