import { ArrowUpRight } from "lucide-react";
import { chapters, crew, links } from "@/data/mission";
import { CurveDesk } from "@/components/catstellar/curve-desk";
import { CrewBay } from "@/components/catstellar/crew-bay";
import { Logbook } from "@/components/catstellar/logbook";

const nav = [
  { href: "#mission", label: "Mission" },
  { href: "#crew", label: "Crew" },
  { href: "#curve", label: "Curve" },
  { href: "#log", label: "Log" },
];

export function Site() {
  return (
    <div className="overflow-x-clip bg-ink text-cream">
      <div className="flex min-h-dvh flex-col">
        <header className="sticky top-0 z-30 shrink-0 border-b border-line bg-ink/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
            <a href="#top" className="font-display text-xl italic leading-none">
              Catstellar
            </a>
            <nav className="flex items-center gap-4 overflow-x-auto text-sm text-mist">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="shrink-0 py-2 text-cream hover:text-gold"
                >
                  {item.label}
                </a>
              ))}
              <a
                href={links.x}
                className="inline-flex shrink-0 items-center gap-1 py-2 text-gold hover:text-cream"
              >
                X
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </nav>
          </div>
        </header>
        <Hero />
      </div>

      <main>
        <Mission />
        <CrewBay crew={crew} />
        <BreakStill />
        <CurveDesk />
        <Logbook />
        <Close />
      </main>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="relative flex min-h-0 flex-1 flex-col">
      <img
        src="/stills/splash.jpg"
        alt="An orange-and-white kitten in a white suit stands in open water at sunset, a dark craft behind."
        className="still-drift absolute inset-0 h-full w-full object-cover object-center"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/50 to-ink/20" />
      <div className="relative flex flex-1 flex-col justify-end px-5 pt-10 pb-10 sm:pb-14">
        <div className="mx-auto grid w-full max-w-6xl items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="text-xs tracking-widest text-gold uppercase">Reel 01 · Splashdown</p>
            <h1 className="mt-3 font-display text-6xl leading-none font-medium italic sm:text-8xl lg:text-9xl">
              Catstellar
            </h1>
            <p className="mt-5 max-w-xl text-lg text-cream sm:text-xl">
              Nine lives. One curve. A litter came down in open water on Robinhood Chain.
              The suits are costume. The curve is the mechanism.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#curve"
                className="inline-flex min-h-11 items-center bg-gold px-5 py-3 text-sm font-medium text-ink"
              >
                Read the curve
              </a>
              <a
                href={links.x}
                className="inline-flex min-h-11 items-center gap-2 border border-cream/40 px-5 py-3 text-sm text-cream"
              >
                @catstellarX
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>
          <ol className="hidden gap-3 text-sm lg:col-span-4 lg:grid lg:justify-self-end">
            {[
              ["01", "Mission", "How they got in the water"],
              ["02", "Crew", "Five call signs, no ranks that pay"],
              ["03", "Curve", "A drawing of the Pons path"],
              ["04", "Log", "File the stills on this device"],
            ].map(([n, title, note]) => (
              <li key={n} className="border-t border-cream/25 pt-3">
                <p className="text-xs tracking-widest text-gold">{n}</p>
                <p className="font-display text-2xl italic">{title}</p>
                <p className="text-mist">{note}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Mission() {
  return (
    <section id="mission" className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
      <div className="max-w-2xl">
        <p className="text-xs tracking-widest text-gold uppercase">Mission</p>
        <h2 className="mt-3 font-display text-4xl leading-tight font-medium italic sm:text-6xl">
          The picture is the lure.
        </h2>
        <p className="mt-5 text-lg text-mist">
          The contract is the only name that cannot be faked. Until that address
          is posted, Catstellar is a reel — on Robinhood Chain, through Pons,
          and nowhere else that matters.
        </p>
      </div>
      <div className="mt-16 grid gap-20">
        {chapters.map((chapter, index) => (
          <article
            key={chapter.slate}
            className="grid items-center gap-6 md:grid-cols-12 md:gap-10"
          >
            <figure
              className={
                index % 2 === 1
                  ? "md:col-span-7 md:col-start-6 md:row-start-1"
                  : "md:col-span-7"
              }
            >
              <div className="overflow-hidden">
                <img
                  src={chapter.still}
                  alt={chapter.alt}
                  className="aspect-3/4 w-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:hover:scale-105 sm:aspect-video md:aspect-3/4"
                  loading="lazy"
                />
              </div>
            </figure>
            <div
              className={
                index % 2 === 1
                  ? "md:col-span-5 md:col-start-1 md:row-start-1"
                  : "md:col-span-5"
              }
            >
              <p className="text-xs tracking-widest text-mist">{chapter.slate}</p>
              <h3 className="mt-2 font-display text-3xl italic sm:text-4xl">{chapter.title}</h3>
              <p className="mt-4 text-mist">{chapter.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function BreakStill() {
  return (
    <figure className="relative aspect-3/4 overflow-hidden sm:aspect-video">
      <img
        src="/stills/vector.jpg"
        alt="A tabby in a flight suit reaches forward through a vertical shaft of city light."
        className="still-drift absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink to-transparent px-5 pt-24 pb-8">
        <div className="mx-auto flex max-w-6xl items-end justify-between gap-6">
          <div>
            <p className="text-xs tracking-widest text-gold uppercase">Reel 06 · Vector</p>
            <p className="mt-2 max-w-md font-display text-3xl italic sm:text-4xl">
              Paws out. Price is not a direction.
            </p>
          </div>
        </div>
      </figcaption>
    </figure>
  );
}

function Close() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:grid-cols-12">
        <div className="sm:col-span-7">
          <p className="font-display text-4xl italic sm:text-5xl">Not a security.</p>
          <p className="mt-4 max-w-xl text-mist">
            Catstellar is a meme on a curve. No yield, no team allocation hiding
            in a vest you cannot see, no promise that the water goes down. Art
            is the project. The chain is the receipt.
          </p>
        </div>
        <ul className="space-y-3 text-sm sm:col-span-5 sm:justify-self-end">
          <li>
            <a className="inline-flex items-center gap-1 text-cream hover:text-gold" href={links.x}>
              x.com/catstellarX
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </li>
          <li>
            <a className="inline-flex items-center gap-1 text-cream hover:text-gold" href={links.pons}>
              Pons v2 docs
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </li>
          <li className="text-mist">catstellar.xyz</li>
          <li className="text-mist">Robinhood Chain · 4663</li>
        </ul>
      </div>
    </footer>
  );
}
