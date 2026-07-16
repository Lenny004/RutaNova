export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-pattern flex min-h-dvh flex-col">{children}</div>
  );
}
