import React from "react";
import { motion } from "framer-motion";

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
    <motion.div
      className="container mx-auto px-6 py-10"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ amount: 0.2 }}
    >
      <div className="text-center mb-12">
        <motion.h2
          className="text-5xl p-2 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent font-bold mb-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Trusted by Leading Brands
        </motion.h2>
        <motion.p
          className="text-muted-foreground text-base font-medium text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          We partner with the world's most innovative technology companies to
          bring you premium products.
        </motion.p>
      </div>

      <motion.div
        style={{ height: "200px", position: "relative" }}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <FlowingMenu
          items={Items.map((item, index) => ({
            ...item,
            component: (
              <motion.img
                key={index}
                src={item.image}
                alt={item.text}
                className="w-24 h-24"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ scale: 1.1, rotate: 3 }}
              />
            ),
          }))}
        />
      </motion.div>
    </motion.div>
  );
};

export default FeatureBrandSection;
