import { CARE_LABELS } from "../../domain/defaults";
import type { CareKind } from "../../domain/types";
import { BottomSheet } from "../../ui/BottomSheet";
import { Button } from "../../ui/Button";
import { useEffect, useState } from "react";
import { getRandomOutsideGift, type OutsideGift } from "./outsideGifts";
import type { RoomSceneObject } from "./RoomScene";

type ObjectActionSheetProps = {
  object: RoomSceneObject | undefined;
  onClose: () => void;
  onCareDone: (kind: CareKind) => void;
  onStartOutside: () => void;
};

const actionCopy: Record<CareKind, string> = {
  water: "Drink one glass?",
  light: "Visit the window?",
  food: "Eat something small?",
  movement: "Stretch for 2 minutes?",
  hygiene: "Wash up?",
  rest: "Rest for a moment?",
  room: "Clear one small surface?",
  outside: "Step out for a moment?",
};

const repeatableCareKinds: CareKind[] = ["water", "food", "movement", "rest", "outside"];

const alreadyDoneCopy: Partial<Record<CareKind, string>> = {
  water: "Already logged today. Want to add another?",
  food: "Already logged today. Want to add another?",
  movement: "You already moved today. Stretch again for 2 minutes?",
  rest: "You already rested today. Rest again for a moment?",
  light: "Already done today. Small care counts.",
  hygiene: "Already done today. Small care counts.",
  room: "Already done today. Small care counts.",
  outside: "Step out again for a moment?",
};

export function ObjectActionSheet({ object, onClose, onCareDone, onStartOutside }: ObjectActionSheetProps) {
  const [outsideGift, setOutsideGift] = useState<OutsideGift>(() => getRandomOutsideGift());

  useEffect(() => {
    if (object?.careKind === "outside") {
      setOutsideGift(getRandomOutsideGift());
    }
  }, [object]);

  if (!object) {
    return null;
  }

  const isOutside = object.careKind === "outside";
  const isAlreadyDone = object.state === "done";
  const isOutsideActive = object.state === "active";
  const isRepeatable = repeatableCareKinds.includes(object.careKind);
  const bodyCopy = isOutsideActive
    ? "You are outside. Come back whenever."
    : isAlreadyDone
      ? alreadyDoneCopy[object.careKind] ?? actionCopy[object.careKind]
      : actionCopy[object.careKind];
  const primaryCopy = isAlreadyDone && object.careKind === "rest"
    ? "Yes, rest again"
    : isAlreadyDone && (object.careKind === "water" || object.careKind === "food")
      ? "Add another"
      : "Done";

  return (
    <BottomSheet isOpen={Boolean(object)} title={CARE_LABELS[object.careKind]} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <p className="text-xl text-ink">{bodyCopy}</p>
          {isOutside && !isOutsideActive ? <p className="mt-2 text-muted">Your room will wait.</p> : null}
        </div>
        {isOutside && !isOutsideActive ? (
          <div className="rounded-2xl border border-warm/20 bg-panel/60 p-4">
            <p className="text-sm uppercase tracking-wide text-muted">Take this with you:</p>
            <p className="mt-1 text-xl font-bold text-ink">{outsideGift.name}</p>
            <p className="mt-1 text-muted">{outsideGift.line}</p>
          </div>
        ) : null}
        <div className="flex flex-col gap-3 sm:flex-row">
          {isOutsideActive || (isAlreadyDone && !isRepeatable) ? (
            <Button className="flex-1" variant="secondary" onClick={onClose}>Close</Button>
          ) : isOutside ? (
            <Button className="flex-1" onClick={onStartOutside}>Start outside</Button>
          ) : (
            <Button className="flex-1" onClick={() => onCareDone(object.careKind)}>{primaryCopy}</Button>
          )}
          {isOutside && !isOutsideActive ? (
            <Button className="flex-1" variant="secondary" onClick={onClose}>Stay in room</Button>
          ) : isAlreadyDone && !isRepeatable ? null : (
            <Button className="flex-1" variant="secondary" onClick={onClose}>Not now</Button>
          )}
        </div>
      </div>
    </BottomSheet>
  );
}
