/** 이메일 가리기 */
export function maskEmail(email: string): string {
  const [id, domain] = email.split("@");
  if (id.length <= 2) {
    return `${id[0]}*@${domain}`;
  }
  const maskedId = `${id[0]}${"*".repeat(id.length - 2)}${id[id.length - 1]}`;
  return `${maskedId}@${domain}`;
}
