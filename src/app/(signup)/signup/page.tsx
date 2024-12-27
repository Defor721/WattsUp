"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { IoIosArrowBack, IoMdInformationCircleOutline } from "react-icons/io";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn";
import { businessInfoVerification } from "@/auth/authService";
import { sendVerificationEmail } from "@/services/emailService";

function Signup() {
  const router = useRouter();

  // 현재 날짜(YYYYMMDD)
  const [nowDate, setNowDate] = useState("");

  // 추가 정보 상태들
  const [email, setEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState<boolean>(false);
  const [verifyPassword, setVerifyPassword] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [principalName, setPrincipalName] = useState("");
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

  const toggleVerifyPassword = () => {
    console.log("비밀번호 확인 눈깔 클릭");
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
    setPrincipalName("");
    setIsBusinessValid(false);
    setBusinessStatusMessage("");
  };

  /** 이메일 인증 코드 전송 */
  const handleSendEmailCode = async () => {
    if (cooldown > 0) return;
    setCooldown(60);

    setIsEmailLoading(true);
    try {
      // await sendVerificationEmail({ email });
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
        principalName,
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

  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = ("0" + (1 + date.getMonth())).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    setNowDate(year + month + day);
  }, []);

  useEffect(() => {
    if (cooldown === 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  return (
    <Card className="relative flex flex-col p-5">
      <button onClick={handlePrevClick}>
        <IoIosArrowBack
          size={"20px"}
          className="absolute left-1 top-2 opacity-50 hover:cursor-pointer hover:opacity-80"
        />
      </button>
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
            {/* 이메일 인증 코드 섹션 */}
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
                type="button"
                onClick={handleSendEmailCode}
                className={`min-w-[72px] rounded p-2 text-white ${
                  cooldown > 0 || isEmailLoading
                    ? "bg-gray-400"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={cooldown > 0 || isEmailLoading}
              >
                {cooldown > 0 ? `${cooldown}초 후` : "코드 전송"}
              </Button>
            </div>
            {/* 이메일 인증 섹션 */}
            <Button
              className={`mt-2 rounded p-2 text-white ${
                isEmailLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
              type="button"
              onClick={handleSendEmailCode}
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
                type="button"
                size={"icon"}
                className="absolute right-1 top-[9px] z-10 -translate-y-1/4 bg-transparent hover:bg-transparent"
                onClick={() => setShowPassword((prevState) => !prevState)}
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
                type="button"
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
            <TooltipProvider>
              <div className="flex flex-col gap-2">
                <Tooltip>
                  <div className="flex items-center gap-1">
                    <Label htmlFor="principalName">대표자 성명</Label>
                    <TooltipTrigger>
                      <IoMdInformationCircleOutline />
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      외국인 사업자의 경우에는 영문명 입력해주세요.
                    </TooltipContent>
                  </div>
                </Tooltip>
                <Input
                  id="principalName"
                  name="principalName"
                  placeholder="대표자 이름을 입력해주세요."
                  value={principalName}
                  onChange={(e) => setPrincipalName(e.target.value)}
                  required
                  disabled={isBusinessValid}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Tooltip>
                  <div className="flex items-center gap-1">
                    <Label htmlFor="businessNumber">사업자 번호</Label>
                    <TooltipTrigger>
                      <IoMdInformationCircleOutline />
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {
                        "'-' 기호를 제외한 사업자 번호 10자리를 입력해주세요. 예) 0123456789"
                      }
                    </TooltipContent>
                  </div>
                </Tooltip>
                <Input
                  id="businessNumber"
                  name="businessNumber"
                  placeholder="사업자번호 10자리를 입력해주세요."
                  value={businessNumber}
                  onChange={(e) => setBusinessNumber(e.target.value)}
                  required
                  disabled={isBusinessValid}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Tooltip>
                  <div className="flex items-center gap-1">
                    <Label htmlFor="startDate">개업일자</Label>
                    <TooltipTrigger>
                      <IoMdInformationCircleOutline />
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {`YYYYMMDD 포맷으로 개업일자 8자리를 입력해주세요. 예) ${nowDate}`}
                    </TooltipContent>
                  </div>
                </Tooltip>
                <Input
                  id="startDate"
                  name="startDate"
                  placeholder="YYYYMMDD"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  disabled={isBusinessValid}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Tooltip>
                  <div className="flex items-center gap-1">
                    <Label htmlFor="companyName">상호명</Label>
                    <TooltipTrigger>
                      <IoMdInformationCircleOutline />
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {
                        "상호를 입력해주세요. 주식회사인 경우 예: (주)회사명, 주식회사 회사명"
                      }
                    </TooltipContent>
                  </div>
                </Tooltip>
                <Input
                  id="companyName"
                  name="companyName"
                  placeholder="(주)터빈크루"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  disabled={isBusinessValid}
                />
              </div>
            </TooltipProvider>
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
            <div className="flex flex-col gap-4">
              {/* 라디오 버튼 */}
              <div className="flex gap-3">
                <div className="flex gap-1">
                  <input
                    id="corporate"
                    type="radio"
                    name="businessType"
                    value="corporate"
                    checked={businessType === "corporate"}
                    onChange={() => setBusinessType("corporate")}
                  />
                  <Label htmlFor="corporate">법인 사업자</Label>
                </div>
                <div className="flex gap-1">
                  <input
                    id="individual"
                    type="radio"
                    name="businessType"
                    value="individual"
                    checked={businessType === "individual"}
                    onChange={() => setBusinessType("individual")}
                  />
                  <Label htmlFor="individual">개인 사업자</Label>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {businessType === "corporate" ? (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="corporateNumber">법인등록번호</Label>
                    <Input
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
                    <Label htmlFor="personalId">주민등록번호</Label>
                    <Input
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
        </CardContent>
        <CardFooter>
          {/* 버튼 섹션 */}
          <Button
            type="submit"
            disabled={!isBusinessValid}
            className={`w-full bg-mainColor text-white disabled:border-none disabled:bg-gray-400 dark:border-1`}
          >
            가입하기
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default Signup;
