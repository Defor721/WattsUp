const getLast7Days = (): string[] => {
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().slice(0, 10).replace(/-/g, ""));
  }
  return dates;
};

export { getLast7Days };
