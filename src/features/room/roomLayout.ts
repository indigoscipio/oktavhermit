import type { RoomObjectId } from "../../domain/types";

export type RoomSpriteBox = {
  x: number;
  y: number;
  size: number;
  z?: number;
  flipX?: boolean;
};

export type RoomHotspotBox = {
  x: number;
  y: number;
  w: number;
  h: number;
  z?: number;
};

export type RoomHintOffset = {
  x?: number;
  y?: number;
};

export type RoomObjectLayout = {
  id: RoomObjectId;
  sprite: RoomSpriteBox;
  hotspot?: RoomHotspotBox;
  hint?: RoomHintOffset;
};

export const SHOW_HOTSPOTS = false;

export const ROOM_LAYOUT: RoomObjectLayout[] = [
  { id: "window", sprite: { x: 70, y: 33, z: 2, size: 30, flipX: true}, hotspot: { x: 70, y: 33, z: 10, w: 17, h: 25 }, hint: { x: 0, y: 5 } },
  { id: "shelf", sprite: { x: 22, y: 58, z: 1, size: 40, flipX: true }, hotspot: { x: 22, y: 58, z: 10, w: 20, h: 25 }, hint: { x: 0, y: 10 } },
  { id: "door", sprite: { x: 65, y: 70, z: 2, size: 50, flipX: true }, hotspot: { x: 65, y: 70, z: 10, w: 15, h: 32}, hint: { x: 0, y: 25 } },
  { id: "bed", sprite: { x: 47, y: 50, z: 1, size: 40 }, hotspot: { x: 47, y: 50, z: 10, w: 30, h: 25 }, hint: { x: 0, y: 0 } },
  { id: "cup", sprite: { x: 35, y: 75, z: 3, size: 30 }, hotspot: { x: 35, y: 75, z: 10, w: 20, h:20 }, hint: { x: 0, y: 0 } },
  { id: "sink", sprite: { x: 80, y: 63, z: 2, size: 30 }, hotspot: { x: 80, y: 63, z: 10, w: 15, h:20 }, hint: { x: 0, y: 0 }},
  { id: "food", sprite: { x: 67, y: 57, z: 2, size: 32 }, hotspot: { x: 67, y: 53, z: 10, w: 20, h: 15 }, hint: { x: 0, y: 0 } },
  { id: "floor", sprite: { x: 56, y: 70, z: 1, size: 35 }, hotspot: { x: 56, y: 70, z: 10, w: 25, h: 16 }, hint: { x: 0, y: 0 } },
];

export const AVATAR_LAYOUT = { x: 50, y: 35, z: 5, size: 40 };

export const ROOM_VIEW = {
  zoom: 1.2,
  offsetX: 0,
  offsetY: 0,
};

export function getRoomObjectLayout(
  id: RoomObjectId,
): RoomObjectLayout | undefined {
  return ROOM_LAYOUT.find((layout) => layout.id === id);
}

export function getRoomObjectHotspot(layout: RoomObjectLayout): RoomHotspotBox {
  const { x, y, z, size } = layout.sprite;

  return layout.hotspot ?? { x, y, z, w: size, h: size };
}
