import { motion } from "framer-motion";
import { 
  Users, 
  ShoppingCart, 
  DollarSign,
  Package,
  ArrowUp,
  ArrowDown,
  Clock
} from "lucide-react";

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
    productImage: "/lovable-uploads/cf7fdb07-79ef-4690-854a-4fb8391f79dc.png",
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
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
        className="bg-white rounded-xl shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-800">Sales Details</h2>
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-600">October</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div className="h-72 w-full">
          {/* This would be your actual chart component */}
          <div className="relative h-full w-full">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
              <span>100%</span>
              <span>80%</span>
              <span>60%</span>
              <span>40%</span>
              <span>20%</span>
            </div>
            
            {/* Placeholder for chart - in a real app, use Recharts or similar */}
            <div className="absolute left-10 right-0 top-0 h-full">
              <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
                <path 
                  d="M0,240 C40,220 60,180 80,190 C100,200 120,240 140,230 C160,220 180,170 200,180 C220,190 240,220 260,210 C280,200 300,140 320,120 C340,100 360,30 380,50 C400,70 420,150 440,160 C460,170 480,190 500,180 C520,170 540,130 560,140 C580,150 600,190 620,170 C640,150 660,90 680,110 C700,130 720,210 740,200 C760,190 780,120 800,110" 
                  fill="none" 
                  stroke="#3b82f6" 
                  strokeWidth="2"
                />
                <path 
                  d="M0,240 C40,220 60,180 80,190 C100,200 120,240 140,230 C160,220 180,170 200,180 C220,190 240,220 260,210 C280,200 300,140 320,120 C340,100 360,30 380,50 C400,70 420,150 440,160 C460,170 480,190 500,180 C520,170 540,130 560,140 C580,150 600,190 620,170 C640,150 660,90 680,110 C700,130 720,210 740,200 C760,190 780,120 800,110 L800,300 L0,300 Z" 
                  fill="url(#paint0_linear)" 
                  fillOpacity="0.2"
                />
                <defs>
                  <linearGradient id="paint0_linear" x1="400" y1="50" x2="400" y2="300" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3b82f6" />
                    <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Chart marker for high point */}
              <div className="absolute top-[30%] left-[40%] transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-3 h-3 bg-white border-2 border-blue-500 rounded-full"></div>
                <div className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  $4,986.77
                </div>
              </div>
            </div>
            
            {/* X-axis labels */}
            <div className="absolute bottom-[-20px] left-10 right-0 flex justify-between text-xs text-gray-500">
              <span>5k</span>
              <span>10k</span>
              <span>15k</span>
              <span>20k</span>
              <span>25k</span>
              <span>30k</span>
              <span>35k</span>
              <span>40k</span>
              <span>45k</span>
              <span>50k</span>
              <span>55k</span>
              <span>60k</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="bg-white rounded-xl shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-800">Deals Details</h2>
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-600">October</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Product Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Location</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date - Time</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Piece</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {dealsData.map((deal) => (
                <tr key={deal.id} className="border-t">
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        <img src={deal.productImage} alt="" className="w-6 h-6" />
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