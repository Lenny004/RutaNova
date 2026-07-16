import type { ReactNode } from "react";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
};

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center animate-fade-in">
      {icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-accent-amber">
          {icon}
        </div>
      )}
      <h3 className="font-display text-lg text-text-cream">{title}</h3>
      {description && (
        <p className="max-w-xs text-sm text-text-muted">{description}</p>
      )}
    </div>
  );
}
