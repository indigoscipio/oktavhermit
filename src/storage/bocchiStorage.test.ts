import { beforeEach, describe, expect, it } from "vitest";
import { createDefaultData, STORAGE_KEY } from "../domain/defaults";
import { addCareLog } from "../domain/care";
import { exportBocchiData, loadBocchiData, resetBocchiData, saveBocchiData } from "./bocchiStorage";

describe("bocchi storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("default data loads when storage is empty", () => {
    expect(loadBocchiData()).toEqual(createDefaultData());
  });

  it("corrupted storage does not crash", () => {
    localStorage.setItem(STORAGE_KEY, "not json");

    expect(loadBocchiData()).toEqual(createDefaultData());
  });

  it("missing fields are normalized safely", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1 }));

    expect(loadBocchiData()).toEqual(createDefaultData());
  });

  it("older version returns default data", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 0, careLogs: [{ kind: "water" }] }));

    expect(loadBocchiData()).toEqual(createDefaultData());
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

    expect(reset).toEqual(createDefaultData());
    expect(loadBocchiData()).toEqual(createDefaultData());
  });
});
