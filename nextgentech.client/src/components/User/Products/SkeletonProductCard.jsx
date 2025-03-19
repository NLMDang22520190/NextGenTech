import React from "react";
import { Skeleton } from "antd";

const SkeletonProductCard = () => {
  return (
    <div className="flex cursor-pointer flex-col border rounded-lg overflow-hidden shadow-sm transition-transform hover:shadow-md hover:scale-105 bg-white h-full">
      {/* Product Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <div
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out bg-gray-200 
           
          `}
        />
        <Skeleton.Image active></Skeleton.Image>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        <Skeleton active></Skeleton>
      </div>
    </div>
  );
};

export default SkeletonProductCard;
