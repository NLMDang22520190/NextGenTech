import { motion } from "framer-motion";
import {
  LayoutDashboard, ShoppingBag,
  ListOrdered, Tag, Calendar, CheckSquare,
  Users, FileText, Layout, UsersRound, Table, Settings, LogOut,
  ChevronLeft, ChevronRight,
  Slack,
  Boxes,
  Users2,
  TicketPercent
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import GradientText from "../../ReactBitsComponent/GradientText";
import { useDispatch } from "react-redux";
import { logout } from "../../../features/AxiosInstance/Auth/Auth";
import { toast } from "sonner";

const SidebarItem = ({ icon: Icon, label, path, isActive = false, isCollapsed, onClick }) => {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      className="animate-fade-in"
    >
      {path === "/logout" ? (
        <button
          onClick={onClick}
          className={`flex gap-3 px-4 py-3 text-base rounded-xl items-center transition-all duration-300 w-full ${
            isActive
              ? 'bg-primary text-white font-medium'
              : 'text-gray-600 hover:bg-primary-50'
          } ${isCollapsed ? 'justify-around' :'' }`}
        >
          <Icon size={20} />
          {!isCollapsed && <span>{label}</span>}
        </button>
      ) : (
        <Link
          to={path}
          className={`flex gap-3 px-4 py-3 text-base rounded-xl items-center transition-all duration-300 ${
            isActive
              ? 'bg-primary text-white font-medium'
              : 'text-gray-600 hover:bg-primary-50'
          } ${isCollapsed ? 'justify-around' :'' }`}
        >
          <Icon size={20} />
          {!isCollapsed && <span>{label}</span>}
        </Link>
      )}
    </motion.div>
  );
};

const AdminSidebar = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Show confirmation message before logout
    if (confirm("Are you sure you want to logout?")) {
      dispatch(logout());
      toast.success("Logout successful");
      // Force a page reload to ensure all state is cleared
      window.location.href = "/auth/login";
    }
  };

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: ShoppingBag, label: "Products", path: "/products" },
    { icon: ListOrdered, label: "Order Lists", path: "/orders" },
    { icon: Slack, label: "Brands", path: "/brands" },
    { icon: Boxes, label: "Categories", path: "/categories" },
    { icon: Users2, label: "Customers", path: "/customers" },
    { icon: TicketPercent, label: "Promotions", path: "/promotions" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: LogOut, label: "Logout", path: "/logout" },
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
  ];

  return (
    <aside className={`h-screen drop-shadow-sm flex flex-col transition-all duration-300 ${
      isCollapsed ? "w-20" : "w-50"
    } bg-white`} >
      <div className="py-2 ps-1 flex justify-evenly items-center">
        <Link to="/">
            <GradientText
              colors={["#50bbf5", "#5069f5", "#50bbf5", "#5069f5", "#50bbf5"]}
              className={`${isCollapsed ? "text-xl" :"text-2xl"}`}
              animationSpeed={3}
              showBorder={false}
            >
              {isCollapsed ? ("NGT") : ("nextgentech")}
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
          className="ps-2 pe-3 h-full flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05, delayChildren: 0.1 }}
        >
          <div className="flex flex-col justify-around h-9/10">
            {sidebarItems.map((item) => (
              <div key={item.path}>
                <SidebarItem
                  icon={item.icon}
                  label={item.label}
                  path={item.path}
                  isActive={location.pathname === item.path}
                  isCollapsed={isCollapsed}
                  onClick={item.path === "/logout" ? handleLogout : undefined}
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
