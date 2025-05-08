import React from "react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../../features/AxiosInstance/AxiosInstance";
// import { Button, TextInput } from "flowbite-react";

const verifyCodeBgImage =
  "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&w=800&q=75";

const VerifyCode = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState("");
  const email = searchParams.get("email") || "";
  const type = searchParams.get("type") || "reset"; // 'reset' or 'signup'

  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // Thông báo thành công
  const [isResending, setIsResending] = useState(false); // Trạng thái gửi lại mã
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const response = await api.post("api/Account/verify-code", {
        email,
        code,
      });

      if (response.status === 200 && response.data.status === "success") {
        setMessage("Xác minh thành công!");

        // Điều hướng và lưu trữ thông tin
        if (type === "reset") {
          sessionStorage.setItem("email", email);
          navigate("/auth/reset-password");
        } else {
          // Lấy password từ sessionStorage và tạo username ngẫu nhiên
          const password = sessionStorage.getItem("signupPassword");
          setMessage("Đang tạo tài khoản...");
          // Gọi API đăng ký người dùng
          const registerResponse = await api.post("api/Account/register", {
            email,
            password,
          });

          if (registerResponse.status === 200) {
            navigate("/auth/login");
          } else {
            setError(
              registerResponse.data.message || "Đăng ký không thành công."
            );
          }
        }
      } else {
        setError(response.data.message || "Mã xác minh không chính xác.");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }

    // if (type === "reset") {
    //   navigate("/auth/reset-password");
    // } else {
    //   navigate("/auth/login");
    // }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setIsResending(true);
    setError("");
    setMessage("");

    try {
      const response = await api.post(
        `api/account/send-verification-code/${encodeURIComponent(email)}`
      );

      if (response.status === 200 && response.data.status === "success") {
        setMessage("Mã xác minh đã được gửi lại thành công.");
      } else {
        setError(response.data.message || "Không thể gửi lại mã.");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại."
      );
    } finally {
      setIsResending(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative">
      <div className="hidden lg:block lg:w-1/2 relative">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-coffee-200 animate-pulse" />
        )}
        <img
          src={verifyCodeBgImage}
          alt="Verify code background"
          loading="eager"
          onLoad={() => setImageLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/25" />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-cream">
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
              Nhập mã xác nhận
            </h2>
            <p className="mt-2 text-sm text-coffee-600">
              Chúng tôi đã gửi mã tới {email}
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="flex justify-center">
              <input
                type="number"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}
            {message && (
              <p className="text-sm text-green-600 text-center">{message}</p>
            )}
            <button
              type="submit"
              className={`w-full h-full p-3 text-sm rounded-xl text-white ${
                code.length === 6
                  ? "bg-primary-600 hover:bg-primary-700"
                  : "bg-gray-400"
              }`}
              disabled={code.length !== 6 || isLoading}
            >
              {isLoading ? "Đang xác minh..." : "Xác nhận"}
            </button>

            <p className="text-center text-sm text-primary-600">
              Không nhận được code?{" "}
              <button
                type="button"
                disabled={isResending}
                onClick={handleResendCode}
                className={`text-primary-800 hover:text-primary-900 underline ${
                  isResending ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isResending ? "Đang gửi lại mã..." : "Gửi lại mã"}
              </button>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyCode;
