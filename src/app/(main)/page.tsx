import Introduce from "@/components/main/introduce/Introduce";
import VideoPart from "@/components/main/video/VideoPart";
import FeaturesPart from "@/components/main/features/Features";
import EnergyInfoPage from "@/components/main/renewable/renewable";

export default function Home() {
  return (
    <div className="relative min-h-screen min-w-[650px] bg-white md:w-full">
      {/* 비디오 섹션 */}
      <VideoPart />

      {/* 컨텐츠 컨테이너 */}
      <div className="w-full">
        {/* 소개 섹션 */}
        <section className="">
          <Introduce />
        </section>

        {/* 재생 가능 에너지 소개 */}
        <section className="bg-gray-50">
          <EnergyInfoPage />
        </section>

        {/* 주요 기능 섹션 */}
        <section className="bg-gray-100">
          <FeaturesPart />
        </section>
      </div>
    </div>
  );
}
