import Main from "@/components/energy-trade/Main";
import Title from "@/components/ui/Title";

export default function TradePage() {
  return (
    <div className="mx-auto flex max-w-[1920px] flex-col p-5 xl:p-10">
      <Title title="태양광 전력 거래소" className="md:mb-5" />
      <Main />
    </div>
  );
}
