export interface User {
  email: string;
  name: string;
  signupType: "native" | "social";
  provider: null | string;
  companyName: string;
  businessNumber: number;
  corporateNumber: number;
  createdAt: Date;
  updatedAt: Date;
  role: "member" | "admin";
  credit: number;
}

export const NULL_USER: User = {
  email: "",
  name: "",
  signupType: "native",
  provider: null,
  companyName: "",
  businessNumber: 0,
  corporateNumber: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  role: "member",
  credit: 0,
};

export interface ResponsePayload {
  access_token: string | null;
  expires_in: number | null;
  redirectTo: string;
  message: string | null;
}

export interface AuthState {
  accessToken: string | null;
  redirectTo: string;
  error: boolean;
  message: string | null;
  loading: boolean;
  actions: {
    handleAction(
      asyncFn: () => Promise<any>,
      onSuccess: (data: any) => void,
    ): unknown;
    nativeLogin: (email: string, password: string) => Promise<void>;
    socialLogin: (code: string) => Promise<void>;
    socialSignup: (password: string) => Promise<void>;
    nativeSignup: (password: string) => Promise<void>;
    logout: () => Promise<void>;
    withdrawalAccount: (password: string) => Promise<void>;
    setMessageState: (message: string) => void;
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
