import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import BlurText from "../../ReactBitsComponent/BlurText";
import SplitText from "../../ReactBitsComponent/SplitText";
import Orb from "../../ReactBitsComponent/Orb";

import Headphone from "../../../assets/HomeProductImage/Headphone.png";
import Keyboard from "../../../assets/HomeProductImage/Keyboard.png";
import Mouse from "../../../assets/HomeProductImage/Mouse.png";
import Phone from "../../../assets/HomeProductImage/Phone.png";
import Speaker from "../../../assets/HomeProductImage/Speaker.png";

const images = [Headphone, Keyboard, Mouse, Phone, Speaker];

const HeroHeaderSection = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000); // Thay đổi ảnh sau 3 giây

    return () => clearInterval(interval); // Dọn dẹp khi component bị unmount
  }, []);

  return (
    <div className="pt-10  bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-4xl ">
      <div className="container mx-auto flex flex-col md:flex-row items-center px-6">
        <div className="flex flex-col gap-6 justify-start">
          <SplitText
            delay={5}
            className="text-6xl font-bold text-primary"
            textAlign="start"
            text="The next generation of tech is here"
          ></SplitText>
          <SplitText
            delay={2.5}
            className="text-base font-medium text-gray-600"
            textAlign="start"
            text="At NextGenTech, we are dedicated to bringing you the latest and greatest in technology. Our mission is to make online shopping for cutting-edge gadgets easy and enjoyable."
          ></SplitText>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 1.5 }}
            class="border text-gray-50  duration-300 relative group cursor-pointer text-lg  overflow-hidden h-16 w-48 rounded-md bg-primary-100 p-2  font-extrabold hover:bg-primary"
          >
            <div class="absolute group-hover:-top-1 group-hover:-right-2 z-10 w-16 h-16 rounded-full group-hover:scale-150  duration-700 right-12 top-12 bg-yellow-500"></div>
            <div class="absolute group-hover:-top-1 group-hover:-right-2 z-10 w-12 h-12 rounded-full group-hover:scale-150  duration-700 right-20 -top-6 bg-orange-500"></div>
            <div class="absolute group-hover:-top-1 group-hover:-right-2 z-10 w-8 h-8   rounded-full group-hover:scale-150  duration-700 right-32 top-6 bg-pink-500"></div>
            <div class="absolute group-hover:-top-1 group-hover:-right-2 z-10 w-4 h-4   rounded-full group-hover:scale-150  duration-700 right-2 top-12 bg-red-600"></div>
            <p class="z-10 absolute bottom-2 left-2">Shop now</p>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative  flex items-center justify-center"
          transition={{ duration: 0.5, ease: "easeOut", delay: 1 }}
          style={{ width: "90%", height: "500px" }}
        >
          <Orb
            hoverIntensity={0.5}
            rotateOnHover={true}
            hue={0}
            forceHoverState={false}
          />
          <AnimatePresence mode="wait">
            <motion.img
              key={images[currentImage]}
              src={images[currentImage]}
              alt="Slideshow"
              className="absolute w-1/2 h-1/2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroHeaderSection;
