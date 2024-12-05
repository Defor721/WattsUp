# WattsUp_Project ( Team 9 )

## TurbinCrew Dashboard & Trading Platform

### - 프로젝트 개요 . Features of the Project

**TurbinCrew**와 협력하여, 한국전력발전소 API를 활용한 대시보드와 거래 플랫폼을 개발합니다.  
Next.js, React, TypeScript, MongoDB, Zustand, 그리고 Swagger를 활용하여 고성능, 확장성, 사용자 친화적인 웹 애플리케이션을 제공합니다.

---

### - 주요기능 . Key Features

1. **실시간 데이터 시각화**

   - 한국전력발전소 API를 통해 실시간 발전소 데이터 수집 및 시각화.
   - 발전소 상태, 출력량, 효율성 등의 주요 지표를 차트 및 그래프로 표시.

2. **거래 플랫폼**

   - 에너지 관련 거래 기능 구현.
   - 사용자 등록 및 로그인, 실시간 거래 데이터 관리.

3. **대시보드**

   - 사용자 맞춤형 대시보드 제공.
   - 데이터 필터링, 다운로드, 알림 설정.

4. **관리자 기능**

   - 사용자 관리, 거래 내역 모니터링, 발전소 데이터 관리.

5. **Swagger**
   - API 문서화 및 테스트 도구를 사용해 개발 및 협업 효율성 강화.

---

### - 기술 스택 . Tech Stack

#### **프론트엔드 . FE**

- **Next.js**: React 기반 풀스택 프레임워크로 SEO와 서버 사이드 렌더링(SSR) 지원.
- **React**: UI 구축.
- **TypeScript**: 정적 타입 체계를 통해 코드 안정성과 유지보수성 향상.
- **Zustand**: 상태 관리 라이브러리로 간결하고 효율적인 상태 관리 구현.

#### **백엔드 . BE**

- **Next.js API Routes**: API 엔드포인트 제공.
- **MongoDB**: NoSQL 데이터베이스로 유연한 데이터 모델링 지원.

#### **기타 . Others**

- **Swagger**: API 문서화를 위한 도구.
- **한국전력발전소 API**: 실시간 발전소 데이터를 가져와 대시보드와 거래 시스템에 반영.
- **Tailwind CSS**: 빠르고 효율적인 스타일링.

---

### - 설치 및 실행 . Installation and Execution

#### 1. **환경 설정 . Configuration**

- `.env` 파일 생성 후 아래 환경 변수 추가:
  ```env
  MONGODB_URI=<MongoDB 연결 URI>
  API_BASE_URL=<한국전력발전소 API 엔드포인트>
  JWT_SECRET=<JWT 시크릿 키>
  ```

---

### - 주요 명령어 설치 . Key Installation Commands

#### Next.js, React, TypeScript 기본 설치

`npx create-next-app@latest --typescript`

#### MongoDB 연결 라이브러리

`npm install mongodb`

#### Zustand 상태 관리

`npm install zustand`

#### Tailwind CSS 설치

`npm install -D tailwindcss postcss autoprefixer`
`npx tailwindcss init`

### Swagger 설치

`npm install swagger-ui-express swagger-jsdoc`
