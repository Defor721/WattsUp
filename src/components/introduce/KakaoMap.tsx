"use client"; // Next.js의 클라이언트 전용 컴포넌트를 선언

import { useEffect, useState } from "react"; // React의 Hook인 useEffect와 useState를 import

// 사용자 위치를 나타내는 타입 정의
interface Location {
  lat: number; // 위도
  lng: number; // 경도
}

// KakaoMap 컴포넌트의 props 타입 정의
interface KakaoMapProps {
  onRegionClick: (region: string) => void; // 지역 클릭 시 지역 이름을 전달하는 콜백 함수
}

const KakaoMap: React.FC<KakaoMapProps> = ({ onRegionClick }) => {
  const [map, setMap] = useState<any>(null); // KakaoMap 객체를 저장할 상태
  const [userLocation, setUserLocation] = useState<Location>({
    lat: 36.5, // 기본 위도: 대한민국 중심
    lng: 127.5, // 기본 경도: 대한민국 중심
  });
  const [errorMessage, setErrorMessage] = useState<string>(""); // 위치 정보 오류 메시지 상태

  // 사용자 위치 정보 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      // 브라우저에서 위치 정보를 지원하는 경우
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords; // 사용자 위치 정보
          setUserLocation({ lat: latitude, lng: longitude }); // 위치 상태 업데이트
        },
        (error) => {
          console.error("Error fetching location:", error); // 위치 정보 가져오기 실패 시 오류 로그 출력
          setErrorMessage("위치 정보를 가져올 수 없습니다."); // 오류 메시지 설정
        },
        { enableHighAccuracy: true }, // 높은 정확도로 위치 정보 요청
      );
    } else {
      // 브라우저에서 위치 정보를 지원하지 않는 경우
      setErrorMessage("브라우저에서 위치 정보를 지원하지 않습니다.");
    }
  }, []);

  // 카카오 맵 스크립트 로드 및 초기화
  useEffect(() => {
    const script = document.createElement("script"); // script 태그 생성
    script.src =
      "https://dapi.kakao.com/v2/maps/sdk.js?appkey=d4b51b70e6c2633c7dd0c60675acfe6f&autoload=false"; // 카카오 맵 SDK URL
    script.async = true; // 비동기 로드 설정

    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        // 카카오 맵 SDK가 로드된 경우
        window.kakao.maps.load(() => {
          const container = document.getElementById("map"); // 지도 렌더링할 DOM 요소 선택
          if (container) {
            const options = {
              center: new window.kakao.maps.LatLng(
                userLocation.lat,
                userLocation.lng,
              ), // 지도 중심 좌표
              level: 13, // 지도 줌 레벨
            };

            const kakaoMap = new window.kakao.maps.Map(container, options); // 지도 생성
            setMap(kakaoMap); // 생성된 지도 객체 저장

            kakaoMap.setDraggable(true); // 지도 드래그 가능 설정
            kakaoMap.setZoomable(false); // 지도 줌 불가능 설정

            const locations = [
              // 주요 도시 및 지역 좌표
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

            // 각 지역에 마커 추가
            locations.forEach((location) => {
              const markerImage = new window.kakao.maps.MarkerImage(
                "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png", // 마커 이미지 URL
                new window.kakao.maps.Size(32, 32), // 마커 크기
              );

              const marker = new window.kakao.maps.Marker({
                position: new window.kakao.maps.LatLng(
                  location.lat,
                  location.lng,
                ), // 마커 위치
                image: markerImage, // 마커 이미지
                map: kakaoMap, // 마커를 추가할 지도 객체
              });

              const infoWindow = new window.kakao.maps.InfoWindow({
                content: `<div style="padding:5px;font-size:14px;font-weight:bold;color:#333;text-align:center;min-width:40px;">${location.name}</div>`, // 정보창 내용
              });

              // 마커 hover 시 정보창 표시
              window.kakao.maps.event.addListener(marker, "mouseover", () => {
                infoWindow.open(kakaoMap, marker);
              });

              // 마커 hover 해제 시 정보창 닫기
              window.kakao.maps.event.addListener(marker, "mouseout", () => {
                infoWindow.close();
              });

              // 마커 클릭 시 지역 이름 전달
              window.kakao.maps.event.addListener(marker, "click", () => {
                onRegionClick(location.name); // 클릭된 지역 이름을 부모 컴포넌트에 전달
              });
            });
          }
        });
      }
    };

    document.head.appendChild(script); // script 태그 추가

    return () => {
      document.head.removeChild(script); // 컴포넌트 언마운트 시 script 태그 제거
    };
  }, [userLocation, onRegionClick]); // userLocation 또는 onRegionClick이 변경될 때마다 실행

  return (
    <div className="relative h-[300px] w-full">
      {/* 지도 컨테이너 */}
      <div id="map" className="h-full w-full" /> {/* 지도 렌더링될 영역 */}
      {errorMessage && (
        <p className="mt-4 text-center text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default KakaoMap; // KakaoMap 컴포넌트 내보내기
