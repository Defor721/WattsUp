import Introduce from "@/components/mainpage/introduce/Introduce";
import VideoPart from "@/components/mainpage/video/VideoPart";
import FeaturesPart from "@/components/mainpage/features/Features";
import RenewableEnergyIntro from "@/components/mainpage/renewable/renewable";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#fff]">
      <VideoPart />
      <Introduce />
      <RenewableEnergyIntro />
      <FeaturesPart />
    </div>
  );
}
