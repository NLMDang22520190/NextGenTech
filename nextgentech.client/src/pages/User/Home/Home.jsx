import React from "react";

import HeroHeaderSection from "../../../components/User/Home/HeroHeaderSection";
import FeatureBrandSection from "../../../components/User/Home/FeatureBrandSection";

const Home = () => {
  return (
    <div className="pt-20 p-6">
      <HeroHeaderSection />
      <FeatureBrandSection />
    </div>
  );
};

export default Home;
