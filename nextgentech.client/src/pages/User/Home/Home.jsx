import React from "react";

import HeroHeaderSection from "../../../components/User/Home/HeroHeaderSection";
import FeatureBrandSection from "../../../components/User/Home/FeatureBrandSection";
import FeatureProductSection from "../../../components/User/Home/FeatureProductSection";
import Benefits from "../../../components/User/Home/BenefitSection";
import TestomonialSection from "../../../components/User/Home/TestomonialSection";

const Home = () => {
  return (
    <div className="pt-20">
      <HeroHeaderSection />
      <FeatureBrandSection />
      <FeatureProductSection />
      <Benefits />
      <TestomonialSection />
    </div>
  );
};

export default Home;
