import { getTodayStatus } from "../../domain/care";
import { CARE_LABELS } from "../../domain/defaults";
import { getLocalDay } from "../../domain/dates";
import { getActiveOutsideSession } from "../../domain/outside";
import type { BocchiData, CareLog } from "../../domain/types";
import { Card } from "../../ui/Card";
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
    <div className="space-y-5">
      <Card>
        <p className="text-sm uppercase tracking-wide text-muted">{intro.label}</p>
        <h1 className="text-4xl font-bold text-ink">{intro.heading}</h1>
        <p className="mt-3 text-lg text-muted">{intro.body}</p>
      </Card>
      <Card>
        <ul className="space-y-3">
          {status.map((item) => (
            <CareStatusItem key={item.kind} status={item} isOutsideActive={isOutsideActive} />
          ))}
        </ul>
      </Card>
      <Card>
        <h2 className="mb-3 text-2xl font-bold text-ink">Recent activity</h2>
        {recentLogs.length > 0 ? (
          <ul className="space-y-2">
            {recentLogs.map((log) => (
              <li key={log.id} className="flex items-center justify-between gap-3 rounded-2xl bg-panel/50 px-4 py-3 text-muted">
                <span className="font-semibold text-ink">{formatTime(log.createdAt)}</span>
                <span className="flex-1">{CARE_LABELS[log.kind]}</span>
                {formatLogValue(log) ? <span>{formatLogValue(log)}</span> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-lg text-muted">Nothing logged yet today.</p>
        )}
      </Card>
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
      heading: "Small world cared for.",
      body: "Rest now. No need to do more.",
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
      heading: "Small care counts.",
      body: "You’ve cared for part of your small world today.",
    };
  }

  return {
    label: "Today",
    heading: "Begin small.",
    body: "One small action is enough to start.",
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

  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function formatLogValue(log: CareLog): string | undefined {
  if ((log.kind === "movement" || log.kind === "outside") && typeof log.value === "number") {
    return `${log.value} min`;
  }

  return undefined;
}
