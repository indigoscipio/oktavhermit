import { CARE_KINDS, createDefaultData, isCareKind, isCareUnit, STORAGE_KEY } from "../domain/defaults";
import type { BocchiData, CareLog, OutsideSession, Settings } from "../domain/types";

function getStorage(): Storage | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

function normalizeSettings(value: unknown): Settings {
  const settings = typeof value === "object" && value !== null ? value as Partial<Settings> : {};
  const enabledCareKinds = Array.isArray(settings.enabledCareKinds)
    ? settings.enabledCareKinds.filter(isCareKind)
    : [...CARE_KINDS];
  const name = typeof settings.name === "string" ? settings.name.trim().slice(0, 40) : undefined;

  return {
    hasCompletedOnboarding: Boolean(settings.hasCompletedOnboarding),
    enabledCareKinds,
    name: name || undefined,
  };
}

function normalizeCareLog(value: unknown): CareLog | undefined {
  if (typeof value !== "object" || value === null) {
    return undefined;
  }

  const log = value as Partial<CareLog>;

  if (
    typeof log.id !== "string" ||
    !isCareKind(log.kind) ||
    typeof log.createdAt !== "string" ||
    typeof log.localDay !== "string"
  ) {
    return undefined;
  }

  return {
    id: log.id,
    kind: log.kind,
    createdAt: log.createdAt,
    localDay: log.localDay,
    value: typeof log.value === "number" ? log.value : undefined,
    unit: isCareUnit(log.unit) ? log.unit : undefined,
  };
}

function normalizeOutsideSession(value: unknown): OutsideSession | undefined {
  if (typeof value !== "object" || value === null) {
    return undefined;
  }

  const session = value as Partial<OutsideSession>;

  if (typeof session.id !== "string" || typeof session.startedAt !== "string") {
    return undefined;
  }

  return {
    id: session.id,
    startedAt: session.startedAt,
    endedAt: typeof session.endedAt === "string" ? session.endedAt : undefined,
    durationMinutes: typeof session.durationMinutes === "number" ? session.durationMinutes : undefined,
  };
}

export function normalizeBocchiData(value: unknown): BocchiData {
  if (typeof value !== "object" || value === null || (value as Partial<BocchiData>).version !== 1) {
    return createDefaultData();
  }

  const data = value as Partial<BocchiData>;
  const careLogs = Array.isArray(data.careLogs)
    ? data.careLogs.map(normalizeCareLog).filter((log): log is CareLog => Boolean(log))
    : [];
  const outsideSessions = Array.isArray(data.outsideSessions)
    ? data.outsideSessions
      .map(normalizeOutsideSession)
      .filter((session): session is OutsideSession => Boolean(session))
    : [];

  return {
    version: 1,
    settings: normalizeSettings(data.settings),
    careLogs,
    outsideSessions,
  };
}

export function loadBocchiData(): BocchiData {
  const storage = getStorage();

  if (!storage) {
    return createDefaultData();
  }

  try {
    const raw = storage.getItem(STORAGE_KEY);

    if (!raw) {
      return createDefaultData();
    }

    return normalizeBocchiData(JSON.parse(raw));
  } catch {
    return createDefaultData();
  }
}

export function saveBocchiData(data: BocchiData): void {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(normalizeBocchiData(data)));
  } catch {
    // Storage can be disabled or full. Bocchi should keep running without crashing.
  }
}

export function resetBocchiData(): BocchiData {
  const data = createDefaultData();
  saveBocchiData(data);
  return data;
}

export function exportBocchiData(data: BocchiData): string {
  return JSON.stringify(normalizeBocchiData(data), null, 2);
}
