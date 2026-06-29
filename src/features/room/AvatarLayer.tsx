import type { CSSProperties } from "react";
import type { AvatarReaction } from "./RoomScene";
import type { RoomAssetMap } from "./roomAssets";
import { AVATAR_LAYOUT } from "./roomLayout";

type AvatarLayerProps = {
  assets: RoomAssetMap;
  reaction?: AvatarReaction;
  bubble?: string;
};

export function AvatarLayer({ assets, reaction, bubble }: AvatarLayerProps) {
  const style = {
    "--avatar-x": `${AVATAR_LAYOUT.x}%`,
    "--avatar-y": `${AVATAR_LAYOUT.y}%`,
    "--avatar-size": `${AVATAR_LAYOUT.size}%`,
    zIndex: AVATAR_LAYOUT.z,
  } as CSSProperties;

  return (
    <div className="avatar-layer" aria-hidden="true">
      <div className="tiny-bocchi" style={style} data-reaction={reaction ?? "idle"} data-bubble={bubble}>
        {assets.avatar ? <img className="avatar-asset" src={assets.avatar} alt="" /> : null}
      </div>
    </div>
  );
}
