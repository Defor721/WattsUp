import apiClient from "@/lib/axios";

export async function sendVerificationEmail({ email }: { email: string }) {
  try {
    await apiClient.post("/api/auth/email-code", { email });
  } catch (error) {
    throw error;
  }
}

export async function verifyEmailCode({
  email,
  emailCode,
}: {
  email: string;
  emailCode: string;
}) {
  try {
    const { data } = await apiClient.post("/api/auth/email-code/verify", {
      email,
      emailCode,
    });

    return data;
  } catch (error) {
    throw error;
  }
}
