import { useEffect, type ReactNode } from "react";

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
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/35 p-4 backdrop-blur-md" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bottom-sheet-title"
        className="w-full max-w-[430px] rounded-[2rem] border border-border bg-white p-6 text-center shadow-bocchi"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="sr-only">
          <h2 id="bottom-sheet-title">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}
