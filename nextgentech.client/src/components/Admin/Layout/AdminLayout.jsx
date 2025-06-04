import { motion } from "framer-motion";
import { useState } from "react";
import AdminSidebar from "./AdminSidebar.jsx";
import { Bell, Search, ChevronDown } from "lucide-react";

const AdminLayout = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)}/>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 py-1 px-6 drop-shadow-sm">
          <div className="flex items-center justify-end">
           
            
            <div className="flex items-center gap-6">
              <div className="relative">
                
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
          <div className="px-6 pt-4 pb-6">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default AdminLayout;