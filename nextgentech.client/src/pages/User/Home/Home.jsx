import React from "react";

import HeroHeaderSection from "../../../components/User/Home/HeroHeaderSection";
import FeatureBrandSection from "../../../components/User/Home/FeatureBrandSection";
import FeatureProductSection from "../../../components/User/Home/FeatureProductSection";
import Benefits from "../../../components/User/Home/BenefitSection";

const Home = () => {
  return (
    <div className="pt-20 p-6">
      <HeroHeaderSection />
      <FeatureBrandSection />
      <FeatureProductSection />
      <Benefits />
    </div>
  );
};

export default Home;
