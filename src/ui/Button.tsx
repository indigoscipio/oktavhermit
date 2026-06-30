import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "quiet" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-warm text-white hover:bg-warmHover",
  secondary: "border border-warm/40 bg-white/40 text-warm hover:bg-brandSoft/50",
  quiet: "bg-transparent text-muted hover:bg-panel/70",
  danger: "border border-blush/40 bg-dangerSoft text-red-700 hover:brightness-105",
};

export function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`focus-ring inline-flex min-h-12 items-center justify-center rounded-[1.25rem] px-5 py-3 text-base font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
