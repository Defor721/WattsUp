import { http, HttpResponse } from "msw";

// 가상 유저 데이터
const users = [
  { id: "1", username: "testuser", name: "Test User", token: "fake-token-123" },
];

// API 기본 경로 설정
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export const handlers = [
  http.get(`${baseUrl}/api/user`, () => {
    console.log("MSW: 유저 정보 반환");
    return HttpResponse.json(users[0], { status: 200 });
  }),
];
