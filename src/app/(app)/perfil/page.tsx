"use client";

import { useEffect, useState } from "react";
import { LogOut, Star, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/components/layout/AuthProvider";
import { PageHeader } from "@/components/layout/AppShell";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { api } from "@/lib/api-client";
import { formatCalificacion } from "@/lib/format";

export default function PerfilPage() {
  const { user, refresh, logout } = useAuth();
  const [nombre, setNombre] = useState(user.nombre);
  const [telefono, setTelefono] = useState(user.telefono ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setNombre(user.nombre);
    setTelefono(user.telefono ?? "");
  }, [user]);

  async function handleGuardar(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      await api.perfil.actualizar({ nombre, telefono: telefono || undefined });
      await refresh();
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Perfil" subtitle={user.email} />

      <div className="px-5 pb-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-amber/15 font-display text-2xl text-accent-amber">
            {user.nombre.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-display text-xl text-text-cream">{user.nombre}</h2>
            {user.empresa && (
              <p className="text-sm text-text-muted">{user.empresa}</p>
            )}
          </div>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
            <Star className="mx-auto h-4 w-4 text-accent-amber" />
            <p className="mt-1 font-display text-lg text-text-cream">
              {formatCalificacion(user.calificacion)}
            </p>
            <p className="text-[10px] text-text-muted">Calificación</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
            <CheckCircle className="mx-auto h-4 w-4 text-accent-green" />
            <p className="mt-1 font-display text-lg text-text-cream">
              {user.gestionesCompletadas}
            </p>
            <p className="text-[10px] text-text-muted">Completadas</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
            <XCircle className="mx-auto h-4 w-4 text-accent-action" />
            <p className="mt-1 font-display text-lg text-text-cream">
              {user.gestionesCanceladas}
            </p>
            <p className="text-[10px] text-text-muted">Canceladas</p>
          </div>
        </div>

        <form onSubmit={handleGuardar} className="space-y-4">
          {error && <ErrorMessage message={error} />}
          {success && (
            <p className="rounded-xl border border-accent-green/30 bg-accent-green/10 px-4 py-2 text-sm text-green-300">
              Perfil actualizado correctamente
            </p>
          )}

          <Input
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <Input
            label="Teléfono"
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="+503 0000 0000"
          />

          <Button type="submit" fullWidth loading={loading}>
            Guardar cambios
          </Button>
        </form>

        <div className="mt-8 border-t border-white/10 pt-6">
          <Button variant="danger" fullWidth onClick={logout}>
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </div>
    </div>
  );
}
