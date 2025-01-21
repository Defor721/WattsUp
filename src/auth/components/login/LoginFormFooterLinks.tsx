import { Link } from "lucide-react";
import FindEmailPopup from "./FindEmailPopup";
import FindPasswordPopup from "./FindPasswordPopup";

export default function LoginFormFooterLinks() {
  return (
    <div className="mt-3 flex items-center text-center text-sm">
      {/* 이메일 찾기 */}
      <FindEmailPopup>
        <p className="inline-block cursor-pointer text-sm underline">
          이메일 찾기
        </p>
      </FindEmailPopup>
      {/* 구분선 */}
      <span className="mx-2 text-gray-500">|</span>
      {/* 비밀번호 찾기 */}
      <div className="flex-grow text-right">
        <FindPasswordPopup>
          <p className="inline-block cursor-pointer text-sm underline">
            비밀번호 찾기
          </p>
        </FindPasswordPopup>
      </div>
      {/* 구분선 */}
      <span className="mx-2 text-gray-500">|</span>
      {/* 회원가입 */}
      <div className="flex-grow text-left">
        <Link href={"/signup"} className="text-sm underline">
          회원가입
        </Link>
      </div>
    </div>
  );
}
