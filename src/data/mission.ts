export const links = {
  x: "https://x.com/catstellarX",
  site: "https://catstellar.xyz",
} as const;

/** Paste the long.xyz token address here. Nothing else. */
export const contracts: {
  token: string | null;
  explorer: string;
} = {
  token: "0x5CD18C07B920e5D3aE1ff9C12cEDD6A155421E18",
  explorer: "https://robin.etherscan.io/address/",
};

export const chain = {
  name: "Robinhood Chain",
  id: "4663",
  venue: "long.xyz",
} as const;

/** Illustrative only. Not a quote and not the launch. */
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
    line: "Walks into the weather and calls it a commute. The patch says Cooper. The chain cannot read patches.",
  },
  {
    id: "brand",
    call: "Brand",
    role: "Navigation",
    still: "/stills/bridge.jpg",
    alt: "Three suited kittens at a metal table inside a ship, one pointing.",
    line: "Points at the table until the room picks a heading. On a curve, heading is just the price moving. She points anyway.",
  },
  {
    id: "doyle",
    call: "Doyle",
    role: "Systems",
    still: "/stills/archive.jpg",
    alt: "A tabby in a worn helmet, paw on a dark library shelf.",
    line: "Reads the shelf before the speech. Then the only grown-up question: who holds the liquidity, and does it unlock.",
  },
  {
    id: "flare",
    call: "Flare",
    role: "Recovery",
    still: "/stills/flare.jpg",
    alt: "A kitten in a visor grips an orange case while waves break over a raft.",
    line: "Orange box. Mouth open. The beacon says where we are. It does not promise a rescue. The box stays anyway.",
  },
  {
    id: "vector",
    call: "Vector",
    role: "Pilot",
    still: "/stills/vector.jpg",
    alt: "A tabby in a flight suit reaches toward the camera through a shaft of city light.",
    line: "Paws out. The city is a runway stood on end. Fast is not a plan. The cat has not heard this.",
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
    title: "The truck",
    still: "/stills/before.jpg",
    alt: "Two kittens in jackets beside a dusty truck on a dirt road at dusk.",
    body: "Corn, dust, two jackets, no patches yet. Every meme starts smaller than the poster. The costume comes later. The truck stays in the shot.",
  },
  {
    slate: "02",
    title: "Splashdown",
    still: "/stills/shore.jpg",
    alt: "A suited cat stands in the sea at sunset, another figure and a hull farther out, the Milky Way above.",
    body: "They needed a runway. They got an ocean. Two suits already in the drink, a hull on the horizon. Strange planet. Correct meme.",
  },
  {
    slate: "03",
    title: "The wall",
    still: "/stills/wall.jpg",
    alt: "A small suited kitten in the water faces a towering wave under a warm sky.",
    body: "The wave does not negotiate. A curve does not either, once you have bought it. Stand in it or don't. The water has no opinion.",
  },
  {
    slate: "04",
    title: "The ridge",
    still: "/stills/ascent.jpg",
    alt: "Four kittens in white packs climb a pale, broken mountain at golden hour.",
    body: "After the drink, rock. Four packs. Nobody carried a promise up that ridge. They carried the walk, and somehow the box.",
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
  { id: "desk", label: "This desk does not trade. The kitten cannot touch your wallet." },
  { id: "grad", label: "A lock drawn on a website is not a lock. Read the pool, not the poster." },
  { id: "ca", label: "The address is the name. A ticker is a costume anyone can sew." },
  { id: "tax", label: "This page will not invent a tax. Read the launch, not the reel." },
] as const;

export const facts: { term: string; detail: string }[] = [
  { term: "Venue", detail: "long.xyz. This website does not launch the token and does not hold a wallet." },
  { term: "Chain", detail: "Robinhood Chain, id 4663." },
  { term: "Address", detail: "Not on this page. When the launch is real, the line lands on X." },
  { term: "Desk", detail: "The chart is a drawing. It does not quote, trade, or open a pool." },
  { term: "Name", detail: "The contract address is the name. A ticker can be copied by anyone." },
  { term: "Suit", detail: "The film stays in the theater. The box stays here." },
];
