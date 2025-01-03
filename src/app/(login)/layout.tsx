// app/(login)/layout.tsx

import { ReactNode } from "react";

function LoginLayout({ children }: { children: ReactNode }) {
  return <main className="h-screen w-screen">{children}</main>;
}

export default LoginLayout;
