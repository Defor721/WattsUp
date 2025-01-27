import React from "react";
import ReactFullpage from "@fullpage/react-fullpage";

// 각 섹션에 렌더링할 컴포넌트 가져오기
import VideoPart from "./video/VideoPart";
import EnergyInfoPage from "./renewable/Renewable";
import FeaturesPart from "./features/Features";
import OurWeb from "./web/OurWeb";
import TodayValue from "./value/page";
// import TodayValue from "../dashboard/main/TodayValue";

const FullPageWrapper: React.FC = () => {
  return (
    <ReactFullpage
      // 라이선스 키 설정 (비상업적 용도는 빈 문자열로 설정 가능)
      licenseKey=""
      // 스크롤 전환 속도 (밀리초 단위, 700ms)
      scrollingSpeed={700}
      // 각 섹션의 앵커 (URL 해시와 연결됨)
      anchors={["video", "ourweb", "value", "energy", "features"]}
      // 섹션 스냅 기능 활성화
      fitToSection={true}
      // Fullpage.js 하단 저작권 표시 설정
      credits={{
        enabled: false, // 저작권 메시지 표시 여부 (false: 숨김)
        label: "", // 메시지 텍스트
        position: "right", // 메시지 위치 ("right", "left", "top", "bottom")
      }}
      // 섹션 렌더링 함수
      render={() => (
        <ReactFullpage.Wrapper>
          {/* 섹션 1: VideoPart 컴포넌트 */}
          <div className="section">
            <VideoPart />
          </div>
          {/* 섹션 2: web소개 컴포넌트 */}
          <div className="section">
            <OurWeb />
          </div>
          {/* 섹션 3: MainIntroPage 컴포넌트 */}
          <div className="section">
            <TodayValue />
          </div>
          {/* 섹션 4: EnergyInfoPage 컴포넌트 */}
          <div className="section">
            <EnergyInfoPage />
          </div>
          {/* 섹션 5: FeaturesPart 컴포넌트 */}
          <div className="section">
            <FeaturesPart />
          </div>
        </ReactFullpage.Wrapper>
      )}
    />
  );
};

export default FullPageWrapper;
