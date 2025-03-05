import { useState, useEffect } from "react";
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

import CartItem from "../../../components/User/Cart/CartItem";
import CartSummary from "../../../components/User/Cart/CartSummary";
import EmptyCart from "../../../components/User/Cart/CartEmpty";

// Mock cart data - in a real app this would come from a context, Redux, or API
const initialCartItems = [
  {
    id: 1,
    name: "NextGen Pro Wireless Headphones",
    price: 249.99,
    discountPrice: 199.99, // Added discount price
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
    categoryId: 3,
    categoryName: "Audio",
  },
  {
    id: 2,
    name: "Ultra HD Smart TV - 55 inch",
    price: 699.99,
    discountPrice: 599.99, // Added discount price
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=2070&auto=format&fit=crop",
    categoryId: 2,
    categoryName: "Television",
  },
  {
    id: 3,
    name: "Professional DSLR Camera with Lens Kit",
    price: 1299.99,
    quantity: 1, // No discount for this item
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1964&auto=format&fit=crop",
    categoryId: 1,
    categoryName: "Photography",
  },
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  // Update quantity of an item
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );

    message.success("Cart updated: Product quantity has been updated");
  };

  // Remove an item from cart
  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));

    message.success("Cart updated: Product has been removed");
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);

    message.success("Cart cleared: All items have been removed");
  };

  // Calculate cart total
  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.discountPrice || item.price) * item.quantity,
    0
  );

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
        {cartItems.length === 0
          ? "Your cart is empty"
          : `You have ${cartItems.length} item${
              cartItems.length !== 1 ? "s" : ""
            } in your cart`}
      </motion.p>

      {cartItems.length === 0 ? (
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
                    key={item.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <CartItem
                      item={item}
                      updateQuantity={updateQuantity}
                      removeItem={removeItem}
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
                  setCartItems(initialCartItems);
                  toast({
                    title: "Cart refreshed",
                    description:
                      "Your cart has been reset to the initial state",
                    duration: 2000,
                  });
                }}
                className="border px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-secondary/70 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className="h-4 w-4" />
                Reset Demo
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
            />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CartPage;
