import type { CSSProperties } from "react";
import type { RoomObjectConfig, RoomObjectState } from "../../domain/types";
import { getRoomObjectHotspot, type RoomObjectLayout } from "./roomLayout";

type RoomHotspotProps = {
  object: RoomObjectConfig;
  layout: RoomObjectLayout;
  state: RoomObjectState["state"];
  onClick: () => void;
};

const stateText: Record<RoomObjectState["state"], string> = {
  calm: "calm",
  needs_care: "not yet",
  done: "done",
  active: "active",
};

type RoomHotspotStyle = CSSProperties & {
  "--room-hotspot-x": string;
  "--room-hotspot-y": string;
  "--room-hotspot-width": string;
  "--room-hotspot-height": string;
};

export function RoomHotspot({ object, layout, state, onClick }: RoomHotspotProps) {
  const hotspot = getRoomObjectHotspot(layout);
  const style: RoomHotspotStyle = {
    "--room-hotspot-x": `${hotspot.x}%`,
    "--room-hotspot-y": `${hotspot.y}%`,
    "--room-hotspot-width": `${hotspot.w}%`,
    "--room-hotspot-height": `${hotspot.h}%`,
    zIndex: hotspot.z ?? layout.sprite.z ?? 1,
  };

  return (
    <button
      type="button"
      className={`room-hotspot room-hotspot--${object.id} focus-ring`}
      style={style}
      data-state={state}
      onClick={onClick}
      aria-label={`${object.label}. ${object.prompt} Current state: ${stateText[state]}.`}
    >
      <span className="sr-only">{object.label}</span>
      <span className="room-hotspot-debug-label" aria-hidden="true">{object.id}</span>
    </button>
  );
}
