export type OutsideGift = {
  name: string;
  line: string;
};

export const OUTSIDE_GIFTS: OutsideGift[] = [
  { name: "Pocket stone", line: "A small weight to keep you here." },
  { name: "Tiny lantern", line: "A little glow for the next few steps." },
  { name: "Lucky coin", line: "Something quiet to hold onto." },
  { name: "Water bottle", line: "A sip can make the world softer." },
  { name: "Warm scarf", line: "A small wrap of room warmth." },
  { name: "House key", line: "Your room is still yours." },
  { name: "Mint candy", line: "A tiny cool breath for outside air." },
  { name: "Paper charm", line: "A soft note from your small world." },
  { name: "Little star", line: "A small light for your pocket." },
  { name: "Umbrella", line: "Just in case the sky feels loud." },
];

export function getRandomOutsideGift(): OutsideGift {
  return OUTSIDE_GIFTS[Math.floor(Math.random() * OUTSIDE_GIFTS.length)] ?? OUTSIDE_GIFTS[0];
}
