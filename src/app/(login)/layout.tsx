// app/(login)/layout.tsx

function LoginLayout({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto mt-20 w-[350px]">{children}</main>;
}

export default LoginLayout;
