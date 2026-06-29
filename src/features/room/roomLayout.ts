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

export type RoomObjectLayout = {
  id: RoomObjectId;
  sprite: RoomSpriteBox;
  hotspot?: RoomHotspotBox;
};

export const SHOW_HOTSPOTS = true;

export const ROOM_LAYOUT: RoomObjectLayout[] = [
  { id: "window", sprite: { x: 70, y: 33, z: 2, size: 26, flipX: true} },
  { id: "shelf", sprite: { x: 25, y: 55, z: 2, size: 40, flipX: true } },
  { id: "door", sprite: { x: 70, y: 68, z: 2, size: 50, flipX: true }, hotspot: { x: 80, y: 43, z: 10, w: 10, h: 10 } },
  { id: "bed", sprite: { x: 47, y: 50, z: 1, size: 40 }, hotspot: { x: 66, y: 64, z: 10, w: 10, h: 10 } },
  { id: "cup", sprite: { x: 43, y: 55, z: 6, size: 25 }, hotspot: { x: 43, y: 55, z: 10, w: 10, h:10 } },
  { id: "sink", sprite: { x: 22, y: 63, z: 4, size: 25 } },
  { id: "food", sprite: { x: 31, y: 77, z: 5, size: 21 }, hotspot: { x: 31, y: 77, z: 10, w: 10, h: 10 } },
  { id: "floor", sprite: { x: 53, y: 80, z: 3, size: 31 }, hotspot: { x: 53, y: 80, z: 10, w: 10, h: 10 } },
];

export const AVATAR_LAYOUT = { x: 50, y: 35, z: 5, size: 40 };

export const ROOM_VIEW = {
  zoom: 1,
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
