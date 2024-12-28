// app/(login)/layout.tsx

import { ReactNode } from "react";

function LoginLayout({ children }: { children: ReactNode }) {
  return <main className="mx-auto my-20 w-[400px]">{children}</main>;
}

export default LoginLayout;
