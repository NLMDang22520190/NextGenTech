import React from "react";
import { Skeleton } from "antd";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const SkeletonProductDetail = () => {
  const navigate = useNavigate();
  const handleBackToProducts = () => navigate("/products");

  return (
    <motion.div
      className="container mx-auto px-4 md:px-6 pt-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.button
        onClick={handleBackToProducts}
        className="flex items-center cursor-pointer text-primary-300 hover:text-primary-500 transition mb-6 group"
        whileHover={{ x: -5 }}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        <span>Back to Products</span>
      </motion.button>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-lg shadow-sm overflow-hidden flex justify-center items-center h-96">
          <Skeleton.Image active />
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Skeleton active paragraph={{ rows: 4 }} />
          </div>
        </div>
      </motion.div>

      {/* Additional Details & Specs */}
      <motion.div
        className="pb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
      >
        <h2 className="text-2xl font-semibold mb-4">Product Details</h2>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SkeletonProductDetail;
