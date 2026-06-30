import type { RoomObjectConfig } from "../../domain/types";

export const ROOM_OBJECTS: RoomObjectConfig[] = [
  { id: "cup", careKind: "water", label: "Cup", prompt: "Water first?" },
  { id: "window", careKind: "light", label: "Window", prompt: "Visit the window?" },
  { id: "food", careKind: "food", label: "Food", prompt: "Eat something smol?" },
  { id: "bed", careKind: "rest", label: "Bed", prompt: "Rest for a moment?" },
  { id: "floor", careKind: "movement", label: "Floor", prompt: "Stretch for 2 minutes?" },
  { id: "sink", careKind: "hygiene", label: "Sink", prompt: "Wash up?" },
  { id: "shelf", careKind: "room", label: "Shelf", prompt: "Clear one smol surface?" },
  { id: "door", careKind: "outside", label: "Door", prompt: "Step out for a moment?" },
];
