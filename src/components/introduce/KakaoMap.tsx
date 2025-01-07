"use client"; // Next.js의 클라이언트 전용 컴포넌트

import { useEffect, useState } from "react"; // React의 useEffect와 useState 가져오기

// 사용자 위치를 나타내는 타입 정의
interface Location {
  lat: number; // 위도
  lng: number; // 경도
}

// KakaoMap 컴포넌트의 props 타입 정의
interface KakaoMapProps {
  onRegionClick: (region: string) => void; // 지역 클릭 시 호출되는 콜백 함수
}

const KakaoMap = ({ onRegionClick }: KakaoMapProps) => {
  const [map, setMap] = useState<any>(null); // KakaoMap 객체 상태
  const [userLocation, setUserLocation] = useState<Location>({
    lat: 36.5, // 대한민국 중심부 위도
    lng: 127.5, // 대한민국 중심부 경도
  });
  const [errorMessage, setErrorMessage] = useState<string>(""); // 오류 메시지 상태

  // 사용자 위치 가져오기 (처음 한 번 실행)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          setUserLocation({ lat: latitude, lng: longitude }); // 사용자 위치 설정
        },
        () => setErrorMessage("위치 정보를 가져올 수 없습니다."),
        { enableHighAccuracy: true },
      );
    } else {
      setErrorMessage("브라우저에서 위치 정보를 지원하지 않습니다.");
    }
  }, []);

  // 카카오 맵 초기화 및 마커 설정
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://dapi.kakao.com/v2/maps/sdk.js?appkey=d4b51b70e6c2633c7dd0c60675acfe6f&autoload=false";
    script.async = true;

    script.onload = () => {
      if (window.kakao?.maps) {
        window.kakao.maps.load(() => {
          const container = document.getElementById("map"); // 지도 컨테이너
          if (container) {
            const kakaoMap = new window.kakao.maps.Map(container, {
              center: new window.kakao.maps.LatLng(
                userLocation.lat,
                userLocation.lng,
              ), // 초기 중심 좌표
              level: 13, // 줌 레벨 설정
            });
            setMap(kakaoMap); // KakaoMap 객체 저장

            // 현재 위치 마커 추가 (한 번만 설정)
            new window.kakao.maps.Marker({
              position: new window.kakao.maps.LatLng(
                userLocation.lat,
                userLocation.lng,
              ),
              map: kakaoMap,
            });

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
            ];

            // 각 지역에 마커 설정
            locations.forEach((location) => {
              const marker = new window.kakao.maps.Marker({
                position: new window.kakao.maps.LatLng(
                  location.lat,
                  location.lng,
                ),
                map: kakaoMap,
              });

              const infoWindow = new window.kakao.maps.InfoWindow({
                content: `<div style="padding:5px;font-size:12px;font-weight:bold;color:#333;min-width:40px;text-align:center;jusctify-center;">${location.name}</div>`,
              });

              // 마커 hover 시 정보창 열기
              window.kakao.maps.event.addListener(marker, "mouseover", () => {
                infoWindow.open(kakaoMap, marker);
              });

              // 마커 hover 해제 시 정보창 닫기
              window.kakao.maps.event.addListener(marker, "mouseout", () => {
                infoWindow.close();
              });

              // 마커 클릭 시 지역 이름 전달
              window.kakao.maps.event.addListener(marker, "click", () => {
                onRegionClick(location.name); // 클릭된 지역 이름 전달
              });
            });
          }
        });
      }
    };

    document.head.appendChild(script); // script 추가 : JavaScript로 외부 스크립트를 동적으로 로드할 때 사용

    return () => {
      document.head.removeChild(script); // 컴포넌트 언마운트 시 script 제거
    };
  }, [userLocation, onRegionClick]); // 의존성: userLocation, onRegionClick

  return (
    <div className="relative h-[300px] w-full">
      <div id="map" className="h-full w-full" /> {/* 지도 컨테이너 */}
      {errorMessage && (
        <p className="mt-4 text-center text-red-500">{errorMessage}</p>
      )}{" "}
      {/* 오류 메시지 */}
    </div>
  );
};

export default KakaoMap; // KakaoMap 컴포넌트 내보내기
