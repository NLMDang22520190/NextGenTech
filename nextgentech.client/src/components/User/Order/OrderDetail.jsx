import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { message } from "antd";
import {
  ArrowLeft,
  Plus,
  CheckCircle,
  Truck,
  Package,
  MapPin,
  CheckCircle2,
  FileCheck,
  FileText,
  Star,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../features/AxiosInstance/AxiosInstance";
import { useSelector } from "react-redux";
import RatingModal from "../../../components/User/Order/RatingModal";

const OrderDetail = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user ID from Redux store
  const userID = useSelector((state) => state.auth.user);

  useEffect(() => {
    // Fetch order details when component mounts
    fetchOrderDetails();
  }, [orderId]);

  // Function to generate order activities based on status
  const generateOrderActivities = (status, orderDate) => {
    const activities = [];
    const orderDateObj = new Date(orderDate);

    // Always have order placement activity
    activities.push({
      icon: FileText,
      color: "text-blue-500",
      description: "Your order has been placed successfully.",
      date: orderDateObj.toLocaleDateString("en-US", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      }),
    });

    // Add activities based on status
    switch (status.toUpperCase()) {
      case "PENDING":
        // Only order placement activity
        break;

      case "PROCESSING":
        // Add order confirmation activity
        activities.push({
          icon: FileCheck,
          color: "text-green-500",
          description: "Your order has been confirmed.",
          date: new Date(
            orderDateObj.getTime() + 2 * 60 * 60 * 1000
          ).toLocaleDateString("en-US", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: false,
          }),
        });
        break;

      case "SHIPPING":
        // Add confirmation and packaging activities
        activities.push({
          icon: FileCheck,
          color: "text-green-500",
          description: "Your order has been confirmed.",
          date: new Date(
            orderDateObj.getTime() + 2 * 60 * 60 * 1000
          ).toLocaleDateString("en-US", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: false,
          }),
        });

        activities.push({
          icon: Package,
          color: "text-orange-500",
          description:
            "Your order has been packaged and handed over to the shipping carrier.",
          date: new Date(
            orderDateObj.getTime() + 1 * 24 * 60 * 60 * 1000
          ).toLocaleDateString("en-US", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: false,
          }),
        });
        break;

      case "COMPLETED":
        // Add all activities
        activities.push({
          icon: FileCheck,
          color: "text-green-500",
          description: "Your order has been confirmed.",
          date: new Date(
            orderDateObj.getTime() + 2 * 60 * 60 * 1000
          ).toLocaleDateString("en-US", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: false,
          }),
        });

        activities.push({
          icon: Package,
          color: "text-orange-500",
          description:
            "Your order has been packaged and handed over to the shipping carrier.",
          date: new Date(
            orderDateObj.getTime() + 1 * 24 * 60 * 60 * 1000
          ).toLocaleDateString("en-US", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: false,
          }),
        });

        activities.push({
          icon: Truck,
          color: "text-blue-500",
          description: "Your order is being delivered to your address.",
          date: new Date(
            orderDateObj.getTime() + 3 * 24 * 60 * 60 * 1000
          ).toLocaleDateString("en-US", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: false,
          }),
        });

        activities.push({
          icon: CheckCircle,
          color: "text-green-500",
          description: "Your order has been delivered successfully.",
          date: new Date(
            orderDateObj.getTime() + 5 * 24 * 60 * 60 * 1000
          ).toLocaleDateString("en-US", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: false,
          }),
        });
        break;

      case "CANCELED":
        // Add order cancellation activity
        activities.push({
          icon: CheckCircle2,
          color: "text-red-500",
          description: "Your order has been canceled.",
          date: new Date(
            orderDateObj.getTime() + 1 * 24 * 60 * 60 * 1000
          ).toLocaleDateString("en-US", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: false,
          }),
        });
        break;

      default:
        // Default only order placement activity
        break;
    }

    return activities;
  };

  // Function to determine current order step
  const getOrderStep = (status) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return 1;
      case "PROCESSING":
        return 2;
      case "SHIPPING":
        return 3;
      case "COMPLETED":
        return 4;
      case "CANCELED":
        return 0;
      default:
        return 1;
    }
  };

  // Function to calculate expected delivery date based on order date
  const calculateExpectedDelivery = (orderDate) => {
    const orderDateObj = new Date(orderDate);
    // Expected delivery after 7 days from order date
    const expectedDate = new Date(
      orderDateObj.getTime() + 7 * 24 * 60 * 60 * 1000
    );
    return expectedDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  // Helper function to get product information by ProductColorId
  const getProductInfoByColorId = async (productColorId) => {
    try {
      // Get all products to find the one that contains this color
      const allProductsResponse = await axios.get(
        "/api/Product/CustomerGetAllProduct"
      );

      if (allProductsResponse.status === 200) {
        const products = allProductsResponse.data;

        for (const product of products) {
          // Get detailed product info to check colors
          try {
            const productDetailResponse = await axios.get(
              `/api/Product/CustomerGetProductById/${product.productId}`
            );
            if (productDetailResponse.status === 200) {
              const productDetail = productDetailResponse.data;
              const matchingColor = productDetail.productColors.find(
                (color) => color.productColorId === productColorId
              );

              if (matchingColor) {
                return {
                  name: productDetail.name,
                  color: matchingColor.color,
                  productId: productDetail.productId,
                };
              }
            }
          } catch (error) {
            console.warn(
              `Error fetching product detail for product ${product.productId}:`,
              error
            );
          }
        }
      }

      // Fallback if product not found
      return {
        name: `Product #${productColorId}`,
        color: "Unknown",
        productId: null,
      };
    } catch (error) {
      console.warn(
        `Error fetching product info for color ${productColorId}:`,
        error
      );
      return {
        name: `Product #${productColorId}`,
        color: "Unknown",
        productId: null,
      };
    }
  };

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      // Get order details
      const orderDetailsResponse = await axios.get(
        `/api/OrderDetail/order/${orderId}`
      );

      // Get order information
      const orderResponse = await axios.get(`/api/Order/${orderId}`);

      if (orderDetailsResponse.status === 200 && orderResponse.status === 200) {
        const orderDetails = orderDetailsResponse.data;
        const orderInfo = orderResponse.data;

        setOrderDetails(orderDetails);

        // Generate order activities based on status
        const activities = generateOrderActivities(
          orderInfo.status,
          orderInfo.orderDate
        );

        // Determine current order step
        const currentStep = getOrderStep(orderInfo.status);

        // Calculate expected delivery date
        const expectedDelivery = calculateExpectedDelivery(orderInfo.orderDate);

        // Fetch product information for each order detail
        const productsWithInfo = await Promise.all(
          orderDetails.map(async (item) => {
            const productInfo = await getProductInfoByColorId(
              item.productColorId
            );
            return {
              id: item.orderDetailId,
              productColorId: item.productColorId, // Keep the original productColorId
              productId: productInfo.productId, // Use the actual productId from productInfo
              category: "PRODUCT",
              name: productInfo.name,
              color: productInfo.color,
              price: formatPrice(item.price),
              quantity: item.quantity,
              subtotal: formatPrice(
                item.price *
                  item.quantity *
                  (1 - (item.discountPercentage || 0) / 100)
              ),
            };
          })
        );

        setOrderData({
          id: orderId,
          productCount: orderDetails.length,
          orderDate: new Date(orderInfo.orderDate).toLocaleDateString("en-US", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: false,
          }),
          totalAmount: formatPrice(
            orderInfo.totalAmount || calculateTotal(orderDetails)
          ),
          expectedDelivery: expectedDelivery,
          status: orderInfo.status,
          currentStep: currentStep,
          activities: activities,
          products: productsWithInfo,
          addresses: {
            billing: {
              name: orderInfo.fullName || "Customer",
              address:
                orderInfo.shippingAddress || "Shipping address information",
            },
            shipping: {
              name: orderInfo.fullName || "Customer",
              address:
                orderInfo.shippingAddress || "Shipping address information",
            },
          },
          notes: orderInfo.paymentMethod || "Cash on delivery",
        });
      }
      setLoading(false);
    } catch (err) {
      console.error("Unable to load order details:", err);
      setError("Unable to load order details. Please try again later.");
      setLoading(false);
    }
  };

  // Open rating modal for specific product
  const openRatingModal = (productId) => {
    if (!userID) {
      message.warning("Please login to rate the product!");
      return;
    }

    // Check if order is completed before allowing rating
    if (orderData?.status?.toUpperCase() !== "COMPLETED") {
      message.warning("You can only rate products from completed orders.");
      return;
    }

    // Validate productId
    if (!productId || productId === null || productId === undefined) {
      message.error(
        "Product information is not available. Please try again later."
      );
      return;
    }

    // Ensure productId is a number before setting it
    setSelectedProductId(Number(productId));
    setIsRatingModalOpen(true);
  };

  // Calculate total from order details
  const calculateTotal = (details) => {
    if (!details || details.length === 0) return 0;

    return details.reduce((total, item) => {
      const discountedPrice = item.price * (1 - item.discountPercentage / 100);
      return total + discountedPrice * item.quantity;
    }, 0);
  };

  // Format price in VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-red-50 rounded-lg p-4 text-red-700">
          <p>{error}</p>
          <button
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={fetchOrderDetails}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-yellow-50 rounded-lg p-4 text-yellow-700">
          <p>Order information not found!</p>
          <button
            className="mt-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
            onClick={() => navigate("/order-history")}
          >
            Back to Order History
          </button>
        </div>
      </div>
    );
  }

  // Update product rating status
  const handleRatingSubmit = async (productId, rating, comment) => {
    try {
      // Make sure all values are in the correct format
      const reviewData = {
        userId: parseInt(userID),
        productId: parseInt(productId),
        rating: parseInt(rating),
        comment: comment || "",
      };

      // Verify data before sending
      if (!reviewData.userId || !reviewData.productId || !reviewData.rating) {
        message.error("Missing required fields for review");
        return;
      }

      const response = await axios.post("/api/Review/add", reviewData);

      if (response.status === 200) {
        setOrderData((prevData) => ({
          ...prevData,
          products: prevData.products.map((product) =>
            product.id === productId ? { ...product, isRated: true } : product
          ),
        }));

        setIsRatingModalOpen(false);
        message.success("Thank you for rating the product!");
      }
    } catch (error) {
      console.error("Error submitting review:", error);

      // Enhanced error handling with Ant Design messages
      if (error.response) {
        // Show more specific error message if available
        if (error.response.data && error.response.data.message) {
          message.error(error.response.data.message);
          return;
        }

        if (error.response.data && error.response.data.errors) {
          const errorMessages = Object.entries(error.response.data.errors)
            .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
            .join("; ");
          message.error(`Data validation error: ${errorMessages}`);
          return;
        }
      }

      message.error(
        "An error occurred while submitting the review. Please try again later."
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-primary-600 hover:text-primary-700 transition-colors text-xl font-bold mb-4 cursor-pointer"
        >
          <ArrowLeft size={20} className="mr-2 text-primary-700" /> ORDER
          DETAILS
        </button>
      </div>

      {isRatingModalOpen && (
        <RatingModal
          isOpen={isRatingModalOpen}
          onClose={() => setIsRatingModalOpen(false)}
          orderId={orderId}
          productId={selectedProductId}
          orderStatus={orderData?.status}
          onSubmit={handleRatingSubmit}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-800 font-semibold">#{orderData.id}</p>
            <p className="text-gray-600 text-sm">
              {orderData.productCount} Products • Order placed on{" "}
              {orderData.orderDate}
            </p>
          </div>
          <p className="text-blue-500 font-bold text-2xl">
            {orderData.totalAmount}
          </p>
        </div>
      </motion.div>

      <div className="mb-8">
        {orderData.status.toUpperCase() !== "CANCELED" ? (
          <>
            <p className="text-gray-700 mb-4">
              Expected delivery on {orderData.expectedDelivery}
            </p>

            <div className="relative mb-8">
              <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 z-0"></div>

              <div
                className="absolute top-4 left-0 h-1 bg-primary-500 z-0"
                style={{ width: `${orderData.currentStep * 25}%` }}
              ></div>

              <div className="flex justify-between relative z-10">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full ${
                      orderData.currentStep >= 1 ? "bg-primary-500" : "bg-white"
                    } border-4 ${
                      orderData.currentStep >= 1
                        ? "border-white"
                        : "border-gray-200"
                    } flex items-center justify-center mb-2`}
                  >
                    <FileText
                      size={16}
                      className={
                        orderData.currentStep >= 1
                          ? "text-white"
                          : "text-gray-400"
                      }
                    />
                  </div>
                  <p className="text-sm text-gray-700">Order Placed</p>
                </div>

                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full ${
                      orderData.currentStep >= 2 ? "bg-primary-500" : "bg-white"
                    } border-4 ${
                      orderData.currentStep >= 2
                        ? "border-white"
                        : "border-gray-200"
                    } flex items-center justify-center mb-2`}
                  >
                    <Package
                      size={16}
                      className={
                        orderData.currentStep >= 2
                          ? "text-white"
                          : "text-gray-400"
                      }
                    />
                  </div>
                  <p className="text-sm text-gray-700">Packaging</p>
                </div>

                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full ${
                      orderData.currentStep >= 3 ? "bg-primary-500" : "bg-white"
                    } border-4 ${
                      orderData.currentStep >= 3
                        ? "border-white"
                        : "border-gray-200"
                    } flex items-center justify-center mb-2`}
                  >
                    <Truck
                      size={16}
                      className={
                        orderData.currentStep >= 3
                          ? "text-white"
                          : "text-gray-400"
                      }
                    />
                  </div>
                  <p className="text-sm text-gray-700">Shipping</p>
                </div>

                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full ${
                      orderData.currentStep >= 4 ? "bg-primary-500" : "bg-white"
                    } border-4 ${
                      orderData.currentStep >= 4
                        ? "border-white"
                        : "border-gray-200"
                    } flex items-center justify-center mb-2`}
                  >
                    <CheckCircle
                      size={16}
                      className={
                        orderData.currentStep >= 4
                          ? "text-white"
                          : "text-gray-400"
                      }
                    />
                  </div>
                  <p className="text-sm text-gray-700">Delivered</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-red-50 rounded-lg p-4 mb-8">
            <p className="text-red-700 font-medium">
              This order has been canceled.
            </p>
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Order Activity</h2>

        <div className="space-y-6">
          {orderData.activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex"
            >
              <div className="mr-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.color} bg-opacity-10`}
                >
                  <activity.icon size={18} className={activity.color} />
                </div>
              </div>
              <div>
                <p className="text-gray-800">{activity.description}</p>
                <p className="text-gray-500 text-sm">{activity.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">
          Products ({orderData.products.length})
        </h2>

        <div className="bg-gray-50 rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-100 py-3 px-4 border-b border-gray-200">
            <div className="col-span-5 font-medium text-gray-700">PRODUCT</div>
            <div className="col-span-2 font-medium text-gray-700">PRICE</div>
            <div className="col-span-1 font-medium text-gray-700">QUANTITY</div>
            <div className="col-span-2 font-medium text-gray-700">TOTAL</div>
            <div className="col-span-2 font-medium text-gray-700">RATING</div>
          </div>

          {orderData.products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="grid grid-cols-12 py-4 px-4 border-b border-gray-100"
            >
              <div className="col-span-5">
                <div className="flex">
                  <div className="w-12 h-12 bg-gray-200 rounded-md mr-3 flex-shrink-0"></div>
                  <div>
                    <p className="text-blue-500 text-xs font-medium">
                      {product.category}
                    </p>
                    <p className="text-gray-800 text-sm">{product.name}</p>
                    {product.color && product.color !== "Unknown" && (
                      <p className="text-gray-500 text-xs">
                        Color: {product.color}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-span-2 self-center text-gray-700">
                {product.price}
              </div>
              <div className="col-span-1 self-center text-gray-700">
                {product.quantity}
              </div>
              <div className="col-span-2 self-center text-gray-700 font-medium">
                {product.subtotal}
              </div>
              <div className="col-span-2 self-center">
                {product.isRated ? (
                  <div className="flex items-center text-yellow-500">
                    <Star size={16} fill="currentColor" className="mr-1" />
                    <span className="text-gray-700">Rated</span>
                  </div>
                ) : orderData?.status?.toUpperCase() === "COMPLETED" ? (
                  <button
                    onClick={() => openRatingModal(product.productId)}
                    className="flex items-center px-3 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm cursor-pointer"
                  >
                    <Star size={14} className="mr-1" /> Rate
                  </button>
                ) : (
                  <div className="flex items-center text-gray-500">
                    <Star size={14} className="mr-1" />
                    <span className="text-sm">
                      {orderData?.status?.toUpperCase() === "CANCELLED"
                        ? "Order Cancelled"
                        : "Complete order to rate"}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-4">
        <div>
          <h3 className="text-gray-800 font-medium mb-3">Billing Address</h3>
          <div className="bg-gray-50 p-4 rounded-lg h-full">
            <p className="font-medium mb-1">
              {orderData.addresses.billing.name}
            </p>
            <p className="text-gray-600 text-sm">
              {orderData.addresses.billing.address}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-gray-800 font-medium mb-3">Shipping Address</h3>
          <div className="bg-gray-50 p-4 rounded-lg h-full">
            <p className="font-medium mb-1">
              {orderData.addresses.shipping.name}
            </p>
            <p className="text-gray-600 text-sm">
              {orderData.addresses.shipping.address}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-gray-800 font-medium mb-3">Order Notes</h3>
          <div className="bg-gray-50 p-4 rounded-lg h-full">
            <p className="text-gray-600 text-sm">{orderData.notes}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
