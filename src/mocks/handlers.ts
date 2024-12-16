import { http, HttpResponse } from "msw";

/**
 * id: DB 고유 아이디
 * signupType: 일반회원은 소셜회원은 social
 * provider: 소셜 로그인 제공자(소셜 로그인일 경우)
 * businessType: 개인사업자는 individual, 법인사업자는 corporate
 * personalId: 주민등록번호 앞 6자리(개인사업자일 경우)
 * corporateNumber: 법인번호 13자리(법인사업자일 경우)
 * businessNumber: 사업자 등록번호 10자리
 * companyName: 대표자명
 * email: 이메일
 */
const users = [
  {
    id: "1",
    signupType: "native",
    provider: null,
    businessType: "corporate",
    corporateNumber: "1234567890123",
    businessNumber: "1111111111",
    companyName: "Shell Corporation",
    personalId: null,
    email: "fraud@scam.com",
    password: "fraud@scam.com",
  },
  {
    id: "2",
    signupType: "social",
    provider: "Google",
    businessType: "individual",
    corporateNumber: null,
    businessNumber: "0000000000",
    companyName: "Test Company",
    personalId: "900101",
    email: "admin@example.com",
    password: "admin@example.com",
  },
];

// API 기본 경로
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export const handlers = [
  // Google 토큰 요청 가로채기
  http.post("https://oauth2.googleapis.com/token", async ({ request }) => {
    const body = await request.json();

    // 가짜 응답 생성
    return HttpResponse.json(
      {
        access_token: "fake-access-token1",
        refresh_token: "fake-refresh-token1",
        expires_in: 3600,
        token_type: "Bearer",
      },
      { status: 200 },
    );
  }),

  // Google 사용자 정보 요청 가로채기
  http.get(
    "https://openidconnect.googleapis.com/v1/userinfo",
    ({ request }) => {
      // 가짜 응답 생성
      return HttpResponse.json(
        {
          sub: "100177854956708924620",
          name: "홍길동",
          given_name: "길동",
          family_name: "홍",
          picture: "https://fakeimage.com/avatar.png",
          email: "tester@example.com",
          email_verified: true,
        },
        { status: 200 },
      );
    },
  ),

  // 유저 가입 정보 확인
  http.post(`${baseUrl}/api/users/registration`, async ({ request }) => {
    const { email } = (await request.json()) as { email: string };

    const existingUser = users.find((user) => user.email === email);

    // DB에 존재하지 않는 경우
    if (!existingUser) {
      return HttpResponse.json(
        {
          signupType: null,
          isAdditionalInfoRequired: true,
        },
        { status: 200 },
      );
    }

    return HttpResponse.json(
      {
        signupType: existingUser.signupType,
        isAdditionalInfoRequired: false,
      },
      { status: 200 },
    );
  }),

  // http.get(`${baseUrl}/api/users/me`, async ({ cookies }) => {
  //   console.log(cookies);

  //   return new HttpResponse(
  //     JSON.stringify({
  //       id: "1",
  //       signupType: "native",
  //       provider: null,
  //       businessType: "corporate",
  //       corporateNumber: "1234567890123",
  //       businessNumber: "1111111111",
  //       companyName: "Shell Corporation",
  //       personalId: null,
  //       email: "fraud@scam.com",
  //       password: "fraud@scam.com",
  //     }),
  //   );
  // }),

  http.get(`${baseUrl}/api/users/me`, async ({ request }) => {
    const cookies = request.headers.get("cookie");
    console.log(cookies);
    return new HttpResponse(
      JSON.stringify({
        id: "1",
        signupType: "native",
        provider: null,
        businessType: "corporate",
        corporateNumber: "1234567890123",
        businessNumber: "1111111111",
        companyName: "Shell Corporation",
        personalId: null,
        email: "fraud@scam.com",
        password: "fraud@scam.com",
      }),
    );
  }),

  // 일반 로그인
  http.post(`${baseUrl}/api/login`, async ({ request }) => {
    const { email, password } = (await request.json()) as {
      email: string;
      password: string;
    };
    const existingUser = users.find((user) => user.email === email);

    if (existingUser && existingUser.password === password) {
      return HttpResponse.json(
        {
          message: "로그인 성공",
          access_token: "fake-access-token",
          expires_in: "3600",
          redirectTo: "/",
        },
        {
          headers: {
            "Set-Cookie": "refresh_token=fake-refresh-token;HttpOnly;Path=/",
          },
          status: 200,
        },
      );
    }

    // 로그인 실패 응답
    return HttpResponse.json(
      { message: "로그인 실패 - 사용자 없음" },
      { status: 401 },
    );
  }),

  // 일반 로그인
  // http.post(`${baseUrl}/api/login`, async ({ request }) => {
  //   const { email, password } = (await request.json()) as {
  //     email: string;
  //     password: string;
  //   };
  //   const existingUser = users.find((user) => user.email === email);

  //   if (existingUser && existingUser.password === password) {
  //     // 성공 응답과 함께 쿠키 설정
  //     const response = new HttpResponse(
  //       JSON.stringify({
  //         message: "로그인 성공",
  //         access_token: "fake-access-token",
  //         expires_in: "3600",
  //         redirectTo: "/",
  //       }),
  //       {
  //         headers: {
  //           "Set-Cookie":
  //             "refresh_token=fake-refresh-token; Path=/; Secure; SameSite=None",
  //           "Content-Type": "application/json",
  //         },
  //         status: 200,
  //       },
  //     );
  //     return response;
  //   }

  //   // 로그인 실패 응답
  //   return HttpResponse.json(
  //     { message: "로그인 실패 - 사용자 없음" },
  //     { status: 401 },
  //   );
  // }),
];
