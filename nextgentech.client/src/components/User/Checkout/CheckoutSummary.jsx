import React from "react";
import { Card, Typography, Divider } from "antd";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, CreditCard } from "lucide-react";

const { Text, Title } = Typography;

export function CheckoutSummary({
  cartItems,
  cartTotal,
  isProcessing,
  onSubmit,
  form,
}) {
  const handlePlaceOrder = async () => {
    try {
      //await form.validateFields(); // Kiểm tra form trước khi submit
      onSubmit(); // Nếu hợp lệ thì gọi hàm submit
    } catch (error) {
      console.log("Form validation failed:", error);
    }
  };

  // Demo shipping cost
  const shippingCost = cartTotal > 100 ? 0 : 9.99;

  // Calculate original total (without discounts)
  const originalTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Calculate savings
  const totalSavings = originalTotal - cartTotal;

  // Calculate final total
  const finalTotal = cartTotal + shippingCost;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ position: "sticky", top: "5rem" }}
    >
      <Card
        title={<Title level={4}>Order Summary</Title>}
        style={{ width: "100%" }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Items overview */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {cartItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.875rem",
                }}
              >
                <Text type="secondary" ellipsis>
                  {item.name}{" "}
                  <Text type="secondary" style={{ fontSize: "0.75rem" }}>
                    x{item.quantity}
                  </Text>
                </Text>
                <Text>
                  $
                  {((item.discountPrice || item.price) * item.quantity).toFixed(
                    2
                  )}
                </Text>
              </div>
            ))}
          </div>

          <Divider />

          {/* Order details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.875rem",
              }}
            >
              <Text type="secondary">
                Subtotal (
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)
              </Text>
              <Text>${cartTotal.toFixed(2)}</Text>
            </div>

            {totalSavings > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.875rem",
                }}
              >
                <Text type="success">Savings</Text>
                <Text type="success">-${totalSavings.toFixed(2)}</Text>
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.875rem",
              }}
            >
              <Text type="secondary">Shipping</Text>
              <Text type={shippingCost === 0 ? "primary" : undefined}>
                {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
              </Text>
            </div>
          </div>

          <Divider />

          {/* Total */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontWeight: 600,
            }}
          >
            <Text>Total</Text>
            <Text style={{ fontSize: "1.25rem" }}>
              ${finalTotal.toFixed(2)}
            </Text>
          </div>

          {/* Submit Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              style={{
                width: "100%",
                padding: "12px 24px",
                backgroundColor: "#1890ff",
                color: "white",
                border: "none",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                opacity: isProcessing ? 0.5 : 1,
                pointerEvents: isProcessing ? "none" : "auto",
              }}
            >
              {isProcessing ? "Processing..." : "Place Order"}
              <ArrowRight size={16} />
            </button>
          </motion.div>

          {/* Payment Info */}
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              fontSize: "0.75rem",
              color: "rgba(0,0,0,0.45)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <CreditCard
                style={{ marginRight: "8px", width: "16px", height: "16px" }}
              />
              <Text type="secondary">
                We accept all major credit cards, PayPal, and Apple Pay
              </Text>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <ShieldCheck
                style={{ marginRight: "8px", width: "16px", height: "16px" }}
              />
              <Text type="secondary">
                Your payment information is processed securely
              </Text>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
