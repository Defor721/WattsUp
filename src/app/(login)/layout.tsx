// app/(login)/layout.tsx

function LoginLayout({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto flex flex-col">{children}</main>;
}

export default LoginLayout;
