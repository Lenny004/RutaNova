"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, MessageCircle, User } from "lucide-react";

const navItems = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/gestiones", label: "Gestiones", icon: Package },
  { href: "/chats", label: "Chats", icon: MessageCircle },
  { href: "/perfil", label: "Perfil", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-bg-charcoal/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`
                nav-item flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium
                ${active ? "text-accent-amber" : "text-text-muted hover:text-text-cream"}
              `}
            >
              <Icon className={`h-5 w-5 ${active ? "stroke-[2.5]" : ""}`} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col pb-20">
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  backHref,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
}) {
  return (
    <header className="animate-fade-in px-5 pt-6 pb-4">
      {backHref && (
        <Link
          href={backHref}
          className="mb-2 inline-flex text-sm text-accent-amber hover:underline"
        >
          ← Volver
        </Link>
      )}
      <h1 className="font-display text-2xl text-text-cream">{title}</h1>
      {subtitle && (
        <p className="mt-1 text-sm text-text-muted">{subtitle}</p>
      )}
    </header>
  );
}
