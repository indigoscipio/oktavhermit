export function getLocalDay(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getLocalDayDifference(start: Date, end: Date): number {
  const startLocal = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const endLocal = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
  const dayMs = 24 * 60 * 60 * 1000;

  if (!Number.isFinite(startLocal) || !Number.isFinite(endLocal)) {
    return 0;
  }

  return Math.floor((endLocal - startLocal) / dayMs);
}

export function getAppDayNumber(startedAt: string, now: Date): number {
  const startedDate = new Date(startedAt);

  if (!Number.isFinite(startedDate.getTime())) {
    return 1;
  }

  return Math.max(1, getLocalDayDifference(startedDate, now) + 1);
}

export function formatDisplayDate(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
