// 소수점 2자리까지 포맷팅
export const formatNumberWithDecimal = (num: number) => {
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(num); // 1,200.00
};

// 소수점 없이 포맷팅
export const formatNumberWithoutDecimal = (num: number) => {
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(num); // 1,200
};
