import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import FuzzyText from "../../components/ReactBitsComponent/FuzzyText";

const NotFound = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-screen gap-6 text-center px-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <FuzzyText color="black" baseIntensity={0.1}>
        404
      </FuzzyText>
      <FuzzyText color="black" fontSize={32} baseIntensity={0.1}>
        Page Not Found
      </FuzzyText>
      <p className="text-gray-500">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-primary text-white rounded-lg shadow-md hover:bg-primary/80 transition"
      >
        Go to Homepage
      </Link>
    </motion.div>
  );
};

export default NotFound;
