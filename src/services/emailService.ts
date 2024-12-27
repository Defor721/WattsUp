import apiClient from "@/lib/axios";

export async function sendVerificationEmail({ email }: { email: string }) {
  console.log(`check: `, email);
  try {
    await apiClient.post("/api/auth/email-code", { email });
  } catch (error) {
    console.log("이메일 인증 코드 전송중 오류 발생", error);
    throw error;
  }
}
