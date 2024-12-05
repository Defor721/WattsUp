export interface AuthState {
  accessToken: string | null;
  actions: {
    setAccessToken: (token: string) => void;
    resetAccessToken: () => void;
    fetchAccessToken: (code: string) => Promise<void>;
  };
}
