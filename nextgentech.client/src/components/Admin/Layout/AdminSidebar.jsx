import { motion } from "framer-motion";
import { 
  LayoutDashboard, ShoppingBag, Heart, MessageSquare, 
  ListOrdered, PackageOpen, Tag, Calendar, CheckSquare, 
  Users, FileText, Layout, UsersRound, Table, Settings, LogOut,
  ChevronLeft, ChevronRight 
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import GradientText from "../../ReactBitsComponent/GradientText";

const SidebarItem = ({ icon: Icon, label, path, isActive = false, isCollapsed }) => {
  return (
    <motion.div
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.98 }}
      className="animate-fade-in"
    >
      <Link 
        to={path} 
        className={`flex gap-3 px-4 py-2.5 text-sm rounded-md transition-all duration-300 ${
          isActive 
            ? 'bg-primary text-white font-medium' 
            : 'text-gray-600 hover:bg-primary-50'
        } ${isCollapsed ? 'justify-around' :'' }`}
      >
        <Icon size={18} />
        {!isCollapsed && <span>{label}</span>}
      </Link>
    </motion.div>
  );
};

const AdminSidebar = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation(); // Lấy đường dẫn hiện tại

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: ShoppingBag, label: "Products", path: "/products" },
    { icon: Heart, label: "Favorites", path: "/favorites" },
    { icon: MessageSquare, label: "Inbox", path: "/inbox" },
    { icon: ListOrdered, label: "Order Lists", path: "/orders" },
    { icon: PackageOpen, label: "Product Stock", path: "/stock" },
  ];

  const pageItems = [
    { icon: Tag, label: "Pricing", path: "/pricing" },
    { icon: Calendar, label: "Calendar", path: "/calendar" },
    { icon: CheckSquare, label: "To-Do", path: "/todo" },
    { icon: Users, label: "Contact", path: "/contact" },
    { icon: FileText, label: "Invoice", path: "/invoice" },
    { icon: Layout, label: "UI Elements", path: "/ui-elements" },
    { icon: UsersRound, label: "Team", path: "/team" },
    { icon: Table, label: "Table", path: "/table" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: LogOut, label: "Logout", path: "/logout" },
  ];

  return (
    <aside className={`h-screen drop-shadow-sm flex flex-col transition-all duration-300 ${
      isCollapsed ? "w-20" : "w-56"
    } bg-white`} >
      <div className="py-2 ps-2 flex justify-evenly items-center">
        <Link to="/">
            <GradientText
              colors={["#50bbf5", "#5069f5", "#50bbf5", "#5069f5", "#50bbf5"]}
              className="text-2xl"
              animationSpeed={3}
              showBorder={false}
            >
              {isCollapsed ? ("N") : ("nextgentech")}
            </GradientText>
        </Link>

        <button 
          onClick={toggleSidebar} 
          className="mt-1 p-1 rounded-full hover:bg-gray-200 transition"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="mt-auto h-full flex-1">
        <motion.div 
          className="px-3 h-full flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05, delayChildren: 0.1 }}
        >
          <div className="flex flex-col justify-around h-full">
            {/* Top Items */}
            
              {sidebarItems.map((item) => (
                <div>
                  <SidebarItem 
                    key={item.path}
                    icon={item.icon}
                    label={item.label}
                    path={item.path}
                    isActive={location.pathname === item.path}
                    isCollapsed={isCollapsed}
                  />
                </div>
              ))}
            
            {/* Section Title */}
            {!isCollapsed && (
              <div className="py-0.5 px-3">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">PAGES</p>
              </div>
            )}

            {/* Bottom Items */}
              {pageItems.map((item) => (
                <div>
                  <SidebarItem 
                    key={item.path}
                    icon={item.icon}
                    label={item.label}
                    path={item.path}
                    isActive={location.pathname === item.path}
                    isCollapsed={isCollapsed}
                  />
                </div>
              ))}
          </div>
        </motion.div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;