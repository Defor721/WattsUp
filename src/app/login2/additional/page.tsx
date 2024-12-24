"use client";

import { useState } from "react";

import apiClient from "@/lib/axios";
import { validateBusinessNumber } from "@/auth/authService";

export default function AdditionalPage() {
  const [businessNumber, setBusinessNumber] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isBusinessValid, setIsBusinessValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [businessType, setBusinessType] = useState("corporate");

  const handleCheckBusinessNumber = async () => {
    setIsLoading(true);
    setStatusMessage("");
    setIsBusinessValid(false);

    try {
      const data = await validateBusinessNumber(businessNumber);

      console.log(data);
      setIsBusinessValid(true);
      setStatusMessage("유효한 사업자 등록번호입니다.");
    } catch (error: any) {
      setStatusMessage(error.message || `서버 오류가 발생했습니다.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await apiClient.post("/api/auth/validatebusiness", {
        businessNumber,
      });
      console.log(`AdditionalPage: `, data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4 bg-slate-100 p-6">
      <h1 className="text-xl font-bold">추가 정보 입력</h1>
      <div className="flex flex-col gap-2">
        {/* 1118194369 */}
        <label htmlFor="businessNumber"> 사업자 번호 </label>
        <input
          id="businessNumber"
          type="text"
          value={businessNumber}
          onChange={(e) => setBusinessNumber(e.target.value)}
          required
          placeholder="사업자 번호 10자리를 입력해주세요."
          className="rounded border p-2"
        />
        <button
          type="button"
          onClick={handleCheckBusinessNumber}
          disabled={isLoading}
          className={`mt-2 rounded p-2 text-white ${
            isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "확인 중..." : "사업자번호 확인"}
        </button>
        {statusMessage && (
          <p
            className={`mt-2 font-semibold ${
              isBusinessValid ? "text-green-500" : "text-red-500"
            }`}
          >
            {statusMessage}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2">
          <div>
            <input
              id="corporate"
              type="radio"
              name="businessType"
              value="corporate"
              checked={businessType === "corporate"}
              onChange={() => setBusinessType("corporate")}
            />
            <label id="corporate">법인 사업자</label>
          </div>
          <div>
            <input
              id="individual"
              type="radio"
              name="businessType"
              value="individual"
              checked={businessType === "individual"}
              onChange={() => setBusinessType("individual")}
            />
            <label id="individual">개인 사업자</label>
          </div>
        </div>
        {businessType === "corporate" && (
          <div className="flex flex-col gap-2">
            <label id="corporateNumber">법인등록번호</label>
            <input
              id="corporateNumber"
              type="text"
              name="corporateNumber"
              placeholder="법인등록번호 13자리를 입력해주세요."
              className="rounded border p-2"
            />
          </div>
        )}
        {businessType === "individual" && (
          <div className="flex flex-col gap-2">
            <label id="personalId">주민등록번호</label>
            <input
              id="personalId"
              type="text"
              name="personalId"
              placeholder="주민등록번호 앞 6자리를 입력해주세요."
              className="rounded border p-2"
            />
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <button
          type="submit"
          disabled={!isBusinessValid}
          className={`rounded p-2 text-white ${
            isBusinessValid
              ? "bg-blue-600 hover:bg-blue-700"
              : "cursor-not-allowed bg-gray-400"
          }`}
        >
          제출
        </button>
      </form>
    </div>
  );
}
