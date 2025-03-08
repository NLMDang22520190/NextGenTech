import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, CheckCircle, Truck, Package, MapPin, CheckCircle2, FileCheck, FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const OrderDetails = () => {
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
      },
      { 
        icon: Truck, 
        color: 'text-blue-300', 
        description: 'Your order on the way to last mile hub.', 
        date: '21, 2021 at 5:32 AM' 
      },
      { 
        icon: CheckCircle2, 
        color: 'text-green-500', 
        description: 'Your order is successfully verified.', 
        date: '20 Jan, 2021 at 7:32 PM' 
      },
      { 
        icon: FileCheck, 
        color: 'text-blue-500', 
        description: 'Your order has been confirmed.', 
        date: '18 Jan, 2021 at 2:41 PM' 
      },
    ],
    products: [
      {
        category: 'SMARTPHONE',
        name: 'Google Pixel 6 Pro, 5G Android Phone - Unlocked Smartphone with Advanced Pixel Camera',
        price: '$899',
        quantity: 1,
        subtotal: '$899'
      },
      {
        category: 'ACCESSORIES',
        name: 'Tauri™ Eye Clear for Google Pixel 6 Pro - Crystal Clear Phone Case with 2X Multi-Drop Protection',
        price: '$39',
        quantity: 1,
        subtotal: '$39'
      }
    ],
    addresses: {
      billing: {
        name: 'Kevin Gilbert',
        address: 'Eastern Housing, Word No. 04, Road No. 13/X, House no. 1230/C, Flat No. 5D, Dhaka-1200, Bangladesh'
      },
      shipping: {
        name: 'Kevin Gilbert',
        address: 'Eastern Housing, Word No. 04, Road No. 13/X, House no. 1230/C, Flat No. 5D, Dhaka-1200, Bangladesh'
      }
    },
    notes: 'Donec ac vehicula turpis. Aenean sagittis elit eu mauris vitae ultricies. Phasellus viverra, lacus nec, justo velit aliquet. Aliquam nisi.'
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-700 hover:text-gray-900 transition-colors text-xl font-bold mb-4"
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
      
      <div className="mb-8">
        <p className="text-gray-700 mb-4">Order expected arrival {orderData.expectedDelivery}</p>
        
        <div className="relative mb-8">
          <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 z-0"></div>
          
          <div className="absolute top-4 left-0 h-1 bg-orange-500 z-0" style={{ width: `${orderData.currentStep * 33}%` }}></div>
          
          <div className="flex justify-between relative z-10">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-orange-500 border-4 border-white flex items-center justify-center mb-2">
                <FileText size={16} className="text-white" />
              </div>
              <p className="text-sm text-gray-700">Order Placed</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-orange-500 border-4 border-white flex items-center justify-center mb-2">
                <Package size={16} className="text-white" />
              </div>
              <p className="text-sm text-gray-700">Packaging</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-white border-4 border-gray-200 flex items-center justify-center mb-2">
                <Truck size={16} className="text-gray-400" />
              </div>
              <p className="text-sm text-gray-700">On The Road</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-white border-4 border-gray-200 flex items-center justify-center mb-2">
                <CheckCircle size={16} className="text-gray-400" />
              </div>
              <p className="text-sm text-gray-700">Delivered</p>
            </div>
          </div>
        </div>
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
        <h2 className="text-lg font-semibold mb-4">Product (02)</h2>
        
        <div className="bg-gray-50 rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-100 py-3 px-4 border-b border-gray-200">
            <div className="col-span-6 font-medium text-gray-700">PRODUCTS</div>
            <div className="col-span-2 font-medium text-gray-700">PRICE</div>
            <div className="col-span-2 font-medium text-gray-700">QUANTITY</div>
            <div className="col-span-2 font-medium text-gray-700">SUB-TOTAL</div>
          </div>
          
          {orderData.products.map((product, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="grid grid-cols-12 py-4 px-4 border-b border-gray-100"
            >
              <div className="col-span-6">
                <div className="flex">
                  <div className="w-12 h-12 bg-gray-200 rounded-md mr-3 flex-shrink-0"></div>
                  <div>
                    <p className="text-blue-500 text-xs font-medium">{product.category}</p>
                    <p className="text-gray-800 text-sm">{product.name}</p>
                  </div>
                </div>
              </div>
              <div className="col-span-2 self-center text-gray-700">{product.price}</div>
              <div className="col-span-2 self-center text-gray-700">{product.quantity}</div>
              <div className="col-span-2 self-center text-gray-700 font-medium">{product.subtotal}</div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6 mb-4">
        <div>
          <h3 className="text-gray-800 font-medium mb-3">Billing Address</h3>
          <div className="bg-gray-50 p-4 rounded-lg h-full">
            <p className="font-medium mb-1">{orderData.addresses.billing.name}</p>
            <p className="text-gray-600 text-sm">{orderData.addresses.billing.address}</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-gray-800 font-medium mb-3">Shipping Address</h3>
          <div className="bg-gray-50 p-4 rounded-lg h-full">
            <p className="font-medium mb-1">{orderData.addresses.shipping.name}</p>
            <p className="text-gray-600 text-sm">{orderData.addresses.shipping.address}</p>
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

export default OrderDetails;