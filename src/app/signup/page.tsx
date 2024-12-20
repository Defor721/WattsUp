"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { useSignupFormStore } from "@/stores/signupFormStore";
import { Button } from "@/components/shadcn";

function Signup() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState<boolean>(false);

  const {
    email,
    password,
    verifyPassword,
    companyName,
    actions: { setEmail, setPassword, setVerifyPassword, setCompanyName },
  } = useSignupFormStore();

  const togglePassword = () => setShowPassword((prevState) => !prevState);
  const toggleVerifyPassword = () =>
    setShowVerifyPassword((prevState) => !prevState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!email || !password) {
      alert("이메일과 비밀번호를 입력하세요.");
      return;
    }

    router.push("/signup/additional");
  };

  return (
    <section className="flex items-center justify-center">
      <form onSubmit={handleSubmit}>
        <input
          className="border-2 border-black"
          name="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="flex items-center justify-center">
          <input
            className="border-2 border-black"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button size={"icon"} onClick={togglePassword}>
            {showPassword ? (
              <EyeOff className="text-muted-foreground h-5 w-5 text-black" />
            ) : (
              <Eye className="text-muted-foreground h-5 w-5 text-black" />
            )}
          </Button>
        </div>
        <div>
          <input
            className="border-2 border-black"
            type={showVerifyPassword ? "text" : "password"}
            name="verifyPassword"
            placeholder="비밀번호 확인"
            value={verifyPassword}
            onChange={(e) => setVerifyPassword(e.target.value)}
            required
          />
          <Button size={"icon"} onClick={toggleVerifyPassword}>
            {showVerifyPassword ? (
              <EyeOff className="text-muted-foreground h-5 w-5 text-black" />
            ) : (
              <Eye className="text-muted-foreground h-5 w-5 text-black" />
            )}
          </Button>
        </div>
        <input
          className="border-2 border-black"
          name="companyName"
          placeholder="대표자 이름"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />
        <div>
          <button type="submit" className="bg-slate-400">
            다음
          </button>
        </div>
      </form>
    </section>
  );
}

export default Signup;
