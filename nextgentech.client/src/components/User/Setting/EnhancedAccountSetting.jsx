import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Check, X, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from "sonner";
import EditModal from './EditModal';
import {cities, districts, wards} from "../Setting/location";
import SelectField from "../Select/Select";

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    })
  };

const EnhancedAccountSettings = () => {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [profileData, setProfileData] = useState({
    username: "Kevin.smith",
    fullName: "Kevin Gilbert",
    email: "Kevin.gilbert@example.com",
    phoneNumber: "+1 000-555-0139",
    city: "Hà Nội",
    district: "Ba Đình",
    ward: "Phường 1",
    state: "Dhaka",
    zipCode: "1207"
  });

  
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  
  const [tempProfileData, setTempProfileData] = useState({...profileData});


  useEffect(() => {
    setTempProfileData({...profileData});
  }, [profileData]);
  


  useEffect(() => {
    if (isProfileModalOpen) {
      setTempProfileData({...profileData});
    }
  }, [isProfileModalOpen, profileData]);
  


  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
  };

  const inputVariants = {
    focus: { scale: 1.01, boxShadow: "0 0 0 2px rgba(249, 115, 22, 0.2)" },
    blur: { scale: 1, boxShadow: "none" }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.03, transition: { duration: 0.2 } },
    tap: { scale: 0.98, transition: { duration: 0.2 } }
  };

  const openProfileModal = () => {
    setTempProfileData({...profileData});
    setIsProfileModalOpen(true);
  };

  const saveProfileChanges = () => {
    setProfileData({...tempProfileData});
    setIsProfileModalOpen(false);
    toast.success("Profile updated successfully!");
  };


  // Handle password change
const handlePasswordChange = (e) => {
    e.preventDefault();
    // Add password validation logic here
    toast.success("Password changed successfully!");
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      className="max-w-7xl mx-auto px-4 sm:px-6 py-12"
    >   
    <h1 className="text-xl font-bold mb-4 text-primary-600">USER PROFILE</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">  
        <motion.div 
          variants={fadeIn} 
          custom={1} 
          className="space-y-8"
        >
  <div className="flex flex-col bg-white rounded-xl shadow-lg p-8 md:p-12 items-start gap-6 relative">

  {/* Wrapper chứa Account Setting + Hình ảnh */}
  <div className="flex flex-col items-center">


    {/* Ảnh đại diện */}
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-24 h-24 rounded-full overflow-hidden bg-sky-500 flex-shrink-0"
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
    >
      <img 
        src="/lovable-uploads/ee6f74d2-cb92-47f8-9971-f947f6e0a573.png" 
        alt="Profile" 
        className="w-full h-full object-cover"
      />
    </motion.div>
  </div>

  {/* Thông tin tài khoản */}
  <div className="grid grid-cols-2 gap-x-16 gap-y-4 w-full">
  {[
    { label: "Username", value: profileData.username },
    { label: "Full Name", value: profileData.fullName },
    { label: "Email", value: profileData.email },
    { label: "Phone Number", value: profileData.phoneNumber },
    { label: "City", value: profileData.city},
    { label: "District", value: profileData.district},
    { label: "Ward", value: profileData.ward}
  ].map((item, index) => (
    <motion.div 
      key={item.label}
      variants={fadeIn}
      custom={index * 0.2 + 2}
      className="overflow-hidden"
    >
      <p className="text-sm text-gray-500">{item.label}</p>
      <p className="font-medium">{item.value}</p>
    </motion.div>
  ))}  
  </div>

  {/* Nút bấm ở dưới cùng */}
  <div className="flex gap-4 mt-6 justify-center w-full">
    <motion.button 
      onClick={openProfileModal}
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className="px-4 py-2 text-sm font-medium cursor-pointer text-white bg-gradient-to-br from-primary to-secondary rounded-md hover:bg-gradient-to-br hover:from-primary-600 hover:to-secondary-600 transition-colors flex items-center gap-2"
    >
      <Edit2 size={16} /> EDIT PROFILE
    </motion.button>

    <motion.button 
      // onClick={handleLogout} // Hàm logout
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className="px-4 py-2 text-sm font-medium cursor-pointer text-white bg-gradient-to-br from-primary to-secondary rounded-md hover:bg-gradient-to-br hover:from-primary-600 hover:to-secondary-600 transition-colors flex items-center gap-2"
    >
      <X size={16} /> LOG OUT
    </motion.button>
  </div>
</div>
  </motion.div>
  <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 w-150 mx-auto -mt-0">
  {/* Tiêu đề */}
      <motion.div 
        variants={fadeIn} 
        custom={5} 
        className="mt-16 max-w-xl mx-auto" // Căn giữa
      >
        <h2 className="text-lg font-medium mb-6 text-primary-600">CHANGE PASSWORD</h2>
        
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <motion.div variants={fadeIn} custom={5.1} className="relative">
            <label className="text-sm text-gray-500 block mb-1">Current Password</label>
            <div className="relative">
              <motion.input 
                variants={inputVariants}
                whileFocus="focus"
                animate="blur"
                type={showPassword.current ? "text" : "password"} 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-primary-500 transition-all duration-200"
                placeholder="••••••••••"
              />
              <motion.button 
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
              </motion.button>
            </div>
          </motion.div>
          
          <motion.div variants={fadeIn} custom={5.2} className="relative">
            <label className="text-sm text-gray-500 block mb-1">New Password</label>
            <div className="relative">
              <motion.input 
                variants={inputVariants}
                whileFocus="focus"
                animate="blur"
                type={showPassword.new ? "text" : "password"} 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-primary-500 transition-all duration-200"
                placeholder="8+ characters"
              />
              <motion.button 
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </motion.button>
            </div>
          </motion.div>
          
          <motion.div variants={fadeIn} custom={5.3} className="relative">
            <label className="text-sm text-gray-500 block mb-1">Confirm Password</label>
            <div className="relative">
              <motion.input 
                variants={inputVariants}
                whileFocus="focus"
                animate="blur"
                type={showPassword.confirm ? "text" : "password"} 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-primary-500 transition-all duration-200"
                placeholder="8+ characters"
              />
              <motion.button 
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </motion.button>
            </div>
          </motion.div>
          
          <motion.button 
            type="submit"
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className="px-4 py-2 text-sm cursor-pointer font-medium text-white bg-gradient-to-br from-primary to-secondary rounded-md hover:bg-gradient-to-br hover:from-primary-600 hover:to-secondary-600 transition-colors"
          >
            CHANGE PASSWORD
          </motion.button>
        </form>
      </motion.div>
      </div>
  </div>
      
      
      <EditModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={saveProfileChanges}
        title="Edit Profile"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500 block mb-1">Username</label>
            <input 
              type="text" 
              value={tempProfileData.username}
              onChange={(e) => setTempProfileData({...tempProfileData, username: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500"
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-500 block mb-1">Full Name</label>
            <input 
              type="text" 
              value={tempProfileData.fullName}
              onChange={(e) => setTempProfileData({...tempProfileData, fullName: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500"
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-500 block mb-1">Email</label>
            <input 
              type="email" 
              value={tempProfileData.email}
              onChange={(e) => setTempProfileData({...tempProfileData, email: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500"
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-500 block mb-1">Phone Number</label>
            <input 
              type="tel" 
              value={tempProfileData.phoneNumber}
              onChange={(e) => setTempProfileData({...tempProfileData, phoneNumber: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500"
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-500 block mb-1">City</label>
            <SelectField    
              options={cities}
              value={tempProfileData.city}
              onChange={(e) => setTempProfileData({...tempProfileData, city: e.target.value})}
            />
          </div>

          <div>
            <label className="text-sm text-gray-500 block mb-1">District</label>
            <SelectField
              options={districts}
              value={tempProfileData.district}
              onChange={(e) => setTempProfileData({...tempProfileData, district: e.target.value})}
            />
          </div>

          <div>
            <label className="text-sm text-gray-500 block mb-1">Ward</label>
            <SelectField
              options={wards}
              value={tempProfileData.ward}
              onChange={(e) => setTempProfileData({...tempProfileData, ward: e.target.value})}
            />
          </div>


          
        </div>
      </EditModal>

      

      
    </motion.div>
  );
};

export default EnhancedAccountSettings;
