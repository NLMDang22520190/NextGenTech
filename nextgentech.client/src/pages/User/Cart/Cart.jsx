import { useState, useEffect, useCallback, useRef } from "react";
import { Button, message, Skeleton, Card } from "antd";
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  Minus,
  Plus,
  RefreshCw,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartDetailsByCustomerId,
  deleteItemFromCart,
  updateItemInCart,
} from "../../../features/Cart/Cart";

import CartItem from "../../../components/User/Cart/CartItem";
import CartSummary from "../../../components/User/Cart/CartSummary";
import EmptyCart from "../../../components/User/Cart/CartEmpty";

const CartPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get cart items and authentication state from Redux store
  const cartState = useSelector((state) => state.cart);
  const cartItems = cartState?.items || [];
  const userId = useSelector((state) => state.auth?.user);
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  // Check authentication and fetch cart details when component mounts
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated || !userId) {
      // Redirect to login if not authenticated
      navigate("/auth/login", { state: { from: "/cart" } });
      return;
    }

    const fetchCartData = async () => {
      setIsLoading(true);
      try {
        await dispatch(fetchCartDetailsByCustomerId(userId)).unwrap();
      } catch (error) {
        message.error(
          "Failed to load cart items: " + (error.message || "Unknown error")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartData();
  }, [dispatch, userId, isAuthenticated, navigate]);

  // State to track local quantities before API update
  const [localQuantities, setLocalQuantities] = useState({});

  // Create a debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Function to actually update the quantity in the API
  const performQuantityUpdate = async (cartDetailId, newQuantity) => {
    if (newQuantity < 1) return;

    // Find the cart item to check stock again (in case it changed)
    const cartItem = cartItems.find(
      (item) => item.cartDetailId === cartDetailId
    );

    // Double-check stock quantity before API call
    if (
      cartItem &&
      cartItem.productColor &&
      cartItem.productColor.stockQuantity
    ) {
      const stockQuantity = cartItem.productColor.stockQuantity;

      if (newQuantity > stockQuantity) {
        message.warning(
          `Cannot add more than ${stockQuantity} items due to stock limitations.`
        );
        // Set quantity to maximum available stock
        newQuantity = stockQuantity;

        // Update local state to match stock limit
        setLocalQuantities((prev) => ({
          ...prev,
          [cartDetailId]: stockQuantity,
        }));
      }
    }

    try {
      // Set updating state for this item
      setUpdatingItems((prev) => ({ ...prev, [cartDetailId]: true }));

      const updateData = {
        cartDetailId: cartDetailId,
        quantity: newQuantity,
      };

      await dispatch(updateItemInCart(updateData)).unwrap();
      message.success("Cart updated: Product quantity has been updated");
    } catch (error) {
      message.error(
        "Failed to update quantity: " + (error.message || "Unknown error")
      );

      // Revert to the original quantity in case of error
      const originalItem = cartItems.find(
        (item) => item.cartDetailId === cartDetailId
      );
      if (originalItem) {
        setLocalQuantities((prev) => ({
          ...prev,
          [cartDetailId]: originalItem.quantity,
        }));
      }
    } finally {
      // Clear updating state for this item
      setUpdatingItems((prev) => {
        const newState = { ...prev };
        delete newState[cartDetailId];
        return newState;
      });
    }
  };

  // Debounced version of the API update function (300ms delay)
  const debouncedApiUpdate = useCallback(
    debounce((cartDetailId, newQuantity) => {
      performQuantityUpdate(cartDetailId, newQuantity);
    }, 300),
    []
  );

  // Function to handle quantity changes
  const updateQuantity = (cartDetailId, newQuantity) => {
    if (newQuantity < 1) return;

    // Find the cart item
    const cartItem = cartItems.find(
      (item) => item.cartDetailId === cartDetailId
    );

    // Check if the new quantity exceeds the stock
    if (
      cartItem &&
      cartItem.productColor &&
      cartItem.productColor.stockQuantity
    ) {
      const stockQuantity = cartItem.productColor.stockQuantity;

      if (newQuantity > stockQuantity) {
        message.warning(
          `Cannot add more than ${stockQuantity} items due to stock limitations.`
        );
        // Set quantity to maximum available stock
        newQuantity = stockQuantity;
      }
    }

    // Update local state immediately for responsive UI
    setLocalQuantities((prev) => ({
      ...prev,
      [cartDetailId]: newQuantity,
    }));

    // Debounce the API call
    debouncedApiUpdate(cartDetailId, newQuantity);
  };

  // Remove an item from cart
  const removeItem = async (cartDetailId) => {
    try {
      await dispatch(deleteItemFromCart(cartDetailId)).unwrap();
      message.success("Cart updated: Product has been removed");
    } catch (error) {
      message.error(
        "Failed to remove item: " + (error.message || "Unknown error")
      );
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      // We'll need to remove each item individually since there's no clear cart API
      for (const item of cartItems) {
        await dispatch(deleteItemFromCart(item.cartDetailId)).unwrap();
      }
      message.success("Cart cleared: All items have been removed");
    } catch (error) {
      message.error(
        "Failed to clear cart: " + (error.message || "Unknown error")
      );
    }
  };

  // Calculate cart total using localQuantities when available
  const cartTotal = cartItems.reduce((total, item) => {
    if (!item?.productColor?.product) return total;
    const price =
      item.productColor.product.salePrice ||
      item.productColor.product.price ||
      0;
    // Use localQuantity if available, otherwise use the item's quantity
    const itemQuantity =
      localQuantities[item.cartDetailId] !== undefined
        ? localQuantities[item.cartDetailId]
        : item.quantity || 0;
    return total + price * itemQuantity;
  }, 0);

  // Proceed to checkout
  const handleCheckout = () => {
    navigate("/checkout");
    // In a real app, you would redirect to a checkout page
    // For now, we'll just show a toast
  };

  // Continue shopping button handler
  const handleContinueShopping = () => {
    navigate("/products");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (isLoading) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Skeleton active style={{ width: 300, height: 300 }} />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="container mx-auto px-4 md:px-6 pt-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.h1
        className="text-3xl font-bold mb-1"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        Your Shopping Cart
      </motion.h1>

      <motion.p
        className="text-muted-foreground mb-8"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        {!cartItems || cartItems.length === 0
          ? "Your cart is empty"
          : `You have ${cartItems.length} item${
              cartItems.length !== 1 ? "s" : ""
            } in your cart`}
      </motion.p>

      {!cartItems || cartItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <EmptyCart onContinueShopping={handleContinueShopping} />
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Cart Items List */}
          <motion.div
            className="lg:col-span-2 space-y-4"
            variants={itemVariants}
          >
            <Card
              className="bg-white rounded-lg shadow-xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="flex justify-between items-center mb-4"
                variants={itemVariants}
              >
                <h2 className="text-xl font-semibold">Cart Items</h2>
                <motion.button
                  onClick={clearCart}
                  className="text-muted-foreground flex items-center gap-2 border rounded-lg px-3 py-2 hover:bg-gray-200 cursor-pointer transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Cart
                </motion.button>
              </motion.div>

              <motion.div className="space-y-4">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.cartDetailId}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <CartItem
                      item={item}
                      updateQuantity={updateQuantity}
                      removeItem={removeItem}
                      isUpdating={updatingItems[item.cartDetailId] || false}
                      localQuantity={localQuantities[item.cartDetailId]}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </Card>

            <motion.div className="flex justify-between mt-4">
              <motion.button
                onClick={handleContinueShopping}
                className="border px-3 py-2 rounded-lg flex items-center bg-gradient-to-br from-primary-300 text-white to-secondary-300 gap-2 hover:bg-gray-200 cursor-pointer transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingBag className="h-4 w-4" />
                Continue Shopping
              </motion.button>

              <motion.button
                onClick={() => {
                  // Refresh cart data from the server
                  dispatch(fetchCartDetailsByCustomerId(userId));
                  message.success("Cart refreshed from server");
                }}
                className="border px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-secondary/70 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Cart
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <CartSummary
              cartItems={cartItems}
              cartTotal={cartTotal}
              onCheckout={handleCheckout}
              localQuantities={localQuantities}
            />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CartPage;
