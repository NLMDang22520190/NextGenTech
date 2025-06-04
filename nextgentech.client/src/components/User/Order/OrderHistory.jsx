import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import axios from '../../../features/AxiosInstance/AxiosInstance';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate();

  // Get user ID from Redux store
  const userID = useSelector((state) => state.auth.user);

  useEffect(() => {
    fetchOrders();
  }, [userID]);

  // Sửa hàm fetchOrders để khớp với cấu trúc dữ liệu API trả về
const fetchOrders = async () => {
  setLoading(true);
  try {
    if (!userID) {
      // Redirect to login if no user ID is found
      navigate('/login', { state: { from: '/order-history' } });
      return;
    }

    const response = await axios.get(`/api/Order/user/${userID}`);
    
    if (response.status === 200) {
      const mappedOrders = response.data.map(order => ({
        id: order.orderId,
        status: order.status, 
        date: new Date(order.orderDate), 
        total: formatPrice(order.totalAmount), 
        rawTotal: order.totalAmount 
      }));
      
      // Sort orders by date (newest first)
      mappedOrders.sort((a, b) => b.date - a.date);
      
      setOrders(mappedOrders);
    }
    setLoading(false);
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    if (err.response && err.response.status === 404) {
      // No orders found
      setOrders([]);
    } else {
      setError("Unable to load order list. Please try again later.");
    }
    setLoading(false);
  }
};

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return "text-green-500";
      case "IN PROGRESS":
      case "PROCESSING":
      case "PENDING":
        return "text-orange-500";
      case "CANCELED":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500"/>;
      case 'IN PROGRESS':
      case 'PROCESSING':
      case 'PENDING':
        return <ClockIcon className="h-5 w-5 text-orange-500"/>;
      case 'CANCELED':
        return <XCircleIcon className="h-5 w-5 text-red-500"/>;
      default:
        return null;
    }
  };

  const handleViewDetails = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  // Calculate paginated orders
  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate total pages
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const pages = [];
    const maxDisplayedPages = 6;
    
    if (totalPages <= maxDisplayedPages) {
      // Display all pages if total pages <= max display count
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Display a subset of pages with current page in the middle
      let startPage = Math.max(1, currentPage - Math.floor(maxDisplayedPages / 2));
      let endPage = Math.min(totalPages, startPage + maxDisplayedPages - 1);
      
      // Adjust if we're near the end
      if (endPage - startPage < maxDisplayedPages - 1) {
        startPage = Math.max(1, endPage - maxDisplayedPages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  if (loading && orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-xl font-bold mb-4 text-primary-700">ORDER HISTORY</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-xl font-bold mb-4 text-primary-700">ORDER HISTORY</h1>
        <div className="bg-red-50 rounded-lg p-4 text-red-700">
          <p>{error}</p>
          <button
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={fetchOrders}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-xl font-bold mb-4 text-primary-700">ORDER HISTORY</h1>

      {orders.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">You don't have any orders yet.</p>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm mb-6">
          <div className="grid grid-cols-12 bg-gray-100 py-3 px-4 border-b border-gray-200">
            <div className="col-span-2 font-medium text-gray-700">ORDER ID</div>
            <div className="col-span-2 font-medium text-gray-700">STATUS</div>
            <div className="col-span-3 font-medium text-gray-700">ORDER DATE</div>
            <div className="col-span-3 font-medium text-gray-700">TOTAL AMOUNT</div>
            <div className="col-span-2 font-medium text-gray-700">ACTIONS</div>
          </div>

          {paginatedOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="grid grid-cols-12 py-3 px-4 border-b border-gray-100 hover:bg-gray-50"
            >
              <div className="col-span-2 font-medium">#{order.id}</div>
              <div className={`col-span-2 font-medium flex items-center space-x-2 ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="hidden md:inline capitalize">{order.status}</span>
              </div>
              <div className="col-span-3 text-gray-600">{formatDate(order.date)}</div>
              <div className="col-span-3 text-gray-600">{order.total}</div>
              <div className="col-span-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-blue-500 flex items-center hover:text-blue-700 transition-colors cursor-pointer"
                  onClick={() => handleViewDetails(order.id)}
                >
                  View Details <ChevronRight size={16} className="ml-1" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-between items-center my-8">
          <div className="relative inline-block text-left">
            <select
              className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5 items/page</option>
              <option value={10}>10 items/page</option>
              <option value={20}>20 items/page</option>
              <option value={50}>50 items/page</option>
            </select>
          </div>
          
          <div className="flex justify-center items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ArrowLeft size={18} />
            </motion.button>

            {getPaginationNumbers().map((page) => (
              <motion.button
                key={page}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ${
                  currentPage === page 
                    ? 'bg-primary-500 text-white' 
                    : 'border border-gray-300 text-gray-600 hover:bg-gray-100'
                } transition-colors`}
                onClick={() => setCurrentPage(page)}
              >
                {page.toString().padStart(2, "0")}
              </motion.button>
            ))}

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ArrowRight size={18} />
            </motion.button>
          </div>
        </div>
      )}

      {loading && orders.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white p-2 rounded-full shadow-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;