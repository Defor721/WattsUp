declare namespace kakao.maps {
  class LatLng {
    constructor(latitude: number, longitude: number);
    getLat(): number;
    getLng(): number;
  }

  class Map {
    constructor(
      container: HTMLElement,
      options: {
        center: LatLng;
        level: number;
      },
    );
    setCenter(position: LatLng): void;
    setLevel(level: number, options?: { animate: boolean }): void;
    getLevel(): number;
    getCenter(): LatLng;
  }

  class Marker {
    constructor(options: {
      position: LatLng;
      map?: Map;
      title?: string;
      zIndex?: number;
    });
    setMap(map: Map | null): void;
    setPosition(position: LatLng): void;
    getPosition(): LatLng;
  }

  class InfoWindow {
    constructor(options: {
      content: string;
      position?: LatLng;
      removable?: boolean;
      zIndex?: number;
    });
    open(map: Map, marker?: Marker): void;
    close(): void;
    setContent(content: string): void;
    setPosition(position: LatLng): void;
    setZIndex(zIndex: number): void;
  }

  namespace event {
    function addListener(
      target: Marker | Map | InfoWindow,
      type: string,
      handler: (...args: any[]) => void,
    ): void;
    function removeListener(
      target: Marker | Map | InfoWindow,
      type: string,
      handler: (...args: any[]) => void,
    ): void;
  }

  export function load(arg0: () => void) {
    throw new Error("Function not implemented.");
  }
}

// Window 인터페이스에 kakao 객체 타입 선언
declare global {
  interface Window {
    kakao: {
      maps: typeof kakao.maps;
    };
  }
}

export {};
