import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, CheckCircle, Truck, Package, MapPin, CheckCircle2, FileCheck, FileText, Star } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../../features/AxiosInstance/AxiosInstance';
import { useSelector } from 'react-redux';
import RatingModal from '../../../components/User/Order/RatingModal';
import { pre } from 'motion/react-client';
import { set } from 'date-fns';

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

  // Hàm tạo các hoạt động đơn hàng dựa trên trạng thái
  const generateOrderActivities = (status, orderDate) => {
    const activities = [];
    const orderDateObj = new Date(orderDate);

    // Luôn có hoạt động đặt hàng
    activities.push({
      icon: FileText,
      color: 'text-blue-500',
      description: 'Đơn hàng của bạn đã được đặt thành công.',
      date: orderDateObj.toLocaleDateString('vi-VN', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      })
    });

    // Thêm các hoạt động dựa trên trạng thái
    switch(status.toUpperCase()) {
      case 'PENDING':
      case 'CHỜ XÁC NHẬN':
        // Chỉ có hoạt động đặt hàng
        break;

      case 'PROCESSING':
      case 'ĐANG XỬ LÝ':
        // Thêm hoạt động xác nhận đơn hàng
        activities.push({
          icon: FileCheck,
          color: 'text-green-500',
          description: 'Đơn hàng của bạn đã được xác nhận.',
          date: new Date(orderDateObj.getTime() + 2 * 60 * 60 * 1000).toLocaleDateString('vi-VN', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false
          })
        });
        break;

      case 'SHIPPING':
      case 'ĐANG GIAO':
        // Thêm hoạt động xác nhận và đóng gói
        activities.push({
          icon: FileCheck,
          color: 'text-green-500',
          description: 'Đơn hàng của bạn đã được xác nhận.',
          date: new Date(orderDateObj.getTime() + 2 * 60 * 60 * 1000).toLocaleDateString('vi-VN', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false
          })
        });

        activities.push({
          icon: Package,
          color: 'text-orange-500',
          description: 'Đơn hàng của bạn đã được đóng gói và giao cho đơn vị vận chuyển.',
          date: new Date(orderDateObj.getTime() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false
          })
        });
        break;

      case 'COMPLETED':
      case 'HOÀN TẤT':
        // Thêm tất cả các hoạt động
        activities.push({
          icon: FileCheck,
          color: 'text-green-500',
          description: 'Đơn hàng của bạn đã được xác nhận.',
          date: new Date(orderDateObj.getTime() + 2 * 60 * 60 * 1000).toLocaleDateString('vi-VN', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false
          })
        });

        activities.push({
          icon: Package,
          color: 'text-orange-500',
          description: 'Đơn hàng của bạn đã được đóng gói và giao cho đơn vị vận chuyển.',
          date: new Date(orderDateObj.getTime() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false
          })
        });

        activities.push({
          icon: Truck,
          color: 'text-blue-500',
          description: 'Đơn hàng của bạn đang được giao đến địa chỉ của bạn.',
          date: new Date(orderDateObj.getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false
          })
        });

        activities.push({
          icon: CheckCircle,
          color: 'text-green-500',
          description: 'Đơn hàng của bạn đã được giao thành công.',
          date: new Date(orderDateObj.getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false
          })
        });
        break;

      case 'CANCELED':
      case 'ĐÃ HUỶ':
        // Thêm hoạt động huỷ đơn hàng
        activities.push({
          icon: CheckCircle2,
          color: 'text-red-500',
          description: 'Đơn hàng của bạn đã bị huỷ.',
          date: new Date(orderDateObj.getTime() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false
          })
        });
        break;

      default:
        // Mặc định chỉ có hoạt động đặt hàng
        break;
    }

    return activities;
  };

  // Hàm xác định bước hiện tại của đơn hàng
  const getOrderStep = (status) => {
    switch(status.toUpperCase()) {
      case 'PENDING':
      case 'CHỜ XÁC NHẬN':
        return 1;
      case 'PROCESSING':
      case 'ĐANG XỬ LÝ':
        return 2;
      case 'SHIPPING':
      case 'ĐANG GIAO':
        return 3;
      case 'COMPLETED':
      case 'HOÀN TẤT':
        return 4;
      case 'CANCELED':
      case 'ĐÃ HUỶ':
        return 0;
      default:
        return 1;
    }
  };

  // Hàm tính ngày dự kiến giao hàng dựa trên ngày đặt hàng
  const calculateExpectedDelivery = (orderDate) => {
    const orderDateObj = new Date(orderDate);
    // Dự kiến giao hàng sau 7 ngày kể từ ngày đặt hàng
    const expectedDate = new Date(orderDateObj.getTime() + 7 * 24 * 60 * 60 * 1000);
    return expectedDate.toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
  };

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      // Lấy thông tin chi tiết đơn hàng
      console.log(`Đang gọi API: /api/OrderDetail/order/${orderId}`);
      const orderDetailsResponse = await axios.get(`/api/OrderDetail/order/${orderId}`);

      // Lấy thông tin đơn hàng
      console.log(`Đang gọi API: /api/Order/${orderId}`);
      const orderResponse = await axios.get(`/api/Order/${orderId}`);

      if (orderDetailsResponse.status === 200 && orderResponse.status === 200) {
        console.log("Chi tiết đơn hàng:", orderDetailsResponse.data);
        console.log("Thông tin đơn hàng:", orderResponse.data);

        const orderDetails = orderDetailsResponse.data;
        const orderInfo = orderResponse.data;

        setOrderDetails(orderDetails);

        // Tạo các hoạt động đơn hàng dựa trên trạng thái
        const activities = generateOrderActivities(orderInfo.status, orderInfo.orderDate);

        // Xác định bước hiện tại của đơn hàng
        const currentStep = getOrderStep(orderInfo.status);

        // Tính ngày dự kiến giao hàng
        const expectedDelivery = calculateExpectedDelivery(orderInfo.orderDate);

        setOrderData({
          id: orderId,
          productCount: orderDetails.length,
          orderDate: new Date(orderInfo.orderDate).toLocaleDateString('vi-VN', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false
          }),
          totalAmount: formatPrice(orderInfo.totalAmount || calculateTotal(orderDetails)),
          expectedDelivery: expectedDelivery,
          status: orderInfo.status,
          currentStep: currentStep,
          activities: activities,
          products: orderDetails.map(item => ({
            id: item.orderDetailId,
            productId: item.productColorId,
            category: 'SẢN PHẨM',
            name: `Sản phẩm #${item.productColorId}`,
            price: formatPrice(item.price),
            quantity: item.quantity,
            subtotal: formatPrice(item.price * item.quantity * (1 - (item.discountPercentage || 0) / 100))
          })),
          addresses: {
            billing: {
              name: orderInfo.fullName || 'Khách hàng',
              address: orderInfo.shippingAddress || 'Thông tin địa chỉ giao hàng'
            },
            shipping: {
              name: orderInfo.fullName || 'Khách hàng',
              address: orderInfo.shippingAddress || 'Thông tin địa chỉ giao hàng'
            }
          },
          notes: orderInfo.paymentMethod || 'Thanh toán khi nhận hàng'
        });
      }
      setLoading(false);
    } catch (err) {
      console.error("Không thể tải chi tiết đơn hàng:", err);
      setError("Không thể tải chi tiết đơn hàng. Vui lòng thử lại sau.");
      setLoading(false);
    }
  };

   // Mở modal đánh giá cho sản phẩm cụ thể
  const openRatingModal = (productId) => {
    if (!userID) {
      alert('Vui lòng đăng nhập để đánh giá sản phẩm!');
      return;
    }

    // Log the productId to verify it's being set correctly
    console.log("Opening rating modal for product ID:", productId);

    // Ensure productId is a number before setting it
    setSelectedProductId(Number(productId));
    setIsRatingModalOpen(true);
  };

  // Tính tổng tiền từ chi tiết đơn hàng
  const calculateTotal = (details) => {
    if (!details || details.length === 0) return 0;

    return details.reduce((total, item) => {
      const discountedPrice = item.price * (1 - item.discountPercentage / 100);
      return total + (discountedPrice * item.quantity);
    }, 0);
  };

  // Định dạng giá tiền theo VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
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
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-yellow-50 rounded-lg p-4 text-yellow-700">
          <p>Không tìm thấy thông tin đơn hàng!</p>
          <button
            className="mt-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
            onClick={() => navigate('/order-history')}
          >
            Trở về lịch sử đơn hàng
          </button>
        </div>
      </div>
    );
  }

  // Cập nhật trạng thái đánh giá của sản phẩm
  const handleRatingSubmit = async (productId, rating, comment) => {
    try {
      console.log("Submitting rating with data:", { userId: userID, productId, rating, comment });

      // Make sure all values are in the correct format
      const reviewData = {
        userId: parseInt(userID),
        productId: parseInt(productId),
        rating: parseInt(rating),
        comment: comment || ""
      };

      // Verify data before sending
      if (!reviewData.userId || !reviewData.productId || !reviewData.rating) {
        console.error("Missing required fields:", reviewData);
        alert("Missing required fields for review");
        return;
      }

      const response = await axios.post('/api/Review/add', reviewData);

      if (response.status === 200) {
        setOrderData(prevData => ({
          ...prevData,
          products: prevData.products.map(product =>
            product.id === productId ? { ...product, isRated: true } : product
          )
        }));

        setIsRatingModalOpen(false);
        alert("Cảm ơn bạn đã đánh giá sản phẩm!");
      }
    }
    catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);

      // Enhanced error logging for better debugging
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);

        // Show more specific error message if available
        if (error.response.data && error.response.data.errors) {
          const errorMessages = Object.entries(error.response.data.errors)
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join('; ');
          alert(`Lỗi xác thực dữ liệu: ${errorMessages}`);
          return;
        }
      }

      alert("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-primary-600 hover:text-primary-700 transition-colors text-xl font-bold mb-4 cursor-pointer"
        >
          <ArrowLeft size={20} className="mr-2 text-primary-700" /> CHI TIẾT ĐƠN HÀNG
        </button>
      </div>

      {isRatingModalOpen && (
        <RatingModal
          isOpen={isRatingModalOpen}
          onClose={() => setIsRatingModalOpen(false)}
          orderId={orderId}
          productId={selectedProductId}
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
            <p className="text-gray-600 text-sm">{orderData.productCount} Sản phẩm • Đơn hàng đặt vào {orderData.orderDate}</p>
          </div>
          <p className="text-blue-500 font-bold text-2xl">{orderData.totalAmount}</p>
        </div>
      </motion.div>

      <div className="mb-8">
        {orderData.status.toUpperCase() !== 'CANCELED' && orderData.status.toUpperCase() !== 'ĐÃ HUỶ' ? (
          <>
            <p className="text-gray-700 mb-4">Dự kiến giao hàng vào {orderData.expectedDelivery}</p>

            <div className="relative mb-8">
              <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 z-0"></div>

              <div className="absolute top-4 left-0 h-1 bg-primary-500 z-0" style={{ width: `${orderData.currentStep * 25}%` }}></div>

              <div className="flex justify-between relative z-10">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full ${orderData.currentStep >= 1 ? 'bg-primary-500' : 'bg-white'} border-4 ${orderData.currentStep >= 1 ? 'border-white' : 'border-gray-200'} flex items-center justify-center mb-2`}>
                    <FileText size={16} className={orderData.currentStep >= 1 ? 'text-white' : 'text-gray-400'} />
                  </div>
                  <p className="text-sm text-gray-700">Đặt hàng</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full ${orderData.currentStep >= 2 ? 'bg-primary-500' : 'bg-white'} border-4 ${orderData.currentStep >= 2 ? 'border-white' : 'border-gray-200'} flex items-center justify-center mb-2`}>
                    <Package size={16} className={orderData.currentStep >= 2 ? 'text-white' : 'text-gray-400'} />
                  </div>
                  <p className="text-sm text-gray-700">Đóng gói</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full ${orderData.currentStep >= 3 ? 'bg-primary-500' : 'bg-white'} border-4 ${orderData.currentStep >= 3 ? 'border-white' : 'border-gray-200'} flex items-center justify-center mb-2`}>
                    <Truck size={16} className={orderData.currentStep >= 3 ? 'text-white' : 'text-gray-400'} />
                  </div>
                  <p className="text-sm text-gray-700">Đang giao</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full ${orderData.currentStep >= 4 ? 'bg-primary-500' : 'bg-white'} border-4 ${orderData.currentStep >= 4 ? 'border-white' : 'border-gray-200'} flex items-center justify-center mb-2`}>
                    <CheckCircle size={16} className={orderData.currentStep >= 4 ? 'text-white' : 'text-gray-400'} />
                  </div>
                  <p className="text-sm text-gray-700">Đã giao</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-red-50 rounded-lg p-4 mb-8">
            <p className="text-red-700 font-medium">Đơn hàng này đã bị hủy.</p>
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Hoạt động đơn hàng</h2>

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
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.color} bg-opacity-10`}>
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
        <h2 className="text-lg font-semibold mb-4">Sản phẩm ({orderData.products.length})</h2>

        <div className="bg-gray-50 rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-100 py-3 px-4 border-b border-gray-200">
            <div className="col-span-5 font-medium text-gray-700">SẢN PHẨM</div>
            <div className="col-span-2 font-medium text-gray-700">GIÁ</div>
            <div className="col-span-1 font-medium text-gray-700">SỐ LƯỢNG</div>
            <div className="col-span-2 font-medium text-gray-700">TỔNG</div>
            <div className="col-span-2 font-medium text-gray-700">ĐÁNH GIÁ</div>
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
                    <p className="text-blue-500 text-xs font-medium">{product.category}</p>
                    <p className="text-gray-800 text-sm">{product.name}</p>
                  </div>
                </div>
              </div>
              <div className="col-span-2 self-center text-gray-700">{product.price}</div>
              <div className="col-span-1 self-center text-gray-700">{product.quantity}</div>
              <div className="col-span-2 self-center text-gray-700 font-medium">{product.subtotal}</div>
              <div className="col-span-2 self-center">
                {product.isRated ? (
                  <div className="flex items-center text-yellow-500">
                    <Star size={16} fill="currentColor" className="mr-1" />
                    <span className="text-gray-700">Đã đánh giá</span>
                  </div>
                ) : (
                  <button
                    onClick={() => openRatingModal(product.productId)}
                    className="flex items-center px-3 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm cursor-pointer"
                  >
                    <Star size={14} className="mr-1" /> Đánh giá
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-4">
        <div>
          <h3 className="text-gray-800 font-medium mb-3">Địa chỉ thanh toán</h3>
          <div className="bg-gray-50 p-4 rounded-lg h-full">
            <p className="font-medium mb-1">{orderData.addresses.billing.name}</p>
            <p className="text-gray-600 text-sm">{orderData.addresses.billing.address}</p>
          </div>
        </div>

        <div>
          <h3 className="text-gray-800 font-medium mb-3">Địa chỉ giao hàng</h3>
          <div className="bg-gray-50 p-4 rounded-lg h-full">
            <p className="font-medium mb-1">{orderData.addresses.shipping.name}</p>
            <p className="text-gray-600 text-sm">{orderData.addresses.shipping.address}</p>
          </div>
        </div>

        <div>
          <h3 className="text-gray-800 font-medium mb-3">Ghi chú đơn hàng</h3>
          <div className="bg-gray-50 p-4 rounded-lg h-full">
            <p className="text-gray-600 text-sm">{orderData.notes}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;