export interface User {
  businessNumber: number;
  businessType: "individual" | "corporate";
  companyName: string;
  corporateNumber: number | null;
  email: string;
  personalId: number | null;
  provider: null | string;
  signupType: "native" | "social";
}

export interface ResponsePayload {
  access_token: string | null;
  expires_in: number | null;
  redirectTo: string;
  message: string | null;
}

export interface SocialSignupParams {
  businessNumber: string;
  startDate: string;
  principalName: string;
  companyName: string;
  corporateNumber: string | null;
}

export interface AuthState {
  accessToken: string | null;
  redirectTo: string;
  error: boolean;
  message: string | null;
  loading: boolean;
  actions: {
    nativeLogin: (email: string, password: string) => Promise<void>;
    socialLogin: (code: string) => Promise<void>;
    socialSignup: (params: SocialSignupParams) => Promise<void>;
    nativeSignup: (password: string) => Promise<void>;
    logout: () => Promise<void>;
    resetAuthState: () => void;
  };
}

export interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
}

export interface AuthResponse {
  accessToken: string;
  message: string;
}
