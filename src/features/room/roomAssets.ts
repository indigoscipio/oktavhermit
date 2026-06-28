import type { RoomObjectId } from "../../domain/types";

export type RoomAssetId = RoomObjectId | "room-shell" | "avatar";

export type RoomAssetMap = Partial<Record<RoomAssetId, string>>;

export const ROOM_ASSETS: RoomAssetMap & { "avatar-female": string } = {
  "room-shell": "/assets/room-shell.webp",
  bed: "/assets/bed.webp",
  door: "/assets/door.webp",
  sink: "/assets/sink.webp",
  window: "/assets/window.webp",
  shelf: "/assets/shelf.webp",
  cup: "/assets/table-and-cup.webp",
  food: "/assets/table-and-food-bowl.webp",
  floor: "/assets/floor-mat.webp",
  avatar: "/assets/avatar-male.webp",
  "avatar-female": "/assets/avatar-female.webp",
};

export const DEFAULT_ROOM_ASSETS: RoomAssetMap = ROOM_ASSETS;
