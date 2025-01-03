const getTodayDate = () => {
  const now = new Date();
  const year = now.getFullYear(); // 연도
  const month = String(now.getMonth() + 1).padStart(2, "0"); // 월 (0부터 시작하므로 +1)
  const day = String(now.getDate()).padStart(2, "0"); // 일
  return `${year}${month}${day}`;
};

const getYesterdayDate = () => {
  const now = new Date();
  now.setDate(now.getDate() - 1); // 하루 전날로 설정
  const year = now.getFullYear(); // 연도
  const month = String(now.getMonth() + 1).padStart(2, "0"); // 월 (0부터 시작하므로 +1)
  const day = String(now.getDate()).padStart(2, "0"); // 일
  return `${year}${month}${day}`;
};

export { getTodayDate, getYesterdayDate };
