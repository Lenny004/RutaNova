export function LoadingSpinner({ label = "Cargando…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 animate-fade-in-subtle">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-amber border-t-transparent" />
      <p className="text-sm text-text-muted">{label}</p>
    </div>
  );
}
