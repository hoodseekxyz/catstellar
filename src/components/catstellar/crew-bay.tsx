import { useState } from "react";
import type { CrewMember } from "@/data/mission";

export function CrewBay({ crew }: { crew: CrewMember[] }) {
  const [active, setActive] = useState(0);
  const member = crew[active] ?? crew[0];
  if (!member) return null;

  return (
    <section id="crew" className="border-t border-line bg-panel">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-20 sm:py-28 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="text-xs tracking-widest text-gold uppercase">Crew</p>
          <h2 className="mt-3 font-display text-4xl leading-tight font-medium italic sm:text-6xl">
            Five suits. The box stays.
          </h2>
          <p className="mt-4 text-mist">
            Call signs are folklore stitched onto fabric. Pick one. The still
            changes. The chain does not.
          </p>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {crew.map((person, index) => {
              const on = index === active;
              return (
                <li key={person.id}>
                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    aria-pressed={on}
                    className="flex min-h-11 w-full items-baseline justify-between gap-4 py-4 text-left"
                  >
                    <span className={on ? "font-display text-2xl italic text-cream" : "font-display text-2xl italic text-mist"}>
                      {person.call}
                    </span>
                    <span className="text-xs tracking-widest text-mist uppercase">{person.role}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <figure className="lg:col-span-7">
          <div className="overflow-hidden">
            <img
              key={member.id}
              src={member.still}
              alt={member.alt}
              className="aspect-3/4 w-full object-cover sm:aspect-4/3"
            />
          </div>
          <figcaption className="mt-4 grid gap-2 sm:grid-cols-12">
            <p className="text-xs tracking-widest text-gold uppercase sm:col-span-3">
              {member.role}
            </p>
            <p className="text-cream sm:col-span-9">{member.line}</p>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
