import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Card } from "antd";
import { ShoppingBagIcon, CheckCircleIcon, ArrowRightIcon } from "lucide-react";
import { motion } from "framer-motion";

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState({
    orderNumber: "",
    total: "0.00",
  });

  useEffect(() => {
    // Get order details from URL query params
    const searchParams = new URLSearchParams(location.search);
    const orderNumber = searchParams.get("orderNumber") || "";
    const total = searchParams.get("total") || "0.00";

    setOrderDetails({ orderNumber, total });

    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="container mx-auto px-4 md:px-6 py-20 max-w-3xl">
      <Card>
        <div className="bg-primary/10 p-8 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="bg-primary/20 rounded-full p-3 mb-4"
          >
            <CheckCircleIcon className="h-12 w-12 text-primary" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl font-bold mb-2"
          >
            Order Confirmed!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-muted-foreground max-w-md"
          >
            Thank you for your purchase. We've received your order and will
            process it as soon as possible.
          </motion.p>
        </div>

        <div className="p-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between pb-2 border-b">
                  <span className="text-muted-foreground">Order Number</span>
                  <span className="font-medium">
                    {orderDetails.orderNumber}
                  </span>
                </div>

                <div className="flex justify-between pb-2 border-b">
                  <span className="text-muted-foreground">Order Date</span>
                  <span className="font-medium">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between pb-2 border-b">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium">Credit Card</span>
                </div>

                <div className="flex justify-between font-semibold text-lg pt-2">
                  <span>Total</span>
                  <span>${orderDetails.total}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">What's Next?</h2>
              <p className="text-muted-foreground">
                You will receive an email confirmation shortly at your
                registered email address. We'll notify you again when your order
                ships.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => navigate("/")}
                className="flex-1"
                icon={<ShoppingBagIcon className="mr-2 h-4 w-4" />}
              >
                Continue Shopping
              </Button>

              <Button
                onClick={() => navigate("/products")}
                className="flex-1"
                icon={<ArrowRightIcon className="ml-2 h-4 w-4" />}
              >
                View All Products
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CheckoutSuccess;
