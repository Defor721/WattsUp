"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { businessInfoVerification } from "@/auth/authService";
import { useAuthStore } from "@/auth/useAuthStore";
import useAccessToken from "@/auth/useAccessToken";

export default function AdditionalPage() {
  const router = useRouter();
  const { setAccessToken } = useAccessToken();
  const {
    accessToken,
    redirectTo,
    actions: { socialSignup, resetLoginState },
  } = useAuthStore();

  const [businessNumber, setBusinessNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [pricipalName, setPricipleName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState<"corporate" | "individual">(
    "corporate",
  );
  const [corporateNumber, setCorporateNumber] = useState("");
  const [personalId, setPersonalId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isBusinessValid, setIsBusinessValid] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleCheckBusinessNumber = async () => {
    setIsLoading(true);
    setStatusMessage("");
    setIsBusinessValid(false);

    try {
      await businessInfoVerification(
        businessNumber,
        startDate,
        pricipalName,
        companyName,
      );
      setIsBusinessValid(true);
      setStatusMessage("유효한 사업자 등록번호입니다.");
    } catch (error: any) {
      setStatusMessage(
        error.response.data.message || `서버 오류가 발생했습니다.`,
      );
      setIsBusinessValid(false);
    } finally {
      setIsLoading(false);
    }
  };

  const resetBusinessInfo = () => {
    setBusinessNumber("");
    setStartDate("");
    setPricipleName("");
    setIsBusinessValid(false);
    setStatusMessage("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      socialSignup({
        businessNumber,
        startDate,
        pricipalName,
        companyName,
        businessType,
        corporateNumber,
        personalId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      setAccessToken(accessToken);
      resetLoginState();
      router.push(redirectTo);
    }
  }, [accessToken]);

  {
    /* TODO: 아래 인풋 예시 주석 모두 지울것 */
    /* 사업자 번호: 1118194369 */
    /* 개업일자: 20221201 */
    // 상호: (주)터빈크루
    /* 대표자 성명: 전기은 */
  }

  return (
    <div className="flex w-full flex-col gap-4 bg-slate-100 p-6">
      <h1 className="text-xl font-bold">추가 정보 입력</h1>
      {/* 사업자 번호 및 대표자 성명 검증 */}
      <div className="flex flex-col gap-2">
        <label htmlFor="businessNumber">사업자 번호</label>
        <input
          className="rounded border p-2"
          id="businessNumber"
          type="text"
          placeholder="'-' 기호를 제외한 사업자 번호 10자리를 입력해주세요. 예) 0000000000"
          value={businessNumber}
          onChange={(e) => setBusinessNumber(e.target.value)}
          required
          disabled={isBusinessValid}
        />
        <label htmlFor="startDate">개업일자</label>
        <input
          className="rounded border p-2"
          id="startDate"
          type="text"
          placeholder="YYYYMMDD 포맷으로 개업일자 8자리를 입력해주세요. 예) 20000101"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          disabled={isBusinessValid}
        />
        <label htmlFor="companyName">상호</label>
        <input
          className="rounded border p-2"
          id="companyName"
          type="text"
          placeholder="상호를 입력해주세요. 주식회사인 경우 예: (주)회사명, 주식회사 회사명"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
          disabled={isBusinessValid}
        />
        <label htmlFor="pricipalName">대표자 성명</label>
        <input
          className="rounded border p-2"
          id="pricipalName"
          type="text"
          placeholder="대표자 이름을 입력해주세요. 외국인 사업자의 경우에는 영문명 입력해주세요."
          value={pricipalName}
          onChange={(e) => setPricipleName(e.target.value)}
          required
          disabled={isBusinessValid}
        />
        {isBusinessValid ? (
          <button
            type="button"
            onClick={resetBusinessInfo}
            className="mt-2 rounded bg-gray-600 p-2 text-white hover:bg-gray-700"
          >
            사업자번호 수정
          </button>
        ) : (
          <button
            className={`mt-2 rounded p-2 text-white ${
              isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
            type="button"
            onClick={handleCheckBusinessNumber}
            disabled={isLoading}
          >
            {isLoading ? "확인 중..." : "사업자번호 확인"}
          </button>
        )}
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
      {/* 법인등록번호 및 주민등록번호 검증 */}
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
        <div className="flex flex-col gap-2">
          {businessType === "corporate" ? (
            <div className="flex flex-col gap-2">
              <label id="corporateNumber">법인등록번호</label>
              <input
                className="rounded border p-2"
                id="corporateNumber"
                type="text"
                name="corporateNumber"
                placeholder="법인등록번호 13자리를 입력해주세요."
                value={corporateNumber}
                onChange={(e) => setCorporateNumber(e.target.value)}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <label id="personalId">주민등록번호</label>
              <input
                className="rounded border p-2"
                id="personalId"
                type="text"
                name="personalId"
                placeholder="주민등록번호 앞 6자리를 입력해주세요."
                value={personalId}
                onChange={(e) => setPersonalId(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
      {/* 제출 */}
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
