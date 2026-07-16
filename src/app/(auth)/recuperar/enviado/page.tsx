import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import RecuperarEnviadoContent from "./RecuperarEnviadoContent";

export default function RecuperarEnviadoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <RecuperarEnviadoContent />
    </Suspense>
  );
}
