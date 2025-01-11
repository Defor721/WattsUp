import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  console.log("middleware AccessToken:", token); // TODO: 디버깅용 로그
  console.log("middleware Request URL:", req.url); // TODO: 디버깅용 로그

  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/energy-trade", "/my-page", "/admin/:path*"],
};
