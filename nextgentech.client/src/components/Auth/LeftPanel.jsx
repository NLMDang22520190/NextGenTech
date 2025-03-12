import { motion } from "framer-motion";

const LeftPanel = () => {
  return (
    <motion.div 
      className="h-full w-full relative overflow-hidden bg-primary-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div 
        className="absolute bottom-20 left-1/2 -translate-x-1/2"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <svg width="320" height="250" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g>
            {/* Simplified scooter illustration */}
            <motion.path 
              d="M20 140 H200" 
              stroke="#8B4513" 
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
            
            {/* Scooter base */}
            <motion.ellipse 
              cx="75" cy="125" rx="25" ry="15" 
              fill="#46aff2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            />
            
            {/* Person on scooter */}
            <motion.g
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
            >
              <circle cx="75" cy="90" r="10" fill="#E64A19" /> {/* Head */}
              <rect x="65" y="100" width="20" height="25" fill="#E64A19" rx="5" /> {/* Body */}
              <rect x="60" y="115" width="10" height="20" fill="#8B4513" rx="3" /> {/* Left leg */}
              <rect x="80" y="115" width="10" height="20" fill="#8B4513" rx="3" /> {/* Right leg */}
              
              <motion.g
                animate={{ rotate: [0, 15, 0], y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                style={{ originX: 0.5, originY: 0 }}
              >
                <rect x="85" y="100" width="20" height="8" fill="#E64A19" rx="3" /> {/* Right arm */}
                <circle cx="105" cy="102" r="5" fill="#8B4513" /> {/* Hand */}
              </motion.g>
            </motion.g>
            
            {/* Small hill */}
            <motion.path 
              d="M150 140 Q180 110 210 140" 
              fill="#E9B362" 
              opacity="0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ duration: 1, delay: 1.2 }}
            />
          </g>
        </svg>
      </motion.div>
      
      <motion.div
        className="absolute top-8 left-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
      </motion.div>
    </motion.div>
  );
};

export default LeftPanel;