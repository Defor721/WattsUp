import { ReactNode } from "react";

function LoginLayout({ children }: { children: ReactNode }) {
  return <main className="mx-auto my-auto h-full w-[480px]">{children}</main>;
}

export default LoginLayout;
