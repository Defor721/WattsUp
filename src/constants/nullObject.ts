import { ResponsePayload } from "@/auth/type";

export const NULL_RESPONSE_PAYLOAD: ResponsePayload = {
  access_token: null,
  expires_in: null,
  user: null,
  message: null,
  requiresRedirect: false,
  redirectTo: "/",
};
