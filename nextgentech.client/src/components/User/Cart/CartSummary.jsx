import React, { useState } from "react";
import { Button, Card, Input, Typography } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRightOutlined,
  TagOutlined,
  CreditCardOutlined,
  SafetyOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const CartSummary = ({
  cartItems,
  cartTotal,
  onCheckout,
  localQuantities = {},
}) => {
  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  // Demo shipping cost
  const shippingCost = cartTotal > 100 ? 0 : 9.99;

  // Calculate original total (without discounts)
  const originalTotal = cartItems.reduce((acc, item) => {
    if (!item?.productColor?.product) return acc;
    const price = item.productColor.product.price || 0;
    // Use localQuantity if available, otherwise use the item's quantity
    const itemQuantity =
      localQuantities[item.cartDetailId] !== undefined
        ? localQuantities[item.cartDetailId]
        : item.quantity || 0;
    return acc + price * itemQuantity;
  }, 0);

  // Calculate savings
  const totalSavings = originalTotal - cartTotal;

  // Apply promo code (demo functionality)
  const handleApplyPromo = (e) => {
    e.preventDefault();
    setIsApplyingPromo(true);

    // Simulate API call
    setTimeout(() => {
      setIsApplyingPromo(false);
      setPromoCode("");
      alert("For this demo, promo codes are not actually applied");
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        title="Order Summary"
        style={{
          position: "sticky",
          top: "5rem",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Order details */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text type="secondary">
                  Subtotal (
                  {cartItems && cartItems.length > 0
                    ? cartItems.reduce((acc, item) => {
                        // Use localQuantity if available, otherwise use the item's quantity
                        const itemQuantity =
                          localQuantities[item.cartDetailId] !== undefined
                            ? localQuantities[item.cartDetailId]
                            : item.quantity || 0;
                        return acc + itemQuantity;
                      }, 0)
                    : 0}{" "}
                  items)
                </Text>
                <Text>${cartTotal.toFixed(2)}</Text>
              </div>

              <AnimatePresence>
                {totalSavings > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Text type="success">Savings</Text>
                    <Text type="success">-${totalSavings.toFixed(2)}</Text>
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text type="secondary">Shipping</Text>
                <Text type={shippingCost === 0 ? "primary" : undefined}>
                  {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
                </Text>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text type="secondary">Tax</Text>
                <Text>${(cartTotal * 0.08).toFixed(2)}</Text>
              </div>
            </div>
          </motion.div>

          <div style={{ borderTop: "1px solid #f0f0f0", margin: "16px 0" }} />

          {/* Promo code */}
          <motion.form
            onSubmit={handleApplyPromo}
            style={{ display: "flex", gap: "8px" }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Input
              placeholder="Promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              style={{ flex: 1 }}
            />
            <Button
              type="default"
              htmlType="submit"
              icon={<TagOutlined />}
              disabled={!promoCode || isApplyingPromo}
            >
              Apply
            </Button>
          </motion.form>

          <div style={{ borderTop: "1px solid #f0f0f0", margin: "16px 0" }} />

          {/* Total */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 600,
            }}
          >
            <Text>Total</Text>
            <Text style={{ fontSize: "1.25rem" }}>
              ${(cartTotal + shippingCost + cartTotal * 0.08).toFixed(2)}
            </Text>
          </motion.div>

          {/* Checkout Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="primary"
              size="large"
              block
              onClick={onCheckout}
              icon={<ArrowRightOutlined />}
            >
              Checkout
            </Button>
          </motion.div>

          {/* Payment Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              fontSize: "0.75rem",
              color: "rgba(0,0,0,0.45)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <CreditCardOutlined style={{ marginRight: "8px" }} />
              <Text type="secondary">
                We accept all major credit cards, PayPal, and Apple Pay
              </Text>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <SafetyOutlined style={{ marginRight: "8px" }} />
              <Text type="secondary">
                Your payment information is processed securely
              </Text>
            </div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default CartSummary;
