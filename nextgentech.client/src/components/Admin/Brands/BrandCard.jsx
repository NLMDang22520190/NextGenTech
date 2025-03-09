import { motion } from "framer-motion";

const BrandCard = ({ brand }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-md hover:shadow-lg hover:scale-102 transition-all duration-100 flex flex-col"
    >
      <div className="relative">
        <div className="relative w-full aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">          
          <img
            src={brand.image != '' ? brand.image : `https://logo.clearbit.com/${brand.name}.com`}
            alt={brand.name}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      
      <div className="px-4 pt-3 pb-4 flex flex-col flex-1 justify-center">
          <h3 className="text-base font-semibold text-gray-800 line-clamp-2 text-center">{brand.name}</h3>
      </div>
    </motion.div>
  );
};

export default BrandCard;