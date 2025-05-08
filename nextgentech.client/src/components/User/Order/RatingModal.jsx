import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useToast } from '../../../hooks/use-toast';

const RatingModal = ({ isOpen, onClose, orderId, productId, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const { toast } = useToast();

  // Log props on component mount to verify they're being received correctly
  useEffect(() => {
    if (isOpen) {
      console.log("RatingModal opened with props:", { orderId, productId });
    }
  }, [isOpen, orderId, productId]);

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (!productId) {
      toast({
        title: "Error",
        description: "Product ID is missing. Please try again.",
        variant: "destructive",
      });
      console.error("Missing productId in RatingModal.handleSubmit");
      return;
    }

    console.log("Submitting review with data:", { 
      productId, 
      rating, 
      feedback,
      isProductIdDefined: productId !== undefined
    });
    
    // Pass productId as the first parameter
    onSubmit(productId, rating, feedback);

    // Reset form
    setRating(0);
    setFeedback('');
    
    toast({
      title: "Review Submitted",
      description: "Thank you for your feedback!",
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Rate Product #{productId}</h2>
        </div>
        
        <div className="p-5 space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Rating</h3>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transform transition-transform duration-200 hover:scale-110 cursor-pointer"
                >
                  <Star
                    size={24}
                    className={`${
                      star <= (hoveredRating || rating)
                        ? 'text-primary-500 fill-primary-500'
                        : 'text-gray-300'
                    } transition-colors duration-150`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {rating > 0 ? `${rating}-Star Rating` : "Select Rating"}
              </span>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Feedback</h3>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write down your feedback about our product & services."
              className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none h-24"
            />
          </div>
          
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="w-full max-w-xs px-4 py-2 font-medium cursor-pointer text-white bg-gradient-to-br from-primary to-secondary rounded-md hover:bg-gradient-to-br hover:from-primary-600 hover:to-secondary-600 transition-colors"
            >
              PUBLISH REVIEW
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RatingModal;