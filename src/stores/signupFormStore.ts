import { create } from "zustand";

interface SignupFormState {
  email: string;
  password: string;
  verifyPassword: string;
  companyName: string;
  signupType: "native" | "social" | null;
  provider: null | string;
  businessType: "individual" | "corporate" | null;
  personalId: number | null;
  corporateNumber: number | null;
  businessNumber: number | null;
  actions: {
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    setVerifyPassword: (verifyPassword: string) => void;
    setCompanyName: (companyName: string) => void;
  };
}

const NULL_SIGNUP_FORM_STATE = {
  email: "",
  password: "",
  verifyPassword: "",
  companyName: "",
  signupType: null,
  provider: null,
  businessType: null,
  personalId: null,
  corporateNumber: null,
  businessNumber: null,
};

export const useSignupFormStore = create<SignupFormState>((set) => ({
  ...NULL_SIGNUP_FORM_STATE,
  actions: {
    setEmail: (email) => set({ email }),
    setPassword: (password) => set({ password }),
    setVerifyPassword: (verifyPassword) => set({ verifyPassword }),
    setCompanyName: (companyName) => set({ companyName }),
  },
}));
