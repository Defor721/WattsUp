"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@/components/shadcn";
import { businessInfoVerification } from "@/auth/authService";
import { sendVerificationEmail } from "@/services/emailService";

function Signup() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState<boolean>(false);

  // 추가 정보 상태들
  const [email, setEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");
  const [businessNumber, setBusinessNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [businessType, setBusinessType] = useState<"corporate" | "individual">(
    "corporate",
  );

  const [corporateNumber, setCorporateNumber] = useState("");
  const [personalId, setPersonalId] = useState("");

  const [isBusinessLoading, setIsBusinessLoading] = useState(false);
  const [isBusinessValid, setIsBusinessValid] = useState(false);
  const [businessStatusMessage, setBusinessStatusMessage] = useState("");

  const togglePassword = () => {
    console.log("비밀번호 눈깔 클릭");
    setShowPassword((prevState) => !prevState);
  };
  const toggleVerifyPassword = () => {
    console.log("비밀번호 확인 눈깔 클릭");
    setShowVerifyPassword((prevState) => !prevState);
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log("submit 클릭");
    e.preventDefault();

    // 유효성 검사
    if (!email || !password) {
      alert("이메일과 비밀번호를 입력하세요.");
      return;
    }

    router.push("/signup/additional");
  };

  const resetBusinessInfo = () => {
    setBusinessNumber("");
    setStartDate("");
    setName("");
    setIsBusinessValid(false);
    setBusinessStatusMessage("");
  };

  const handleCheckEmail = async () => {
    setIsEmailLoading(true);

    try {
      await sendVerificationEmail({ email });
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleCheckBusinessNumber = async () => {
    setIsBusinessLoading(true);
    setBusinessStatusMessage("");
    setIsBusinessValid(false);

    try {
      await businessInfoVerification(
        businessNumber,
        startDate,
        name,
        companyName,
      );
      setIsBusinessValid(true);
      setBusinessStatusMessage("유효한 사업자 등록번호입니다.");
    } catch (error: any) {
      setBusinessStatusMessage(
        error.response.data.message || `서버 오류가 발생했습니다.`,
      );
      setIsBusinessValid(false);
    } finally {
      setIsBusinessLoading(false);
    }
  };

  const handlePrevClick = () => {
    router.back();
  };

  return (
    <Card className="relative flex flex-col p-5">
      {/* <button onClick={handlePrevClick}>
        <IoIosArrowBack
          size={"20px"}
          className="absolute left-1 top-2 opacity-50 hover:cursor-pointer hover:opacity-80"
        />
      </button> */}
      <CardHeader>
        <CardTitle className="text-2xl">회원가입</CardTitle>
        <CardDescription>회원가입을 위한 정보를 입력해주세요.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="flex flex-col gap-5">
          {/* 이메일 섹션 */}
          <div className="flex flex-col gap-2">
            {/* TODO: 이메일 입력하면서 중복인지 아닌지 체크 구현할것 */}
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="이메일을 입력해주세요."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="flex items-center gap-2">
              <Input
                id="verificationEmailCode"
                type="text"
                placeholder="인증코드 6자리를 입력해주세요."
                value={emailCode}
                onChange={(e) => setEmailCode(e.target.value)}
                required
              />
              <Button
                className={`rounded p-2 text-white ${
                  isEmailLoading
                    ? "bg-gray-400"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                코드 전송
              </Button>
            </div>
            <Button
              className={`mt-2 rounded p-2 text-white ${
                isEmailLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
              type="button"
              onClick={handleCheckEmail}
              disabled={isEmailLoading}
            >
              이메일 인증
            </Button>
          </div>

          {/* 비밀번호 섹션 */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">비밀번호</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="비밀번호를 입력해주세요."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                size={"icon"}
                className="absolute right-1 top-[9px] z-10 -translate-y-1/4 bg-transparent hover:bg-transparent"
                onClick={togglePassword}
              >
                {showPassword ? (
                  <EyeOff className="text-muted-foreground h-5 w-5 opacity-70" />
                ) : (
                  <Eye className="text-muted-foreground h-5 w-5 opacity-70" />
                )}
              </Button>
            </div>
            <div className="relative">
              <Input
                type={showVerifyPassword ? "text" : "password"}
                name="verifyPassword"
                placeholder="비밀번호를 다시 한번 입력해주세요."
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
                required
              />
              <Button
                className="absolute right-1 top-[9px] z-10 -translate-y-1/4 bg-transparent hover:bg-transparent"
                size={"icon"}
                onClick={toggleVerifyPassword}
              >
                {showVerifyPassword ? (
                  <EyeOff className="text-muted-foreground h-5 w-5 opacity-70" />
                ) : (
                  <Eye className="text-muted-foreground h-5 w-5 opacity-70" />
                )}
              </Button>
            </div>
          </div>
          {/* 추가 정보 섹션 */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="companyName">대표자 성명</Label>
              <Input
                id="companyName"
                name="companyName"
                placeholder="대표자 성명"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="companyName">사업자 번호</Label>
              <Input
                className="text-sm"
                id="companyName"
                name="companyName"
                placeholder="(예시) 0123456789"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="companyName">개업일자</Label>
              <Input
                id="companyName"
                name="companyName"
                placeholder="(예시) YYYYMMDD"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="companyName">상호명</Label>
              <Input
                id="companyName"
                name="companyName"
                placeholder="(예시) (주)터빈크루"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
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
                  isBusinessLoading
                    ? "bg-gray-400"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                type="button"
                onClick={handleCheckBusinessNumber}
                disabled={isBusinessLoading}
              >
                {isBusinessLoading ? "확인 중..." : "사업자번호 확인"}
              </button>
            )}
            {businessStatusMessage && (
              <p
                className={`mt-2 font-semibold ${
                  isBusinessValid ? "text-green-500" : "text-red-500"
                }`}
              >
                {businessStatusMessage}
              </p>
            )}

            {/* 법인등록번호 및 주민등록번호 검증 */}
            <div className="flex flex-col gap-2">
              {/* 라디오 버튼 */}
              <div className="flex">
                <div className="flex">
                  <Input
                    id="corporate"
                    type="radio"
                    name="businessType"
                    value="corporate"
                    checked={businessType === "corporate"}
                    onChange={() => setBusinessType("corporate")}
                  />
                  <Label id="corporate">법인 사업자</Label>
                </div>
                <div className="flex">
                  <Input
                    id="individual"
                    type="radio"
                    name="businessType"
                    value="individual"
                    checked={businessType === "individual"}
                    onChange={() => setBusinessType("individual")}
                  />
                  <Label id="individual">개인 사업자</Label>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {businessType === "corporate" ? (
                  <div className="flex flex-col gap-2">
                    <Label id="corporateNumber">법인등록번호</Label>
                    <Input
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
                    <Label id="personalId">주민등록번호</Label>
                    <Input
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
          </div>

          {/* 버튼 섹션 */}
          <div className="mt-5 flex justify-between">
            <Button onClick={handlePrevClick} className="border-1">
              이전
            </Button>
            <Button
              type="submit"
              className="bg-mainColor text-white dark:border-1"
            >
              다음
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}

export default Signup;
