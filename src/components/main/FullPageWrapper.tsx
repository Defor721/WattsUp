import React from "react";
import ReactFullpage from "@fullpage/react-fullpage";

import VideoPart from "./video/VideoPart";
import EnergyInfoPage from "./renewable/Renewable";
import FeaturesPart from "./features/Features";

const FullPageWrapper: React.FC = () => {
  return (
    <ReactFullpage
      licenseKey=""
      scrollingSpeed={700}
      navigation
      anchors={["video", "energy", "features"]}
      fitToSection={true}
      credits={{
        enabled: false,
        label: "Made with FullPage.js",
        position: "right",
      }}
      render={() => (
        <ReactFullpage.Wrapper>
          <div className="section" style={{ backgroundColor: "#e5e7eb" }}>
            <VideoPart />
          </div>
          <div className="section" style={{ backgroundColor: "#f3f4f6" }}>
            <EnergyInfoPage />
          </div>
          <div className="section" style={{ backgroundColor: "#ffffff" }}>
            <FeaturesPart />
          </div>
        </ReactFullpage.Wrapper>
      )}
    />
  );
};

export default FullPageWrapper;
