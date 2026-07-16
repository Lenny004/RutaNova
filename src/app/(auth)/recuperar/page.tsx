"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

export default function RecuperarPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.auth.recuperar(email);
      const params = new URLSearchParams({ email });
      if (res.resetToken) {
        params.set("token", res.resetToken);
      }
      router.push(`/recuperar/enviado?${params.toString()}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo enviar el enlace",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col justify-center px-6 py-12">
      <div className="mx-auto w-full max-w-sm animate-fade-in">
        <Link
          href="/login"
          className="mb-6 inline-flex text-sm text-accent-amber hover:underline"
        >
          ← Volver al login
        </Link>

        <h1 className="font-display text-3xl text-text-cream">
          Recuperar acceso
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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

          <Button type="submit" fullWidth loading={loading}>
            Enviar enlace
          </Button>
        </form>
      </div>
    </main>
  );
}
