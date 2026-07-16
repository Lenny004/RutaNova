import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, id, className = "", ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-text-cream/90">
        {label}
      </label>
      <input
        id={inputId}
        className={`
          w-full rounded-xl border bg-white/5 px-4 py-3 text-text-cream
          placeholder:text-text-muted/60
          transition-colors duration-200
          focus:border-accent-amber/50 focus:outline-none focus:ring-2 focus:ring-accent-amber/20
          ${error ? "border-accent-action/60" : "border-white/10"}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-accent-action">{error}</p>}
    </div>
  );
}
