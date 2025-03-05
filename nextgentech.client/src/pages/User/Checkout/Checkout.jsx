import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag } from "lucide-react";

import { CheckoutForm } from "../../../components/User/Checkout/CheckoutForm";
import { CheckoutSummary } from "../../../components/User/Checkout/CheckoutSummary";
import { Form } from "antd";

const initialCartItems = [
  {
    id: 1,
    name: "NextGen Pro Wireless Headphones",
    price: 249.99,
    discountPrice: 199.99,
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
    discountPrice: 599.99,
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
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1964&auto=format&fit=crop",
    categoryId: 1,
    categoryName: "Photography",
  },
];

const Checkout = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cartItems] = useState(initialCartItems);
  const navigate = useNavigate();

  const [form] = Form.useForm();

  // Calculate cart total
  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.discountPrice || item.price) * item.quantity,
    0
  );

  // Handle form submission
  const handleSubmitOrder = () => {
    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      // Generate a random order number for the demo
      const orderNumber = Math.floor(100000 + Math.random() * 900000);

      // Navigate to success page with order details
      navigate(
        `/checkout/success?orderNumber=${orderNumber}&total=${cartTotal.toFixed(
          2
        )}`
      );

      // Simple alert instead of toast
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 md:px-6 py-20"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold mb-1">Checkout</h1>
          <p className="text-gray-500">Complete your purchase</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/cart")}
          className="flex items-center border rounded-md px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          <CheckoutForm
            onSubmit={handleSubmitOrder}
            isProcessing={isProcessing}
            form={form}
          />
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <CheckoutSummary
            cartItems={cartItems}
            cartTotal={cartTotal}
            isProcessing={isProcessing}
            onSubmit={handleSubmitOrder}
            form={form}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;
