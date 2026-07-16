import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import RestablecerForm from "./RestablecerForm";

export default function RestablecerPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <RestablecerForm />
    </Suspense>
  );
}
