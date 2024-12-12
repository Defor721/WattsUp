// import { http, HttpResponse } from "msw";

// /**
//  * id: DB 고유 아이디
//  * signupType: 일반회원은 소셜회원은 social
//  * provider: 소셜 로그인 제공자(소셜 로그인일 경우)
//  * businessType: 개인사업자는 individual, 법인사업자는 corporate
//  * personalId: 주민등록번호 앞 6자리(개인사업자일 경우)
//  * corporateNumber: 법인번호 13자리(법인사업자일 경우)
//  * businessNumber: 사업자 등록번호 10자리
//  * companyName: 대표자명
//  * email: 이메일
//  */
// const users = [
//   {
//     id: "1",
//     signupType: "native",
//     provider: null,
//     businessType: "corporate",
//     corporateNumber: "1234567890123",
//     businessNumber: "1111111111",
//     companyName: "Shell Corporation",
//     personalId: null,
//     email: "fraud@scam.com",
//   },
//   {
//     id: "2",
//     signupType: "social",
//     provider: "Google",
//     businessType: "individual",
//     corporateNumber: null,
//     businessNumber: "0000000000",
//     companyName: "Test Company",
//     personalId: "900101",
//     email: "admin@example.com",
//   },
// ];

// // API 기본 경로
// const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

// export const handlers = [
//   // Google 토큰 요청 가로채기
//   http.post("https://oauth2.googleapis.com/token", async ({ request }) => {
//     const body = await request.json();

//     // 가짜 응답 생성
//     return HttpResponse.json(
//       {
//         access_token: "fake-access-token",
//         refresh_token: "fake-refresh-token",
//         expires_in: 3600,
//         token_type: "Bearer",
//       },
//       { status: 200 },
//     );
//   }),

//   // Google 사용자 정보 요청 가로채기
//   http.get(
//     "https://openidconnect.googleapis.com/v1/userinfo",
//     ({ request }) => {
//       // 가짜 응답 생성
//       return HttpResponse.json(
//         {
//           sub: "100177854956708924620",
//           name: "홍길동",
//           given_name: "길동",
//           family_name: "홍",
//           picture: "https://fakeimage.com/avatar.png",
//           email: "tester@example.com",
//           email_verified: true,
//         },
//         { status: 200 },
//       );
//     },
//   ),

//   // 유저 가입 정보 확인
//   http.post(`${baseUrl}/api/users/registration`, async ({ request }) => {
//     const { email } = (await request.json()) as { email: string };
//     console.log(`check email: `, email);
//     const existingUser = users.find((user) => user.email === email);
//     console.log(`check existingUser: `, existingUser);
//     // DB에 존재하지 않는 경우
//     if (!existingUser) {
//       return HttpResponse.json(
//         {
//           signupType: null,
//           isAdditionalInfoRequired: true,
//         },
//         { status: 200 },
//       );
//     }

//     return HttpResponse.json(
//       {
//         signupType: existingUser.signupType,
//         isAdditionalInfoRequired: false,
//       },
//       { status: 200 },
//     );
//   }),
// ];
