"use client";
// SlideNavigationProps 타입 정의
interface SlideNavigationProps {
  totalSlides: number; // 전체 슬라이드 개수
  currentSlide: number; // 현재 선택된 슬라이드
  onSlideChange: (index: number) => void; // 슬라이드 변경 핸들러
}

// SlideNavigation 컴포넌트 정의
function SlideNavigation({
  totalSlides,
  currentSlide,
  onSlideChange,
}: SlideNavigationProps) {
  return (
    <div className="absolute bottom-12 flex justify-center space-x-2">
      {/* 슬라이드 네비게이션 버튼 생성 */}
      {new Array(totalSlides).fill(null).map((_, index) => (
        <button
          key={index}
          onClick={() => onSlideChange(index)}
          className={`h-4 w-4 rounded-full border-2 transition ${
            currentSlide === index ? "bg-white" : "border-white"
          }`}
        />
      ))}
    </div>
  );
}

export default SlideNavigation;
