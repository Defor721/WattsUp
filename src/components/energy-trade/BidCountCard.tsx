"use client"; // Next.js에서 클라이언트 컴포넌트로 동작하도록 지정

import { useEffect, useState } from "react"; // React 훅 사용을 위해 import

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card"; // UI 카드 컴포넌트
import { Skeleton } from "@/components/shadcn/skeleton"; // 로딩 상태를 표시하는 컴포넌트

export function BidCountCard() {
  // bidCount: 입찰 건수 데이터 상태 (초기값 null)
  const [bidCount, setBidCount] = useState<number | null>(null);
  // isLoading: 로딩 상태 (초기값 true)
  const [isLoading, setIsLoading] = useState(true);
  // error: 에러 메시지 상태 (초기값 null)
  const [error, setError] = useState<string | null>(null);

  // 컴포넌트가 마운트될 때 실행
  useEffect(() => {
    const fetchBidCount = async () => {
      try {
        // "/api/trade/countbid" 엔드포인트에 요청
        const response = await fetch("/api/trade/countbid");
        if (!response.ok) {
          // 응답 상태가 200이 아닌 경우 에러 발생
          throw new Error("Failed to fetch bid count");
        }
        const data = await response.json(); // 응답 데이터를 JSON으로 변환
        setBidCount(data.count); // 입찰 건수 상태 업데이트
        setIsLoading(false); // 로딩 상태 해제
      } catch (err) {
        // 에러가 발생한 경우
        setError("Failed to load bid count"); // 에러 메시지 설정
        setIsLoading(false); // 로딩 상태 해제
      }
    };

    fetchBidCount(); // 초기 데이터 요청

    // 5초마다 데이터를 새로 요청하는 인터벌 설정
    const interval = setInterval(fetchBidCount, 5000);

    // 컴포넌트가 언마운트될 때 인터벌 해제
    return () => clearInterval(interval);
  }, []);

  // 로딩 상태를 렌더링
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex items-center justify-between space-y-0 p-2">
          <CardTitle className="text-sm font-bold">입찰 건수</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-[100px] text-sm" /> {/* 로딩 상태 UI */}
        </CardContent>
      </Card>
    );
  }

  // 에러 상태를 렌더링
  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">입찰 건수</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-red-500">{error}</div>
          {/* 에러 메시지 */}
        </CardContent>
      </Card>
    );
  }

  // 성공적으로 데이터를 불러온 경우 렌더링
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">입찰 건수</CardTitle>
      </CardHeader>
      <CardContent>
        {/* 데이터가 로드되었을 때 입찰 건수를 포맷하여 출력 */}
        <div className="text-2xl font-bold">
          {bidCount?.toLocaleString() ?? 0}
        </div>
      </CardContent>
    </Card>
  );
}
