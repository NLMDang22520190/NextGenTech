import { motion } from "framer-motion";
import LoginForm from "../../components/Auth/LoginForm";
import LeftPanel from "../../components/Auth/LeftPanel";
import RightPanel from "../../components/Auth/RightPanel";

const Login = () => {
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

      {/* LoginForm */}
      <motion.div
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2  w-full max-w-xl shadow-xl z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <LoginForm />
      </motion.div>
    </div>
  );
};

export default Login;
