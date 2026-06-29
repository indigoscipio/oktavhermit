import { RoomHotspot } from "./RoomHotspot";
import type { RoomSceneObject } from "./RoomScene";
import type { RoomObjectId } from "../../domain/types";

type RoomInteractionLayerProps = {
  objects: RoomSceneObject[];
  onObjectClick: (object: RoomSceneObject) => void;
  onObjectHoverChange: (objectId: RoomObjectId | null) => void;
};

export function RoomInteractionLayer({ objects, onObjectClick, onObjectHoverChange }: RoomInteractionLayerProps) {
  return (
    <div className="room-interaction-layer">
      {objects.map((object) => (
        <RoomHotspot
          key={object.id}
          object={object}
          layout={object.layout}
          state={object.state}
          onClick={() => onObjectClick(object)}
          onHoverChange={(isHovered) => onObjectHoverChange(isHovered ? object.id : null)}
        />
      ))}
    </div>
  );
}
