import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Check, X, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from "sonner";
import EditModal from './EditModal';

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
    displayName: "Kevin",
    username: "Kevin.smith",
    fullName: "Kevin Gilbert",
    email: "Kevin.gilbert@example.com",
    secondaryEmail: "kevin123@example.com",
    phoneNumber: "+1 000-555-0139",
    country: "Bangladesh",
    state: "Dhaka",
    zipCode: "1207"
  });

  const [billingAddress, setBillingAddress] = useState({
    firstName: "Kevin",
    lastName: "Gilbert",
    companyName: "",
    address: "Road No. 12, House no-1000/C, Flat No. 10",
    country: "Bangladesh",
    state: "Dhaka",
    city: "Dhaka",
    zipCode: "1207",
    email: "kevin123@example.com",
    phoneNumber: "+1 000-555-0139"
  });

  const [shippingAddress, setShippingAddress] = useState({
    firstName: "Kevin",
    lastName: "Gilbert",
    companyName: "",
    address: "Road No. 12, House no-1000/C, Flat No. 10",
    country: "Bangladesh",
    state: "Dhaka",
    city: "Dhaka",
    zipCode: "1207",
    email: "kevin123@example.com",
    phoneNumber: "+1 000-555-0139"
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  
  const [tempProfileData, setTempProfileData] = useState({...profileData});
  const [tempBillingAddress, setTempBillingAddress] = useState({...billingAddress});
  const [tempShippingAddress, setTempShippingAddress] = useState({...shippingAddress});

  useEffect(() => {
    setTempProfileData({...profileData});
  }, [profileData]);
  
  useEffect(() => {
    setTempBillingAddress({...billingAddress});
  }, [billingAddress]);
  
  useEffect(() => {
    setTempShippingAddress({...shippingAddress});
  }, [shippingAddress]);

  useEffect(() => {
    if (isProfileModalOpen) {
      setTempProfileData({...profileData});
    }
  }, [isProfileModalOpen, profileData]);
  
  useEffect(() => {
    if (isBillingModalOpen) {
      setTempBillingAddress({...billingAddress});
    }
  }, [isBillingModalOpen, billingAddress]);
  
  useEffect(() => {
    if (isShippingModalOpen) {
      setTempShippingAddress({...shippingAddress});
    }
  }, [isShippingModalOpen, shippingAddress]);

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

  const openBillingModal = () => {
    setTempBillingAddress({...billingAddress});
    setIsBillingModalOpen(true);
  };

  const saveBillingChanges = () => {
    setBillingAddress({...tempBillingAddress});
    setIsBillingModalOpen(false);
    toast.success("Billing address updated successfully!");
  };

  const openShippingModal = () => {
    setTempShippingAddress({...shippingAddress});
    setIsShippingModalOpen(true);
  };

  const saveShippingChanges = () => {
    setShippingAddress({...tempShippingAddress});
    setIsShippingModalOpen(false);
    toast.success("Shipping address updated successfully!");
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
      
      
     
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        

        <motion.div 
          variants={fadeIn} 
          custom={1} 
          className="space-y-8"
        >
          <div className="flex flex-col bg-white rounded-xl shadow-lg p-8 md:p-12 sm:flex-row items-start sm:items-center gap-6">
  
  {/* Wrapper chứa Account Setting + Hình ảnh */}
  <div className="flex flex-col items-center">
    {/* Tiêu đề */}
    <motion.h1 
      variants={fadeIn} 
      custom={0} 
      className="text-l font-semibold mb-4 "
    >
      ACCOUNT SETTING
    </motion.h1>

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
  <div className="grid grid-cols-2 gap-x-16 gap-y-4 flex-grow">
    {[
      { label: "Display name", value: profileData.displayName },
      { label: "Username", value: profileData.username },
      { label: "Full Name", value: profileData.fullName },
      { label: "Email", value: profileData.email },
      { label: "Secondary Email", value: profileData.secondaryEmail },
      { label: "Phone Number", value: profileData.phoneNumber },
      { label: "Country/Region", value: profileData.country }
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

    <div className="grid grid-cols-2 col-span-2 gap-4">
      <motion.div variants={fadeIn} custom={4}>
        <p className="text-sm text-gray-500">State</p>
        <p className="font-medium">{profileData.state}</p>
      </motion.div>
      
      <motion.div variants={fadeIn} custom={4.2}>
        <p className="text-sm text-gray-500">Zip Code</p>
        <p className="font-medium">{profileData.zipCode}</p>
      </motion.div>
    </div>
  </div>

</div>
          
<div className="flex gap-4">
  <motion.button 
    onClick={openProfileModal}
    variants={buttonVariants}
    initial="initial"
    whileHover="hover"
    whileTap="tap"
    className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 transition-colors flex items-center gap-2"
  >
    <Edit2 size={16} /> EDIT PROFILE
  </motion.button>

  <motion.button 
    // onClick={handleLogout} // Hàm logout
    variants={buttonVariants}
    initial="initial"
    whileHover="hover"
    whileTap="tap"
    className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors flex items-center gap-2"
  >
    <X size={16} /> LOG OUT
  </motion.button>
</div>
        </motion.div>
        
        <motion.div 
          variants={fadeIn} 
          custom={2} 
          className="space-y-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              variants={fadeIn} 
              custom={2.2} 
              className="space-y-6"
            >
              <h2 className="text-lg font-medium">BILLING ADDRESS</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <motion.div variants={fadeIn} custom={2.3}>
                  <p className="text-sm text-gray-500">First Name</p>
                  <p className="font-medium">{billingAddress.firstName}</p>
                </motion.div>
                
                <motion.div variants={fadeIn} custom={2.4}>
                  <p className="text-sm text-gray-500">Last Name</p>
                  <p className="font-medium">{billingAddress.lastName}</p>
                </motion.div>
              </div>
              
              <motion.div variants={fadeIn} custom={2.5}>
                <p className="text-sm text-gray-500">Company Name <span className="text-gray-400">(Optional)</span></p>
                <p className="font-medium">{billingAddress.companyName || "-"}</p>
              </motion.div>
              
              <motion.div variants={fadeIn} custom={2.6}>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{billingAddress.address}</p>
              </motion.div>
              
              <motion.div variants={fadeIn} custom={2.7}>
                <p className="text-sm text-gray-500">Country</p>
                <p className="font-medium">{billingAddress.country}</p>
              </motion.div>
              
              <motion.div variants={fadeIn} custom={2.8}>
                <p className="text-sm text-gray-500">Region/State</p>
                <p className="font-medium">{billingAddress.state}</p>
              </motion.div>
              
              <div className="grid grid-cols-2 gap-4">
                <motion.div variants={fadeIn} custom={2.9}>
                  <p className="text-sm text-gray-500">City</p>
                  <p className="font-medium">{billingAddress.city}</p>
                </motion.div>
                
                <motion.div variants={fadeIn} custom={3.0}>
                  <p className="text-sm text-gray-500">Zip Code</p>
                  <p className="font-medium">{billingAddress.zipCode}</p>
                </motion.div>
              </div>
              
              <motion.div variants={fadeIn} custom={3.1}>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{billingAddress.email}</p>
              </motion.div>
              
              <motion.div variants={fadeIn} custom={3.2}>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium">{billingAddress.phoneNumber}</p>
              </motion.div>
              
              <motion.button 
                onClick={openBillingModal}
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 transition-colors flex items-center gap-2"
              >
                <Edit2 size={16} /> EDIT BILLING
              </motion.button>
            </motion.div>
            
            <motion.div 
              variants={fadeIn} 
              custom={3.3} 
              className="space-y-6"
            >
              <h2 className="text-lg font-medium">SHIPPING ADDRESS</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <motion.div variants={fadeIn} custom={3.4}>
                  <p className="text-sm text-gray-500">First Name</p>
                  <p className="font-medium">{shippingAddress.firstName}</p>
                </motion.div>
                
                <motion.div variants={fadeIn} custom={3.5}>
                  <p className="text-sm text-gray-500">Last Name</p>
                  <p className="font-medium">{shippingAddress.lastName}</p>
                </motion.div>
              </div>
              
              <motion.div variants={fadeIn} custom={3.6}>
                <p className="text-sm text-gray-500">Company Name <span className="text-gray-400">(Optional)</span></p>
                <p className="font-medium">{shippingAddress.companyName || "-"}</p>
              </motion.div>
              
              <motion.div variants={fadeIn} custom={3.7}>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{shippingAddress.address}</p>
              </motion.div>
              
              <motion.div variants={fadeIn} custom={3.8}>
                <p className="text-sm text-gray-500">Country</p>
                <p className="font-medium">{shippingAddress.country}</p>
              </motion.div>
              
              <motion.div variants={fadeIn} custom={3.9}>
                <p className="text-sm text-gray-500">Region/State</p>
                <p className="font-medium">{shippingAddress.state}</p>
              </motion.div>
              
              <div className="grid grid-cols-2 gap-4">
                <motion.div variants={fadeIn} custom={4.0}>
                  <p className="text-sm text-gray-500">City</p>
                  <p className="font-medium">{shippingAddress.city}</p>
                </motion.div>
                
                <motion.div variants={fadeIn} custom={4.1}>
                  <p className="text-sm text-gray-500">Zip Code</p>
                  <p className="font-medium">{shippingAddress.zipCode}</p>
                </motion.div>
              </div>
              
              <motion.div variants={fadeIn} custom={4.2}>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{shippingAddress.email}</p>
              </motion.div>
              
              <motion.div variants={fadeIn} custom={4.3}>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium">{shippingAddress.phoneNumber}</p>
              </motion.div>
              
              <motion.button 
                onClick={openShippingModal}
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 transition-colors flex items-center gap-2"
              >
                <Edit2 size={16} /> EDIT SHIPPING
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        variants={fadeIn} 
        custom={5} 
        className="mt-16 max-w-xl mx-auto" // Căn giữa
      >
        <h2 className="text-lg font-medium mb-6">CHANGE PASSWORD</h2>
        
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <motion.div variants={fadeIn} custom={5.1} className="relative">
            <label className="text-sm text-gray-500 block mb-1">Current Password</label>
            <div className="relative">
              <motion.input 
                variants={inputVariants}
                whileFocus="focus"
                animate="blur"
                type={showPassword.current ? "text" : "password"} 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-orange-500 transition-all duration-200"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-orange-500 transition-all duration-200"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-orange-500 transition-all duration-200"
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
            className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 transition-colors"
          >
            CHANGE PASSWORD
          </motion.button>
        </form>
      </motion.div>

      <EditModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={saveProfileChanges}
        title="Edit Profile"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500 block mb-1">Display Name</label>
            <input 
              type="text" 
              value={tempProfileData.displayName}
              onChange={(e) => setTempProfileData({...tempProfileData, displayName: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500"
            />
          </div>
          
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
            <label className="text-sm text-gray-500 block mb-1">Secondary Email</label>
            <input 
              type="email" 
              value={tempProfileData.secondaryEmail}
              onChange={(e) => setTempProfileData({...tempProfileData, secondaryEmail: e.target.value})}
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
            <label className="text-sm text-gray-500 block mb-1">Country/Region</label>
            <input 
              type="text" 
              value={tempProfileData.country}
              onChange={(e) => setTempProfileData({...tempProfileData, country: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500 block mb-1">State</label>
              <input 
                type="text" 
                value={tempProfileData.state}
                onChange={(e) => setTempProfileData({...tempProfileData, state: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500"
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-500 block mb-1">Zip Code</label>
              <input 
                type="text" 
                value={tempProfileData.zipCode}
                onChange={(e) => setTempProfileData({...tempProfileData, zipCode: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500"
              />
            </div>
          </div>
        </div>
      </EditModal>

      <EditModal 
        isOpen={isBillingModalOpen}
        onClose={() => setIsBillingModalOpen(false)}
        onSave={saveBillingChanges}
        title="Edit Billing Address"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500 block mb-1">First Name</label>
              <input 
                type="text" 
                value={tempBillingAddress.firstName}
                onChange={(e) => setTempBillingAddress({...tempBillingAddress, firstName: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500"
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-500 block mb-1">Last Name</label>
              <input 
                type="text" 
                value={tempBillingAddress.lastName}
                onChange={(e) => setTempBillingAddress({...tempBillingAddress, lastName: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500"
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm text-gray-500 block mb-1">Company Name <span className="text-gray-400">(Optional)</span></label>
            <input 
              type="text" 
              value={tempBillingAddress.companyName}
              onChange={(e) => setTempBillingAddress({...tempBillingAddress, companyName: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500"
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-500 block mb-1">Address</label>
            <input 
              type="text" 
              value={tempBillingAddress.address}
              onChange={(e) => setTempBillingAddress({...tempBillingAddress, address: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500"
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-500 block mb-1">Country</label>
            <input 
              type="text" 
              value={tempBillingAddress.country}
              onChange={(e) => setTempBillingAddress({...tempBillingAddress, country: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500"
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-500 block mb-1">Region/State</label>
            <input 
              type="text" 
              value={tempBillingAddress.state}
              onChange={(e) => setTempBillingAddress({...tempBillingAddress, state: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500 block mb-1">City</label>
              <input 
                type="text" 
                value={tempBillingAddress.city}
                onChange={(e) => setTempBillingAddress({...tempBillingAddress, city: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500"
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-500 block mb-1">Zip Code</label>
              <input 
                type="text" 
                value={tempBillingAddress.zipCode}
                onChange={(e) => setTempBillingAddress({...tempBillingAddress, zipCode: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500"
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm text-gray-500 block mb-1">Email</label>
            <input 
              type="email" 
              value={tempBillingAddress.email}
              onChange={(e) => setTempBillingAddress({...tempBillingAddress, email: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500"
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-500 block mb-1">Phone Number</label>
            <input 
              type="tel" 
              value={tempBillingAddress.phoneNumber}
              onChange={(e) => setTempBillingAddress({...tempBillingAddress, phoneNumber: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500"
            />
          </div>
        </div>
      </EditModal>

      <EditModal 
        isOpen={isShippingModalOpen}
        onClose={() => setIsShippingModalOpen(false)}
        onSave={saveShippingChanges}
        title="Edit Shipping Address"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500 block mb-1">First Name</label>
              <input 
                type="text" 
                value={tempShippingAddress.firstName}
                onChange={(e) => setTempShippingAddress({...tempShippingAddress, firstName: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500"
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-500 block mb-1">Last Name</label>
              <input 
                type="text" 
                value={tempShippingAddress.lastName}
                onChange={(e) => setTempShippingAddress({...tempShippingAddress, lastName: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500"
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm text-gray-500 block mb-1">Company Name <span className="text-gray-400">(Optional)</span></label>
            <input 
              type="text" 
              value={tempShippingAddress.companyName}
              onChange={(e) => setTempShippingAddress({...tempShippingAddress, companyName: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500"
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-500 block mb-1">Address</label>
            <input 
              type="text" 
              value={tempShippingAddress.address}
              onChange={(e) => setTempShippingAddress({...tempShippingAddress, address: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500"
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-500 block mb-1">Country</label>
            <input 
              type="text" 
              value={tempShippingAddress.country}
              onChange={(e) => setTempShippingAddress({...tempShippingAddress, country: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500"
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-500 block mb-1">Region/State</label>
            <input 
              type="text" 
              value={tempShippingAddress.state}
              onChange={(e) => setTempShippingAddress({...tempShippingAddress, state: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500 block mb-1">City</label>
              <input 
                type="text" 
                value={tempShippingAddress.city}
                onChange={(e) => setTempShippingAddress({...tempShippingAddress, city: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500"
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-500 block mb-1">Zip Code</label>
              <input 
                type="text" 
                value={tempShippingAddress.zipCode}
                onChange={(e) => setTempShippingAddress({...tempShippingAddress, zipCode: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500"
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm text-gray-500 block mb-1">Email</label>
            <input 
              type="email" 
              value={tempShippingAddress.email}
              onChange={(e) => setTempShippingAddress({...tempShippingAddress, email: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500"
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-500 block mb-1">Phone Number</label>
            <input 
              type="tel" 
              value={tempShippingAddress.phoneNumber}
              onChange={(e) => setTempShippingAddress({...tempShippingAddress, phoneNumber: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500"
            />
          </div>
        </div>
      </EditModal>
    </motion.div>
  );
};

export default EnhancedAccountSettings;
