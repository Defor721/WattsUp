export const isValidEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * 1. 최소 8자 ~ 최대 16자\
 * 2. 소문자, 대문자, 숫자, 특수문자 포함\
 * 3. 공백 금지
 */
export const isValidPassword = (password: string): boolean => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;

  return passwordRegex.test(password);
};

export const isPasswordMatching = (
  password: string,
  confirmPassword: string,
): boolean => {
  return password === confirmPassword;
};
