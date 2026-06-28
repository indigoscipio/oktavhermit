import type { RoomAssetMap } from "./roomAssets";

type RoomShellProps = {
  assets: RoomAssetMap;
};

export function RoomShell({ assets }: RoomShellProps) {
  if (assets["room-shell"]) {
    return <img className="room-shell-asset" src={assets["room-shell"]} alt="" aria-hidden="true" />;
  }

  return (
    <div className="room-shell-placeholder" aria-hidden="true">
      <div className="room-shell-wall room-shell-wall--left" />
      <div className="room-shell-wall room-shell-wall--right" />
      <div className="room-shell-floor" />
    </div>
  );
}
