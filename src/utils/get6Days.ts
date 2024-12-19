const get6Days = (): string[] => {
  const dates: string[] = [];
  for (let i = 0; i < 6; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    // 직접 포맷 지정 (YYYY-MM-DD 형식)
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    dates.push(formattedDate);
  }
  return dates;
};

export { get6Days };
