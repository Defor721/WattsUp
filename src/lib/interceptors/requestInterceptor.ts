// import { AxiosError, InternalAxiosRequestConfig } from "axios";

// import { accessTokenUtil } from "../auth/accessTokenUtil";

// // 요청 인터셉터 핸들러
// export const handleRequest = (config: InternalAxiosRequestConfig) => {
//   const accessToken = accessTokenUtil.getAccessToken();
//   if (accessToken) {
//     config.headers.Authorization = `Bearer ${accessToken}`;
//   }
//   return config;
// };

// // 요청 인터셉터 에러 핸들러
// export const handleRequestError = (error: AxiosError) => {
//   console.error("[Request Error]:", error);
//   return Promise.reject(error);
// };
