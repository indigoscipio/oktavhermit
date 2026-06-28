import { getOutsideElapsedSeconds } from "../../domain/outside";
import type { OutsideSession } from "../../domain/types";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";

type OutsidePanelProps = {
  session: OutsideSession;
  now: Date;
  onReturn: () => void;
  onCancel: () => void;
};

function formatElapsed(seconds: number): string {
  const cappedSeconds = Math.min(seconds, 99 * 60 * 60 + 59 * 60 + 59);
  const hours = Math.floor(cappedSeconds / 3600);
  const minutes = Math.floor((cappedSeconds % 3600) / 60);
  const remainingSeconds = cappedSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

export function OutsidePanel({ session, now, onReturn, onCancel }: OutsidePanelProps) {
  const elapsedSeconds = getOutsideElapsedSeconds(session, now);

  return (
    <Card className="border-skysoft bg-skysoft/25">
      <div className="space-y-4 text-center">
        <div>
          <p className="text-sm uppercase tracking-wide text-muted">Outside</p>
          <h2 className="text-3xl font-bold text-ink">You are outside.</h2>
        </div>
        <p className="text-5xl font-bold tabular-nums text-ink" aria-live="polite">{formatElapsed(elapsedSeconds)}</p>
        <p className="text-lg text-muted">Come back whenever.</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={onReturn}>I'm back</Button>
          <Button variant="quiet" onClick={onCancel}>Cancel outside</Button>
        </div>
      </div>
    </Card>
  );
}
