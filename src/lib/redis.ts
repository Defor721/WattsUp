// redis.ts
import { createClient } from "redis";

export const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT as string),
  },
  password: process.env.REDIS_PW,
});

redisClient
  .connect()
  .catch((error) => console.error("Redis 연결 실패:", error));

// 추가 함수 예시
export async function checkRedisConnection() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}
