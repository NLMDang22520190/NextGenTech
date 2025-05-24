import { useState } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";
import { Popconfirm } from "antd";
import api from "../../../features/AxiosInstance/AxiosInstance";

const BrandCard = ({ brand, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(brand);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
  };

  // No longer needed as we're using Popconfirm's onConfirm

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-md hover:shadow-lg hover:scale-102 transition-all duration-100 flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div className="relative w-full aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
          <img
            src={brand.image !== ''
              ? (brand.image.startsWith('/api')
                ? `${api.defaults.baseURL}${brand.image}`
                : brand.image)
              : `https://logo.clearbit.com/${brand.name}.com`}
            alt={brand.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/300x300?text=No+Image";
            }}
          />

          {/* Action buttons that appear on hover */}
          {isHovered && (
            <div className="absolute top-2 right-2 flex space-x-2 bg-white bg-opacity-80 rounded-lg p-1 shadow-md transition-opacity duration-200">
              <button
                onClick={handleEdit}
                className="p-1.5 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                <Edit size={14} />
              </button>
              <Popconfirm
                title="Delete Brand"
                description="Are you sure you want to delete this brand?"
                onConfirm={() => onDelete(brand.id)}
                okText="Yes"
                cancelText="No"
                placement="left"
              >
                <button
                  onClick={handleDelete}
                  className="p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </Popconfirm>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 pt-3 pb-4 flex flex-col flex-1 justify-center">
          <h3 className="text-base font-semibold text-gray-800 line-clamp-2 text-center">{brand.name}</h3>
      </div>
    </motion.div>
  );
};

export default BrandCard;