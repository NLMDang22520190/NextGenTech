import React from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const TestomonialSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Tech Enthusiast",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150",
      text: "Amazing products and exceptional customer service. Will definitely shop here again!",
    },
    {
      name: "Michael Chen",
      role: "Software Developer",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150",
      text: "The quality of the products exceeded my expectations. Highly recommended!",
    },
    {
      name: "Emily Davis",
      role: "Digital Creator",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150",
      text: "Best tech store I've ever shopped at. The prices are competitive and the selection is great.",
    },
  ];

  return (
    <section className="py-20  bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-4xl p-6 ">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 text-base font-medium">
            Don't just take our word for it
          </p>
        </motion.div>
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.2 } },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-lg shadow-gray-200/50 relative"
            >
              <div className="absolute -top-4 -right-4">
                <Quote className="h-8 w-8 text-blue-600 transform rotate-180" />
              </div>
              <div className="flex items-center mb-6">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover mr-4 ring-4 ring-blue-50"
                />
                <h3 className="font-semibold text-lg">{testimonial.name}</h3>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed">
                {testimonial.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestomonialSection;
