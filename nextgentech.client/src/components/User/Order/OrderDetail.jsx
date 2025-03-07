import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, CheckCircle, Truck, Package, MapPin, CheckCircle2, FileCheck, FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const OrderDetail = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  
  const orderData = {
    id: '96459761',
    productCount: 4,
    orderDate: '17 Jan, 2021 at 7:32 PM',
    totalAmount: '$1199.00',
    expectedDelivery: '23 Jan, 2021',
    status: 'IN PROGRESS',
    currentStep: 2,
    activities: [
      { 
        icon: CheckCircle, 
        color: 'text-green-500', 
        description: 'Your order has been delivered. Thank you for shopping at Clicon!', 
        date: '23 Jan, 2021 at 7:32 PM' 
      },
      { 
        icon: Truck, 
        color: 'text-blue-500', 
        description: 'Our delivery man (John Wick) Has picked-up your order for delivery.', 
        date: '23 Jan, 2021 at 2:00 PM' 
      },
      { 
        icon: MapPin, 
        color: 'text-blue-400', 
        description: 'Your order has reached at last mile hub.', 
        date: '22 Jan, 2021 at 8:00 AM' 
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" /> ORDER DETAILS
        </button>
        
        <button className="flex items-center text-orange-500 hover:text-orange-600 transition-colors">
          Leave a Rating <Plus size={20} className="ml-2" />
        </button>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-800 font-semibold">#{orderData.id}</p>
            <p className="text-gray-600 text-sm">{orderData.productCount} Products • Order Placed on {orderData.orderDate}</p>
          </div>
          <p className="text-blue-500 font-bold text-2xl">{orderData.totalAmount}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderDetail;
