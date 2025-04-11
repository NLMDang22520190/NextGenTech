import React, { useState } from "react";
import { UseState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

const forgotPasswordBgImage =
  "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&w=800&q=75";

const ForgorPassword = () => {
    const navigate = useNavigate();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        setIsLoading(true);
    }



    return (
        <div className="min-h-screen flex relative">
          <div className="hidden lg:block lg:w-1/2 relative">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-coffee-200 animate-pulse" />
            )}
            <img
              src={forgotPasswordBgImage}
              alt="Forgot password background"
              loading="eager"
              onLoad={() => setImageLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/25" />
          </div>
    
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-cream">
            {!isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <h2 className="text-3xl font-bold text-primary-800">
                    Cài lại mật khẩu
                  </h2>
                  <p className="mt-2 text-sm text-primary-600">
                    Vui lòng nhập email để nhận mã xác nhận
                  </p>
                </motion.div>
    
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  onSubmit={handleSubmit}
                  className="mt-8 space-y-6"
                >
                  <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Nhập email..."
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                      />

                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="w-full p-3 text-sm h-full rounded-xl text-white bg-primary-600 hover:bg-primary-700"
                  >
                    {isLoading ? "Đang xử lý..." : "Gửi mã"}
                  </button>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-center text-sm text-gray-700 mt-4"
                    >
                      Đang gửi mã xác minh, vui lòng đợi...
                    </motion.div>
                  )}
    
                  <p className="text-center text-sm">
                    Đã nhớ mật khẩu?{" "}
                    <Link
                      to="/auth/login"
                      className="text-primary-600 hover:text-primary-800 transition-colors"
                    >
                      Đăng nhập
                    </Link>
                  </p>
                </motion.form>
              </motion.div>
            ) : (
              <div className="text-center space-y-4">
                <div className="text-green-500 text-5xl mb-4">✓</div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Kiểm tra email của bạn
                </h3>
                <p className="text-sm text-gray-600">
                  Chúng tôi đã gửi mã xác minh đến email của bạn.
                </p>
                <p className="text-sm text-gray-500">
                  Đang chuyển hướng đến trang xác minh trong vài giây...
                </p>
              </div>
            )}
          </div>
        </div>
      );
};

export default ForgorPassword;