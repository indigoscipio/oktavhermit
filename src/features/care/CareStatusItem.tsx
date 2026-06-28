import { CARE_LABELS } from "../../domain/defaults";
import type { CareStatus } from "../../domain/types";
import { Icon } from "../../ui/Icon";

type CareStatusItemProps = {
  status: CareStatus;
  isOutsideActive: boolean;
};

export function CareStatusItem({ status, isOutsideActive }: CareStatusItemProps) {
  const isMinutes = status.kind === "movement" || status.kind === "outside";
  const valueText = isMinutes && status.totalValueToday > 0 ? `${status.totalValueToday} min` : undefined;
  const label = status.kind === "outside" && !status.isDoneToday && !isOutsideActive
    ? "optional"
    : isOutsideActive && status.kind === "outside"
      ? "active"
      : status.isDoneToday
        ? valueText ?? "done"
        : "not yet";

  return (
    <li className="flex items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-panel/50 px-4 py-3">
      <span className="flex items-center gap-3 text-lg font-semibold text-ink">
        <Icon name={status.kind === "room" ? "room" : status.kind} size={22} />
        {CARE_LABELS[status.kind]}
      </span>
      <span className="rounded-full bg-paper px-3 py-1 text-sm text-muted">{label}</span>
    </li>
  );
}
