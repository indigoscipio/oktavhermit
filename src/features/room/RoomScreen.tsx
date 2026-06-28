import { addCareLog } from "../../domain/care";
import { deriveRoomState } from "../../domain/room";
import { cancelOutsideSession, endOutsideSession, getActiveOutsideSession, getOutsideElapsedSeconds, startOutsideSession } from "../../domain/outside";
import type { BocchiData, CareKind, RoomObjectState } from "../../domain/types";
import { Card } from "../../ui/Card";
import { useState } from "react";
import { ObjectActionSheet } from "./ObjectActionSheet";
import { OutsidePanel } from "./OutsidePanel";
import { RoomScene } from "./RoomScene";

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
  rest: "Rest logged. Small care counts.",
  room: "Room care logged. Small care counts.",
  outside: "Outside logged. Small care counts.",
};

export function RoomScreen({ data, now, onDataChange, onMessage }: RoomScreenProps) {
  const roomState = deriveRoomState(data, now);
  const activeOutsideSession = getActiveOutsideSession(data);
  const [selectedObject, setSelectedObject] = useRoomSelection();
  const coreObjects = roomState.objects.filter((object) => object.careKind !== "outside");
  const isSmallWorldCaredFor = coreObjects.length > 0 && coreObjects.every((object) => object.state === "done");

  function handleCareDone(kind: CareKind) {
    const nextData = addCareLog(data, kind, { now });
    onDataChange(nextData);
    setSelectedObject(undefined);
    onMessage(doneCopy[kind]);
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
    onMessage(`You came back. That counts. Outside: ${duration} min`);
  }

  function handleCancelOutside() {
    onDataChange(cancelOutsideSession(data));
    onMessage("Outside canceled. Your room is here.");
  }

  return (
    <div className="space-y-5">
      <Card className="room-shell p-3 sm:p-5">
        <div className="mb-4 px-1 text-ink">
          <p className="text-sm uppercase tracking-wide text-muted">Room</p>
          <h1 className="text-3xl font-bold">Care for your small world.</h1>
        </div>
        <RoomScene
          objects={roomState.objects}
          hasActiveOutsideSession={roomState.hasActiveOutsideSession}
          onObjectClick={setSelectedObject}
        />
      </Card>

      {activeOutsideSession ? (
        <OutsidePanel session={activeOutsideSession} now={now} onReturn={handleReturn} onCancel={handleCancelOutside} />
      ) : null}

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
