import React, { useState, useEffect } from "react";

import HeroSection from "../../../components/User/About/HeroSection";
import StatsSection from "../../../components/User/About/StatsSection";
import MeetTheTeamSection from "../../../components/User/About/MeetTheTeamSection";

const AboutUs = () => {
  return (
    <div className="pt-20">
      <HeroSection />
      <StatsSection />
      <MeetTheTeamSection />
    </div>
  );
};

export default AboutUs;
