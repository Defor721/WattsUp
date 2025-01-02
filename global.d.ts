declare module "fullpage.js" {
  export default class fullpage {
    constructor(
      selector: string,
      options: {
        licenseKey?: string;
        scrollingSpeed?: number;
        navigation?: boolean;
        anchors?: string[];
      },
    );
    static destroy(type: string): void;
  }
}
