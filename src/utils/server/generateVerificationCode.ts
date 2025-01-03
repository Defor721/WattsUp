export const generateVerificationCode = () => {
  return Math.floor(Math.random() * 900000 + 100000);
};
