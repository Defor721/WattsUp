// 공통 환경 확인 함수
const isBrowser = () => typeof window !== "undefined";

// 쿠키 설정
export const setCookie = (
  name: string,
  value: string,
  expires_in: number,
  options?: {
    path?: string;
    secure?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
  },
) => {
  if (!isBrowser()) return;

  const { path = "/", secure = true, sameSite = "Strict" } = options || {};
  const expires = new Date(Date.now() + expires_in * 1000).toUTCString();

  document.cookie = `${name}=${encodeURIComponent(
    value,
  )};expires=${expires};path=${path};samesite=${sameSite};${
    secure ? "secure" : ""
  }`;
};

// 쿠키 가져오기
export const getCookie = (name: string): string | null => {
  if (!isBrowser()) return null;

  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((row) => row.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
};

// 쿠키 삭제
export const deleteCookie = (name: string) => {
  if (!isBrowser()) return;

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
};
