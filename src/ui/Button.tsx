import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "quiet" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-warm text-paper hover:brightness-105",
  secondary: "bg-paper text-ink border border-ink/15 hover:bg-panel",
  quiet: "bg-transparent text-muted hover:bg-paper/60",
  danger: "bg-blush text-ink border border-ink/15 hover:brightness-105",
};

export function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`focus-ring inline-flex items-center justify-center rounded-full px-5 py-3 text-base font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
