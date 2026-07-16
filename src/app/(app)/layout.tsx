import { AuthProvider } from "@/components/layout/AuthProvider";
import { AppShell, BottomNav } from "@/components/layout/AppShell";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AppShell>{children}</AppShell>
      <BottomNav />
    </AuthProvider>
  );
}
