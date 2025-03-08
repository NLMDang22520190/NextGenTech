import { motion } from "framer-motion";
import { 
  Users,
  DollarSign,
  Package,
  ArrowUp,
  ArrowDown,
  Clock
} from "lucide-react";
import SalesChart from "./SaleChart";

const statsItems = [
  {
    title: "Total User",
    value: "40,689",
    icon: Users,
    iconBg: "bg-blue-100",
    trend: "+8.5% Up from yesterday",
    trendUp: true,
    trendIcon: ArrowUp,
    trendClass: "text-green-500",
  },
  {
    title: "Total Order",
    value: "10293",
    icon: Package,
    iconBg: "bg-yellow-100",
    trend: "+1.3% Up from past week",
    trendUp: true,
    trendIcon: ArrowUp,
    trendClass: "text-green-500",
  },
  {
    title: "Total Sales",
    value: "$89,000",
    icon: DollarSign,
    iconBg: "bg-green-100",
    trend: "-4.3% Down from yesterday",
    trendUp: false,
    trendIcon: ArrowDown,
    trendClass: "text-red-500",
  },
  {
    title: "Total Pending",
    value: "2040",
    icon: Clock,
    iconBg: "bg-orange-100",
    trend: "+1.8% Up from yesterday",
    trendUp: true,
    trendIcon: ArrowUp,
    trendClass: "text-green-500",
  },
];

// Simple mock data for the deals table
const dealsData = [
  {
    id: 1,
    productName: "Apple Watch",
    productImage: "src/assets/AdminDashboardImage/AppleWatch.png",
    location: "6096 Marjolaine Landing",
    dateTime: "12.09.2019 - 12.53 PM",
    price: 423,
    amount: "$34,795",
    status: "Delivered"
  }
];

const DashboardContent = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        {statsItems.map((item, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl shadow-sm p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500">{item.title}</p>
                <p className="text-2xl font-semibold mt-1">{item.value}</p>
              </div>
              <div className={`${item.iconBg} p-3 rounded-full`}>
                <item.icon className="h-5 w-5 text-dashblue" />
              </div>
            </div>
            <div className="flex items-center">
              <item.trendIcon className={`h-4 w-4 ${item.trendClass} mr-1`} />
              <span className={`text-xs ${item.trendClass}`}>
                {item.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        className="bg-white rounded-xl shadow-sm mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <SalesChart/>
      </motion.div>

      <motion.div 
        className="bg-white rounded-xl shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-800">Deals Details</h2>
          <div className="relative">
          <select className="appearance-none pl-4 pr-8 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white">
            <option>October</option>
            <option>September</option>
            <option>August</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 rounded-l-lg">Product Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Location</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date - Time</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Piece</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 rounded-r-lg">Status</th>
              </tr>
            </thead>
            <tbody>
              {dealsData.map((deal) => (
                <tr key={deal.id} className="">
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                        <img src={deal.productImage} alt="" className="p-1 rounded-lg" />
                      </div>
                      <span className="text-sm font-medium">{deal.productName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{deal.location}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{deal.dateTime}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{deal.price}</td>
                  <td className="px-4 py-4 text-sm font-medium">{deal.amount}</td>
                  <td className="px-4 py-4">
                    <span className="px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                      {deal.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardContent;