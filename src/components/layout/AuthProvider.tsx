"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api, type Usuario } from "@/lib/api-client";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

type AuthContextValue = {
  user: Usuario;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refresh = useCallback(async () => {
    try {
      const { user: sessionUser } = await api.auth.me();
      setUser(sessionUser);
    } catch {
      setUser(null);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.auth.logout();
    } finally {
      setUser(null);
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { user: sessionUser } = await api.auth.me();
        if (active) setUser(sessionUser);
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, router, pathname]);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <LoadingSpinner label="Verificando sesión…" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <AuthContext.Provider value={{ user: user!, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
