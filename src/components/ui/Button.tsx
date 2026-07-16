import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent-action text-white hover:bg-[#c23a3a] shadow-lg shadow-accent-action/20",
  secondary:
    "bg-accent-amber/15 text-accent-amber border border-accent-amber/30 hover:bg-accent-amber/25",
  danger:
    "bg-red-900/40 text-red-300 border border-red-500/30 hover:bg-red-900/60",
  ghost: "bg-transparent text-text-muted hover:text-text-cream hover:bg-white/5",
};

export function Button({
  variant = "primary",
  loading = false,
  fullWidth = false,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3
        text-sm font-semibold transition-all duration-200
        disabled:cursor-not-allowed disabled:opacity-50
        active:scale-[0.98]
        ${variantClasses[variant]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Procesando…</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
