import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <section
      className={`rounded-bocchi border border-border bg-paper p-5 shadow-bocchi ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
