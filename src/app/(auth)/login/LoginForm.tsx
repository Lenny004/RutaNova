"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    api.auth
      .me()
      .then(() => router.replace(redirect))
      .catch(() => setChecking(false));
  }, [router, redirect]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.auth.login(email, password);
      router.replace(redirect);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo iniciar sesión",
      );
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <main className="flex flex-1 flex-col justify-center px-6 py-12">
      <div className="mx-auto w-full max-w-sm animate-fade-in">
        <div className="mb-10 text-center">
          <h1 className="font-display text-5xl font-semibold tracking-tight text-text-cream">
            Ruta<span className="text-accent-amber">Nova</span>
          </h1>
          <p className="mt-3 text-lg font-medium text-text-cream/90">
            Tu ruta, tu control
          </p>
          <p className="mt-2 text-sm text-text-muted">
            Gestiona entregas, chatea con tu equipo y navega con confianza.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <ErrorMessage message={error} />}

          <Input
            label="Correo electrónico"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@empresa.com"
            required
          />

          <Input
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <div className="text-right">
            <Link
              href="/recuperar"
              className="text-sm text-accent-amber hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <Button type="submit" fullWidth loading={loading}>
            Iniciar sesión
          </Button>
        </form>

        <p className="mt-8 text-center text-xs text-text-muted/70">
          Demo: carlos.andrade@rutanova.app / RutaNova2024!
        </p>
      </div>
    </main>
  );
}
