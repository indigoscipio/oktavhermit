import type { RoomObjectState } from "../../domain/types";
import { RoomObjectButton } from "./RoomObjectButton";

type RoomSceneProps = {
  objects: RoomObjectState[];
  hasActiveOutsideSession: boolean;
  onObjectClick: (object: RoomObjectState) => void;
};

export function RoomScene({ objects, hasActiveOutsideSession, onObjectClick }: RoomSceneProps) {
  return (
    <div className="room-scene rounded-bocchi shadow-insetRoom" aria-label="Bocchi room">
      {objects.map((object) => (
        <RoomObjectButton key={object.objectId} object={object} onClick={() => onObjectClick(object)} />
      ))}
      {!hasActiveOutsideSession ? <div className="tiny-bocchi" aria-hidden="true" /> : null}
      {hasActiveOutsideSession ? (
        <div className="absolute left-1/2 top-1/2 z-10 w-56 -translate-x-1/2 -translate-y-1/2 rounded-bocchi bg-paper/90 p-4 text-center text-ink shadow-bocchi">
          <p className="text-lg font-semibold">your room will wait</p>
        </div>
      ) : null}
    </div>
  );
}
