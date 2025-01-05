// API 응답 타입 정의
export interface ApiResponse {
  smp?: {
    date: string;
    max: number;
    min: number;
    average: number;
  };
  rec?: {
    date: string;
    tradeVolume: number;
    average: number;
    max: number;
    min: number;
    closing: number;
  };
  regionalPower?: {
    [key: string]: number;
  };
}
