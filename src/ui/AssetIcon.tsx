import type { ImgHTMLAttributes } from "react";
import type { CareKind } from "../domain/types";

export type AssetIconName =
  | "acorn"
  | "book"
  | "branch"
  | "bug"
  | "cigarette-pack"
  | "daifuku"
  | "donut"
  | "feather"
  | "flower"
  | "gear"
  | "hand-mirror"
  | "heart"
  | "house"
  | "lantern"
  | "leaf"
  | "lock"
  | "old-computer"
  | "paper-airplane"
  | "plant"
  | "shoe"
  | "shower"
  | "sleep"
  | "snail"
  | "stone"
  | "sun"
  | "tree"
  | "water";

type AssetIconStyle = "linear-color" | "line";

type AssetIconProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "width" | "height"> & {
  name: AssetIconName;
  style?: AssetIconStyle;
  size?: number;
};

export const careIconMap: Record<CareKind, AssetIconName> = {
  water: "water",
  food: "donut",
  light: "sun",
  movement: "shoe",
  hygiene: "shower",
  rest: "sleep",
  room: "plant",
  outside: "tree",
};

export function AssetIcon({ name, style = "linear-color", size = 32, className = "", alt = "", ...props }: AssetIconProps) {
  return (
    <img
      src={`/assets/icons/${style}/${name}.svg`}
      width={size}
      height={size}
      alt={alt}
      className={`pixel-icon ${className}`}
      {...props}
    />
  );
}
