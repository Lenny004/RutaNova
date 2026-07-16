"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

export default function RestablecerForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Token de restablecimiento no válido");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      await api.auth.restablecer(token, password, confirmPassword);
      router.replace("/login");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo restablecer",
      );
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="mx-auto w-full max-w-sm animate-fade-in">
          <ErrorMessage message="Enlace de restablecimiento inválido o expirado." />
          <Link
            href="/recuperar"
            className="mt-4 block text-center text-sm text-accent-amber hover:underline"
          >
            Solicitar nuevo enlace
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col justify-center px-6 py-12">
      <div className="mx-auto w-full max-w-sm animate-fade-in">
        <h1 className="font-display text-3xl text-text-cream">
          Nueva contraseña
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Elige una contraseña segura para tu cuenta.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && <ErrorMessage message={error} />}

          <Input
            label="Nueva contraseña"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />

          <Input
            label="Confirmar contraseña"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
          />

          <Button type="submit" fullWidth loading={loading}>
            Restablecer contraseña
          </Button>
        </form>
      </div>
    </main>
  );
}
