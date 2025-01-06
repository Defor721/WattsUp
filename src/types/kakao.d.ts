declare namespace kakao.maps {
  class LatLng {
    constructor(latitude: number, longitude: number);
    getLat(): number;
    getLng(): number;
  }

  class Map {
    setZoomable(arg0: boolean) {
      throw new Error("Method not implemented.");
    }
    setDraggable(arg0: boolean) {
      throw new Error("Method not implemented.");
    }
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
      image?: undefined;
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
      maps: {
        CustomOverlay: any;
        load(arg0: () => void): unknown;
        LatLng: typeof kakao.maps.LatLng;
        Map: typeof kakao.maps.Map;
        Marker: typeof kakao.maps.Marker;
        MarkerImage: typeof kakao.maps.MarkerImage;
        Size: typeof kakao.maps.Size;
        InfoWindow: typeof kakao.maps.InfoWindow;
        event: typeof kakao.maps.event;
      };
    };
  }
}

export {};
