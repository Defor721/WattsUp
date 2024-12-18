import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  // 토큰이 없는 경우 로그인 페이지로 리다이렉트
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 사용자 상태 확인
  return fetch("https://example.com/api/users", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.status === 403) {
        // 추가 데이터 필요 시 리다이렉트
        return NextResponse.redirect(new URL("/profile/additional", req.url));
      }
      if (!response.ok) {
        // 오류 발생 시 로그인 페이지로 이동
        return NextResponse.redirect(new URL("/login", req.url));
      }
      // 정상 접근 시 계속 진행
      return NextResponse.next();
    })
    .catch(() => NextResponse.redirect(new URL("/login", req.url)));
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"], // 앱 라우터 기준 보호 경로 설정
};
