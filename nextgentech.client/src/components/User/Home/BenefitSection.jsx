import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const benefits = [
  {
    id: 1,
    title: "Premium Quality",
    description:
      "Each product goes through rigorous testing to ensure it meets our high standards.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj7ysIvjRxPqh8hZZ36AL2Fn0mHmFf2z8mKQ&s",
  },
  {
    id: 2,
    title: "Secure Payment",
    description:
      "Your transactions are encrypted and protected with industry-leading security measures.",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    title: "Free Shipping",
    description: "We offer free worldwide shipping on all orders over $100.",
    image:
      "https://images.unsplash.com/photo-1559348349-86f1f65817fe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const BenefitCard = ({ benefit, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl overflow-hidden shadow-md relative"
    >
      <div className="h-40 overflow-hidden">
        <img
          src={benefit.image}
          alt={benefit.title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
        />
      </div>
      <div className="p-6 text-left">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <Check className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-display font-semibold text-lg">
            {benefit.title}
          </h3>
        </div>
        <p className="text-muted-foreground ">{benefit.description}</p>
      </div>
    </motion.div>
  );
};

const Benefits = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/products");
  };
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, threshold: 0.1 });

  return (
    <section id="benefits" ref={sectionRef} className="py-20 ">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <div className="inline-block px-3 py-1 rounded-full bg-primary-50 text-base font-bold text-primary-400">
            Why Choose Us
          </div>
          <motion.h2
            className="text-5xl bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent font-bold mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            The techlandia Difference
          </motion.h2>
          <motion.p2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-muted-foreground text-gray-600 text-base font-medium"
          >
            We're committed to providing exceptional products and service that
            enhance your tech experience.
          </motion.p2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard key={benefit.id} benefit={benefit} index={index} />
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 p-8 md:p-12 bg-primary rounded-2xl text-white text-center max-w-4xl mx-auto"
        >
          <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">
            Ready to Experience the Best?
          </h3>
          <p className="mb-6 text-primary-foreground/90 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have elevated their tech
            experience with our premium products.
          </p>
          <button
            to="/products"
            onClick={() => handleClick()}
            class="cursor-pointer group relative bg-white hover:bg-zinc-300 text-black font-semibold text-sm px-6 py-3 rounded-full transition-all duration-200 ease-in-out shadow hover:shadow-lg w-40 h-12"
          >
            <div class="relative flex items-center justify-center gap-2">
              <span class="relative inline-block overflow-hidden">
                <span class="block transition-transform duration-300 group-hover:-translate-y-full">
                  Get Started
                </span>
                <span class="absolute inset-0 transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                  Right Now
                </span>
              </span>

              <svg
                class="w-4 h-4 transition-transform duration-200 group-hover:rotate-45"
                viewBox="0 0 24 24"
              >
                <circle fill="currentColor" r="11" cy="12" cx="12"></circle>
                <path
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  stroke-width="2"
                  stroke="white"
                  d="M7.5 16.5L16.5 7.5M16.5 7.5H10.5M16.5 7.5V13.5"
                ></path>
              </svg>
            </div>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Benefits;
