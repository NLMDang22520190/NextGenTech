import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Filter, ChevronDown, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Tag, X } from "lucide-react";
import { format, parse, isValid } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover";
import { Calendar } from "../../../components/ui/calendar";
import { Modal, Table } from "antd";
import { Select as AntdSelect } from "antd";
import axios from "../../../features/AxiosInstance/AxiosInstance";

const OrderList = () => {
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedStatus, setSelectedStatus] = useState(undefined);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders data from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/Order/get-all');
        setOrders(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Get unique order statuses from the data
  const orderStatuses = useMemo(() => {
    return [...new Set(orders.map(order => order.status))];
  }, [orders]);

  // Function to reset all filters
  const resetFilters = () => {
    setSelectedDate(undefined);
    setSelectedStatus(undefined);
  };

  // Helper function to format date from API to display format
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd MMM yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Format the selected date as string
  const formatSelectedDate = () => {
    return selectedDate ? format(selectedDate, "dd MMM yyyy") : "Date";
  };

  // Get status color based on status value
  const getStatusColor = (status) => {
    switch (status) {
      case "Hoàn tất":
        return "bg-emerald-100 text-emerald-600";
      case "Đang xử lý":
        return "bg-purple-100 text-purple-600";
      case "Hủy":
        return "bg-red-100 text-red-600";
      case "Chờ xác nhận":
        return "bg-amber-100 text-amber-600";
      case "Đang giao":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Filter orders based on selected filters
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Filter by date if selected
      if (selectedDate) {
        const orderDate = new Date(order.orderDate);
        if (!isValid(orderDate) || 
            orderDate.getDate() !== selectedDate.getDate() || 
            orderDate.getMonth() !== selectedDate.getMonth() || 
            orderDate.getFullYear() !== selectedDate.getFullYear()) {
          return false;
        }
      }

      // Filter by status if selected
      if (selectedStatus && order.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [orders, selectedDate, selectedStatus]);

  // Update order status
  // Replace the existing updateOrderStatus function with this correctly fixed version
const updateOrderStatus = async (orderId, newStatus) => {
  try {
    // The API expects the new status as a direct string value, not as a JSON object
    // Note: We're sending the status as a raw string with quotes around it
    await axios.put(`http://localhost:5240/api/Order/update-order-state/${orderId}`, 
      JSON.stringify(newStatus),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Update local state
    setOrders(orders.map(order => 
      order.orderId === orderId ? {...order, status: newStatus} : order
    ));
    
    // Update selected order if it's the one being modified
    if (selectedOrder && selectedOrder.orderId === orderId) {
      setSelectedOrder({...selectedOrder, status: newStatus});
    }
    
  } catch (error) {
    console.error("Error updating order status:", error);
    // Add better error handling
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Server responded with error:", error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received from server");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up request:", error.message);
    }
  }
};

  // Animation variants
  const tableRowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    }),
  };

  return (
    <div className="w-full max-w-7xl mx-auto font-sans">
      <motion.h1 
        className="text-2xl font-medium text-gray-800 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }}
      >
        Danh sách đơn hàng
      </motion.h1>

      {/* Filter Section */}
      <motion.div 
        className="flex flex-wrap gap-2 mb-6 border border-gray-200 rounded-lg overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.1, 0.25, 1.0] }}
      >
        <div className="flex items-center p-4 border-r border-gray-200">
          <Filter size={18} className="text-gray-600" />
        </div>
        
        {/* Date Filter */}
        <div className="flex items-center border-r border-gray-200">
          <Popover>
            <PopoverTrigger asChild>
              <button className="px-4 py-3 flex items-center justify-between min-w-[160px] text-left">
                <span className="flex items-center text-sm font-medium text-gray-700">
                  <CalendarIcon size={16} className="mr-2 text-gray-500" />
                  {formatSelectedDate()}
                </span>
                <ChevronDown size={16} className="ml-2 text-gray-500" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-50 bg-white shadow-lg rounded-md border border-gray-200" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Order Status Filter */}
        <div className="flex items-center border-r border-gray-200">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="border-0 focus:ring-0 focus:ring-offset-0 px-4 py-3 h-auto min-w-[160px]">
              <span className="flex items-center text-sm font-medium text-gray-700">
                <Tag size={16} className="mr-2 text-gray-500" />
                <SelectValue placeholder="Trạng thái đơn hàng" />
              </span>
            </SelectTrigger>
            <SelectContent className="z-50 bg-white">
              {orderStatuses.map(status => (
                <SelectItem key={status} value={status} className="cursor-pointer">
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Reset Filters */}
        <div className="flex items-center ml-auto">
          <button 
            onClick={resetFilters}
            className="px-4 py-3 flex items-center text-red-500 hover:text-red-600 transition-colors duration-200 cursor-pointer" 
          >
            <X size={16} className="mr-2" />
            <span className="text-sm font-medium">Xóa bộ lọc</span>
          </button>
        </div>
      </motion.div>

      {/* Error State */}
      {error && (
        <div className="border border-red-200 bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64 border border-gray-200 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
        </div>
      ) : (
        <>
          {/* Table */}
          <motion.div 
            className="border border-gray-200 rounded-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: [0.25, 0.1, 0.25, 1.0] }}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Ngày đặt
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Địa chỉ
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Tổng tiền
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Phương thức
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                        Không tìm thấy đơn hàng nào
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order, index) => (
                      <motion.tr 
                        key={order.orderId}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        custom={index}
                        whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.6)" }}
                        className="transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                          #{order.orderId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(order.orderDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {order.shippingAddress}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {order.totalAmount.toLocaleString('vi-VN')} ₫
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {order.paymentMethod}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                          >
                            Chi tiết
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Pagination */}
          <motion.div 
            className="flex items-center justify-between mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <div className="text-sm text-gray-500">
              Hiển thị {filteredOrders.length > 0 ? 1 : 0}-{filteredOrders.length} của {filteredOrders.length}
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200">
                <ChevronLeft size={16} className="text-gray-600" />
              </button>
              <button className="p-2 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200">
                <ChevronRight size={16} className="text-gray-600" />
              </button>
            </div>
          </motion.div>
        </>
      )}

      {/* Order Detail Modal */}
      <Modal
        title="Chi tiết đơn hàng"
        footer={null}
        open={!!selectedOrder}
        onOk={() => setSelectedOrder(null)}
        onCancel={() => setSelectedOrder(null)}
      >
        {selectedOrder && (
          <div className="flex flex-col gap-y-2">
            <div className="mb-2">
              <strong>Mã đơn hàng:</strong> #{selectedOrder.orderId}
            </div>
            <div className="mb-2">
              <strong>Ngày đặt:</strong> {formatDate(selectedOrder.orderDate)}
            </div>
            <div className="mb-2">
              <strong>Địa chỉ giao hàng:</strong> {selectedOrder.shippingAddress}
            </div>
            <div className="flex items-center gap-x-2 mb-2">
              <strong>Trạng thái:</strong>
              <AntdSelect
                defaultValue={selectedOrder.status}
                style={{ width: 150 }}
                onChange={(value) => updateOrderStatus(selectedOrder.orderId, value)}
              >
                <AntdSelect.Option value="Chờ xác nhận">Chờ xác nhận</AntdSelect.Option>
                <AntdSelect.Option value="Đang xử lý">Đang xử lý</AntdSelect.Option>
                <AntdSelect.Option value="Đang giao">Đang giao</AntdSelect.Option>
                <AntdSelect.Option value="Hoàn tất">Hoàn tất</AntdSelect.Option>
                <AntdSelect.Option value="Hủy">Hủy</AntdSelect.Option>
              </AntdSelect>
            </div>
            <div className="mb-2">
              <strong>Phương thức thanh toán:</strong> {selectedOrder.paymentMethod}
            </div>
            <div className="mb-2">
              <strong>Tổng tiền:</strong> {selectedOrder.totalAmount.toLocaleString('vi-VN')} ₫
            </div>
            
            {/* Add this section if you implement fetching order details */}
            {selectedOrder.orderDetails && selectedOrder.orderDetails.length > 0 && (
              <>
                <div className="mb-2">
                  <strong>Chi tiết đơn hàng:</strong>
                </div>
                <Table
                  pagination={false}
                  size="small"
                  columns={[
                    {
                      title: "Sản phẩm",
                      dataIndex: "productName",
                      key: "productName",
                    },
                    {
                      title: "Số lượng",
                      dataIndex: "quantity",
                      key: "quantity",
                    },
                    {
                      title: "Đơn giá",
                      dataIndex: "price",
                      key: "price",
                      render: (value) =>
                        value.toLocaleString("vi-VN") + " ₫",
                    },
                    {
                      title: "Thành tiền",
                      key: "total",
                      render: (_, record) =>
                        (record.price * record.quantity).toLocaleString("vi-VN") + " ₫",
                    },
                  ]}
                  dataSource={selectedOrder.orderDetails}
                  rowKey="id"
                />
              </>
            )}

            {selectedOrder.promotion && (
              <div className="mb-2">
                <strong>Mã khuyến mãi áp dụng:</strong> {selectedOrder.promotion.code}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderList;