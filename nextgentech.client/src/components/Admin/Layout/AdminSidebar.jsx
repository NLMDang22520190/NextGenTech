import { motion } from "framer-motion";
import { 
  LayoutDashboard, ShoppingBag, Heart, MessageSquare, 
  ListOrdered, PackageOpen, Tag, Calendar, CheckSquare, 
  Users, FileText, Layout, UsersRound, Table, Settings, LogOut 
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import GradientText from "../../ReactBitsComponent/GradientText";

const SidebarItem = ({ icon: Icon, label, path, isActive = false }) => {
  return (
    <motion.div
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.98 }}
      className="animate-fade-in"
    >
      <Link 
        to={path} 
        className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-md ${
          isActive 
            ? 'bg-primary text-white font-medium' 
            : 'text-gray-600 hover:bg-primary-50'
        }`}
      >
        <Icon size={18} />
        <span>{label}</span>
      </Link>
    </motion.div>
  );
};

const AdminSidebar = () => {
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
    <aside className="w-56 bg-white h-screen border-r border-gray-200" >
      <div className="p-4">
        <Link to="/">
            <GradientText
              colors={["#50bbf5", "#5069f5", "#50bbf5", "#5069f5", "#50bbf5"]}
              className="text-2xl"
              animationSpeed={3}
              showBorder={false}
            >
              nextgentech
            </GradientText>
        </Link>
      </div>

      <nav className="mt-4">
        <motion.div 
          className="space-y-1 px-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05, delayChildren: 0.1 }}
        >
          {sidebarItems.map((item) => (
            <SidebarItem 
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              isActive={location.pathname === item.path}
            />
          ))}
          
          <div className="pt-6 pb-2 px-3">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">PAGES</p>
          </div>
          
          {pageItems.map((item) => (
            <SidebarItem 
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              isActive={location.pathname === item.path}
            />
          ))}
        </motion.div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;