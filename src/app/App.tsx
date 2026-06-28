import { useEffect, useState } from "react";
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
  const [message, setMessage] = useState("Open Bocchi. Care for your small world.");

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  function updateData(nextData: BocchiData) {
    setData(nextData);
    saveBocchiData(nextData);
  }

  return (
    <div className="min-h-screen bg-bg text-ink sm:flex sm:items-center sm:justify-center sm:p-4">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-paper shadow-bocchi sm:min-h-[820px] sm:max-h-[calc(100vh-2rem)] sm:rounded-[2rem] sm:border sm:border-ink/10">
        <header className="flex-none border-b border-ink/10 bg-paper/95 px-5 py-4 text-center">
          <p className="text-3xl font-bold tracking-[0.18em] text-ink">bocchi</p>
        </header>

        <main className="flex-1 overflow-y-auto px-4 pb-4 pt-4">
          {activeTab === "room" ? (
            <RoomScreen data={data} now={now} onDataChange={updateData} onMessage={setMessage} />
          ) : null}
          {activeTab === "care" ? <CareScreen data={data} now={now} /> : null}
          {activeTab === "settings" ? (
            <SettingsScreen data={data} onDataChange={updateData} onMessage={setMessage} />
          ) : null}
        </main>

        <footer className="flex-none border-t border-ink/10 bg-panel/60 px-4 py-3 text-center text-sm text-muted" aria-live="polite">
          {message}
        </footer>

        <nav className="grid flex-none grid-cols-3 border-t border-ink/10 bg-paper" aria-label="Main navigation">
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
