import { useEffect } from "react";

const KakaoMap = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://dapi.kakao.com/v2/maps/sdk.js?appkey=d4b51b70e6c2633c7dd0c60675acfe6f&autoload=false";
    script.async = true;

    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          const container = document.getElementById("map");
          if (container) {
            const options = {
              center: new window.kakao.maps.LatLng(36.5, 127.5), // 대한민국 중심 좌표
              level: 13, // 줌 레벨
            };

            const map = new window.kakao.maps.Map(container, options);

            // 대한민국 주요 도/광역시 중심 좌표와 이름
            const locations = [
              { name: "서울특별시", lat: 37.5665, lng: 126.978 },
              { name: "부산광역시", lat: 35.1796, lng: 129.0756 },
              { name: "대구광역시", lat: 35.8714, lng: 128.6014 },
              { name: "인천광역시", lat: 37.4563, lng: 126.7052 },
              { name: "광주광역시", lat: 35.1595, lng: 126.8526 },
              { name: "대전광역시", lat: 36.3504, lng: 127.3845 },
              { name: "울산광역시", lat: 35.539, lng: 129.3114 },
              { name: "경기도", lat: 37.4138, lng: 127.5183 },
              { name: "강원도", lat: 37.8228, lng: 128.1555 },
              { name: "충청북도", lat: 36.6353, lng: 127.4914 },
              { name: "충청남도", lat: 36.5184, lng: 126.8006 },
              { name: "전라북도", lat: 35.7175, lng: 127.153 },
              { name: "전라남도", lat: 34.8161, lng: 126.4629 },
              { name: "경상북도", lat: 36.5759, lng: 128.5052 },
              { name: "경상남도", lat: 35.238, lng: 128.692 },
              { name: "제주특별자치도", lat: 33.4996, lng: 126.5312 },
            ];

            // 마커 및 정보 창 추가
            locations.forEach((location) => {
              const markerPosition = new window.kakao.maps.LatLng(
                location.lat,
                location.lng,
              );
              const marker = new window.kakao.maps.Marker({
                position: markerPosition,
                map: map,
              });

              const infoWindow = new window.kakao.maps.InfoWindow({
                content: `<div style="padding:5px;font-size:12px;">${location.name}</div>`,
              });

              // 마커에 마우스를 올리면 정보 창 표시
              window.kakao.maps.event.addListener(marker, "mouseover", () => {
                infoWindow.open(map, marker);
              });

              // 마커에서 마우스를 떼면 정보 창 닫기
              window.kakao.maps.event.addListener(marker, "mouseout", () => {
                infoWindow.close();
              });
            });
          } else {
            console.error("Map container element not found");
          }
        });
      }
    };

    document.head.appendChild(script);

    // Cleanup script on unmount
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div
      id="map"
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export default KakaoMap;
