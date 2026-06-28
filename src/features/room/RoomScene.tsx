import type { RoomObjectState } from "../../domain/types";
import { RoomObjectButton } from "./RoomObjectButton";

export type AvatarReaction = "water" | "food" | "light" | "movement" | "hygiene" | "rest" | "room" | "back";

type RoomSceneProps = {
  objects: RoomObjectState[];
  hasActiveOutsideSession: boolean;
  avatarReaction?: AvatarReaction;
  onObjectClick: (object: RoomObjectState) => void;
};

const reactionBubble: Record<AvatarReaction, string> = {
  water: ":)",
  food: "full",
  light: "sun",
  movement: "stretch",
  hygiene: "fresh",
  rest: "zzz",
  room: "nice",
  back: "back",
};

export function RoomScene({ objects, hasActiveOutsideSession, avatarReaction, onObjectClick }: RoomSceneProps) {
  return (
    <div className="room-scene rounded-bocchi shadow-insetRoom" aria-label="Bocchi room">
      {objects.map((object) => (
        <RoomObjectButton key={object.objectId} object={object} onClick={() => onObjectClick(object)} />
      ))}
      {!hasActiveOutsideSession ? (
        <div
          className="tiny-bocchi"
          data-reaction={avatarReaction ?? "idle"}
          data-bubble={avatarReaction ? reactionBubble[avatarReaction] : undefined}
          aria-hidden="true"
        />
      ) : null}
      {hasActiveOutsideSession ? (
        <div className="absolute left-1/2 top-1/2 z-10 w-56 -translate-x-1/2 -translate-y-1/2 rounded-bocchi border border-ink/10 bg-paper/90 p-4 text-center text-ink">
          <p className="text-lg font-semibold">your room will wait</p>
        </div>
      ) : null}
    </div>
  );
}
