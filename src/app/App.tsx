import { useEffect, useRef, useState } from "react";
import { CareScreen } from "../features/care/CareScreen";
import { RoomScreen } from "../features/room/RoomScreen";
import { SettingsScreen } from "../features/settings/SettingsScreen";
import { loadBocchiData, saveBocchiData } from "../storage/bocchiStorage";
import type { BocchiData } from "../domain/types";

type Tab = "room" | "care" | "settings";

const tabs: Array<{ id: Tab; label: string; mark: string }> = [
  { id: "room", label: "Room", mark: "□" },
  { id: "care", label: "Care", mark: "♡" },
  { id: "settings", label: "Settings", mark: "◇" },
];

export function App() {
  const [data, setData] = useState<BocchiData>(() => loadBocchiData());
  const [activeTab, setActiveTab] = useState<Tab>("room");
  const [now, setNow] = useState(() => new Date());
  const [message, setMessage] = useState<string | undefined>();
  const toastTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  function updateData(nextData: BocchiData) {
    setData(nextData);
    saveBocchiData(nextData);
  }

  function showToast(nextMessage: string) {
    setMessage(nextMessage);

    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = window.setTimeout(() => setMessage(undefined), 2600);
  }

  return (
    <div className="h-dvh overflow-hidden bg-bg text-ink">
      <div className="mx-auto flex h-dvh w-full max-w-md flex-col bg-paper">
        <header className="flex-none border-b border-ink/10 bg-paper/95 px-5 py-4 text-center">
          <p className="text-3xl font-bold tracking-[0.18em] text-ink">bocchi</p>
        </header>

        <main className="flex-1 overflow-y-auto px-4 pb-8 pt-4">
          {activeTab === "room" ? (
            <RoomScreen data={data} now={now} onDataChange={updateData} onMessage={showToast} />
          ) : null}
          {activeTab === "care" ? <CareScreen data={data} now={now} /> : null}
          {activeTab === "settings" ? (
            <SettingsScreen data={data} onDataChange={updateData} onMessage={showToast} />
          ) : null}
        </main>

        {message ? (
          <div className="pointer-events-none fixed inset-x-0 bottom-24 z-30 mx-auto w-full max-w-md px-4" aria-live="polite">
            <p className="rounded-full border border-ink/10 bg-ink px-4 py-3 text-center text-sm text-paper shadow-bocchi">
              {message}
            </p>
          </div>
        ) : null}

        <nav className="sticky bottom-0 z-20 grid flex-none grid-cols-3 border-t border-ink/10 bg-paper" aria-label="Main navigation">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`focus-ring flex flex-col items-center gap-1 px-2 py-3 text-sm font-semibold transition ${activeTab === tab.id ? "bg-panel text-ink" : "text-muted hover:bg-panel/50"}`}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-full text-xl ${activeTab === tab.id ? "bg-warm/20" : ""}`} aria-hidden="true">
                  {tab.mark}
                </span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
      </div>
    </div>
  );
}
