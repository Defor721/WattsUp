"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useSignupFormStore } from "@/stores/signupFormStore";

export default function AdditionalInfo() {
  const router = useRouter();
  const [form, setForm] = useState({ businessType: "", companyName: "" });
  const { email, password, verifyPassword, companyName } = useSignupFormStore();

  console.log(email, password, verifyPassword, companyName);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    // 서버에 추가 정보 제출
    const response = await fetch("/api/submit-additional-info", {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      // TODO: 토스트로 교체
      console.log("추가 정보 제출 완료");
      router.push("/dashboard"); // 메인 페이지로 리다이렉트
    } else {
      console.error("오류 발생");
    }
  }

  return (
    <div>
      <h1>추가 정보 입력</h1>
      <form onSubmit={handleSubmit}>
        <label>사업자 유형:</label>
        <select
          value={form.businessType}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, businessType: e.target.value }))
          }
        >
          <option value="">선택하세요</option>
          <option value="individual">개인 사업자</option>
          <option value="corporate">법인 사업자</option>
        </select>

        <label>회사명:</label>
        <input
          type="text"
          value={form.companyName}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, companyName: e.target.value }))
          }
        />

        <button type="submit">제출</button>
      </form>
    </div>
  );
}
