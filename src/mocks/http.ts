import { setupServer } from "msw/node";

import { handlers } from "./handlers";

// 서버 초기화
export const server = setupServer(...handlers);

// 서버 시작 시 옵션 설정
server.listen({ onUnhandledRequest: "bypass" });
