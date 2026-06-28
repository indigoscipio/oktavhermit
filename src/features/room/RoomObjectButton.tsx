import type { RoomObjectState } from "../../domain/types";

type RoomObjectButtonProps = {
  object: RoomObjectState;
  onClick: () => void;
};

const stateText: Record<RoomObjectState["state"], string> = {
  calm: "calm",
  needs_care: "not yet",
  done: "done",
  active: "active",
};

export function RoomObjectButton({ object, onClick }: RoomObjectButtonProps) {
  return (
    <button
      type="button"
      className={`room-object object-${object.objectId} focus-ring`}
      data-state={object.state}
      onClick={onClick}
      aria-label={`${object.label}. ${object.prompt} Current state: ${stateText[object.state]}.`}
    >
      <span className="room-object-label">{object.label}</span>
      <span className="mx-2 mb-2 inline-flex rounded-full bg-paper/75 px-2 py-1 text-xs text-ink">
        {stateText[object.state]}
      </span>
    </button>
  );
}
