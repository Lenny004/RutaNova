import { AlertCircle } from "lucide-react";

type ErrorMessageProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-accent-action/30 bg-accent-action/10 p-6 text-center animate-fade-in">
      <AlertCircle className="h-6 w-6 text-accent-action" />
      <p className="text-sm text-text-cream">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-sm font-medium text-accent-amber hover:underline"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
