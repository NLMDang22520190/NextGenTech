import { motion } from "framer-motion";
import { useState } from "react";
import AdminSidebar from "./AdminSidebar.jsx";
import { Bell, Search, ChevronDown } from "lucide-react";

const AdminLayout = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 py-4 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-md hover:bg-gray-100 md:hidden"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </motion.button>
              
              <div className="relative w-64" >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  className="pl-10 pr-4 py-2 w-[150px] border rounded-full text-sm focus:outline-none focus:border-primary-600 hover:w-full hover:duration-300 duration-300"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="relative">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 rounded-full hover:bg-gray-100"
                >
                  <Bell size={20} className="text-gray-600" />
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    2
                  </span>
                </motion.button>
              </div>
              
              <div className="flex items-center border-l pl-6 gap-3">
                <div className="flex items-center">
                  <img src="https://flagcdn.com/gb.svg" width="30" className="mr-2" alt="English" />
                  <span className="text-sm font-medium text-gray-700">English</span>
                  <ChevronDown size={16} className="ml-1 text-gray-500" />
                </div>
                
                <div className="flex items-center gap-2">
                  <img 
                    src="https://i.pravatar.cc/36"
                    alt="Profile" 
                    className="h-8 w-8 rounded-full object-cover border-2 border-white shadow-sm" 
                  />
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-700">Moni Roy</p>
                    <p className="text-xs text-gray-500">Admin</p>
                  </div>
                  <ChevronDown size={16} className="text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <motion.main 
          className="flex-1 overflow-y-auto bg-gray-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="px-6 py-8">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default AdminLayout;