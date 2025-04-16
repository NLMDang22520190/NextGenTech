import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

import FuzzyText from "../../../components/ReactBitsComponent/FuzzyText";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <FuzzyText baseIntensity={0.05} color="#50bbf5">404</FuzzyText>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-1 bg-primary-600 mx-auto my-6"
        />
        <p className="text-xl text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
        <Link
          to={"/"}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 transition-colors"
        >
          Return to Dashboard
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
