import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import LeftPanel from "../../components/Auth/LeftPanel";
import RightPanel from "../../components/Auth/RightPanel";
import api from "../../../src/features/AxiosInstance/AxiosInstance";

const SignUp = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values) => {
    const { email, username, password, confirmPassword } = values;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      message.error(
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
      );
      return;
    }

    if (password !== confirmPassword) {
      message.error("Mật khẩu không khớp");
      return;
    }

    setIsLoading(true);

    // Save email and password to sessionStorage
    sessionStorage.setItem("signupPassword", password);

    try {
      const response = await api.post(
        `api/Account/send-verification-code/${encodeURIComponent(email)}`
      );
      if (response.status === 200 && response.data.status === "success") {
        message.success("Mã xác thực đã được gửi đến email của bạn!");
        // Redirect to VerifyCode page
        navigate(
          `/auth/verify-code?email=${encodeURIComponent(email)}&type=signup`
        );
      } else {
        message.error("Không thể gửi mã xác thực. Vui lòng thử lại.");
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full md:top-20 flex relative">
      {/* LeftPanel */}
      <motion.div
        className="w-1/2 bg-amber-light flex items-center justify-center h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <LeftPanel />
      </motion.div>

      {/* RightPanel */}
      <div className="w-1/2 bg-white h-full relative flex items-center justify-center">
        <RightPanel />
      </div>

      {/* Form */}
      <motion.div
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xl shadow-xl z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="relative w-full min-h-[550px] mx-auto border border-gray-300 shadow-xl rounded-3xl p-10 bg-white">
          <div className="absolute top-4 right-4 md:top-8 md:right-8 text-sm">
            <span className="text-gray-500">Have an Account?</span> <br />
            <Link
              to="/auth/login"
              className="text-primary-600 font-medium hover:underline transition-all"
            >
              Sign in
            </Link>
          </div>
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-sm font-normal mb-1">Welcome to Nextgentech</h2>
            <h1 className="text-4xl font-bold mb-8 text-primary-600">
              Sign up
            </h1>

            <Form
              form={form}
              onFinish={handleSubmit}
              layout="vertical"
              size="large"
              className="w-full"
            >
              <Form.Item
                name="email"
                label="Enter your Email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
                className="mb-6"
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="Email address"
                  className="py-3"
                />
              </Form.Item>

              <Form.Item
                name="username"
                label="Enter your Username"
                rules={[
                  { required: true, message: "Please input your username!" },
                  {
                    min: 3,
                    message: "Username must be at least 3 characters!",
                  },
                ]}
                className="mb-6"
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="User name"
                  className="py-3"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Enter your Password"
                rules={[
                  { required: true, message: "Please input your password!" },
                  {
                    pattern:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:
                      "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.",
                  },
                ]}
                className="mb-6"
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Password"
                  className="py-3"
                  autoComplete="new-password"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your password!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Mật khẩu không khớp!"));
                    },
                  }),
                ]}
                className="mb-6"
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Confirm Password"
                  className="py-3"
                  autoComplete="new-password"
                />
              </Form.Item>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                    className="w-full h-12 bg-gradient-to-br from-primary to-secondary border-none hover:from-primary-600 hover:to-secondary-600 text-white font-medium mb-6"
                    style={{
                      background: isLoading
                        ? undefined
                        : "linear-gradient(135deg, #50bbf5 0%, #5069f5 100%)",
                    }}
                  >
                    {isLoading ? "Sending code..." : "Sign up"}
                  </Button>
                </Form.Item>
              </motion.div>
            </Form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
