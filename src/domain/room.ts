import { getTodayStatus } from "./care";
import { CARE_LABELS } from "./defaults";
import { getLocalDay } from "./dates";
import { getActiveOutsideSession } from "./outside";
import type { BocchiData, CareKind, RoomObjectId, RoomObjectState, RoomState } from "./types";

const ROOM_OBJECTS: Array<{
  objectId: RoomObjectId;
  careKind: CareKind;
  prompt: string;
}> = [
  { objectId: "cup", careKind: "water", prompt: "Water first?" },
  { objectId: "window", careKind: "light", prompt: "Visit the window?" },
  { objectId: "food", careKind: "food", prompt: "Eat something small?" },
  { objectId: "bed", careKind: "rest", prompt: "Rest for a moment?" },
  { objectId: "floor", careKind: "movement", prompt: "Stretch for 2 minutes?" },
  { objectId: "sink", careKind: "hygiene", prompt: "Wash up?" },
  { objectId: "shelf", careKind: "room", prompt: "Clear one small surface?" },
  { objectId: "door", careKind: "outside", prompt: "Step out for a moment?" },
];

export function deriveRoomState(data: BocchiData, now: Date): RoomState {
  const todayStatus = getTodayStatus(data, now);
  const hasActiveOutsideSession = Boolean(getActiveOutsideSession(data));
  const objects: RoomObjectState[] = ROOM_OBJECTS.filter((object) =>
    data.settings.enabledCareKinds.includes(object.careKind),
  ).map((object) => {
    const status = todayStatus.find((item) => item.kind === object.careKind);
    const isDoneToday = Boolean(status?.isDoneToday);
    const state = object.careKind === "outside" && hasActiveOutsideSession
      ? "active"
      : isDoneToday
        ? "done"
        : "needs_care";

    return {
      objectId: object.objectId,
      careKind: object.careKind,
      state,
      label: CARE_LABELS[object.careKind],
      prompt: object.prompt,
    };
  });

  return {
    localDay: getLocalDay(now),
    objects,
    hasActiveOutsideSession,
  };
}
