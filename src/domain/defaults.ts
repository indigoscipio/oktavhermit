import type { BocchiData, CareKind, CareUnit } from "./types";

export const STORAGE_KEY = "bocchi:v1";

export const CARE_KINDS: CareKind[] = [
  "water",
  "food",
  "light",
  "movement",
  "hygiene",
  "rest",
  "room",
  "outside",
];

export const DEFAULT_ENABLED_CARE_KINDS: CareKind[] = [...CARE_KINDS];

export const CARE_LABELS: Record<CareKind, string> = {
  water: "Water",
  food: "Food",
  light: "Light",
  movement: "Movement",
  hygiene: "Hygiene",
  rest: "Rest",
  room: "Room",
  outside: "Outside",
};

export const DEFAULT_CARE_VALUES: Record<CareKind, { value: number; unit: CareUnit }> = {
  water: { value: 1, unit: "cup" },
  food: { value: 1, unit: "count" },
  light: { value: 1, unit: "count" },
  movement: { value: 2, unit: "minute" },
  hygiene: { value: 1, unit: "count" },
  rest: { value: 1, unit: "count" },
  room: { value: 1, unit: "count" },
  outside: { value: 0, unit: "minute" },
};

export function createDefaultData(): BocchiData {
  return {
    version: 1,
    startedAt: new Date().toISOString(),
    settings: {
      hasCompletedOnboarding: false,
      enabledCareKinds: [...DEFAULT_ENABLED_CARE_KINDS],
      name: undefined,
    },
    careLogs: [],
    outsideSessions: [],
  };
}

export function isCareKind(value: unknown): value is CareKind {
  return typeof value === "string" && CARE_KINDS.includes(value as CareKind);
}

export function isCareUnit(value: unknown): value is CareUnit {
  return value === "cup" || value === "minute" || value === "hour" || value === "count";
}
