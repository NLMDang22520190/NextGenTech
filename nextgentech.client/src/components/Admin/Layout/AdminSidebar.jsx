import { motion } from "framer-motion";
import { 
  LayoutDashboard, ShoppingBag, Heart, MessageSquare, 
  ListOrdered, PackageOpen, Tag, Calendar, CheckSquare, 
  Users, FileText, Layout, UsersRound, Table, Settings, LogOut 
} from "lucide-react";
import { Link } from "react-router-dom";
import "./AdminSidebar.css";
import GradientText from "../../ReactBitsComponent/GradientText";

const SidebarItem = ({ icon: Icon, label, path, isActive = false }) => {
  return (
    <motion.div
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link to={path} className={`sidebar-item ${isActive ? 'active' : ''}`}>
        <Icon size={18} />
        <span>{label}</span>
      </Link>
    </motion.div>
  );
};

const DashboardSidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
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

      <nav className="sidebar-nav">
        <div className="sidebar-section">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/" isActive={true} />
          <SidebarItem icon={ShoppingBag} label="Products" path="/products" />
          <SidebarItem icon={Heart} label="Favorites" path="/favorites" />
          <SidebarItem icon={MessageSquare} label="Inbox" path="/inbox" />
          <SidebarItem icon={ListOrdered} label="Order Lists" path="/orders" />
          <SidebarItem icon={PackageOpen} label="Product Stock" path="/stock" />
          
          <div className="sidebar-section-header">PAGES</div>
          
          <SidebarItem icon={Tag} label="Pricing" path="/pricing" />
          <SidebarItem icon={Calendar} label="Calendar" path="/calendar" />
          <SidebarItem icon={CheckSquare} label="To-Do" path="/todo" />
          <SidebarItem icon={Users} label="Contact" path="/contact" />
          <SidebarItem icon={FileText} label="Invoice" path="/invoice" />
          <SidebarItem icon={Layout} label="UI Elements" path="/ui-elements" />
          <SidebarItem icon={UsersRound} label="Team" path="/team" />
          <SidebarItem icon={Table} label="Table" path="/table" />
          <SidebarItem icon={Settings} label="Settings" path="/settings" />
          <SidebarItem icon={LogOut} label="Logout" path="/logout" />
        </div>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;