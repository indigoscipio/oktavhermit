import type { SVGProps } from "react";
import {
  Check,
  ChevronDown,
  Close,
  CloudSun,
  Coffee,
  Download,
  Heart,
  Home,
  Moon,
  Play,
  Settings2,
  ShoppingBag,
  Sparkles,
  Trash,
  Tree,
} from "pixelarticons/react";

export type IconName =
  | "room"
  | "care"
  | "settings"
  | "water"
  | "food"
  | "light"
  | "movement"
  | "hygiene"
  | "rest"
  | "outside"
  | "export"
  | "delete"
  | "done"
  | "chevronDown"
  | "close";

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number;
};

const iconMap = {
  room: Home,
  care: Heart,
  settings: Settings2,
  water: Coffee,
  food: ShoppingBag,
  light: CloudSun,
  movement: Play,
  hygiene: Sparkles,
  rest: Moon,
  outside: Tree,
  export: Download,
  delete: Trash,
  done: Check,
  chevronDown: ChevronDown,
  close: Close,
};

export function Icon({ name, size = 24, className = "", ...props }: IconProps) {
  const Component = iconMap[name];

  return <Component aria-hidden="true" className={className} width={size} height={size} {...props} />;
}
