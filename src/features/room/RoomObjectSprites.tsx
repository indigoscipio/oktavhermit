import type { RoomAssetMap } from "./roomAssets";
import { RoomObjectSprite } from "./RoomObjectSprite";
import type { RoomSceneObject } from "./RoomScene";
import type { RoomObjectId } from "../../domain/types";

type RoomObjectSpritesProps = {
  objects: RoomSceneObject[];
  assets: RoomAssetMap;
  hoveredObjectId?: RoomObjectId | null;
};

export function RoomObjectSprites({ objects, assets, hoveredObjectId }: RoomObjectSpritesProps) {
  return (
    <div className="room-objects-layer">
      {objects.map((object) => (
        <RoomObjectSprite
          key={object.id}
          id={object.id}
          asset={assets[object.id]}
          layout={object.layout}
          state={object.state}
          isHovered={hoveredObjectId === object.id}
        />
      ))}
    </div>
  );
}
