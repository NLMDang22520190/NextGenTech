import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartDetailsByCustomerId } from "../../../features/Cart/Cart";

import { CheckoutForm } from "../../../components/User/Checkout/CheckoutForm";
import { CheckoutSummary } from "../../../components/User/Checkout/CheckoutSummary";
import { Form, Skeleton, Empty, Button } from "antd";

const Checkout = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // Get cart items from Redux store
  const cartState = useSelector((state) => state.cart);
  const cartItems = cartState?.items || [];
  const userId = useSelector((state) => state.auth?.user);

  // Fetch cart details when component mounts
  useEffect(() => {
    const fetchCartData = async () => {
      setIsLoading(true);
      try {
        await dispatch(fetchCartDetailsByCustomerId(userId)).unwrap();
      } catch (error) {
        console.error("Failed to load cart items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartData();
  }, [dispatch, userId]);

  // Calculate cart total
  const cartTotal = cartItems.reduce((total, item) => {
    if (!item?.productColor?.product) return total;
    const price =
      item.productColor.product.salePrice ||
      item.productColor.product.price ||
      0;
    return total + price * item.quantity;
  }, 0);

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

  // If loading, show skeleton
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-20">
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  // If cart is empty, show empty state
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-20 flex flex-col items-center justify-center">
        <Empty
          description="Your cart is empty"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <Button
          type="primary"
          onClick={() => navigate("/products")}
          className="mt-4"
          icon={<ShoppingBag className="h-4 w-4 mr-2" />}
        >
          Continue Shopping
        </Button>
      </div>
    );
  }

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
