import { beforeEach, describe, expect, it } from "vitest";
import { createDefaultData, STORAGE_KEY } from "../domain/defaults";
import { addCareLog } from "../domain/care";
import { exportBocchiData, loadBocchiData, resetBocchiData, saveBocchiData } from "./bocchiStorage";

describe("bocchi storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("default data loads when storage is empty", () => {
    expectDefaultData(loadBocchiData());
  });

  it("corrupted storage does not crash", () => {
    localStorage.setItem(STORAGE_KEY, "not json");

    expectDefaultData(loadBocchiData());
  });

  it("missing fields are normalized safely", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1 }));

    expectDefaultData(loadBocchiData());
  });

  it("older version returns default data", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 0, careLogs: [{ kind: "water" }] }));

    expectDefaultData(loadBocchiData());
  });

  it("saves and exports complete Bocchi data", () => {
    const data = addCareLog(createDefaultData(), "water", { now: new Date(2026, 0, 1, 9, 0, 0) });

    saveBocchiData(data);

    expect(loadBocchiData().careLogs).toHaveLength(1);
    expect(JSON.parse(exportBocchiData(data))).toMatchObject({ version: 1 });
  });

  it("resetBocchiData saves default data", () => {
    saveBocchiData(addCareLog(createDefaultData(), "water"));
    const reset = resetBocchiData();

    expectDefaultData(reset);
    expectDefaultData(loadBocchiData());
  });
});

function expectDefaultData(data: ReturnType<typeof createDefaultData>) {
  expect(data).toMatchObject({
    version: 1,
    settings: createDefaultData().settings,
    careLogs: [],
    outsideSessions: [],
  });
  expect(typeof data.startedAt).toBe("string");
  expect(Number.isFinite(new Date(data.startedAt).getTime())).toBe(true);
}
