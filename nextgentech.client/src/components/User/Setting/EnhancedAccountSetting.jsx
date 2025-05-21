import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Edit2, X, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from "sonner";
import EditModal from './EditModal';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from "../../../features/AxiosInstance/Auth/Auth";
import api from "../../../features/AxiosInstance/AxiosInstance";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Profile Data
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    city: "",
    district: "",
    ward: "",
    avatarUrl: "/lovable-uploads/ee6f74d2-cb92-47f8-9971-f947f6e0a573.png", // Default avatar
  });
  const [tempProfileData, setTempProfileData] = useState({...profileData});

  // File upload state
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [imageChanged, setImageChanged] = useState(false);

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Location States
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // Load User Data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        if (!userId) {
          throw new Error('User ID not found. Please login again.');
        }

        const response = await api.get(`api/account/GetUserById/${userId}`);

        if (!response || response.status !== 200) {
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }

        const userData = response.data;

        console.log("Fetched user data:", userData);

        // Map the API response to component state
        const formattedData = {
          fullName: userData.fullName || "",
          email: userData.email || "",
          phoneNumber: userData.phone || "",
          city: userData.city || "",
          district: userData.district || "",
          ward: userData.ward || "",
          avatarUrl: userData.avatarImageUrl || "/lovable-uploads/ee6f74d2-cb92-47f8-9971-f947f6e0a573.png", // Use user's avatar or default
        };

        console.log("Formatted user data:", formattedData);

        // Kiểm tra xem có ảnh đại diện đã lưu trong localStorage không
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

  // Fetch cities
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(
          "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Token: apiKey,
            },
          }
        );
        const data = await response.json();

        if (data && data.data) {
          setCities(data.data);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
        toast.error("Failed to load cities");
      }
    };

    fetchCities();
  }, []);

  // Fetch districts when city changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!tempProfileData.city) return;

      try {
        const response = await fetch(
          "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Token: apiKey,
            },
            body: JSON.stringify({ province_id: parseInt(tempProfileData.city) }),
          }
        );
        const data = await response.json();

        if (data && data.data) {
          setDistricts(data.data);
        }
      } catch (error) {
        console.error("Error fetching districts:", error);
        toast.error("Failed to load districts");
      }
    };

    fetchDistricts();
  }, [tempProfileData.city]);

  // Fetch wards when district changes
  useEffect(() => {
    const fetchWards = async () => {
      if (!tempProfileData.district) return;

      try {
        const response = await fetch(
          "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Token: apiKey,
            },
            body: JSON.stringify({ district_id: parseInt(tempProfileData.district) }),
          }
        );
        const data = await response.json();

        if (data && data.data) {
          setWards(data.data);
        }
      } catch (error) {
        console.error("Error fetching wards:", error);
        toast.error("Failed to load wards");
      }
    };

    fetchWards();
  }, [tempProfileData.district]);

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
  };

  // Animation variants
  const inputVariants = {
    focus: { scale: 1.01, boxShadow: "0 0 0 2px rgba(249, 115, 22, 0.2)" },
    blur: { scale: 1, boxShadow: "none" }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.03, transition: { duration: 0.2 } },
    tap: { scale: 0.98, transition: { duration: 0.2 } }
  };

  // Open profile modal
  const openProfileModal = () => {
    setTempProfileData({...profileData});
    setIsProfileModalOpen(true);
  };

  // Handle avatar upload
  const handleAvatarUpload = async (file) => {
    try {
      setIsUploading(true);

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

      // Đánh dấu là ảnh đã được thay đổi
      setImageChanged(true);

      // Cập nhật luôn profileData để hiển thị ảnh mới ngay lập tức
      setProfileData(prev => ({
        ...prev,
        avatarUrl: imageUrl
      }));

      // Lưu URL ảnh vào localStorage để đảm bảo nó được giữ lại sau khi tải lại trang
      if (userId && imageUrl) {
        localStorage.setItem(`user_avatar_${userId}`, imageUrl);
        console.log("Saved avatar URL to localStorage:", imageUrl);
      }

      // Hiển thị ảnh đã tải lên
      const previewUrl = imageUrl.startsWith('/api')
        ? `${api.defaults.baseURL}${imageUrl}`
        : imageUrl;

      console.log("Preview URL:", previewUrl);

      toast.success("Tải ảnh đại diện lên thành công");
      return imageUrl;
    } catch (error) {
      console.error("Lỗi khi tải ảnh lên:", error);
      toast.error("Không thể tải ảnh lên: " + (error.response?.data || error.message));
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file selection
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      toast.error("Chỉ chấp nhận file hình ảnh (jpg, jpeg, png)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước file không được vượt quá 5MB");
      return;
    }

    // Upload the file
    await handleAvatarUpload(file);
  };

  // Save profile changes
  const saveProfileChanges = async () => {
    try {
      if (!userId) {
        toast.error("User không được xác định. Vui lòng đăng nhập lại.");
        return;
      }

      // Chuẩn bị dữ liệu gửi lên server
      const payload = {
        fullName: tempProfileData.fullName || "",
        phone: tempProfileData.phoneNumber || "",
        district: tempProfileData.district || "",
        city: tempProfileData.city || "",
        ward: tempProfileData.ward || "",
        photoUrl: tempProfileData.avatarUrl || "" // Sử dụng URL ảnh đã cập nhật
      };

      console.log("Saving profile with avatar URL:", tempProfileData.avatarUrl);

      // Lưu URL ảnh vào localStorage để đảm bảo nó được giữ lại sau khi tải lại trang
      if (tempProfileData.avatarUrl) {
        localStorage.setItem(`user_avatar_${userId}`, tempProfileData.avatarUrl);
      }

      const response = await api.put(`api/Account/Update-info/${userId}`, payload);

      if (response && response.status === 200) {
        // Cập nhật dữ liệu hồ sơ với thông tin mới
        setProfileData({...tempProfileData});

        // Đóng modal
        setIsProfileModalOpen(false);

        // Hiển thị thông báo thành công
        toast.success("Hồ sơ đã được cập nhật thành công!");

        console.log("Profile updated successfully with avatar:", tempProfileData.avatarUrl);
      } else {
        toast.error("Không thể cập nhật hồ sơ. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Error in saveProfileChanges:", err);

      // Show detailed error messages
      if (err.response) {
        toast.error(`Lỗi: ${err.response.data?.message || "Đã xảy ra lỗi."}`);
      } else if (err.request) {
        toast.error("Không nhận được phản hồi từ server.");
      } else {
        toast.error(`Lỗi: ${err.message}`);
      }
    }
  };

  // Handle password form changes
  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value
    });
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    // Validate passwords
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng điền đầy đủ tất cả các trường mật khẩu");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới không khớp");
      return;
    }

    try {
      const email = profileData.email;

      if (!email) {
        toast.error("Email không được xác định. Vui lòng thử lại.");
        return;
      }

      const response = await api.post("/api/Account/ChangePassword", {
        email: email,
        currentPassword: currentPassword,
        newPassword: newPassword,
      });

      if (response.status === 200) {
        toast.success("Đổi mật khẩu thành công!");
        // Reset the form
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        toast.error("Không thể đổi mật khẩu");
      }
    } catch (err) {
      console.error("Lỗi khi đổi mật khẩu:", err);

      if (err.response) {
        toast.error(`Lỗi: ${err.response.data?.message || "Không thể đổi mật khẩu"}`);
      } else if (err.request) {
        toast.error("Không nhận được phản hồi từ máy chủ");
      } else {
        toast.error(`Lỗi: ${err.message}`);
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    // dispatch(clearCart()); // Uncomment if needed
    navigate("/login");
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          <p className="font-medium">Error loading profile</p>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Format location for display
  const getLocationName = (id, locationType) => {
    if (!id) return "";

    switch (locationType) {
      case "city":
        const city = cities.find(c => c.ProvinceID === parseInt(id));
        return city ? city.ProvinceName : id;
      case "district":
        const district = districts.find(d => d.DistrictID === parseInt(id));
        return district ? district.DistrictName : id;
      case "ward":
        const ward = wards.find(w => w.WardCode === id.toString());
        return ward ? ward.WardName : id;
      default:
        return id;
    }
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
            {/* Profile Image */}
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-24 h-24 rounded-full overflow-hidden bg-sky-500 flex-shrink-0 relative group cursor-pointer"
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                onClick={() => fileInputRef.current?.click()}
              >
                {/* Avatar Image */}
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

                {/* Overlay with camera icon on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={24} className="text-white" />
                </div>

                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileSelect}
                />
              </motion.div>
              <p className="text-xs text-gray-500 mt-2">Click to change avatar</p>
            </div>

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

            {/* Buttons */}
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
                onClick={handleLogout}
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

        {/* Password Change Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 w-150 mx-auto -mt-0">
          <motion.div
            variants={fadeIn}
            custom={5}
            className="mt-16 max-w-xl mx-auto"
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
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordFormChange}
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
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordFormChange}
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
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordFormChange}
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
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={24} className="text-white" />
              </div>

              {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">Click to change avatar</p>
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
              disabled // Email shouldn't be editable
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
            <select
              value={tempProfileData.city}
              onChange={(e) => setTempProfileData({...tempProfileData, city: e.target.value, district: "", ward: ""})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500"
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.ProvinceID} value={city.ProvinceID}>
                  {city.ProvinceName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-500 block mb-1">District</label>
            <select
              value={tempProfileData.district}
              onChange={(e) => setTempProfileData({...tempProfileData, district: e.target.value, ward: ""})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500"
              disabled={!tempProfileData.city}
            >
              <option value="">Select District</option>
              {districts.map((district) => (
                <option key={district.DistrictID} value={district.DistrictID}>
                  {district.DistrictName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-500 block mb-1">Ward</label>
            <select
              value={tempProfileData.ward}
              onChange={(e) => setTempProfileData({...tempProfileData, ward: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500"
              disabled={!tempProfileData.district}
            >
              <option value="">Select Ward</option>
              {wards.map((ward) => (
                <option key={ward.WardCode} value={ward.WardCode}>
                  {ward.WardName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </EditModal>
    </motion.div>
  );
};

export default EnhancedAccountSettings;