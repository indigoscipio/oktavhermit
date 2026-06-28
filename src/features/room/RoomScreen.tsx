import { addCareLog, getLogsForDay } from "../../domain/care";
import { getLocalDay } from "../../domain/dates";
import { deriveRoomState } from "../../domain/room";
import { endOutsideSession, getActiveOutsideSession, getOutsideElapsedSeconds, startOutsideSession } from "../../domain/outside";
import type { BocchiData, CareKind } from "../../domain/types";
import { useEffect, useRef, useState } from "react";
import { ObjectActionSheet } from "./ObjectActionSheet";
import { OutsidePanel } from "./OutsidePanel";
import { RoomScene, type AvatarReaction, type RoomSceneObject } from "./RoomScene";
import { ROOM_LAYOUT, ROOM_VIEW } from "./roomLayout";
import { ROOM_OBJECTS } from "./roomObjects";

type RoomScreenProps = {
  data: BocchiData;
  now: Date;
  onDataChange: (data: BocchiData) => void;
  onMessage: (message: string) => void;
};

const doneCopy: Record<CareKind, string> = {
  water: "Water logged. Small care counts.",
  food: "Food logged. Small care counts.",
  light: "Light logged. Small care counts.",
  movement: "Movement logged. Small care counts.",
  hygiene: "Hygiene logged. Small care counts.",
  rest: "Rest logged. Take it easy.",
  room: "Room care logged. Small care counts.",
  outside: "Outside logged. Small care counts.",
};

const avatarReactionByKind: Partial<Record<CareKind, AvatarReaction>> = {
  water: "water",
  food: "food",
  light: "light",
  movement: "movement",
  hygiene: "hygiene",
  rest: "rest",
  room: "room",
};

export function RoomScreen({ data, now, onDataChange, onMessage }: RoomScreenProps) {
  const roomState = deriveRoomState(data, now, ROOM_OBJECTS);
  const activeOutsideSession = getActiveOutsideSession(data);
  const [selectedObject, setSelectedObject] = useRoomSelection();
  const [avatarReaction, setAvatarReaction] = useState<AvatarReaction | undefined>();
  const avatarTimerRef = useRef<number | undefined>(undefined);
  const coreObjects = roomState.objects.filter((object) => object.careKind !== "outside");
  const isSmallWorldCaredFor = coreObjects.length > 0 && coreObjects.every((object) => object.state === "done");
  const roomTitle = data.settings.name ? `${data.settings.name}'s room` : "Care for your small world";

  useEffect(() => {
    return () => {
      if (avatarTimerRef.current) {
        window.clearTimeout(avatarTimerRef.current);
      }
    };
  }, []);

  function showAvatarReaction(reaction: AvatarReaction | undefined) {
    if (!reaction) {
      return;
    }

    setAvatarReaction(reaction);

    if (avatarTimerRef.current) {
      window.clearTimeout(avatarTimerRef.current);
    }

    avatarTimerRef.current = window.setTimeout(() => setAvatarReaction(undefined), 2600);
  }

  function handleCareDone(kind: CareKind) {
    const nextData = addCareLog(data, kind, { now });
    const localDay = getLocalDay(now);
    const restCount = getLogsForDay(nextData, localDay).filter((log) => log.kind === "rest").length;

    onDataChange(nextData);
    setSelectedObject(undefined);
    showAvatarReaction(avatarReactionByKind[kind]);
    onMessage(kind === "rest" && restCount >= 3 ? "You rested a lot today. That’s okay :)" : doneCopy[kind]);
  }

  function handleStartOutside() {
    const nextData = startOutsideSession(data, now);
    onDataChange(nextData);
    setSelectedObject(undefined);
    onMessage("Your room will wait.");
  }

  function handleReturn() {
    const nextData = endOutsideSession(data, now);
    const ended = getActiveOutsideSession(data);
    const duration = ended ? Math.ceil(getOutsideElapsedSeconds(ended, now) / 60) : 0;
    onDataChange(nextData);
    showAvatarReaction("back");
    onMessage(`You came back. That counts. Outside: ${duration} min`);
  }

  if (activeOutsideSession) {
    return (
      <div className="space-y-5">
        <OutsidePanel session={activeOutsideSession} now={now} onReturn={handleReturn} />
      </div>
    );
  }

  return (
    <div className="room-screen">
      <header className="room-screen-header">
        <p className="text-sm uppercase tracking-wide text-muted">Room</p>
        <h1 className="text-3xl font-bold text-ink">{roomTitle}</h1>
      </header>

      <div className="room-viewport">
        <div
          className="room-layer"
          style={{
            "--room-zoom": String(ROOM_VIEW.zoom),
            "--room-offset-x": `${ROOM_VIEW.offsetX}px`,
            "--room-offset-y": `${ROOM_VIEW.offsetY}px`,
          } as React.CSSProperties}
        >
          <RoomScene
            objects={roomState.objects}
            objectConfigs={ROOM_OBJECTS}
            objectLayouts={ROOM_LAYOUT}
            hasActiveOutsideSession={roomState.hasActiveOutsideSession}
            avatarReaction={avatarReaction}
            onObjectClick={setSelectedObject}
          />
        </div>
        <p className="room-status-bubble">
          {isSmallWorldCaredFor ? "Small world cared for. Take it easy." : "Tap a room object. One tiny action is enough."}
        </p>
      </div>

      <ObjectActionSheet
        object={selectedObject}
        onClose={() => setSelectedObject(undefined)}
        onCareDone={handleCareDone}
        onStartOutside={handleStartOutside}
      />
    </div>
  );
}

function useRoomSelection() {
  return useState<RoomSceneObject | undefined>(undefined);
}
