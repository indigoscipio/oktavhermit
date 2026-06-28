import type { CSSProperties } from "react";
import type { RoomObjectId, RoomObjectState } from "../../domain/types";
import type { RoomObjectLayout } from "./roomLayout";

type RoomObjectSpriteProps = {
  id: RoomObjectId;
  asset?: string;
  layout: RoomObjectLayout;
  state: RoomObjectState["state"];
};

export function RoomObjectSprite({ id, asset, layout, state }: RoomObjectSpriteProps) {
  const { sprite } = layout;
  const style = {
    "--room-sprite-x": `${sprite.x}%`,
    "--room-sprite-y": `${sprite.y}%`,
    "--room-sprite-w": `${sprite.w}%`,
    "--room-sprite-h": `${sprite.h}%`,
    zIndex: sprite.z ?? 1,
  } as CSSProperties;

  return (
    <div className={`room-object-sprite room-object-sprite--${id}`} style={style} data-state={state} aria-hidden="true">
      {asset ? (
        <img className="room-object-asset" src={asset} alt="" />
      ) : (
        <span className={`room-object-placeholder room-object-placeholder--${id}`} />
      )}
    </div>
  );
}
