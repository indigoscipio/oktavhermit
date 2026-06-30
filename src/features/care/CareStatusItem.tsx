import { CARE_LABELS } from "../../domain/defaults";
import type { CareStatus } from "../../domain/types";
import { AssetIcon, careIconMap } from "../../ui/AssetIcon";
import { Icon } from "../../ui/Icon";

type CareStatusItemProps = {
  status: CareStatus;
  isOutsideActive: boolean;
};

export function CareStatusItem({ status, isOutsideActive }: CareStatusItemProps) {
  const isMinutes = status.kind === "movement" || status.kind === "outside";
  const valueText = isMinutes && status.totalValueToday > 0 ? `${status.totalValueToday} min` : undefined;
  const label = status.kind === "outside" && !status.isDoneToday && !isOutsideActive
    ? "Optional"
    : isOutsideActive && status.kind === "outside"
      ? "Active"
      : status.isDoneToday
        ? valueText ?? "Done"
        : "Not Yet";
  const badgeTone = status.isDoneToday && !valueText
    ? "border-moss bg-successSoft text-green-900"
    : valueText || isOutsideActive
      ? "border-info/40 bg-infoSoft text-blue-900"
      : "border-warning bg-warningSoft text-amber-800";

  return (
    <li className="flex items-center justify-between gap-4 rounded-[1.35rem] border border-border bg-paper px-4 py-4 shadow-bocchi">
      <span className="flex items-center gap-4 text-xl font-bold text-ink">
        <AssetIcon name={careIconMap[status.kind]} size={46} />
        {CARE_LABELS[status.kind]}
      </span>
      <span className={`inline-flex items-center gap-1 rounded-[0.8rem] border px-3 py-2 text-sm font-bold ${badgeTone}`}>
        {status.isDoneToday && !valueText ? <Icon name="done" size={16} /> : null}
        {valueText || isOutsideActive ? <Icon name="clock" size={16} /> : null}
        {label}
      </span>
    </li>
  );
}
