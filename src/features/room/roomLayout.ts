import type { RoomObjectId } from "../../domain/types";

export type RoomBox = {
  x: number;
  y: number;
  w: number;
  h: number;
  z?: number;
};

export type RoomObjectLayout = {
  id: RoomObjectId;
  sprite: RoomBox;
  hotspot?: RoomBox;
};

export const SHOW_HOTSPOTS = false;

export const ROOM_LAYOUT: RoomObjectLayout[] = [
  { id: "window", sprite: { x: 24, y: 28, z: 2, w: 26, h: 24 } },
  { id: "shelf", sprite: { x: 58, y: 29, z: 2, w: 28, h: 17 } },
  { id: "door", sprite: { x: 80, y: 43, z: 2, w: 20, h: 36 }, hotspot: { x: 80, y: 43, z: 10, w: 16, h: 32 } },
  { id: "bed", sprite: { x: 66, y: 63, z: 4, w: 34, h: 25 }, hotspot: { x: 66, y: 64, z: 10, w: 28, h: 18 } },
  { id: "cup", sprite: { x: 43, y: 55, z: 6, w: 25, h: 22 }, hotspot: { x: 43, y: 55, z: 10, w: 28, h: 24 } },
  { id: "sink", sprite: { x: 22, y: 63, z: 4, w: 25, h: 26 } },
  { id: "food", sprite: { x: 31, y: 77, z: 5, w: 21, h: 16 }, hotspot: { x: 31, y: 77, z: 10, w: 24, h: 18 } },
  { id: "floor", sprite: { x: 53, y: 80, z: 3, w: 31, h: 18 }, hotspot: { x: 53, y: 80, z: 10, w: 34, h: 20 } },
];

export const AVATAR_LAYOUT = { x: 48, y: 70, z: 5, w: 12, h: 22 };

export const ROOM_VIEW = {
  zoom: 1.12,
  offsetX: 0,
  offsetY: -8,
};

export function getRoomObjectLayout(
  id: RoomObjectId,
): RoomObjectLayout | undefined {
  return ROOM_LAYOUT.find((layout) => layout.id === id);
}

export function getRoomObjectHotspot(layout: RoomObjectLayout): RoomBox {
  return layout.hotspot ?? layout.sprite;
}
