export type CareKind =
  | "water"
  | "food"
  | "light"
  | "movement"
  | "hygiene"
  | "rest"
  | "room"
  | "outside";

export type CareUnit = "cup" | "minute" | "hour" | "count";

export type CareLog = {
  id: string;
  kind: CareKind;
  createdAt: string;
  localDay: string;
  value?: number;
  unit?: CareUnit;
};

export type OutsideSession = {
  id: string;
  startedAt: string;
  endedAt?: string;
  durationMinutes?: number;
};

export type Settings = {
  hasCompletedOnboarding: boolean;
  enabledCareKinds: CareKind[];
  name?: string;
};

export type BocchiData = {
  version: 1;
  settings: Settings;
  careLogs: CareLog[];
  outsideSessions: OutsideSession[];
};

export type CareStatus = {
  kind: CareKind;
  isDoneToday: boolean;
  totalValueToday: number;
  lastLoggedAt?: string;
};

export type TodayStatus = CareStatus[];

export type RoomObjectId =
  | "cup"
  | "window"
  | "food"
  | "bed"
  | "floor"
  | "sink"
  | "shelf"
  | "door";

export type RoomObjectConfig = {
  id: RoomObjectId;
  careKind: CareKind;
  label: string;
  prompt: string;
};

export type RoomObjectState = {
  objectId: RoomObjectId;
  careKind: CareKind;
  state: "calm" | "needs_care" | "done" | "active";
};

export type RoomState = {
  localDay: string;
  objects: RoomObjectState[];
  hasActiveOutsideSession: boolean;
};
