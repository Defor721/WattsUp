import { useEffect, useState } from "react";

interface Location {
  lat: number;
  lng: number;
}

interface KakaoMapProps {
  onRegionClick: (region: string) => void; // 클릭된 지역을 전달하는 함수
}

const KakaoMap: React.FC<KakaoMapProps> = ({ onRegionClick }) => {
  const [map, setMap] = useState<any>(null); // KakaoMap 객체 저장
  const [userLocation, setUserLocation] = useState<Location>({
    lat: 36.5, // 기본 좌표: 대한민국 중심
    lng: 127.5,
  });
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error fetching location:", error);
          setErrorMessage("위치 정보를 가져올 수 없습니다.");
        },
        { enableHighAccuracy: true },
      );
    } else {
      setErrorMessage("브라우저에서 위치 정보를 지원하지 않습니다.");
    }
  }, []);

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
              center: new window.kakao.maps.LatLng(
                userLocation.lat,
                userLocation.lng,
              ),
              level: 13,
            };

            const kakaoMap = new window.kakao.maps.Map(container, options);
            setMap(kakaoMap); // 지도 객체 저장

            const locations = [
              { name: "서울시", lat: 37.5665, lng: 126.978 },
              { name: "부산시", lat: 35.1796, lng: 129.0756 },
              { name: "대구시", lat: 35.8714, lng: 128.6014 },
              { name: "인천시", lat: 37.4563, lng: 126.7052 },
              { name: "광주시", lat: 35.1595, lng: 126.8526 },
              { name: "대전시", lat: 36.3504, lng: 127.3845 },
              { name: "울산시", lat: 35.5384, lng: 129.3114 },
              { name: "경기도", lat: 37.4138, lng: 127.5183 },
              { name: "강원도", lat: 37.8228, lng: 128.1555 },
              { name: "충청북도", lat: 36.6357, lng: 127.4917 },
              { name: "충청남도", lat: 36.5184, lng: 126.8 },
              { name: "전라북도", lat: 35.7175, lng: 127.153 },
              { name: "전라남도", lat: 34.8679, lng: 126.991 },
              { name: "경상북도", lat: 36.2486, lng: 128.6647 },
              { name: "경상남도", lat: 35.2374, lng: 128.6922 },
              { name: "제주특별자치도", lat: 33.4996, lng: 126.5312 },
            ];

            // 마커 추가 및 클릭 이벤트 등록
            locations.forEach((location) => {
              const marker = new window.kakao.maps.Marker({
                position: new window.kakao.maps.LatLng(
                  location.lat,
                  location.lng,
                ),
                map: kakaoMap,
              });

              window.kakao.maps.event.addListener(marker, "click", () => {
                kakaoMap.setCenter(
                  new window.kakao.maps.LatLng(location.lat, location.lng),
                ); // 클릭된 지역으로 지도 중심 이동
                onRegionClick(location.name); // 클릭된 지역 이름 전달
              });
            });
          }
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script); // 스크립트 제거
    };
  }, [userLocation, onRegionClick]);

  return (
    <div className="relative h-[300px] w-full">
      <div id="map" className="h-full w-full" />
      {errorMessage && (
        <p className="mt-4 text-center text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default KakaoMap;
