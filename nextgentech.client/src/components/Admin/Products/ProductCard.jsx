import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Popconfirm } from "antd";
import api from "../../../features/AxiosInstance/AxiosInstance";

const StarRating = ({ rating, reviews }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-gray-500 text-xs ml-2">({reviews})</span>
    </div>
  );
};

const ProductCard = ({ product, onEdit = () => {}, onDelete = () => {} }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-md hover:shadow-lg hover:scale-102 transition-all duration-100 flex flex-col"
    >
      <div className="relative">
        <div className="relative w-full aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
          <img
            src={product.image && product.image.startsWith('/api')
              ? `${api.defaults.baseURL}${product.image}`
              : product.image}
            alt={product.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/300x300?text=No+Image";
            }}
          />

          {/* Delete button */}
          <Popconfirm
            title="Delete Product"
            description="Are you sure you want to delete this product?"
            onConfirm={() => onDelete(product.id)}
            okText="Yes"
            cancelText="No"
            placement="left"
          >
            <button
              className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </Popconfirm>
        </div>
      </div>

      <div className="px-4 pt-3 pb-4 flex flex-col flex-1 justify-between space-y-1">
        <div>
          <h3 className="text-base font-semibold text-gray-800 line-clamp-2 cursor-pointer" onClick={handleClick}>{product.name}</h3>
          <p className="text-blue-500 font-semibold">${product.price.toFixed(2)}</p>
        </div>

        <div className="mb-2">
          <StarRating rating={product.rating} reviews={product.reviews} />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onEdit(product.id)}
          className="w-full py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
        >
          Edit Product
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;