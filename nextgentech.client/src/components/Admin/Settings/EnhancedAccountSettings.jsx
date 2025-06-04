import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Edit2, Camera, Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from "sonner";
import EditModal from './EditModal';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from "../../../features/AxiosInstance/Auth/Auth";
import api from "../../../features/AxiosInstance/AxiosInstance";
import { Spin, Tabs } from 'antd';

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
  // API key for GHN (Giao Hang Nhanh)
  const apiKey = "a84f0896-7c1a-11ef-8e53-0a00184fe694";

  // Redux hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.user);

  // UI States
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form States
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    city: '',
    district: '',
    ward: '',
    avatarUrl: ''
  });
  const [tempProfileData, setTempProfileData] = useState({...profileData});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Location Data States
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  // Refs
  const fileInputRef = useRef(null);

  // Load User Data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        if (!userId) {
          throw new Error('User ID not found. Please login again.');
        }

        const response = await api.get(`/api/Account/GetUserById/${userId}`);

        if (!response || response.status !== 200) {
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }

        const userData = response.data;

        // Format the data for our component
        const formattedData = {
          fullName: userData.fullName || '',
          email: userData.email || '',
          phoneNumber: userData.phone || '',
          city: userData.city || '',
          district: userData.district || '',
          ward: userData.ward || '',
          avatarUrl: userData.avatarImageUrl || ''
        };

        console.log("Formatted user data:", formattedData);

        // Check for saved avatar in localStorage
        const savedAvatar = localStorage.getItem(`user_avatar_${userId}`);
        if (savedAvatar) {
          console.log("Found saved avatar in localStorage:", savedAvatar);
          formattedData.avatarUrl = savedAvatar;
        }

        setProfileData(formattedData);
        setTempProfileData(formattedData);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message);
        setLoading(false);
        toast.error(err.message || "Failed to load user profile");
      }
    };

    if (userId) {
      fetchUserData();
    } else {
      setError("User not logged in");
      setLoading(false);
    }
  }, [userId]);

  // Sync tempProfileData with profileData when modal opens
  useEffect(() => {
    if (isProfileModalOpen) {
      setTempProfileData({...profileData});
    }
  }, [isProfileModalOpen, profileData]);

  // Load Cities
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Token": apiKey
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch cities: ${response.status}`);
        }

        const data = await response.json();
        setCities(data.data || []);

        // Set selected city if profileData has city
        if (profileData.city) {
          setSelectedCity(profileData.city);
          fetchDistricts(profileData.city);
        }
      } catch (err) {
        console.error("Error fetching cities:", err);
        toast.error("Failed to load cities");
      }
    };

    fetchCities();
  }, [profileData.city, apiKey]);

  // Load Districts when City changes
  const fetchDistricts = async (cityCode) => {
    if (!cityCode) return;

    try {
      const response = await fetch("https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Token": apiKey
        },
        body: JSON.stringify({
          province_id: parseInt(cityCode)
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch districts: ${response.status}`);
      }

      const data = await response.json();
      setDistricts(data.data || []);

      // Set selected district if profileData has district
      if (profileData.district) {
        setSelectedDistrict(profileData.district);
        fetchWards(profileData.district);
      }
    } catch (err) {
      console.error("Error fetching districts:", err);
      toast.error("Failed to load districts");
    }
  };

  // Load Wards when District changes
  const fetchWards = async (districtCode) => {
    if (!districtCode) return;

    try {
      const response = await fetch("https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Token": apiKey
        },
        body: JSON.stringify({
          district_id: parseInt(districtCode)
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch wards: ${response.status}`);
      }

      const data = await response.json();
      setWards(data.data || []);

      // Set selected ward if profileData has ward
      if (profileData.ward) {
        setSelectedWard(profileData.ward);
      }
    } catch (err) {
      console.error("Error fetching wards:", err);
      toast.error("Failed to load wards");
    }
  };

  // Handle city change
  const handleCityChange = (e) => {
    const cityCode = e.target.value;
    setSelectedCity(cityCode);
    setSelectedDistrict('');
    setSelectedWard('');
    setTempProfileData({
      ...tempProfileData,
      city: cityCode,
      district: '',
      ward: ''
    });
    fetchDistricts(cityCode);
  };

  // Handle district change
  const handleDistrictChange = (e) => {
    const districtCode = e.target.value;
    setSelectedDistrict(districtCode);
    setSelectedWard('');
    setTempProfileData({
      ...tempProfileData,
      district: districtCode,
      ward: ''
    });
    fetchWards(districtCode);
  };

  // Handle ward change
  const handleWardChange = (e) => {
    const wardCode = e.target.value;
    setSelectedWard(wardCode);
    setTempProfileData({
      ...tempProfileData,
      ward: wardCode
    });
  };

  // Get location name by code
  const getLocationName = (code, type) => {
    if (!code) return "Not set";

    switch (type) {
      case "city":
        const city = cities.find(c => c.ProvinceID.toString() === code.toString());
        return city ? city.ProvinceName : code;
      case "district":
        const district = districts.find(d => d.DistrictID.toString() === code.toString());
        return district ? district.DistrictName : code;
      case "ward":
        const ward = wards.find(w => w.WardCode.toString() === code.toString());
        return ward ? ward.WardName : code;
      default:
        return code;
    }
  };

  // Handle file upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      toast.error("Chỉ chấp nhận file hình ảnh (jpg, jpeg, png)");
      return;
    }

    // Validate file size
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("File size exceeds 5MB limit");
      return;
    }

    try {
      // Create FormData to send the file
      const formData = new FormData();
      formData.append('file', file);

      // Call the upload API
      const response = await api.post('/api/Upload/UploadImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Get the image URL from the response
      const imageUrl = response.data.imageUrl;
      console.log("Uploaded image URL:", imageUrl);

      // Update the avatar URL in the temp profile data
      setTempProfileData(prev => ({
        ...prev,
        avatarUrl: imageUrl
      }));

      // Save URL to localStorage
      if (userId && imageUrl) {
        localStorage.setItem(`user_avatar_${userId}`, imageUrl);
        console.log("Saved avatar URL to localStorage:", imageUrl);
      }

      toast.success("Avatar uploaded successfully!");
    } catch (err) {
      console.error("Error uploading avatar:", err);
      toast.error("Unable to upload avatar. Please try again.");
    }
  };

  // Save profile changes
  const saveProfileChanges = async () => {
    try {
      if (!userId) {
        toast.error("User not identified. Please login again.");
        return;
      }

      // Prepare data for server - match EXACTLY the format that works in Swagger
      const payload = {
        fullName: tempProfileData.fullName || "",
        phone: tempProfileData.phoneNumber || "",
        district: tempProfileData.district || "",
        city: tempProfileData.city || "",
        ward: tempProfileData.ward || "",
        photoUrl: tempProfileData.avatarUrl || "" // Use photoUrl as shown in your Swagger example
      };

      // Log payload size for debugging
      const payloadSize = JSON.stringify(payload).length;
      console.log("Saving profile with payload:", payload);
      console.log("Payload size:", payloadSize, "characters");

      // If photoUrl is base64 and too large, truncate for logging
      if (payload.photoUrl && payload.photoUrl.startsWith('data:image')) {
        console.log("PhotoUrl is base64 image, length:", payload.photoUrl.length);
      }

      // Save avatar URL to localStorage to ensure it persists after page reload
      if (tempProfileData.avatarUrl) {
        localStorage.setItem(`user_avatar_${userId}`, tempProfileData.avatarUrl);
      }

      // Use the Admin-Update-info endpoint specifically for admin
      const response = await api.put(`api/Account/Admin-Update-info/${userId}`, payload);

      if (response && response.status === 200) {
        // Update the profile data state with the new values
        setProfileData({...tempProfileData});

        // Close the modal
        setIsProfileModalOpen(false);

        // Show success message
        toast.success("Personal information updated successfully!");
        console.log("Profile updated successfully with avatar:", tempProfileData.avatarUrl);
      } else {
        toast.error("Unable to update profile. Please try again.");
      }
    } catch (err) {
      console.error("Error in saveProfileChanges:", err);

      // Log all available error information for debugging
      console.log("Error response:", err.response);
      console.log("Error data:", err.response?.data);
      console.log("Error status:", err.response?.status);
      console.log("Error headers:", err.response?.headers);
      console.log("Error config:", err.config);

      // Show detailed error messages
      if (err.response) {
        const errorMessage = err.response.data?.customData?.message ||
                            err.response.data?.message ||
                            err.response.data?.status ||
                            "An error occurred while updating information.";
        toast.error(`Error: ${errorMessage}`);

        // Log the detailed error for debugging
        if (err.response.data?.customData?.details) {
          console.error("Error details:", err.response.data.customData.details);
        }

        // If it's a 500 error, show a more specific message
        if (err.response.status === 500) {
          toast.error("Internal server error. Please try again later or contact administrator.");
          console.error("Server error details:", err.response.data);
        }
      } else if (err.request) {
        toast.error("No response received from server.");
      } else {
        toast.error(`Error: ${err.message}`);
      }
    }
  };

  // Change password
  const changePassword = async () => {
    try {
      // Validate passwords
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        toast.error("Please fill in all password fields");
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error("New password and confirm password do not match.");
        return;
      }

      if (passwordData.newPassword.length < 6) {
        toast.error("New password must be at least 6 characters.");
        return;
      }

      const email = profileData.email;
      if (!email) {
        toast.error("Email not identified. Please try again.");
        return;
      }

      // Prepare data for server
      const payload = {
        email: email,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      };

      console.log("Changing password with payload:", { email, hasCurrentPwd: !!passwordData.currentPassword, hasNewPwd: !!passwordData.newPassword });

      // Call API to change password - use the same format as the User Settings component
      const response = await api.post("api/Account/ChangePassword", payload);

      if (response.status === 200) {
        // Reset password fields
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });

        // Close the modal
        setIsPasswordModalOpen(false);

        // Show success message
        toast.success("Password changed successfully!");
      } else {
        toast.error("Unable to change password");
      }
    } catch (err) {
      console.error("Error changing password:", err);
      console.log("Error details:", err.response?.data);

      if (err.response) {
        const errorMessage = err.response.data?.message || "Unable to change password";
        toast.error(`Error: ${errorMessage}`);

        // If there's a specific error about the current password
        if (errorMessage.includes("current password")) {
          toast.error("Current password is incorrect");
        }
      } else if (err.request) {
        toast.error("No response received from server");
      } else {
        toast.error(`Error: ${err.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Loading settings..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button
          onClick={() => navigate('/auth/login')}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Account Settings</h1>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <p className="text-gray-600">Manage your account information and security settings</p>
      </div>

      {/* Main Content */}
      <motion.div
        className="bg-white rounded-lg shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column - Avatar and Actions */}
            <div className="md:w-1/3 flex flex-col items-center">
              <motion.div
                className="w-40 h-40 rounded-full overflow-hidden bg-sky-500 flex-shrink-0 mb-6 border-4 border-white shadow-lg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <img
                  src={profileData.avatarUrl?.startsWith('/api')
                    ? `${api.defaults.baseURL}${profileData.avatarUrl}`
                    : (profileData.avatarUrl || "/lovable-uploads/ee6f74d2-cb92-47f8-9971-f947f6e0a573.png")}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/lovable-uploads/ee6f74d2-cb92-47f8-9971-f947f6e0a573.png";
                  }}
                />
              </motion.div>

              <motion.div
                className="space-y-3 w-full"
                variants={fadeIn}
                custom={1}
              >
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Edit2 size={16} />
                  <span>Edit Profile</span>
                </button>

                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Eye size={16} />
                  <span>Change Password</span>
                </button>
              </motion.div>
            </div>

            {/* Right Column - User Info */}
            <div className="md:w-2/3">
              <motion.h2
                className="text-xl font-semibold mb-4 text-gray-800"
                variants={fadeIn}
                custom={1.5}
              >
                Personal Information
              </motion.h2>

              {/* Account Info */}
              <div className="grid grid-cols-2 gap-x-16 gap-y-4 w-full">
                {[
                  { label: "Full Name", value: profileData.fullName },
                  { label: "Email", value: profileData.email },
                  { label: "Phone Number", value: profileData.phoneNumber },
                  { label: "City", value: getLocationName(profileData.city, "city") },
                  { label: "District", value: getLocationName(profileData.district, "district") },
                  { label: "Ward", value: getLocationName(profileData.ward, "ward") }
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
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hidden file input for avatar upload */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* Edit Profile Modal */}
      <EditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={saveProfileChanges}
        title="Edit Profile"
      >
        <div className="space-y-4">
          {/* Avatar Upload in Modal */}
          <div className="flex flex-col items-center mb-6">
            <div
              className="w-24 h-24 rounded-full overflow-hidden bg-sky-500 flex-shrink-0 relative group cursor-pointer mb-2"
              onClick={() => fileInputRef.current?.click()}
            >
              {/* Avatar Preview */}
              <img
                src={tempProfileData.avatarUrl?.startsWith('/api')
                  ? `${api.defaults.baseURL}${tempProfileData.avatarUrl}`
                  : (tempProfileData.avatarUrl || "/lovable-uploads/ee6f74d2-cb92-47f8-9971-f947f6e0a573.png")}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/lovable-uploads/ee6f74d2-cb92-47f8-9971-f947f6e0a573.png";
                }}
              />

              {/* Overlay with camera icon */}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={24} className="text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-500">Click to change avatar</p>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={tempProfileData.fullName || ''}
              onChange={(e) => setTempProfileData({...tempProfileData, fullName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={tempProfileData.phoneNumber || ''}
              onChange={(e) => setTempProfileData({...tempProfileData, phoneNumber: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City/Province
            </label>
            <select
              value={selectedCity}
              onChange={handleCityChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select City/Province</option>
              {cities.map(city => (
                <option key={city.ProvinceID} value={city.ProvinceID}>
                  {city.ProvinceName}
                </option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              District
            </label>
            <select
              value={selectedDistrict}
              onChange={handleDistrictChange}
              disabled={!selectedCity}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select District</option>
              {districts.map(district => (
                <option key={district.DistrictID} value={district.DistrictID}>
                  {district.DistrictName}
                </option>
              ))}
            </select>
          </div>

          {/* Ward */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ward
            </label>
            <select
              value={selectedWard}
              onChange={handleWardChange}
              disabled={!selectedDistrict}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select Ward</option>
              {wards.map(ward => (
                <option key={ward.WardCode} value={ward.WardCode}>
                  {ward.WardName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </EditModal>

      {/* Change Password Modal */}
      <EditModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSave={changePassword}
        title="Change Password"
      >
        <div className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword.current ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword({...showPassword, current: !showPassword.current})}
              >
                {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.new ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword({...showPassword, new: !showPassword.new})}
              >
                {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.confirm ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword({...showPassword, confirm: !showPassword.confirm})}
              >
                {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>
      </EditModal>
    </div>
  );
};

export default EnhancedAccountSettings;
