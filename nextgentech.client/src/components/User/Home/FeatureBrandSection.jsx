import React from "react";

import FlowingMenu from "../../ReactBitsComponent/FlowingMenu";
import AppleLogo from "../../../assets/HomeFeatureBrand/AppleLogo.png";
import RazerLogo from "../../../assets/HomeFeatureBrand/RazerLogo.png";
import SoundCoreLogo from "../../../assets/HomeFeatureBrand/SoundCoreLogo.png";

const Items = [
  {
    link: "#",
    text: "Apple",
    image: AppleLogo,
  },
  {
    link: "#",
    text: "Razer",
    image: RazerLogo,
  },
  {
    link: "#",
    text: "SoundCore",
    image: SoundCoreLogo,
  },
];

const FeatureBrandSection = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-display font-semibold text-foreground mb-2">
          Trusted by Leading Brands
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We partner with the world's most innovative technology companies to
          bring you premium products.
        </p>
      </div>
      <div style={{ height: "500px", position: "relative" }}>
        <FlowingMenu items={Items} />
      </div>
    </div>
  );
};

export default FeatureBrandSection;
