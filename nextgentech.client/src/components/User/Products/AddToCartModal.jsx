import { useState, useEffect, useTransition } from "react";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { Modal, message } from "antd";
import { motion } from "framer-motion";
import api from "../../../features/AxiosInstance/AxiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../../../features/Cart/Cart";

const AddToCartModal = ({
  isOpen,
  onClose,
  productId,
  productImage,
  productName,
}) => {
  const [productDetail, setProductDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [availableStock, setAvailableStock] = useState(0);
  const [isPending, startTransition] = useTransition();

  const dispatch = useDispatch();
  const cartId = useSelector((state) => state.cart.cartId);
  const cartItems = useSelector((state) => state.cart.items);
  //const cartId = 5;

  // Fetch product details when modal is opened
  useEffect(() => {
    if (isOpen && productId) {
      fetchProductDetail();
    }

    // Reset state when modal is closed
    if (!isOpen) {
      setSelectedColor(null);
      setQuantity(1);
    }
  }, [isOpen, productId]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/api/Product/CustomerGetProductById/${productId}`
      );
      const data = response.data;
      const mappedData = {
        id: data.productId,
        name: data.name,
        description: data.description,
        price: data.salePrice,
        oldPrice: data.price,
        stockQuantity: data.stockQuantity,
        categoryId: data.category.categoryId,
        categoryName: data.category.categoryName,
        brandId: data.brand.brandId,
        brandName: data.brand.brandName,
        image: productImage, // Use the image passed from parent
        productColors: data.productColors.map((color) => ({
          id: color.productColorId,
          name: color.color,
          code: color.colorCode,
          stock: color.stockQuantity,
        })),
      };

      // Calculate total stock from all colors
      const totalStock = mappedData.productColors.reduce(
        (sum, color) => sum + color.stock,
        0
      );
      mappedData.stockQuantity = totalStock;
      setProductDetail(mappedData);
      setAvailableStock(totalStock);
      setLoading(false);
    } catch (error) {
      console.error(error);
      message.error("Error fetching product: " + error.message);
      setLoading(false);
    }
  };

  // Handle color selection
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setAvailableStock(color.stock);
    // Reset quantity if it exceeds new stock
    if (quantity > color.stock) {
      setQuantity(1);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0 && newQuantity <= availableStock) {
      setQuantity(newQuantity);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!selectedColor) {
      message.warning("Please select a color");
      return;
    }

    if (!cartId) {
      message.error("Cart not found. Please try again later.");
      return;
    }

    // Check if this product color is already in the cart
    const existingCartItem = cartItems.find(
      (item) => item.productColorId === selectedColor.id
    );

    // Calculate total quantity (existing + new)
    const existingQuantity = existingCartItem ? existingCartItem.quantity : 0;
    const totalQuantity = existingQuantity + quantity;

    // Check if total quantity exceeds available stock
    if (totalQuantity > selectedColor.stock) {
      message.error(
        `Cannot add ${quantity} items to cart. You already have ${existingQuantity} in your cart and the total would exceed the available stock of ${selectedColor.stock}.`
      );
      return;
    }

    startTransition(async () => {
      try {
        const itemData = {
          cartId: cartId,
          productColorId: selectedColor.id,
          quantity: quantity,
        };

        await dispatch(addItemToCart(itemData)).unwrap();
        message.success(`${productName} added to cart successfully!`);
        onClose();
      } catch (error) {
        console.error("Failed to add item to cart:", error);
        message.error("Failed to add item to cart. Please try again.");
      }
    });
  };

  return (
    <Modal
      title="Add to Cart"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={500}
    >
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : productDetail ? (
        <div className="flex flex-col">
          {/* Product Basic Info */}
          <div className="flex gap-4 mb-4">
            <img
              src={productDetail.image}
              alt={productDetail.name}
              className="w-24 h-24 object-cover rounded-md"
            />
            <div className="flex flex-col">
              <h3 className="font-medium text-lg">{productDetail.name}</h3>
              <div className="text-sm text-gray-500">
                {productDetail.brandName}
              </div>
              <div className="flex items-baseline mt-1">
                <span className="text-lg font-medium">
                  ${productDetail.price.toFixed(2)}
                </span>
                {productDetail.oldPrice > productDetail.price && (
                  <span className="text-sm text-gray-500 line-through ml-2">
                    ${productDetail.oldPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-4">
            <span className="text-sm font-medium mb-2 block">
              Color: {selectedColor?.name || "Select a color"}
            </span>
            <div className="flex space-x-2">
              {productDetail.productColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleColorSelect(color)}
                  className={`w-10 h-10 rounded-full border-2 cursor-pointer ${
                    selectedColor?.id === color.id
                      ? "border-primary"
                      : "border-transparent"
                  } transform transition-transform ${
                    selectedColor?.id === color.id ? "scale-110" : "scale-100"
                  } hover:scale-110`}
                  style={{
                    backgroundColor: color.code,
                    boxShadow:
                      selectedColor?.id === color.id
                        ? "0 0 0 2px rgba(59, 130, 246, 0.3)"
                        : "none",
                  }}
                  aria-label={`Select ${color.name} color`}
                  disabled={color.stock <= 0}
                />
              ))}
            </div>
            {selectedColor && (
              <div className="text-sm text-gray-500 mt-1">
                {selectedColor.stock} available
              </div>
            )}
          </div>

          {/* Quantity Controls - Only show if color is selected */}
          {selectedColor && (
            <div className="flex items-center mb-4">
              <span className="text-sm font-medium mr-4">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="px-3 py-1 text-lg disabled:opacity-50 cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-1 font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= availableStock}
                  className="px-3 py-1 text-lg disabled:opacity-50 cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart Button - Only enable if color is selected */}
          {selectedColor && (
            <motion.button
              onClick={handleAddToCart}
              disabled={isPending}
              className={`w-full flex items-center justify-center gap-2 bg-gradient-to-br from-primary to-secondary cursor-pointer text-white py-2 rounded-lg hover:bg-gradient-to-br hover:from-primary-600 hover:to-secondary-600 transition-all ${
                isPending ? "opacity-70 cursor-not-allowed" : ""
              }`}
              whileHover={{ scale: isPending ? 1 : 1.02 }}
              whileTap={{ scale: isPending ? 1 : 0.98 }}
            >
              {isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Adding to Cart...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </>
              )}
            </motion.button>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          Failed to load product details. Please try again.
        </div>
      )}
    </Modal>
  );
};

export default AddToCartModal;
