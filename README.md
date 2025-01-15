# VPP 대시보드 및 전력 거래소 구축 프로젝트 - Watts Up

<br/>

## 🔥 프로젝트 목표

Watts Up은 가상 발전소와 태양광 전력 거래 시스템 및 프로토타입 구축을 위해 설계된 프로젝트입니다.\
가상 발전소는 분산된 에너지 자원을 디지털화 하고 통합하여, 하나의 발전소처럼 운영하는 시스템입니다.

해당 프로젝트는 [터빈 크루](https://turbinecrew.co.kr/)의 제안서를 바탕으로 기획되었습니다.\
실시간 전력 모니터링과 거래를 지원하며, 전력 거래 자동화, 사용자 친화적인 대시보드를 제공합니다.

<br/>

## 💻 주요 기능

### 전력 거래

실시간 데이터를 바탕으로 필요한 태양광 전력을 즉시 구매할 수 있습니다.

![전력 거래](https://github.com/user-attachments/assets/d8dc3244-f42a-45b2-b83f-525edb86c066)

### 대시보드

지역별 발전 예측 데이터를 기반으로 효과적인 전력 거래를 계획할 수 있습니다.

![대시보드](https://github.com/user-attachments/assets/cec6d538-5a7f-4996-b7dd-33d7b4a4863b)

### 추가정보

실시간 데이터를 확인하고 필요한 정보를 다운로드하여 분석에 활용할 수 있습니다.

![대시보드 추가정보](https://github.com/user-attachments/assets/61bde9ae-66a0-46a2-95e1-8aa9dd947d68)

### 유저 확인

관리자는 가입된 유저의 데이터를 한눈에 확인하고, 필요한 정보를 신속히 파악할 수 있습니다.

![유저 관리](https://github.com/user-attachments/assets/7c27c404-c682-4835-b23f-b2e37f5025b4)

### 데이터 확인

관리자는 지역 발전량을 갱신하고 거래 목록을 확인할 수 있습니다.

![데이터 관리](https://github.com/user-attachments/assets/468b687b-8f6b-4947-bcd6-01832d2b4eb4)

<br/>

## 🪪 시용자 가이드

### 계정 생성 및 로그인 (일반)

[![일반 로그인](https://img.youtube.com/vi/z6NAji_p-4E/0.jpg)](https://youtu.be/z6NAji_p-4E)

### 계정 생성 및 로그인 (소셜)

[![일반 로그인](https://img.youtube.com/vi/zCHRAivtOEI/0.jpg)](https://youtu.be/zCHRAivtOEI)

<br/>

## 💽 프로젝트 설치 및 실행 방법

1. **의존성 설치**

   ```bash
   npm install
   ```

2. **개발 서버 실행**

   ```bash
   npm run dev
   ```

   **프로덕션 빌드**

   ```bash
   npm run build
   npm start
   ```

<br/>

## 📂 환경 변수 설명

### 🛠️ 기본 환경

- `NEXT_PUBLIC_ENVIRONMENT`: 애플리케이션의 실행 환경을 나타냅니다. (`development`, `production` 등)
- `NEXT_PUBLIC_API_BASE_URL`: API 요청의 기본 URL을 설정합니다. (`http://localhost:3000` 또는 배포된 URL)

### 🔐 [토큰 시크릿](https://jwt.io/)

- `ACCESS_TOKEN_SECRET`: JWT 엑세스 토큰을 서명하기 위한 비밀 키입니다.
- `REFRESH_TOKEN_SECRET`: JWT 리프레시 토큰을 서명하기 위한 비밀 키입니다.
- `BUSINESS_TOKEN_SECRET`: 비즈니스 관련 토큰을 서명하기 위한 비밀 키입니다.
- `EMAIL_TOKEN_SECRET`: 이메일 인증 토큰을 서명하기 위한 비밀 키입니다.

### 🧂 [bcrypt 암호화](https://github.com/kelektiv/node.bcrypt.js#readme)

- `SALT_ROUND`: bcrypt 암호화 시 해시를 생성할 라운드 수를 설정합니다. (보안 수준을 결정)

### 📦 [MongoDB](https://www.mongodb.com/ko-kr)

- `MONGODB_URI`: MongoDB 연결 문자열입니다. 데이터베이스 서버 URL과 인증 정보를 포함합니다.

### 🔑 [Google OAuth](console.cloud.google.com/)

- `NEXT_PUBLIC_REDIRECT_URI`: Google OAuth 인증 후 리다이렉트될 URL입니다.
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Google API에서 발급된 클라이언트 ID입니다.
- `GOOGLE_CLIENT_SECRET`: Google API에서 발급된 클라이언트 비밀 키입니다.

### 🏢 [공공데이터 사업자 정보 API](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15081808)

- `BUSINESS_STATUS_API_URL`: 공공데이터 사업자 등록 상태를 확인하는 공공데이터 API URL입니다.
- `BUSINESS_INFO_VERIFICATION_API_URL`: 공공데이터 사업자 정보 검증 API URL입니다.
- `BUSINESS_SERVICE_KEY`: 공공데이터 사업자 정보 API 접근을 위한 인증 키입니다.

### 🌤️ [공공데이터 발전원별 발전량](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15113384)

- `NEXT_PUBLIC_DATA_PORTAL_SERVICE_KEY`: 공공데이터 포털 서비스 키로, 반전량 데이터를 요청하는 데 사용됩니다.

### ✉️ [Gmail](https://mail.google.com/)

- `GMAIL_USER`: Gmail 계정 이메일 주소입니다.
- `GMAIL_APP_PW`: Gmail API 또는 SMTP 연동에 필요한 앱 비밀번호입니다.

### 🖴 [Redis](https://redis.io/)

- `REDIS_HOST`: Redis 서버 호스트 URL입니다.
- `REDIS_PORT`: Redis 서버 포트 번호입니다.
- `REDIS_PW`: Redis 서버 접속을 위한 비밀번호입니다.

### 🗺️ [Kakao 지도](https://apis.map.kakao.com/web/)

- `REACT_APP_KAKAO_API_KEY`: Kakao 지도 API를 호출하기 위한 인증 키입니다.

### ☁️ [OpenWeather](https://openweathermap.org/)

- `OPEN_WEATHER_API_KEY`: OpenWeatherMap API를 호출하기 위한 인증 키입니다.

<br/>

## ⚙️ 사용 기술 스택

### 프론트엔드

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-52303d?style=flat-square&logo=zustand&logoColor=white)
![Shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=flat-square&logo=shadcnui&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-0055FF?style=flat-square&logo=framer&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-57b2bd?style=flat-square&logo=recharts&logoColor=white)

<!-- ![React Query](https://img.shields.io/badge/React%20Query-FF4154?style=flat-square&logo=react-query&logoColor=white) -->

### 백엔드 및 데이터 처리

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![Bcrypt](https://img.shields.io/badge/bcrypt-FF6A00?style=flat-square&logo=bcrypt&logoColor=white)

### 기타 도구

![cheerio](https://img.shields.io/badge/Cheerio-E88C1F?style=flat-square&logo=cheerio&logoColor=white)
![MSW](https://img.shields.io/badge/MSW-FF6A00?style=flat-square&logo=mockserviceworker&logoColor=white)
![Husky](https://img.shields.io/badge/Husky-9c6623?style=flat-square&logo=husky&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-4d9fcb?style=flat-square&logo=nodemailer&logoColor=white)
![Kakao Maps Api](https://img.shields.io/badge/Kakao%20Maps%20API-FFCD00?style=flat-square&logo=kakao&logoColor=black)

<br/>

## 👥 팀원 소개

<table style="border-collapse: collapse; width: 100%; text-align: center;">
  <tr>
    <td style="border: 1px solid #464646; padding: 10px; ">
      <img src="https://avatars.githubusercontent.com/u/107985535?v=4" alt="yoonstar1996" width="100" height="100" style="border-radius: 100%;">
      <hr style="border: 0; border-top: 1px solid #464646; margin: 10px 0;">
      <a href="https://github.com/yoonstar1996">yoonstar1996</a>
    </td>
    <td style="border: 1px solid #464646; padding: 10px;">
      <img src="https://avatars.githubusercontent.com/u/158129874?v=4" alt="zerozeroha" width="100" height="100" style="border-radius: 100%;">
      <hr style="border: 0; border-top: 1px solid #464646; margin: 10px 0;">
      <a href="https://github.com/zerozeroha">zerozeroha</a>
    </td>
    <td style="border: 1px solid #464646; padding: 10px;">
      <img src="https://avatars.githubusercontent.com/u/108377377?v=4" alt="working-zima" width="100" height="100" style="border-radius: 100%;">
      <hr style="border: 0; border-top: 1px solid #464646; margin: 10px 0;">
      <a href="https://github.com/working-zima">working-zima</a>
    </td>
    <td style="border: 1px solid #464646; padding: 10px;">
      <img src="https://avatars.githubusercontent.com/u/92020095?v=4" alt="Defor721" width="100" height="100" style="border-radius: 100%;">
      <hr style="border: 0; border-top: 1px solid #464646; margin: 10px 0;">
      <a href="https://github.com/Defor721">Defor721</a>
    </td>
    <td style="border: 1px solid #464646; padding: 10px;">
      <img src="https://avatars.githubusercontent.com/u/155401028?v=4" alt="LifeIsMoment" width="100" height="100" style="border-radius: 100%;">
      <hr style="border: 0; border-top: 1px solid #464646; margin: 10px 0;">
      <a href="https://github.com/LifeIsMoment">LifeIsMoment</a>
    </td>
  </tr>
</table>
