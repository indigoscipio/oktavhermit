import { RoomHotspot } from "./RoomHotspot";
import type { RoomSceneObject } from "./RoomScene";

type RoomInteractionLayerProps = {
  objects: RoomSceneObject[];
  onObjectClick: (object: RoomSceneObject) => void;
};

export function RoomInteractionLayer({ objects, onObjectClick }: RoomInteractionLayerProps) {
  return (
    <div className="room-interaction-layer">
      {objects.map((object) => (
        <RoomHotspot
          key={object.id}
          object={object}
          layout={object.layout}
          state={object.state}
          onClick={() => onObjectClick(object)}
        />
      ))}
    </div>
  );
}
