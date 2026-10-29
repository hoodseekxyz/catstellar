import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { frames } from "@/data/mission";

const LOG_KEY = "catstellar-log";
const SIGN_KEY = "catstellar-callsign";

export function Logbook() {
  const [filed, setFiled] = useState<string[]>([]);
  const [sign, setSign] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOG_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) {
          setFiled(parsed.filter((item) => typeof item === "string"));
        }
      }
      const stored = localStorage.getItem(SIGN_KEY);
      if (stored) setSign(stored);
    } catch {
      /* storage optional */
    }
  }, []);

  function toggle(id: string) {
    setFiled((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem(LOG_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  function saveSign(value: string) {
    const next = value.slice(0, 16);
    setSign(next);
    try {
      localStorage.setItem(SIGN_KEY, next);
    } catch {
      /* ignore */
    }
  }

  return (
    <section id="log" className="border-t border-line bg-panel">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-xs tracking-widest text-gold uppercase">Log</p>
            <h2 className="mt-3 font-display text-4xl leading-tight font-medium italic sm:text-6xl">
              File the stills.
            </h2>
            <p className="mt-4 text-mist">
              Eleven frames. Tap one to file it. It stays in this browser. It
              does not pay you, rank you, or move a price.
            </p>
            <label className="mt-8 block">
              <span className="text-xs tracking-widest text-mist uppercase">Call sign</span>
              <input
                value={sign}
                maxLength={16}
                onChange={(event) => saveSign(event.target.value)}
                placeholder="Unnamed suit"
                autoComplete="off"
                className="mt-2 w-full border-b border-line bg-transparent py-3 font-display text-3xl text-cream italic outline-none placeholder:text-mist focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
              />
            </label>
            <p className="mt-6 font-display text-3xl tabular-nums italic">
              {filed.length}
              <span className="text-lg text-mist"> / {frames.length} filed</span>
            </p>
            <p className="mt-2 text-sm text-mist">
              {sign.trim()
                ? `${sign.trim()} is on the sheet.`
                : "No call sign yet. The water does not require one."}
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-7">
            {frames.map((frame) => {
              const on = filed.includes(frame.id);
              return (
                <li key={frame.id}>
                  <button
                    type="button"
                    onClick={() => toggle(frame.id)}
                    aria-pressed={on}
                    className="w-full text-left"
                  >
                    <span className="relative block overflow-hidden">
                      <img
                        src={frame.still}
                        alt=""
                        className={
                          on
                            ? "aspect-3/4 w-full object-cover"
                            : "aspect-3/4 w-full object-cover opacity-55"
                        }
                        loading="lazy"
                      />
                      {on ? (
                        <Check
                          className="absolute top-2 right-2 size-5 text-gold"
                          aria-hidden="true"
                        />
                      ) : null}
                    </span>
                    <span className="mt-2 block text-xs tracking-widest text-mist">{frame.slate}</span>
                    <span className="block font-display text-lg italic">{frame.title}</span>
                    <span className="sr-only">{frame.alt}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
