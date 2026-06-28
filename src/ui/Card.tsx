import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <section
      className={`rounded-bocchi border border-ink/10 bg-paper p-5 ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
