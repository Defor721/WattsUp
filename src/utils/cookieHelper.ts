// 쿠키 설정
export const setCookie = (
  name: string,
  value: string,
  expiresInSeconds: number
) => {
  if (typeof window === "undefined") return null;
  console.log(`expiresInSeconds: `, expiresInSeconds);
  const expires = new Date();
  expires.setTime(expires.getTime() + expiresInSeconds * 1000);
  console.log(`expires.toUTCString(): `, expires.toUTCString());
  document.cookie = `${name}=${encodeURIComponent(
    value
  )};expires=${expires.toUTCString()};path=/;samesite=strict`;
};

// 쿠키 가져오기
export const getCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null;
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((row) => row.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
};

// 쿠키 삭제
export const deleteCookie = (name: string) => {
  if (typeof window === "undefined") return null;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
};
