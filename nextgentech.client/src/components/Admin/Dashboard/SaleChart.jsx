import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceDot 
} from "recharts";

// Generate sales data
const generateData = () => {
  const data = [];
  let value = 20;
  
  for (let i = 5; i <= 60; i += 5) {
    // Add some randomness to the data
    value = Math.max(20, Math.min(95, value + (Math.random() * 20 - 10)));
    data.push({ x: i, value: Math.round(value) });
  }
  
  // Ensure one peak point for the reference dot
  const peakIndex = Math.floor(Math.random() * 5) + 2; // Between 2-7
  data[peakIndex].value = 85;
  data[peakIndex].peakValue = 64364.77;
  
  return data;
};

const SalesChart = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setTimeout(() => {
      setData(generateData());
      setIsLoading(false);
    }, 500);
  }, []);
  
  const peakPoint = data.find(item => item.peakValue);
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
          <p className="text-sm font-medium">{`${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Sales Details</h2>
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
      
      <div className="w-full h-64">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-pulse bg-gray-200 rounded-md w-full h-48"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F7DF9" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#4F7DF9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#EEF2F6" />
              <XAxis 
                dataKey="x" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94A3B8' }}
                tickFormatter={(value) => `${value}k`}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94A3B8' }}
                tickFormatter={(value) => `${value}%`}
                tickCount={5}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#4F7DF9" 
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorValue)" 
                animationDuration={1500}
              />
              {peakPoint && (
                <ReferenceDot
                  x={peakPoint.x}
                  y={peakPoint.value}
                  r={4}
                  fill="#FFFFFF"
                  stroke="#4F7DF9"
                  strokeWidth={2}
                >
                  <Label value={peakPoint.peakValue} position="top" />
                </ReferenceDot>
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};

// Custom label component for the reference dot
const Label = ({ value, position }) => {
  return (
    <motion.g
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.3 }}
    >
      <rect x="-40" y="-35" width="80" height="24" rx="4" fill="#4F7DF9" />
      <text x="0" y="-19" textAnchor="middle" fill="white" fontSize="12" fontWeight="500">
        ${value}
      </text>
    </motion.g>
  );
};

export default SalesChart;