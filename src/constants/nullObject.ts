import { ResponsePayload } from "@/auth/type";

export const NULL_RESPONSE_PAYLOAD: ResponsePayload = {
  access_token: null,
  expires_in: null,
  redirectTo: "/",
  message: null,
};
