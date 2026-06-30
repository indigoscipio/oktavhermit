import { CARE_KINDS, CARE_LABELS } from "../../domain/defaults";
import { getActiveOutsideSession } from "../../domain/outside";
import type { BocchiData, CareKind } from "../../domain/types";
import { exportBocchiData, resetBocchiData } from "../../storage/bocchiStorage";
import { AssetIcon, careIconMap } from "../../ui/AssetIcon";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { Dialog } from "../../ui/Dialog";
import { Icon } from "../../ui/Icon";
import { useEffect, useState } from "react";

type SettingsScreenProps = {
  data: BocchiData;
  onDataChange: (data: BocchiData) => void;
  onMessage: (message: string) => void;
};

export function SettingsScreen({ data, onDataChange, onMessage }: SettingsScreenProps) {
  const [isClearOpen, setIsClearOpen] = useState(false);
  const [draftName, setDraftName] = useState(data.settings.name ?? "");
  const activeOutside = getActiveOutsideSession(data);

  useEffect(() => {
    setDraftName(data.settings.name ?? "");
  }, [data.settings.name]);

  function toggleCareKind(kind: CareKind) {
    const isEnabled = data.settings.enabledCareKinds.includes(kind);

    if (kind === "outside" && isEnabled && activeOutside) {
      onMessage("Come back before turning Outside off.");
      return;
    }

    const enabledCareKinds = isEnabled
      ? data.settings.enabledCareKinds.filter((item) => item !== kind)
      : [...data.settings.enabledCareKinds, kind];

    onDataChange({
      ...data,
      settings: {
        ...data.settings,
        enabledCareKinds,
      },
    });
  }

  function handleNameSave() {
    const nextName = draftName.slice(0, 40);

    onDataChange({
      ...data,
      settings: {
        ...data.settings,
        name: nextName.trim() ? nextName : undefined,
      },
    });
    onMessage("Name updated.");
  }

  function handleExport() {
    const blob = new Blob([exportBocchiData(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bocchi-export.json";
    link.click();
    URL.revokeObjectURL(url);
    onMessage("Data exported.");
  }

  function handleClear() {
    onDataChange(resetBocchiData());
    setIsClearOpen(false);
    onMessage("Bocchi data cleared.");
  }

  return (
    <div className="space-y-6 pb-2">
      <h1 className="text-4xl font-bold text-ink">Settings</h1>

      <Card>
        <label className="block text-xl font-bold text-ink" htmlFor="settings-name">Name</label>
        <div className="mt-3 flex gap-3">
          <div className="relative min-w-0 flex-1">
            <Icon name="user" size={28} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              id="settings-name"
              className="focus-ring min-h-14 w-full rounded-[1.15rem] border border-ink/20 bg-white px-4 py-3 pl-14 text-lg text-ink placeholder:text-muted shadow-bocchi"
              type="text"
              maxLength={40}
              placeholder="Enter your name..."
              value={draftName}
              onChange={(event) => setDraftName(event.currentTarget.value.slice(0, 40))}
            />
          </div>
          <Button onClick={handleNameSave}>Save name</Button>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <details className="group">
          <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-4 p-5">
            <span className="text-left">
              <h2 className="text-2xl font-bold text-ink">Care areas</h2>
              <p className="mt-1 text-lg text-muted">Which care areas appear in today</p>
            </span>
            <Icon name="chevronDown" size={34} className="shrink-0 text-muted transition-transform group-open:rotate-180" />
          </summary>
          <div className="border-t border-border px-5 py-2">
            {CARE_KINDS.map((kind) => {
              const checked = data.settings.enabledCareKinds.includes(kind);
              const disabled = kind === "outside" && Boolean(activeOutside) && checked;

              return (
                <label key={kind} className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-b-0">
                  <span className="flex items-center gap-3 text-xl font-bold text-ink">
                    <AssetIcon name={careIconMap[kind]} size={40} />
                    {CARE_LABELS[kind]}
                  </span>
                  <input
                    className="peer sr-only"
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={() => toggleCareKind(kind)}
                  />
                  <span className={`flex h-10 w-[70px] items-center rounded-full p-1 transition ${checked ? "bg-moss" : "bg-stone-200"} ${disabled ? "opacity-60" : ""}`}>
                    <span className={`h-8 w-8 rounded-full bg-white shadow transition ${checked ? "translate-x-[30px]" : ""}`} />
                  </span>
                </label>
              );
            })}
          </div>
        </details>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="p-5">
          <h2 className="text-2xl font-bold text-ink">Export/Import</h2>
          <p className="mt-1 text-lg text-muted">Keep a copy of your local Bocchi data.</p>
        </div>
        <button className="focus-ring flex w-full items-center justify-between border-t border-border px-5 py-4 text-left text-xl font-bold text-ink" type="button" onClick={handleExport}>
          <span className="flex items-center gap-3"><Icon name="export" size={32} />Export All Data</span>
          <Icon name="chevronRight" size={26} className="text-muted" />
        </button>
        <button className="focus-ring flex w-full items-center justify-between border-t border-border px-5 py-4 text-left text-xl font-bold text-red-700" type="button" onClick={() => setIsClearOpen(true)}>
          <span className="flex items-center gap-3"><Icon name="delete" size={32} />Clear All Data</span>
          <Icon name="chevronRight" size={26} className="text-muted" />
        </button>
      </Card>

      <Card className="flex items-center gap-4 border-warning bg-warningSoft">
        <AssetIcon name="lock" size={58} />
        <div>
          <h2 className="text-2xl font-bold text-ink">Your Privacy Matters</h2>
          <p className="mt-1 text-lg leading-relaxed text-muted">Stored locally on this device. No account, no cloud sync, no tracking.</p>
        </div>
      </Card>

      <Dialog isOpen={isClearOpen} title="Clear all data?" onClose={() => setIsClearOpen(false)}>
        <div className="space-y-4">
          <p className="text-lg text-muted">This removes your Bocchi room care logs and outside sessions from this browser.</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="danger" onClick={handleClear}>Clear data</Button>
            <Button variant="secondary" onClick={() => setIsClearOpen(false)}>Maybe later</Button>
          </div>
        </div>
      </Dialog>

      <footer className="pb-2 text-center text-base leading-relaxed text-muted">
        bocchi by{" "}
        <a className="font-semibold text-ink underline decoration-warm/40 underline-offset-4" href="https://oktavsoftware.com/" target="_blank" rel="noreferrer">
          oktavsoftware
        </a>{" "}
        version 1.0.0{" "}
        <a className="font-semibold text-ink underline decoration-warm/40 underline-offset-4" href="https://github.com/indigoscipio/oktavhermit" target="_blank" rel="noreferrer">
          GitHub Link
        </a>
      </footer>
    </div>
  );
}
