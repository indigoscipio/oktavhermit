import { getTodayStatus } from "../../domain/care";
import { CARE_LABELS } from "../../domain/defaults";
import { getLocalDay } from "../../domain/dates";
import { getActiveOutsideSession } from "../../domain/outside";
import type { BocchiData, CareLog } from "../../domain/types";
import { CareStatusItem } from "./CareStatusItem";

type CareScreenProps = {
  data: BocchiData;
  now: Date;
};

export function CareScreen({ data, now }: CareScreenProps) {
  const status = getTodayStatus(data, now);
  const isOutsideActive = Boolean(getActiveOutsideSession(data));
  const recentLogs = getRecentLogsForToday(data, now);
  const intro = getCareIntro(status, isOutsideActive);

  return (
    <div className="space-y-7 pb-2">
      <header>
        <h1 className="text-4xl font-bold text-ink">Today</h1>
        <p className="mt-2 text-lg text-muted">{intro.body}</p>
      </header>

      <section aria-label="Care areas">
        <ul className="space-y-2">
          {status.map((item) => (
            <CareStatusItem key={item.kind} status={item} isOutsideActive={isOutsideActive} />
          ))}
        </ul>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-ink">Recent</h2>
          <span className="text-lg font-semibold text-muted underline underline-offset-4">Show All</span>
        </div>
        {recentLogs.length > 0 ? (
          <ul className="rounded-bocchi border border-border bg-paper px-4 py-2 shadow-bocchi">
            {recentLogs.map((log) => (
              <li key={log.id} className="flex items-center justify-between gap-3 border-b border-border py-3 last:border-b-0">
                <span className="text-xl font-bold text-ink">{CARE_LABELS[log.kind]}</span>
                <span className="text-lg text-ink">{formatTime(log.createdAt)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-bocchi border border-border bg-paper p-4 text-lg text-muted shadow-bocchi">Nothing logged yet today.</p>
        )}
      </section>

      <p className="text-center text-xl leading-relaxed text-muted">
        Smol steps, your way.<br />That’s enough. ❤️
      </p>
    </div>
  );
}

function getCareIntro(status: ReturnType<typeof getTodayStatus>, isOutsideActive: boolean) {
  if (isOutsideActive) {
    return {
      label: "Outside",
      heading: "Your room will wait.",
      body: "Come back whenever.",
    };
  }

  const coreStatus = status.filter((item) => item.kind !== "outside");
  const doneCount = coreStatus.filter((item) => item.isDoneToday).length;
  const totalCount = coreStatus.length;

  if (totalCount > 0 && doneCount === totalCount) {
    return {
      label: "Today",
      heading: "Smol world cared for.",
      body: "Your smol world feels cared for. Rest now.",
    };
  }

  if (totalCount > 0 && doneCount >= Math.ceil(totalCount * 0.7)) {
    return {
      label: "Today",
      heading: "The room feels warmer.",
      body: "You can take it easy for a while.",
    };
  }

  if (doneCount > 0) {
    return {
      label: "Today",
      heading: "Smol care counts.",
      body: "You’ve cared for part of your smol world today.",
    };
  }

  return {
    label: "Today",
    heading: "Begin smol.",
    body: "One smol action is enough to start.",
  };
}

function getRecentLogsForToday(data: BocchiData, now: Date): CareLog[] {
  const localDay = getLocalDay(now);

  return data.careLogs
    .filter((log) => log.localDay === localDay && data.settings.enabledCareKinds.includes(log.kind))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);
}

function formatTime(value: string): string {
  const date = new Date(value);

  if (!Number.isFinite(date.getTime())) {
    return "--:--";
  }

  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
