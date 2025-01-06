"use client"; // Next.js의 client-side 컴포넌트임을 명시

import { useState } from "react"; // React의 useState 훅을 가져옴
import { motion } from "framer-motion"; // 애니메이션 효과를 위한 framer-motion 라이브러리
import axios from "axios"; // HTTP 요청을 위한 Axios 라이브러리

// ShadCN UI 컴포넌트 가져오기
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Label } from "@/components/shadcn/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { Regions } from "@/utils/regions"; // 지역 리스트 가져오기

// Regions 배열을 Select 컴포넌트에서 사용할 수 있는 옵션 형식으로 변환
const regionOptions = Regions.map((region) => ({
  value: region.toLowerCase().replace(/시|도$/, ""), // '시', '도' 제거 후 소문자로 변환하여 value로 사용
  // api 연결 통일성 주려고 소문자로 권장한다고 챗지피티가 그럼...
  label: region, // 원래 지역명을 label로 사용
}));

// API 호출 함수: 입찰 데이터를 서버에 전송
const submitBid = async (region: string, totalPrice: number) => {
  const response = await axios.post("/api/trade/bid", {
    region, // 선택된 지역
    price: totalPrice, // 총 가격
  });
  return response.data; // 서버에서 반환된 응답 데이터를 반환
};

// 입찰 폼 컴포넌트
export default function BidForm() {
  const [region, setRegion] = useState(""); // 선택된 지역 상태
  const [quantity, setQuantity] = useState(""); // 수량 입력 상태
  const [price, setPrice] = useState(""); // 단가 입력 상태
  const [isSubmitting, setIsSubmitting] = useState(false); // 제출 중 여부 상태

  // 폼 제출 핸들러 함수
  const handleSubmit = async (e: any) => {
    e.preventDefault(); // 폼 기본 동작(페이지 새로고침)을 방지
    const totalPrice = +quantity * +price; // 입력된 수량과 단가를 곱하여 총 가격 계산
    // +는 유니어리 플러스 연산자(Unary Plus Operator)로, 문자열이나 기타 타입의 값을 숫자 타입으로 변환
    // quantity와 price는 입력값으로 받기 때문에 문자열 타입입니다. 숫자 계산을 하기 위해서는 이를 숫자로 변환해야 함.
    setIsSubmitting(true); // 제출 중 상태 활성화
    try {
      await submitBid(region, totalPrice); // API 호출
      alert("입찰이 성공적으로 제출되었습니다."); // 성공 메시지
      setRegion(""); // 상태 초기화
      setQuantity("");
      setPrice("");
    } catch (error) {
      console.error("입찰 제출 중 오류:", error); // 오류 로그 출력
      alert("입찰 제출 중 문제가 발생했습니다."); // 오류 메시지
    } finally {
      setIsSubmitting(false); // 제출 중 상태 비활성화
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // 초기 애니메이션 설정: 투명도 0, y축 아래로 이동
      animate={{ opacity: 1, y: 0 }} // 애니메이션 완료 설정: 투명도 1, y축 원래 위치
      transition={{ duration: 0.5 }} // 애니메이션 지속 시간
      className="w-full"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">입찰하기</CardTitle>
          {/* 카드 제목 */}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 지역 선택 */}
            <div className="space-y-2">
              {/* 지역 선택 라벨 */}
              <Label htmlFor="region" className="text-sm font-medium">
                지역
              </Label>
              <Select value={region} onValueChange={setRegion}>
                {/* Select 컴포넌트 */}
                <SelectTrigger id="region">
                  {/* 드롭다운을 열고 닫는 트리거 버튼 */}
                  <SelectValue placeholder="지역을 선택하세요" />{" "}
                  {/* 기본값(선택되지 않았을 때 표시) */}
                </SelectTrigger>
                <SelectContent className="z-50 bg-white">
                  {/* 드롭다운 항목 목록을 감싸는 컨테이너 */}
                  {regionOptions.map((region) => (
                    <SelectItem key={region.value} value={region.value}>
                      {/* 각 드롭다운 항목 */}
                      {region.label} {/* 화면에 표시되는 지역명 */}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* 수량 입력 */}
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-medium">
                수량 (kWh) {/* 수량 입력 라벨 */}
              </Label>
              <Input
                id="quantity" // 수량 입력 필드 ID
                type="number" // 숫자 입력 타입
                value={quantity} // 입력된 수량 값
                onChange={(e) => setQuantity(e.target.value)} // 값 변경 시 상태 업데이트
                required // 필수 입력 필드
              />
            </div>
            {/* 단가 입력 */}
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium">
                단가 (원/kWh) {/* 단가 입력 라벨 */}
              </Label>
              <Input
                id="price" // 단가 입력 필드 ID
                type="number" // 숫자 입력 타입
                value={price} // 입력된 단가 값
                onChange={(e) => setPrice(e.target.value)} // 값 변경 시 상태 업데이트
                required // 필수 입력 필드
              />
            </div>
            {/* 총 가격 표시 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">총 가격 (원)</Label>
              {/* 총 가격 라벨 */}
              <div className="text-lg font-bold">
                {quantity && price // 수량과 단가가 입력되었는지 확인
                  ? (+quantity * +price).toLocaleString() // 총 가격을 계산하고 천 단위 구분 기호 추가
                  : "0"}
                원
              </div>
            </div>
            {/* 제출 버튼 */}
            <Button
              type="submit" // 버튼 타입: 제출
              disabled={isSubmitting} // 제출 중이면 비활성화
              className="w-full bg-[rgb(13,23,53)] text-white hover:bg-[rgb(13,23,53)]/90" ///90은 90% 불투명도를 의미(10% 투명).
            >
              {isSubmitting ? "제출 중..." : "입찰하기"}
              {/* 상태에 따라 버튼 텍스트 변경 */}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
