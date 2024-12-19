import * as React from "react";

const TABLET_BREAKPOINT = 1024;

export function useDeviceType() {
  const [deviceType, setDeviceType] = React.useState<{
    isTablet: boolean;
  }>({
    isTablet: false,
  });

  React.useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;
      setDeviceType({
        isTablet: width <= TABLET_BREAKPOINT,
      });
    };

    updateDeviceType(); // 초기 상태 설정
    window.addEventListener("resize", updateDeviceType); // 리사이즈 이벤트 등록

    return () => window.removeEventListener("resize", updateDeviceType); // 이벤트 정리
  }, []);

  return deviceType;
}
