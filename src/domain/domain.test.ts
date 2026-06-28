import { describe, expect, it } from "vitest";
import { addCareLog, getTodayStatus } from "./care";
import { createDefaultData, STORAGE_KEY } from "./defaults";
import { getLocalDay } from "./dates";
import { endOutsideSession, getActiveOutsideSession, startOutsideSession } from "./outside";
import { deriveRoomState } from "./room";

describe("date helpers", () => {
  it("returns a local YYYY-MM-DD day", () => {
    const date = new Date(2026, 0, 5, 23, 30, 0);

    expect(getLocalDay(date)).toBe("2026-01-05");
  });
});

describe("care logs", () => {
  it("addCareLog adds the correct localDay", () => {
    const now = new Date(2026, 3, 9, 22, 15, 0);
    const data = addCareLog(createDefaultData(), "water", { now });

    expect(data.careLogs).toHaveLength(1);
    expect(data.careLogs[0]).toMatchObject({
      kind: "water",
      localDay: "2026-04-09",
      value: 1,
      unit: "cup",
    });
  });

  it("getTodayStatus marks a kind as done", () => {
    const now = new Date(2026, 3, 9, 9, 0, 0);
    const data = addCareLog(createDefaultData(), "light", { now });
    const status = getTodayStatus(data, now);

    expect(status.find((item) => item.kind === "light")).toMatchObject({
      isDoneToday: true,
      totalValueToday: 1,
    });
  });
});

describe("outside sessions", () => {
  it("startOutsideSession creates one active session", () => {
    const data = startOutsideSession(createDefaultData(), new Date(2026, 0, 1, 10, 0, 0));

    expect(getActiveOutsideSession(data)).toBeDefined();
    expect(data.outsideSessions).toHaveLength(1);
  });

  it("cannot create two active outside sessions", () => {
    const started = startOutsideSession(createDefaultData(), new Date(2026, 0, 1, 10, 0, 0));
    const startedAgain = startOutsideSession(started, new Date(2026, 0, 1, 10, 5, 0));

    expect(startedAgain.outsideSessions).toHaveLength(1);
  });

  it("endOutsideSession calculates duration and logs outside on the started day", () => {
    const startedAt = new Date(2026, 0, 1, 23, 58, 0);
    const endedAt = new Date(2026, 0, 2, 0, 2, 0);
    const started = startOutsideSession(createDefaultData(), startedAt);
    const ended = endOutsideSession(started, endedAt);

    expect(getActiveOutsideSession(ended)).toBeUndefined();
    expect(ended.outsideSessions[0].durationMinutes).toBe(4);
    expect(ended.careLogs[0]).toMatchObject({
      kind: "outside",
      value: 4,
      unit: "minute",
      localDay: "2026-01-01",
    });
  });

  it("outside session survives reload because it is stored", async () => {
    const { loadBocchiData, saveBocchiData } = await import("../storage/bocchiStorage");
    const started = startOutsideSession(createDefaultData(), new Date(2026, 0, 1, 10, 0, 0));

    localStorage.removeItem(STORAGE_KEY);
    saveBocchiData(started);

    expect(getActiveOutsideSession(loadBocchiData())).toBeDefined();
  });
});

describe("room state", () => {
  it("disabled care kinds are ignored in derived room state", () => {
    const data = createDefaultData();
    const withoutWater = {
      ...data,
      settings: {
        ...data.settings,
        enabledCareKinds: data.settings.enabledCareKinds.filter((kind) => kind !== "water"),
      },
    };

    const roomState = deriveRoomState(withoutWater, new Date(2026, 0, 1, 10, 0, 0));

    expect(roomState.objects.some((object) => object.careKind === "water")).toBe(false);
  });

  it("deriveRoomState changes object state after care log", () => {
    const now = new Date(2026, 0, 1, 10, 0, 0);
    const before = deriveRoomState(createDefaultData(), now);
    const afterData = addCareLog(createDefaultData(), "water", { now });
    const after = deriveRoomState(afterData, now);

    expect(before.objects.find((object) => object.objectId === "cup")?.state).toBe("needs_care");
    expect(after.objects.find((object) => object.objectId === "cup")?.state).toBe("done");
  });
});
