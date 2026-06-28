import { addCareLog, getLogsForDay } from "../../domain/care";
import { getLocalDay } from "../../domain/dates";
import { deriveRoomState } from "../../domain/room";
import { endOutsideSession, getActiveOutsideSession, getOutsideElapsedSeconds, startOutsideSession } from "../../domain/outside";
import type { BocchiData, CareKind, RoomObjectState } from "../../domain/types";
import { Card } from "../../ui/Card";
import { useEffect, useRef, useState } from "react";
import { ObjectActionSheet } from "./ObjectActionSheet";
import { OutsidePanel } from "./OutsidePanel";
import { RoomScene, type AvatarReaction } from "./RoomScene";

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
  const roomState = deriveRoomState(data, now);
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
    <div className="space-y-5">
      <Card className="room-shell p-3 sm:p-5">
        <div className="mb-4 px-1 text-ink">
          <p className="text-sm uppercase tracking-wide text-muted">Room</p>
          <h1 className="text-3xl font-bold">{roomTitle}</h1>
        </div>
        <RoomScene
          objects={roomState.objects}
          hasActiveOutsideSession={roomState.hasActiveOutsideSession}
          avatarReaction={avatarReaction}
          onObjectClick={setSelectedObject}
        />
      </Card>

      <Card>
        <p className="text-lg text-muted">
          {isSmallWorldCaredFor ? "Small world cared for. Take it easy." : "Tap a room object. One tiny action is enough."}
        </p>
      </Card>

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
  return useState<RoomObjectState | undefined>(undefined);
}
