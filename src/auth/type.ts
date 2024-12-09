export interface AuthState {
  accessToken: string | null;
  user: User | null;
  actions: {
    setUser: (user: User) => void;
    setAccessToken: (token: string, expiresIn: number) => void;
    resetAccessToken: () => void;
  };
}

export interface User {
  id: string;
  signupType: "native" | "social";
  provider?: string | null;
  businessType: "individual" | "corporate";
  personalId?: string | null;
  corporateNumber?: string | null;
  businessNumber: string;
  companyName: string;
  email: string;
}
