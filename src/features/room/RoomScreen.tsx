import { addCareLog, getLogsForDay } from "../../domain/care";
import { formatDisplayDate, getAppDayNumber, getLocalDay } from "../../domain/dates";
import { deriveRoomState } from "../../domain/room";
import { endOutsideSession, getActiveOutsideSession, getOutsideElapsedSeconds, startOutsideSession } from "../../domain/outside";
import type { BocchiData, CareKind, RoomObjectId } from "../../domain/types";
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
  disableIdleHint?: boolean;
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

const DEBUG_IDLE_HINT = false;
const IDLE_HINT_DELAY_MS = DEBUG_IDLE_HINT ? 800 : 24000;
const IDLE_HINT_VISIBLE_MS = DEBUG_IDLE_HINT ? 999999 : 5200;

export function RoomScreen({ data, now, onDataChange, onMessage, disableIdleHint = false }: RoomScreenProps) {
  const roomState = deriveRoomState(data, now, ROOM_OBJECTS);
  const activeOutsideSession = getActiveOutsideSession(data);
  const [selectedObject, setSelectedObject] = useRoomSelection();
  const [avatarReaction, setAvatarReaction] = useState<AvatarReaction | undefined>();
  const [idleHintObjectId, setIdleHintObjectId] = useState<RoomObjectId | undefined>();
  const avatarTimerRef = useRef<number | undefined>(undefined);
  const idleTimerRef = useRef<number | undefined>(undefined);
  const idleHideTimerRef = useRef<number | undefined>(undefined);
  const coreObjects = roomState.objects.filter((object) => object.careKind !== "outside");
  const idleCandidateObjectId = roomState.objects.find((object) => object.state === "needs_care")?.objectId;
  const idleHintObjectIds = DEBUG_IDLE_HINT
    ? roomState.objects.map((object) => object.objectId)
    : idleHintObjectId
      ? [idleHintObjectId]
      : undefined;
  const isSmallWorldCaredFor = coreObjects.length > 0 && coreObjects.every((object) => object.state === "done");
  const roomTitle = data.settings.name ? `${data.settings.name}'s room` : "Care for your small world";
  const roomDayLabel = `Day ${getAppDayNumber(data.startedAt, now)} · ${formatDisplayDate(now)}`;

  useEffect(() => {
    return () => {
      if (avatarTimerRef.current) {
        window.clearTimeout(avatarTimerRef.current);
      }

      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }

      if (idleHideTimerRef.current) {
        window.clearTimeout(idleHideTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    function clearIdleTimers() {
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }

      if (idleHideTimerRef.current) {
        window.clearTimeout(idleHideTimerRef.current);
      }
    }

    function scheduleIdleHint() {
      clearIdleTimers();
      setIdleHintObjectId(undefined);

      if (disableIdleHint || !idleCandidateObjectId || selectedObject || activeOutsideSession) {
        return;
      }

      idleTimerRef.current = window.setTimeout(() => {
        setIdleHintObjectId(idleCandidateObjectId);
        idleHideTimerRef.current = window.setTimeout(() => setIdleHintObjectId(undefined), IDLE_HINT_VISIBLE_MS);
      }, IDLE_HINT_DELAY_MS);
    }

    scheduleIdleHint();
    window.addEventListener("pointerdown", scheduleIdleHint);
    window.addEventListener("keydown", scheduleIdleHint);

    return () => {
      clearIdleTimers();
      window.removeEventListener("pointerdown", scheduleIdleHint);
      window.removeEventListener("keydown", scheduleIdleHint);
    };
  }, [activeOutsideSession, disableIdleHint, idleCandidateObjectId, selectedObject]);

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
        <p className="mt-1 text-sm text-muted">{roomDayLabel}</p>
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
            idleHintObjectIds={idleHintObjectIds}
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
