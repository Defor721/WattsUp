import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  const response = token
    ? NextResponse.next()
    : NextResponse.redirect(new URL("/login", req.url));

  return response;
}

export const config = {
  matcher: ["/energy-trade", "/my-page", "/admin/:path*"],
};
