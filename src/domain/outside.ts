import { addCareLog } from "./care";
import { getLocalDay } from "./dates";
import { createId } from "./ids";
import type { BocchiData, OutsideSession } from "./types";

export function getActiveOutsideSession(data: BocchiData): OutsideSession | undefined {
  return data.outsideSessions.find((session) => !session.endedAt);
}

export function startOutsideSession(data: BocchiData, now = new Date()): BocchiData {
  if (getActiveOutsideSession(data)) {
    return data;
  }

  const session: OutsideSession = {
    id: createId("outside"),
    startedAt: now.toISOString(),
  };

  return {
    ...data,
    outsideSessions: [...data.outsideSessions, session],
  };
}

export function endOutsideSession(data: BocchiData, now = new Date()): BocchiData {
  const activeSession = getActiveOutsideSession(data);

  if (!activeSession) {
    return data;
  }

  const elapsedSeconds = getOutsideElapsedSeconds(activeSession, now);
  const durationMinutes = Math.max(0, Math.ceil(elapsedSeconds / 60));
  const endedAt = now.toISOString();
  const outsideSessions = data.outsideSessions.map((session) =>
    session.id === activeSession.id ? { ...session, endedAt, durationMinutes } : session,
  );

  const withEndedSession = {
    ...data,
    outsideSessions,
  };
  const startedDate = new Date(activeSession.startedAt);
  const logDay = Number.isFinite(startedDate.getTime()) ? getLocalDay(startedDate) : getLocalDay(now);

  return addCareLog(withEndedSession, "outside", {
    now,
    value: durationMinutes,
    unit: "minute",
    localDay: logDay,
  });
}

export function cancelOutsideSession(data: BocchiData): BocchiData {
  const activeSession = getActiveOutsideSession(data);

  if (!activeSession) {
    return data;
  }

  return {
    ...data,
    outsideSessions: data.outsideSessions.filter((session) => session.id !== activeSession.id),
  };
}

export function getOutsideElapsedSeconds(session: OutsideSession, now = new Date()): number {
  const startedAt = new Date(session.startedAt).getTime();
  const current = now.getTime();

  if (!Number.isFinite(startedAt) || !Number.isFinite(current)) {
    return 0;
  }

  return Math.max(0, Math.floor((current - startedAt) / 1000));
}
