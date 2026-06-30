import type { AssetIconName } from "../../ui/AssetIcon";

export type OutsideGift = {
  name: string;
  line: string;
  icon: AssetIconName;
};

export const OUTSIDE_GIFTS: OutsideGift[] = [
  { name: "Tiny Lantern", line: "A little glow for the next few steps.", icon: "lantern" },
  { name: "Pocket Stone", line: "A smol weight to keep you here.", icon: "stone" },
  { name: "Soft Leaf", line: "Proof that outside can be gentle.", icon: "leaf" },
  { name: "Found Feather", line: "A quiet thing from a quiet bird.", icon: "feather" },
  { name: "Tiny Branch", line: "A stick with main character energy.", icon: "branch" },
  { name: "Daifuku", line: "Emergency soft snack. Very important.", icon: "daifuku" },
  { name: "Slow Snail", line: "No rush. The snail gets it.", icon: "snail" },
  { name: "Hand Mirror", line: "A tiny check-in for your face.", icon: "hand-mirror" },
  { name: "Acorn", line: "A pocket-sized little world.", icon: "acorn" },
  { name: "Pressed Flower", line: "A smol nice thing survived.", icon: "flower" },
  { name: "Tiny Book", line: "A few pages of portable room.", icon: "book" },
  { name: "Polite Bug", line: "It is also just trying its best.", icon: "bug" },
  { name: "Cigarette Pack", line: "A weird little sidewalk artifact.", icon: "cigarette-pack" },
  { name: "Paper Airplane", line: "A folded wish for a short trip.", icon: "paper-airplane" },
  { name: "Old Computer", line: "A tiny offline companion.", icon: "old-computer" },
];

export function getRandomOutsideGift(): OutsideGift {
  return OUTSIDE_GIFTS[Math.floor(Math.random() * OUTSIDE_GIFTS.length)] ?? OUTSIDE_GIFTS[0];
}
