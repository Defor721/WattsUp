export interface AuthState {
  accessToken: string | null;
  user: User | null;
  actions: {
    loginWithSocialToken: (code: string) => ResponsePayload;
    setUser: (user: User) => void;
    setAccessToken: (token: string, expiresIn: number) => void;
    resetAccessToken: () => void;
  };
}

export interface User {
  id: string;
  signupType: "native" | "social" | null;
  provider?: string | null;
  businessType: "individual" | "corporate";
  personalId?: string | null;
  corporateNumber?: string | null;
  businessNumber: string;
  companyName: string;
  email: string;
}

export interface ResponsePayload {
  access_token: string | null;
  expires_in: number | null;
  redirectTo: string;
  message: string | null;
}
