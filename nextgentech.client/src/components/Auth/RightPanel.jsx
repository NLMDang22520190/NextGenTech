import { motion } from "framer-motion";

const RightPanel = () => {
  return (
    <motion.div 
      className="h-full w-full relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div 
        className="absolute top-1/4 right-8"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
      >
        <svg width="160" height="240" viewBox="0 0 160 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g>
            {/* Person illustration */}
            <motion.g
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              {/* Person body */}
              <rect x="70" y="100" width="40" height="60" rx="10" fill="#E64A19" />
              
              {/* Head with bun */}
              <circle cx="90" cy="80" r="20" fill="#8B4513" />
              <circle cx="95" cy="65" r="10" fill="#8B4513" />
              
              {/* Arms */}
              <motion.g
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                style={{ originX: 0, originY: 0 }}
              >
                <rect x="60" y="110" width="30" height="12" rx="6" fill="#E64A19" />
                <circle cx="50" cy="116" r="8" fill="#FFD5CD" />
              </motion.g>
              
              <motion.g
                animate={{ rotate: [5, -5, 5] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", delay: 0.3 }}
                style={{ originX: 1, originY: 0 }}
              >
                <rect x="90" y="110" width="30" height="12" rx="6" fill="#E64A19" />
                <circle cx="130" cy="116" r="8" fill="#FFD5CD" />
              </motion.g>
              
              {/* Legs */}
              <rect x="70" y="160" width="15" height="40" rx="7" fill="#FFD5CD" />
              <rect x="95" y="160" width="15" height="40" rx="7" fill="#FFD5CD" />
              
              {/* Shoes */}
              <rect x="65" y="195" width="25" height="10" rx="5" fill="#FF99CC" />
              <rect x="90" y="195" width="25" height="10" rx="5" fill="#FF99CC" />
            </motion.g>
          </g>
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default RightPanel;