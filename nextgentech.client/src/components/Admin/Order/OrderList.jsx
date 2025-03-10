import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Filter, ChevronDown, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Package, Tag, X  } from "lucide-react";
import { format, parse, isValid } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../../components/ui/select";
import { Popover, PopoverContent, PopoverTrigger} from "../../../components/ui/popover";
import  { Calendar } from "../../../components/ui/calendar";
import { Button } from "../../../components/ui/button";

const OrderList = () => {
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedType, setSelectedType] = useState(undefined);
  const [selectedStatus, setSelectedStatus] = useState(undefined);

  // Sample data for our orders
  const orderData = [
    {
      id: "00001",
      name: "Christine Brooks",
      address: "089 Kutch Green Apt. 448",
      date: "04 Sep 2019",
      type: "Electric",
      status: "Completed",
    },
    {
      id: "00002",
      name: "Rosie Pearson",
      address: "979 Immanuel Ferry Suite 526",
      date: "28 May 2019",
      type: "Book",
      status: "Processing",
    },
    {
      id: "00003",
      name: "Darrell Caldwell",
      address: "8587 Frida Ports",
      date: "23 Nov 2019",
      type: "Medicine",
      status: "Rejected",
    },
    {
      id: "00004",
      name: "Gilbert Johnston",
      address: "768 Destiny Lake Suite 600",
      date: "05 Feb 2019",
      type: "Mobile",
      status: "Completed",
    },
    {
      id: "00005",
      name: "Alan Cain",
      address: "042 Mylene Throughway",
      date: "29 Jul 2019",
      type: "Watch",
      status: "Processing",
    },
    {
      id: "00006",
      name: "Alfred Murray",
      address: "543 Weimann Mountain",
      date: "15 Aug 2019",
      type: "Medicine",
      status: "Completed",
    },
    {
      id: "00007",
      name: "Maggie Sullivan",
      address: "New Scottieberg",
      date: "21 Dec 2019",
      type: "Watch",
      status: "Processing",
    },
    {
      id: "00008",
      name: "Rosie Todd",
      address: "New Jon",
      date: "30 Apr 2019",
      type: "Medicine",
      status: "On Hold",
    },
    {
      id: "00009",
      name: "Dollie Hines",
      address: "124 Lyla Forge Suite 975",
      date: "09 Jan 2019",
      type: "Book",
      status: "In Transit",
    },
  ];

  // Get unique order types from the data
  const orderTypes = [...new Set(orderData.map(order => order.type))];
  
  // Get unique order statuses from the data
  const orderStatuses = [...new Set(orderData.map(order => order.status))];

  // Function to reset all filters
  const resetFilters = () => {
    setSelectedDate(undefined);
    setSelectedType(undefined);
    setSelectedStatus(undefined);
  };

  // Get status color based on status value
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-600";
      case "Processing":
        return "bg-purple-100 text-purple-600";
      case "Rejected":
        return "bg-red-100 text-red-600";
      case "On Hold":
        return "bg-amber-100 text-amber-600";
      case "In Transit":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Format the selected date as string
  const formatSelectedDate = () => {
    return selectedDate ? format(selectedDate, "dd MMM yyyy") : "Date";
  };

  // Filter orders based on selected filters
  const filteredOrders = useMemo(() => {
    return orderData.filter((order) => {
      // Filter by date if selected
      if (selectedDate) {
        const orderDate = parse(order.date, "dd MMM yyyy", new Date());
        if (!isValid(orderDate) || 
            orderDate.getDate() !== selectedDate.getDate() || 
            orderDate.getMonth() !== selectedDate.getMonth() || 
            orderDate.getFullYear() !== selectedDate.getFullYear()) {
          return false;
        }
      }

      // Filter by type if selected
      if (selectedType && order.type !== selectedType) {
        return false;
      }

      // Filter by status if selected
      if (selectedStatus && order.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [orderData, selectedDate, selectedType, selectedStatus]);

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
        Order Lists
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
        
        {/* Order Type Filter */}
        <div className="flex items-center border-r border-gray-200">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="border-0 focus:ring-0 focus:ring-offset-0 px-4 py-3 h-auto min-w-[160px]">
              <span className="flex items-center text-sm font-medium text-gray-700">
                <Package size={16} className="mr-2 text-gray-500" />
                <SelectValue placeholder="Order Type" />
              </span>
            </SelectTrigger>
            <SelectContent className="z-50 bg-white">
              {orderTypes.map(type => (
                <SelectItem key={type} value={type} className="cursor-pointer">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Order Status Filter */}
        <div className="flex items-center border-r border-gray-200">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="border-0 focus:ring-0 focus:ring-offset-0 px-4 py-3 h-auto min-w-[160px]">
              <span className="flex items-center text-sm font-medium text-gray-700">
                <Tag size={16} className="mr-2 text-gray-500" />
                <SelectValue placeholder="Order Status" />
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
            className="px-4 py-3 flex items-center text-red-500 hover:text-red-600 transition-colors duration-200"
          >
            <X size={16} className="mr-2" />
            <span className="text-sm font-medium">Reset Filter</span>
          </button>
        </div>
      </motion.div>

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
                  NAME
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  ADDRESS
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  DATE
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  TYPE
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  STATUS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order, index) => (
                <motion.tr 
                  key={order.id}
                  variants={tableRowVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.6)" }}
                  className="transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {order.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {order.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {order.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
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
          Showing {filteredOrders.length > 0 ? 1 : 0}-{filteredOrders.length} of {filteredOrders.length}
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
    </div>
  );
};

export default OrderList;