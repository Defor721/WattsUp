declare namespace kakao.maps {
  class LatLng {
    constructor(latitude: number, longitude: number);
  }

  class Map {
    constructor(
      container: HTMLElement,
      options: { center: LatLng; level: number },
    );
  }

  class Marker {
    constructor(options: { position: LatLng; map?: Map });
    setMap(map: Map | null): void;
  }

  class InfoWindow {
    constructor(options: { content: string });
    open(map: Map, marker: Marker): void;
    close(): void;
  }

  function load(callback: () => void): void;

  namespace event {
    function addListener(
      target: Marker | Map,
      type: string,
      callback: (...args: any[]) => void,
    ): void;
  }
}
