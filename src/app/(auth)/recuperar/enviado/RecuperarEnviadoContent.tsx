"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function RecuperarEnviadoContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "tu correo";
  const token = searchParams.get("token");

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      <div className="mx-auto w-full max-w-sm text-center animate-fade-in">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-green/15 text-accent-green">
          <MailCheck className="h-8 w-8" />
        </div>

        <h1 className="font-display text-2xl text-text-cream">
          Revisa tu correo
        </h1>
        <p className="mt-3 text-sm text-text-muted">
          Si existe una cuenta para{" "}
          <span className="font-medium text-text-cream">{email}</span>, recibirás
          instrucciones para restablecer tu contraseña.
        </p>

        {token && (
          <div className="mt-6 rounded-xl border border-accent-amber/20 bg-accent-amber/10 p-4 text-left">
            <p className="text-xs font-medium text-accent-amber">
              Modo desarrollo
            </p>
            <p className="mt-1 text-xs text-text-muted">
              Usa este enlace para restablecer:
            </p>
            <Link
              href={`/recuperar/restablecer?token=${token}`}
              className="mt-2 block break-all text-sm text-accent-amber hover:underline"
            >
              Restablecer contraseña →
            </Link>
          </div>
        )}

        <div className="mt-8">
          <Link href="/login">
            <Button variant="secondary" fullWidth>
              Volver al login
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
