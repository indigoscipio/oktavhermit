import { useEffect, useRef, useState } from "react";
import { CareScreen } from "../features/care/CareScreen";
import { RoomScreen } from "../features/room/RoomScreen";
import { SettingsScreen } from "../features/settings/SettingsScreen";
import { loadBocchiData, saveBocchiData } from "../storage/bocchiStorage";
import type { BocchiData } from "../domain/types";
import { AssetIcon, type AssetIconName } from "../ui/AssetIcon";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { LandingPage } from "./LandingPage";

type Tab = "room" | "care" | "settings";

const tabs: Array<{ id: Tab; label: string; icon: AssetIconName }> = [
  { id: "room", label: "Room", icon: "house" },
  { id: "care", label: "Care", icon: "heart" },
  { id: "settings", label: "Settings", icon: "gear" },
];

export function App() {
  const path = window.location.pathname;

  if (path !== "/app" && path !== "/app/") {
    return <LandingPage />;
  }

  return <BocchiApp />;
}

function BocchiApp() {
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

  function handleBeginOnboarding() {
    updateData({
      ...data,
      settings: {
        ...data.settings,
        hasCompletedOnboarding: true,
      },
    });
  }

  return (
    <div className="h-dvh overflow-hidden bg-bg text-ink">
      <div className="app-frame mx-auto flex h-dvh w-full max-w-[480px] flex-col bg-bg">
        <header className="app-header flex-none px-6 pb-5 pt-6">
          <a className="focus-ring inline-flex items-center gap-3 rounded-bocchi" href="/" aria-label="Bocchi home">
            <img className="h-12 w-auto pixel-icon" src="/logo.png" alt="bocchi" />
          </a>
          <button className="focus-ring inline-flex h-12 w-12 items-center justify-center rounded-bocchi text-muted hover:bg-panel" type="button" onClick={() => setActiveTab("settings")} aria-label="Open settings">
            <Icon name="user" size={32} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-6 pb-8 pt-2">
          {activeTab === "room" ? (
            <RoomScreen data={data} now={now} onDataChange={updateData} onMessage={showToast} disableIdleHint={!data.settings.hasCompletedOnboarding} />
          ) : null}
          {activeTab === "care" ? <CareScreen data={data} now={now} /> : null}
          {activeTab === "settings" ? (
            <SettingsScreen data={data} onDataChange={updateData} onMessage={showToast} />
          ) : null}
        </main>

        {message ? (
          <div className="pointer-events-none fixed inset-x-0 bottom-28 z-30 mx-auto w-full max-w-[480px] px-6" aria-live="polite">
            <p className="rounded-[1.35rem] border border-white/10 bg-ink px-5 py-4 text-center text-lg font-bold text-white shadow-bocchi">
              {message}
            </p>
          </div>
        ) : null}

        <nav className="sticky bottom-0 z-20 grid flex-none grid-cols-3 gap-2 rounded-t-[2rem] border border-border bg-surface-soft p-3 shadow-bocchi" aria-label="Main navigation">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`focus-ring flex min-h-[88px] flex-col items-center justify-center gap-1 rounded-[1.35rem] px-2 py-3 text-sm font-bold transition ${activeTab === tab.id ? "border border-border bg-bg text-ink" : "text-muted hover:bg-panel"}`}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                <span className="flex h-11 w-11 items-center justify-center" aria-hidden="true">
                  <AssetIcon name={tab.icon} style={activeTab === tab.id ? "linear-color" : "line"} size={40} />
                </span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

        {!data.settings.hasCompletedOnboarding ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/35 p-4 backdrop-blur-md">
            <div role="dialog" aria-modal="true" aria-labelledby="onboarding-title" className="w-full max-w-[420px] rounded-[2rem] border border-border bg-white p-6 text-center shadow-bocchi">
              <div className="mb-5 overflow-hidden rounded-bocchi border border-border bg-bg">
                <img className="h-52 w-full object-cover pixel-art" src="/assets/hero-img.webp" alt="A cozy Bocchi room preview" />
              </div>
              <h2 id="onboarding-title" className="text-3xl font-bold text-ink">Welcome to your room!</h2>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                This is your smol room. Tap objects to log tiny care: water, light, food, rest, movement, hygiene, room care, and outside. Smol steps!
              </p>
              <Button className="mt-6 w-full" onClick={handleBeginOnboarding}>OK</Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
