"use client";

import React, { useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState<{
    smpAverage: string | null;
    recValue: string | null;
  }>({
    smpAverage: null,
    recValue: null,
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/crawl");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        console.log("크롤링 데이터:", result);
        setData(result);
      } catch (error: any) {
        console.error("API 호출 실패:", error);
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>크롤링 데이터</h1>

      <p>SMP 평균가: {data.smpAverage || "로딩 중..."}</p>
      <p>REC 값: {data.recValue || "로딩 중..."}</p>
    </div>
  );
}
