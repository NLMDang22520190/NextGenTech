import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from 'framer-motion';
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
  // Add state for pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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
      case "Completed":
        return "bg-emerald-100 text-emerald-600";
      case "Processing":
        return "bg-purple-100 text-purple-600";
      case "Cancelled":
        return "bg-red-100 text-red-600";
      case "Pending":
        return "bg-amber-100 text-amber-600";
      case "Pending Confirm":
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

  // Calculate total pages
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get orders for current page
  const paginatedOrders = useMemo(() => {
    return filteredOrders.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    );
  }, [filteredOrders, currentPage, itemsPerPage]);

  // Function to generate page numbers for display
  const getPaginationNumbers = () => {
    const pages = [];
    const maxDisplayedPages = 5;

    if (totalPages <= maxDisplayedPages) {
      // Display all pages if total pages <= max displayed pages
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Display a subset of pages with current page in the middle
      let startPage = Math.max(0, currentPage - Math.floor(maxDisplayedPages / 2));
      let endPage = Math.min(totalPages - 1, startPage + maxDisplayedPages - 1);

      // Adjust if we're near the end
      if (endPage - startPage < maxDisplayedPages - 1) {
        startPage = Math.max(0, endPage - maxDisplayedPages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

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
        Order List
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
              <button className="px-4 py-3 flex items-center justify-between min-w-[160px] text-left cursor-pointer">
                <span className="flex items-center text-sm font-medium text-gray-700">
                  <CalendarIcon size={16} className="mr-2 text-primary-500 " />
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
        <div className="flex items-center border-r border-gray-200 ">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="border-0 focus:ring-0 focus:ring-offset-0 px-4 py-3 h-auto min-w-[220px]">
              <div className="flex items-center justify-start w-full text-sm font-medium text-gray-700 cursor-pointer">
                <Tag size={16} className="mr-2 text-green-500 flex-shrink-0 cursor-pointer" />
                <SelectValue placeholder="Order Status" className="flex-grow cursor-pointer" />
              </div>
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
            <span className="text-sm font-medium">Reset Filters</span>
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
                      Order Date
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedOrders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    paginatedOrders.map((order, index) => (
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
                            className="text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
                          >
                            Details
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}

                  {/* Add empty rows if number of orders is less than itemsPerPage */}
                  {paginatedOrders.length > 0 && paginatedOrders.length < itemsPerPage && (
                    Array.from({ length: itemsPerPage - paginatedOrders.length }).map((_, i) => (
                      <tr key={`empty-${i}`} className="h-[60px]">
                        <td colSpan={7}></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Pagination - Replace old pagination section */}
          {totalPages > 1 && (
            <motion.div
              className="flex items-center justify-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <div className="flex items-center space-x-2">
                <button
                  className="p-2 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft size={16} className="text-gray-600" />
                </button>

                {getPaginationNumbers().map((page) => (
                  <motion.button
                    key={page}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ${
                      currentPage === page
                        ? 'bg-primary-500 text-white'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    } transition-colors duration-200`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page + 1}
                  </motion.button>
                ))}

                <button
                  className="p-2 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                  disabled={currentPage >= totalPages - 1}
                >
                  <ChevronRight size={16} className="text-gray-600" />
                </button>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* Order Detail Modal*/}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h3 className="text-lg font-medium">Chi tiết đơn hàng #{selectedOrder.orderId}</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-gray-500 w-40">Order ID:</span>
                      <span className="font-medium">#{selectedOrder.orderId}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-40">Order Date:</span>
                      <span>{formatDate(selectedOrder.orderDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-40">Payment Method:</span>
                      <span>{selectedOrder.paymentMethod}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-gray-500 w-40">Total Amount:</span>
                      <span className="font-medium text-primary-600">{selectedOrder.totalAmount.toLocaleString('vi-VN')} ₫</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-60">Status:</span>
                      <AntdSelect
                        defaultValue={selectedOrder.status}
                        style={{ width: 150 }}
                        onChange={(value) => updateOrderStatus(selectedOrder.orderId, value)}
                        className="border border-gray-300 rounded-md"
                      >
                        <AntdSelect.Option value="Pending Confirm">Pending Confirm</AntdSelect.Option>
                        <AntdSelect.Option value="Processing">Processing</AntdSelect.Option>
                        {/* <AntdSelect.Option value="Shipping">Shipping</AntdSelect.Option> */}
                        <AntdSelect.Option value="Completed">Completed</AntdSelect.Option>
                        <AntdSelect.Option value="Cancelled">Cancelled</AntdSelect.Option>
                      </AntdSelect>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-gray-500">Address:</span>
                  <p className="mt-1 p-2 bg-gray-50 rounded-md">{selectedOrder.shippingAddress}</p>
                </div>

                {selectedOrder.orderDetails && selectedOrder.orderDetails.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-md font-medium mb-3">Product Details</h4>
                    <div className="border rounded-lg overflow-hidden">
                      <Table
                        pagination={false}
                        size="small"
                        columns={[
                          {
                            title: "Product",
                            dataIndex: "productName",
                            key: "productName",
                          },
                          {
                            title: "Quantity",
                            dataIndex: "quantity",
                            key: "quantity",
                            className: "text-center",
                          },
                          {
                            title: "Unit Price",
                            dataIndex: "price",
                            key: "price",
                            render: (value) => value.toLocaleString("vi-VN") + " ₫",
                            className: "text-right",
                          },
                          {
                            title: "Total",
                            key: "total",
                            render: (_, record) => (record.price * record.quantity).toLocaleString("vi-VN") + " ₫",
                            className: "text-right font-medium",
                          },
                        ]}
                        dataSource={selectedOrder.orderDetails}
                        rowKey="id"
                      />
                    </div>
                  </div>
                )}

                {selectedOrder.promotion && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
                    <div className="flex items-center">
                      <span className="text-blue-600 font-medium">Mã khuyến mãi:</span>
                      <span className="ml-2 px-2 py-1 bg-blue-100 rounded text-blue-700">{selectedOrder.promotion.code}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
                >
                  Đóng
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderList;
