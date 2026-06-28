import { CARE_KINDS, DEFAULT_CARE_VALUES } from "./defaults";
import { getLocalDay } from "./dates";
import { createId } from "./ids";
import type { BocchiData, CareKind, CareLog, CareUnit, TodayStatus } from "./types";

type AddCareLogOptions = {
  now?: Date;
  value?: number;
  unit?: CareUnit;
  localDay?: string;
};

export function addCareLog(
  data: BocchiData,
  kind: CareKind,
  options: AddCareLogOptions = {},
): BocchiData {
  const now = options.now ?? new Date();
  const defaults = DEFAULT_CARE_VALUES[kind];
  const log: CareLog = {
    id: createId("care"),
    kind,
    createdAt: now.toISOString(),
    localDay: options.localDay ?? getLocalDay(now),
    value: options.value ?? defaults.value,
    unit: options.unit ?? defaults.unit,
  };

  return {
    ...data,
    careLogs: [...data.careLogs, log],
  };
}

export function getLogsForDay(data: BocchiData, localDay: string): CareLog[] {
  return data.careLogs.filter((log) => log.localDay === localDay);
}

export function getTodayStatus(data: BocchiData, now: Date): TodayStatus {
  const localDay = getLocalDay(now);
  const logs = getLogsForDay(data, localDay);

  return CARE_KINDS.filter((kind) => data.settings.enabledCareKinds.includes(kind)).map((kind) => {
    const kindLogs = logs.filter((log) => log.kind === kind);
    const totalValueToday = kindLogs.reduce((sum, log) => sum + (log.value ?? 1), 0);
    const loggedAtTimes = kindLogs
      .map((log) => log.createdAt)
      .sort((a, b) => a.localeCompare(b));
    const lastLoggedAt = loggedAtTimes[loggedAtTimes.length - 1];

    return {
      kind,
      isDoneToday: kindLogs.length > 0,
      totalValueToday,
      lastLoggedAt,
    };
  });
}
