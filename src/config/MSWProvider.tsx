"use client";

import { Suspense, use } from "react";

/**
 * 브라우저 워커를 시작하여 현재 서비스 워커 인스턴스에 요청 핸들러 추가하며, 브라우저에서 비동기로 초기화
 */
const mockingEnabledPromise =
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_ENVIRONMENT === "development"
    ? import("@/mocks/browser").then(async ({ worker }) => {
        await worker.start({ onUnhandledRequest });
        handleHotReload(worker);
        console.log(`등록된 핸들러 목록:`, worker.listHandlers());
      })
    : Promise.resolve(); // 브라우저가 아니거나 프로덕션 환경에서는 초기화하지 않음

/**
 * next가 내부적으로 처리할 요청, msw가 처리할 수 없는 요청이 들어왔을 때 경고 보내는 함수
 */
function onUnhandledRequest(request: Request, print: any) {
  if (request.url.includes("_next")) return;

  // print.warning();
}

/**
 * 핫 리로딩 관리 함수
 * TODO: nextjs 69098번 이슈 closed 되면 지울 것
 */
function handleHotReload(worker: any) {
  if ((module as any).hot) {
    (module as any).hot.dispose(() => {
      worker.stop(); // 서비스 워커 중단
    });
  }
}

export function MSWProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={null}>
      <MSWProviderWrapper>{children}</MSWProviderWrapper>
    </Suspense>
  );
}

/**
 * 서비스 워커 초기화 완료 대기 후 자식 컴포넌트 렌더링
 */
function MSWProviderWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  use(mockingEnabledPromise);
  return children;
}
