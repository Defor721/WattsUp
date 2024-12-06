export interface AuthState {
  accessToken: string | null;
  actions: {
    fetchAccessToken: (code: string) => Promise<void>;
    setAccessToken: (token: string, expiresIn: number) => void;
    resetAccessToken: () => void;
  };
}
