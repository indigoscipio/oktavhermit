import { getTodayStatus } from "./care";
import { getLocalDay } from "./dates";
import { getActiveOutsideSession } from "./outside";
import type { BocchiData, RoomObjectConfig, RoomObjectState, RoomState } from "./types";

export function deriveRoomState(data: BocchiData, now: Date, roomObjects: RoomObjectConfig[]): RoomState {
  const todayStatus = getTodayStatus(data, now);
  const hasActiveOutsideSession = Boolean(getActiveOutsideSession(data));
  const objects: RoomObjectState[] = roomObjects.filter((object) =>
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
      objectId: object.id,
      careKind: object.careKind,
      state,
    };
  });

  return {
    localDay: getLocalDay(now),
    objects,
    hasActiveOutsideSession,
  };
}
