import type { RoomAssetMap } from "./roomAssets";
import { RoomObjectSprite } from "./RoomObjectSprite";
import type { RoomSceneObject } from "./RoomScene";

type RoomObjectSpritesProps = {
  objects: RoomSceneObject[];
  assets: RoomAssetMap;
};

export function RoomObjectSprites({ objects, assets }: RoomObjectSpritesProps) {
  return (
    <div className="room-objects-layer">
      {objects.map((object) => (
        <RoomObjectSprite
          key={object.id}
          id={object.id}
          asset={assets[object.id]}
          layout={object.layout}
          state={object.state}
        />
      ))}
    </div>
  );
}
