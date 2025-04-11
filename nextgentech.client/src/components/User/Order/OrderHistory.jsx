import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const orderData = [
  { id: '96459', status: 'IN PROGRESS', date: 'Dec 30, 2019 07:52', total: '$80 (5 Products)' },
  { id: '71667', status: 'COMPLETED', date: 'Dec 7, 2019 23:26', total: '$70 (4 Products)' },
  { id: '95214', status: 'CANCELED', date: 'Dec 7, 2019 23:26', total: '$2,300 (2 Products)' },
  { id: '71667', status: 'COMPLETED', date: 'Feb 2, 2019 19:28', total: '$250 (1 Products)' },
  { id: '51746', status: 'COMPLETED', date: 'Dec 30, 2019 07:52', total: '$360 (2 Products)' },
  { id: '51746', status: 'CANCELED', date: 'Dec 4, 2019 21:42', total: '$220 (7 Products)' },
  { id: '67143', status: 'COMPLETED', date: 'Feb 2, 2019 19:28', total: '$80 (1 Products)' },
  { id: '62143', status: 'COMPLETED', date: 'Mar 20, 2019 23:14', total: '$160 (1 Products)' },
  { id: '71743', status: 'COMPLETED', date: 'Dec 4, 2019 21:42', total: '$1,500 (3 Products)' },
  { id: '67343', status: 'COMPLETED', date: 'Dec 30, 2019 07:52', total: '$1,200 (2 Products)' },
  { id: '67393', status: 'CANCELED', date: 'Dec 30, 2019 05:18', total: '$1,500 (1 Products)' },
  { id: '67343', status: 'COMPLETED', date: 'Dec 30, 2019 07:52', total: '$80 (1 Products)' },
];

const OrderHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-500";
      case "IN PROGRESS":
        return "text-orange-500";
      case "CANCELED":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500"/>;
      case 'IN PROGRESS': 
        return <ClockIcon className="h-5 w-5 text-orange-500"/>;
      case 'CANCELED':
        return <XCircleIcon className="h-5 w-5 text-red-500"/>;
      default:
        return null;
        
    }
  }

  const handleViewDetails = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-xl font-bold mb-4 text-primary-700">ORDER HISTORY</h1>
      
      <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm mb-6">
        <div className="grid grid-cols-12 bg-gray-100 py-3 px-4 border-b border-gray-200">
          <div className="col-span-2 font-medium text-gray-700">ORDER ID</div>
          <div className="col-span-2 font-medium text-gray-700">STATUS</div>
          <div className="col-span-3 font-medium text-gray-700">DATE</div>
          <div className="col-span-3 font-medium text-gray-700">TOTAL</div>
          <div className="col-span-2 font-medium text-gray-700">ACTION</div>
        </div>

        {orderData.map((order, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="grid grid-cols-12 py-3 px-4 border-b border-gray-100 hover:bg-gray-50"
          >
            <div className="col-span-2 font-medium">#{order.id}</div>
            <div className={`col-span-2 font-medium flex justify-center md:justify-start items-center space-x-1 ${getStatusColor(order.status)}`}>
              <span className="hidden md:inline">{order.status}</span>
              {getStatusIcon(order.status)}
            </div>
            <div className="col-span-3 text-gray-600">{order.date}</div>
            <div className="col-span-3 text-gray-600">{order.total}</div>
            <div className="col-span-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-blue-500 flex items-center hover:text-blue-700 transition-colors cursor-pointer"
                onClick={() => handleViewDetails(order.id)}
              >
                View Details <ChevronRight size={16} className="ml-1 " />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center items-center space-x-2 my-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={18} />
        </motion.button>

        {[1, 2, 3, 4, 5, 6].map((page) => (
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
          className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ArrowRight size={18} />
        </motion.button>
      </div>
    </div>
  );
};

export default OrderHistory;
