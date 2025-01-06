// app/(signup)/layout.tsx

function SignupLayout({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto my-20 w-[480px]">{children}</main>;
}

export default SignupLayout;
