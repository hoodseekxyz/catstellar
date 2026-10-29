export const links = {
  x: "https://x.com/catstellarX",
  site: "https://catstellar.xyz",
  pons: "https://docs.ponsfamily.com/v2",
  github: "https://github.com/hoodseekxyz",
} as const;

export const chain = {
  name: "Robinhood Chain",
  id: "4663",
  venue: "Pons v2",
  pool: "Uniswap v4",
} as const;

/** Illustrative only. Not the on-chain Pons formula and not a quote. */
export function illustrativePrice(fill01: number): number {
  const t = Math.min(0.99, Math.max(0, fill01));
  return 0.000084 * Math.pow(1 / (1 - t * 0.92), 1.8);
}

export function curveSeries() {
  const points: { fill: number; price: number }[] = [];
  for (let fill = 0; fill <= 100; fill += 2) {
    points.push({ fill, price: illustrativePrice(fill / 100) });
  }
  return points;
}

export function formatPicture(n: number): string {
  if (n >= 1) return n.toFixed(2);
  if (n >= 0.01) return n.toFixed(4);
  return n.toFixed(6);
}

export type CrewMember = {
  id: string;
  call: string;
  role: string;
  still: string;
  alt: string;
  line: string;
};

export const crew: CrewMember[] = [
  {
    id: "cooper",
    call: "Cooper",
    role: "Command",
    still: "/stills/cooper.jpg",
    alt: "An orange-and-white kitten in a snow-dusted suit, walking a ridge.",
    line: "Walks into weather and calls it a commute. The patch says Cooper. The chain will not care what the patch says.",
  },
  {
    id: "brand",
    call: "Brand",
    role: "Navigation",
    still: "/stills/bridge.jpg",
    alt: "Three suited kittens at a metal table inside a ship, one pointing.",
    line: "Points at the table until the room picks a heading. On a curve, heading is just price moving.",
  },
  {
    id: "doyle",
    call: "Doyle",
    role: "Systems",
    still: "/stills/archive.jpg",
    alt: "A tabby in a worn helmet, paw on a dark library shelf.",
    line: "Reads the shelf before the speech. Systems asks one question: who holds the liquidity, and does it unlock.",
  },
  {
    id: "flare",
    call: "Flare",
    role: "Recovery",
    still: "/stills/flare.jpg",
    alt: "A kitten in a visor grips an orange case while waves break over a raft.",
    line: "Orange box. Open mouth. A beacon is a location, not a guarantee that anyone is coming.",
  },
  {
    id: "vector",
    call: "Vector",
    role: "Pilot",
    still: "/stills/vector.jpg",
    alt: "A tabby in a flight suit reaches toward the camera through a shaft of city light.",
    line: "City lights stacked like a runway stood on end. Velocity is not the same thing as a plan.",
  },
];

export type Chapter = {
  slate: string;
  title: string;
  still: string;
  alt: string;
  body: string;
};

export const chapters: Chapter[] = [
  {
    slate: "01",
    title: "Before the visor",
    still: "/stills/before.jpg",
    alt: "Two kittens in jackets beside a dusty truck on a dirt road at dusk.",
    body: "A dirty truck, a corn row, no patches yet. Every launch starts smaller than the poster. The costume comes later. The habit of looking at each other comes first.",
  },
  {
    slate: "02",
    title: "Splashdown",
    still: "/stills/shore.jpg",
    alt: "A suited cat stands in the sea at sunset, another figure and a hull farther out, the Milky Way above.",
    body: "Sunset on the left. A hull on the right. Two of them already in the drink. A strange place to call a runway, and the only one this reel has.",
  },
  {
    slate: "03",
    title: "The wall",
    still: "/stills/wall.jpg",
    alt: "A small suited kitten in the water faces a towering wave under a warm sky.",
    body: "Some of the work is standing in it. The wave does not negotiate. A curve does not either, once you have bought it.",
  },
  {
    slate: "04",
    title: "The ridge",
    still: "/stills/ascent.jpg",
    alt: "Four kittens in white packs climb a pale, broken mountain at golden hour.",
    body: "After the water, rock. Four packs. Nobody carried a promise up that ridge. They carried the walk.",
  },
];

export type Frame = {
  id: string;
  slate: string;
  title: string;
  still: string;
  alt: string;
};

export const frames: Frame[] = [
  { id: "splash", slate: "01", title: "Face the water", still: "/stills/splash.jpg", alt: "A kitten in a white suit stands in the sea, a dark craft behind." },
  { id: "shore", slate: "02", title: "Watch the hull", still: "/stills/shore.jpg", alt: "A suited cat from behind, sunset and a wrecked craft on the horizon." },
  { id: "formation", slate: "03", title: "Hold formation", still: "/stills/formation.jpg", alt: "Three suited kittens wade, a ship between them under a split sky." },
  { id: "wall", slate: "04", title: "Meet the wall", still: "/stills/wall.jpg", alt: "A kitten faces an enormous breaking wave." },
  { id: "flare", slate: "05", title: "Keep the box", still: "/stills/flare.jpg", alt: "A kitten holds an orange case in rough water." },
  { id: "bridge", slate: "06", title: "Point at the table", still: "/stills/bridge.jpg", alt: "Three crew at a planning table inside a ship." },
  { id: "archive", slate: "07", title: "Read the shelf", still: "/stills/archive.jpg", alt: "A tabby astronaut reaches for a book." },
  { id: "vector", slate: "08", title: "Take the shaft", still: "/stills/vector.jpg", alt: "A flying tabby reaches through vertical city light." },
  { id: "cooper", slate: "09", title: "Walk the weather", still: "/stills/cooper.jpg", alt: "Cooper walks a snowy ridge." },
  { id: "ascent", slate: "10", title: "Climb anyway", still: "/stills/ascent.jpg", alt: "Four cats climb a mountain in suits." },
  { id: "before", slate: "11", title: "Remember the truck", still: "/stills/before.jpg", alt: "Two kittens in jackets by a truck." },
];

export const preflight = [
  { id: "desk", label: "This desk does not trade. Nothing here moves a token." },
  { id: "grad", label: "Liquidity locks only if the curve actually graduates." },
  { id: "ca", label: "The contract address is the name. A ticker can be copied by anyone." },
  { id: "tax", label: "A creator tax, if one is set, is fixed at launch and does not grow later." },
] as const;

export const facts: { term: string; detail: string }[] = [
  { term: "Venue", detail: "Pons v2. The public buys a bonding curve. Pons never holds the wallet." },
  { term: "Chain", detail: "Robinhood Chain, id 4663." },
  { term: "After the curve", detail: "Sell-out graduates into a Uniswap v4 pool. Reserved tokens and collected funds seed it." },
  { term: "Lock", detail: "That liquidity is locked. A picture of a lock on a website is not the lock. The pool is." },
  { term: "Open", detail: "Early buys can meet a snipe tax near 99%, decaying to zero in about five seconds." },
  { term: "Fees", detail: "A trading fee can split across protocol, buyback, and creator. Buybacks, if used, vest over years." },
];
