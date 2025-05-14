import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MinusIcon, PlusIcon, Trash2Icon, LoaderIcon } from "lucide-react";

const CartItem = ({
  item,
  updateQuantity,
  removeItem,
  isUpdating = false,
  localQuantity,
}) => {
  // Check if item and its properties exist
  if (!item || !item.productColor || !item.productColor.product) {
    return <div>Invalid cart item data</div>;
  }

  // Extract product data from the API response structure
  const product = item.productColor.product;
  const productId = product.productId;
  const name = product.name || "Unknown Product";
  const price = product.price || 0;
  const salePrice = product.salePrice || price;
  const discountPercentage = product.discountPercentage || 0;
  const imageUrl =
    product.imageUrl ||
    (product.productImages && product.productImages.length > 0
      ? product.productImages[0].imageUrl
      : "https://via.placeholder.com/150");
  const color = item.productColor.color || "Default";
  const colorCode = item.productColor.colorCode || "#000000";
  const cartDetailId = item.cartDetailId;
  const stockQuantity = item.productColor.stockQuantity || 0;

  // Use localQuantity if available, otherwise use the item's quantity
  const quantity =
    localQuantity !== undefined ? localQuantity : item.quantity || 1;

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
          <Link to={`/products/${productId}`}>
            <img
              src={imageUrl}
              alt={name}
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
                  to={`/products/${productId}`}
                  className="text-lg font-medium line-clamp-2 hover:text-blue-600 transition-colors"
                >
                  {name}
                </Link>
                <p className="text-sm text-gray-500 mt-1">
                  Color: <span style={{ color: colorCode }}>{color}</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Available:{" "}
                  <span
                    className={
                      quantity >= stockQuantity
                        ? "text-red-500 font-medium"
                        : ""
                    }
                  >
                    {stockQuantity}
                  </span>
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {discountPercentage > 0 ? (
                    <>
                      <span className="text-gray-400 line-through">
                        ${price.toFixed(2)}
                      </span>
                      <span className="text-blue-600 font-medium">
                        ${salePrice.toFixed(2)}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full">
                        {discountPercentage}% off
                      </span>
                    </>
                  ) : (
                    <p className="text-gray-500 font-medium">
                      ${price.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="flex mt-4 sm:mt-0 sm:ml-4 items-center sm:items-end justify-between sm:flex-col sm:justify-between">
            {/* Quantity Control */}
            <div className="flex items-center border rounded-md overflow-clip relative">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className={`p-2 ${
                  quantity <= 1 || isUpdating
                    ? "text-gray-300 cursor-not-allowed"
                    : "hover:bg-primary-50 cursor-pointer"
                }`}
                onClick={() =>
                  !isUpdating && updateQuantity(cartDetailId, quantity - 1)
                }
                disabled={quantity <= 1 || isUpdating}
              >
                <MinusIcon className="h-4 w-4" />
              </motion.button>
              <span className="w-10 text-center font-medium text-sm relative">
                {quantity}
                {isUpdating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
                    <LoaderIcon className="h-4 w-4 animate-spin text-blue-500" />
                  </div>
                )}
              </span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className={`p-2 ${
                  isUpdating || quantity >= stockQuantity
                    ? "text-gray-300 cursor-not-allowed"
                    : "hover:bg-primary-50 cursor-pointer"
                }`}
                onClick={() =>
                  !isUpdating &&
                  quantity < stockQuantity &&
                  updateQuantity(cartDetailId, quantity + 1)
                }
                disabled={isUpdating || quantity >= stockQuantity}
                title={
                  quantity >= stockQuantity
                    ? "Maximum stock reached"
                    : "Increase quantity"
                }
              >
                <PlusIcon className="h-4 w-4" />
              </motion.button>
            </div>

            {/* Price and Remove Button */}
            <div className="flex items-center sm:mt-4">
              <span className="font-semibold text-right mr-4 sm:mr-0 sm:mb-0 ">
                ${(salePrice * quantity).toFixed(2)}
              </span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className={`p-2 transition-colors ${
                  isUpdating
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:text-red-500 cursor-pointer"
                }`}
                onClick={() => !isUpdating && removeItem(cartDetailId)}
                disabled={isUpdating}
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
