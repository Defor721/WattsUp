import React from "react";

interface CountryData {
  label: string;
  value: number | undefined; // undefined를 허용
}

const UsersByCountry = ({ data }: { data: CountryData[] }) => {
  return (
    <div className="rounded-lg bg-gray-800 p-6 shadow-lg">
      <h3 className="mb-4 text-xl font-bold text-white">연도별 국민총소득</h3>
      <ul>
        {data.map((country) => (
          <li
            key={country.label}
            className="flex justify-between text-gray-400"
          >
            <span>{country.label}년</span>
            <span>
              {country.value
                ? `${country.value.toLocaleString()} 억원`
                : "데이터 없음"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersByCountry;
