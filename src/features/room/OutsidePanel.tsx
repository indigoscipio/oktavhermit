import { getOutsideElapsedSeconds } from "../../domain/outside";
import type { OutsideSession } from "../../domain/types";
import { AssetIcon } from "../../ui/AssetIcon";
import { Button } from "../../ui/Button";

type OutsidePanelProps = {
  session: OutsideSession;
  now: Date;
  onReturn: () => void;
};

function getElapsedParts(seconds: number) {
  const cappedSeconds = Math.min(seconds, 99 * 60 + 59);

  return {
    minutes: Math.floor(cappedSeconds / 60),
    seconds: cappedSeconds % 60,
  };
}

export function OutsidePanel({ session, now, onReturn }: OutsidePanelProps) {
  const elapsedSeconds = getOutsideElapsedSeconds(session, now);
  const elapsed = getElapsedParts(elapsedSeconds);

  return (
    <div className="flex min-h-[68vh] items-center justify-center">
      <section className="w-full rounded-[2rem] border border-border bg-white p-8 text-center shadow-bocchi">
        <AssetIcon name="tree" size={82} className="mx-auto" />
        <h2 className="mt-5 text-4xl font-bold text-ink">You are outside.</h2>
        <p className="mx-auto mt-4 max-w-xs text-xl leading-relaxed text-muted">Be careful! The outside can be a beautiful and dangerous place.</p>
        <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center rounded-bocchi border border-ink/10 bg-white p-5" aria-live="polite">
          <div>
            <p className="text-6xl font-bold tabular-nums text-ink">{String(elapsed.minutes).padStart(2, "0")}</p>
            <p className="mt-2 text-lg text-muted">Minute</p>
          </div>
          <p className="text-6xl font-bold text-ink">:</p>
          <div>
            <p className="text-6xl font-bold tabular-nums text-ink">{String(elapsed.seconds).padStart(2, "0")}</p>
            <p className="mt-2 text-lg text-muted">Seconds</p>
          </div>
        </div>
        <Button className="mt-6 w-full" onClick={onReturn}>I'm Home</Button>
      </section>
    </div>
  );
}
