import { CARE_KINDS, CARE_LABELS } from "../../domain/defaults";
import { getActiveOutsideSession } from "../../domain/outside";
import type { BocchiData, CareKind } from "../../domain/types";
import { exportBocchiData, resetBocchiData } from "../../storage/bocchiStorage";
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
    <div className="space-y-5">
      <Card>
        <p className="text-sm uppercase tracking-wide text-muted">Settings</p>
        <h1 className="text-4xl font-bold text-ink">Keep Bocchi small.</h1>
        <p className="mt-3 text-lg text-muted">Choose what appears in your room.</p>
      </Card>

      <Card>
        <label className="block text-2xl font-bold text-ink" htmlFor="settings-name">Name</label>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            id="settings-name"
            className="focus-ring min-w-0 flex-1 rounded-2xl border border-ink/10 bg-panel/50 px-4 py-3 text-lg text-ink placeholder:text-muted"
            type="text"
            maxLength={40}
            placeholder="Your name"
            value={draftName}
            onChange={(event) => setDraftName(event.currentTarget.value.slice(0, 40))}
          />
          <Button onClick={handleNameSave}>Save name</Button>
        </div>
      </Card>

      <Card>
        <details className="group">
          <summary className="focus-ring flex cursor-pointer list-none items-start justify-between gap-4 rounded-2xl">
            <span>
              <h2 className="text-2xl font-bold text-ink">Care areas</h2>
              <p className="mt-1 text-muted">Choose which care areas appear in Today.</p>
            </span>
            <Icon name="chevronRight" size={22} className="mt-1 shrink-0 text-muted transition-transform group-open:rotate-90" />
          </summary>
          <div className="mt-4 space-y-3">
            {CARE_KINDS.map((kind) => {
              const checked = data.settings.enabledCareKinds.includes(kind);
              const disabled = kind === "outside" && Boolean(activeOutside) && checked;

              return (
                <label key={kind} className="flex items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-panel/50 px-4 py-3">
                  <span className="flex items-center gap-3 text-lg font-semibold text-ink">
                    <Icon name={kind === "room" ? "room" : kind} size={22} />
                    {CARE_LABELS[kind]}
                  </span>
                  <input
                    className="focus-ring h-6 w-6 accent-warm"
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={() => toggleCareKind(kind)}
                  />
                </label>
              );
            })}
          </div>
        </details>
      </Card>

      <Card>
        <h2 className="mb-3 text-2xl font-bold text-ink">Your data</h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={handleExport}><Icon name="export" size={20} className="mr-2" />Export data</Button>
          <Button variant="danger" onClick={() => setIsClearOpen(true)}><Icon name="delete" size={20} className="mr-2" />Clear all data</Button>
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-2xl font-bold text-ink">Privacy</h2>
        <p className="text-lg leading-relaxed text-muted">
          Bocchi stores your data locally on this device. There is no account, no cloud sync, no ads, and no tracking. You can export or clear your data anytime.
        </p>
        <p className="mt-3 text-lg leading-relaxed text-muted">
          Because your data stays in this browser, clearing browser data may remove it. Export a backup if you want to keep it.
        </p>
      </Card>

      <Dialog isOpen={isClearOpen} title="Clear all data?" onClose={() => setIsClearOpen(false)}>
        <div className="space-y-4">
          <p className="text-lg text-muted">This removes your Bocchi room care logs and outside sessions from this browser.</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="danger" onClick={handleClear}>Clear data</Button>
            <Button variant="secondary" onClick={() => setIsClearOpen(false)}>Not now</Button>
          </div>
        </div>
      </Dialog>

      <footer className="pb-2 text-center text-sm text-muted">
        bocchi by{" "}
        <a className="font-semibold text-ink underline decoration-warm/40 underline-offset-4" href="https://oktavsoftware.com/" target="_blank" rel="noreferrer">
          oktavsoftware
        </a>{" "}
        version 0.0.0{" "}
        <a className="font-semibold text-ink underline decoration-warm/40 underline-offset-4" href="https://github.com/indigoscipio/oktavhermit" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </footer>
    </div>
  );
}
