import { useEffect, type ReactNode } from "react";
import { Button } from "./Button";

type BottomSheetProps = {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export function BottomSheet({ isOpen, title, children, onClose }: BottomSheetProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink/35 p-3 backdrop-blur-sm sm:items-center" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bottom-sheet-title"
        className="w-full max-w-md rounded-bocchi border border-ink/10 bg-paper p-5 shadow-bocchi"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id="bottom-sheet-title" className="text-2xl font-bold text-ink">{title}</h2>
          <Button variant="quiet" className="px-3 py-2" onClick={onClose} aria-label="Close sheet">
            Close
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
