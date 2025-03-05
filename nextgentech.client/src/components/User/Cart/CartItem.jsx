import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";

const CartItem = ({ item, updateQuantity, removeItem }) => {
  // Calculate discount percentage if discount price exists
  const discountPercentage = item.discountPrice
    ? Math.round(((item.price - item.discountPrice) / item.price) * 100)
    : 0;

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Product Image */}
        <div className="w-full sm:w-32 h-32 bg-gray-100 flex-shrink-0 overflow-hidden">
          <Link to={`/products/${item.id}`}>
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        </div>

        {/* Product Details */}
        <div className="flex flex-col sm:flex-row flex-1 p-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col h-full justify-between">
              <div>
                <Link
                  to={`/products/${item.id}`}
                  className="text-lg font-medium line-clamp-2 hover:text-blue-600 transition-colors"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-gray-500 mt-1">
                  Category: {item.categoryName}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {item.discountPrice ? (
                    <>
                      <span className="text-gray-400 line-through">
                        ${item.price.toFixed(2)}
                      </span>
                      <span className="text-blue-600 font-medium">
                        ${item.discountPrice.toFixed(2)}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full">
                        {discountPercentage}% off
                      </span>
                    </>
                  ) : (
                    <p className="text-gray-500 font-medium">
                      ${item.price.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="flex mt-4 sm:mt-0 sm:ml-4 items-center sm:items-end justify-between sm:flex-col sm:justify-between">
            {/* Quantity Control */}
            <div className="flex items-center border rounded-md overflow-clip">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className={`p-2 ${
                  item.quantity <= 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "hover:bg-primary-50 cursor-pointer"
                }`}
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <MinusIcon className="h-4 w-4" />
              </motion.button>
              <span className="w-10 text-center font-medium text-sm">
                {item.quantity}
              </span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="p-2 hover:bg-primary-50 cursor-pointer"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <PlusIcon className="h-4 w-4" />
              </motion.button>
            </div>

            {/* Price and Remove Button */}
            <div className="flex items-center sm:mt-4">
              <span className="font-semibold text-right mr-4 sm:mr-0 sm:mb-0 ">
                $
                {((item.discountPrice || item.price) * item.quantity).toFixed(
                  2
                )}
              </span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="p-2 text-gray-500 hover:text-red-500 cursor-pointer transition-colors "
                onClick={() => removeItem(item.id)}
              >
                <Trash2Icon size={16} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
