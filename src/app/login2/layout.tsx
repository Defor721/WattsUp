import { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex w-full justify-center">{children}</div>;
}
