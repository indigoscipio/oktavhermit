import { CARE_LABELS } from "../../domain/defaults";
import type { CareKind } from "../../domain/types";
import { AssetIcon, careIconMap } from "../../ui/AssetIcon";
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
  water: "Drink one glass of water?",
  light: "Visit the window for a little light?",
  food: "Eat something smol?",
  movement: "Stretch for 2 minutes?",
  hygiene: "Wash up for a moment?",
  rest: "Rest for a moment?",
  room: "Clear one smol surface?",
  outside: "Be careful! The outside can be a beautiful and dangerous place.",
};

const firstActionCopy: Record<CareKind, string> = {
  water: "Yes, drink",
  light: "Yes, receive light",
  food: "Yes, eat",
  movement: "Yes, stretch",
  hygiene: "Yes, wash up",
  rest: "Yes, rest",
  room: "Yes, clean room",
  outside: "Start outside",
};

const repeatActionCopy: Partial<Record<CareKind, string>> = {
  water: "Add another",
  food: "Add another",
  movement: "Yes, stretch again",
  rest: "Yes, rest again",
};

const repeatableCareKinds: CareKind[] = ["water", "food", "movement", "rest", "outside"];

const alreadyDoneCopy: Partial<Record<CareKind, string>> = {
  water: "Already logged today. Want to drink one more glass?",
  food: "Already logged today. Want to eat another smol thing?",
  movement: "You already moved today. Stretch again for 2 minutes?",
  rest: "You already rested today. Do you want to rest again for a moment?",
  light: "Already done today. Smol care counts.",
  hygiene: "Already done today. Smol care counts.",
  room: "Already done today. Smol care counts.",
  outside: "Be careful! The outside can be a beautiful and dangerous place.",
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
  const primaryCopy = isAlreadyDone
    ? repeatActionCopy[object.careKind] ?? firstActionCopy[object.careKind]
    : firstActionCopy[object.careKind];

  return (
    <BottomSheet isOpen={Boolean(object)} title={CARE_LABELS[object.careKind]} onClose={onClose}>
      <div className="space-y-5">
        <div className="mx-auto flex h-20 w-20 items-center justify-center">
          <AssetIcon name={careIconMap[object.careKind]} size={72} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-ink">{isOutside ? "Go outside?" : `${CARE_LABELS[object.careKind]}?`}</h2>
          <p className="mt-3 text-xl leading-relaxed text-muted">{bodyCopy}</p>
        </div>
        {isOutside && !isOutsideActive ? (
          <div className="rounded-bocchi border border-moss bg-successSoft/50 p-4 text-left">
            <p className="text-center text-sm font-bold uppercase tracking-[0.18em] text-muted">Take this with you:</p>
            <div className="mt-3 flex items-center gap-4 border-t border-moss/40 pt-3">
              <AssetIcon name={outsideGift.icon} size={64} />
              <div>
                <p className="text-xl font-bold text-ink">{outsideGift.name}</p>
                <p className="mt-1 text-muted">{outsideGift.line}</p>
              </div>
            </div>
          </div>
        ) : null}
        <div className="flex flex-col gap-3">
          {isOutsideActive || (isAlreadyDone && !isRepeatable) ? (
            <Button className="w-full" variant="secondary" onClick={onClose}>Close</Button>
          ) : isOutside ? (
            <Button className="w-full" onClick={onStartOutside}>Go Outside</Button>
          ) : (
            <Button className="w-full" onClick={() => onCareDone(object.careKind)}>{primaryCopy}</Button>
          )}
          {isOutside && !isOutsideActive ? (
            <Button className="w-full" variant="secondary" onClick={onClose}>Stay in room</Button>
          ) : isAlreadyDone && !isRepeatable ? null : (
            <Button className="w-full" variant="secondary" onClick={onClose}>Maybe later</Button>
          )}
        </div>
      </div>
    </BottomSheet>
  );
}
