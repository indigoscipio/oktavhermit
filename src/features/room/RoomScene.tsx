import type { RoomObjectConfig, RoomObjectState } from "../../domain/types";
import { SHOW_HOTSPOTS, type RoomObjectLayout } from "./roomLayout";
import { AvatarLayer } from "./AvatarLayer";
import { DEFAULT_ROOM_ASSETS, type RoomAssetMap } from "./roomAssets";
import { RoomInteractionLayer } from "./RoomInteractionLayer";
import { RoomObjectSprites } from "./RoomObjectSprites";
import { RoomShell } from "./RoomShell";

export type AvatarReaction = "water" | "food" | "light" | "movement" | "hygiene" | "rest" | "room" | "back";

type RoomSceneProps = {
  objects: RoomObjectState[];
  objectConfigs: RoomObjectConfig[];
  objectLayouts: RoomObjectLayout[];
  assets?: RoomAssetMap;
  hasActiveOutsideSession: boolean;
  avatarReaction?: AvatarReaction;
  onObjectClick: (object: RoomSceneObject) => void;
};

export type RoomSceneObject = RoomObjectConfig & {
  objectId: RoomObjectState["objectId"];
  state: RoomObjectState["state"];
  layout: RoomObjectLayout;
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

export function RoomScene({
  objects,
  objectConfigs,
  objectLayouts,
  assets = DEFAULT_ROOM_ASSETS,
  hasActiveOutsideSession,
  avatarReaction,
  onObjectClick,
}: RoomSceneProps) {
  const sceneObjects = objects.flatMap((state): RoomSceneObject[] => {
    const object = objectConfigs.find((config) => config.id === state.objectId);
    const layout = objectLayouts.find((item) => item.id === state.objectId);

    if (!object || !layout) {
      return [];
    }

    return [{ ...object, objectId: state.objectId, state: state.state, layout }];
  });

  return (
    <div className={`room-scene rounded-bocchi shadow-insetRoom ${SHOW_HOTSPOTS ? "debug-hotspots" : ""}`} aria-label="Bocchi room">
      <RoomShell assets={assets} />
      <RoomObjectSprites objects={sceneObjects} assets={assets} />
      <RoomInteractionLayer objects={sceneObjects} onObjectClick={onObjectClick} />
      {!hasActiveOutsideSession ? (
        <AvatarLayer assets={assets} reaction={avatarReaction} bubble={avatarReaction ? reactionBubble[avatarReaction] : undefined} />
      ) : null}
      {hasActiveOutsideSession ? (
        <div className="absolute left-1/2 top-1/2 z-10 w-56 -translate-x-1/2 -translate-y-1/2 rounded-bocchi border border-ink/10 bg-paper/90 p-4 text-center text-ink">
          <p className="text-lg font-semibold">your room will wait</p>
        </div>
      ) : null}
    </div>
  );
}
