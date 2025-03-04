import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-4xl py-20 md:py-32">
      <motion.div
        className="container px-4 md:px-6 max-w-5xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.2 }}
        variants={fadeUp}
      >
        <div className="flex flex-col items-center text-center space-y-6">
          <motion.div
            className="inline-block rounded-lg px-3 py-1 bg-primary-50 text-base font-bold text-primary-400 mb-2"
            variants={fadeUp}
            transition={{ delay: 0.1 }}
          >
            About NextGenTech
          </motion.div>
          <motion.h1
            className="text-3xl md:text-5xl bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent font-bold"
            variants={fadeUp}
            transition={{ delay: 0.2 }}
          >
            Your Premier Destination for Tech Products
          </motion.h1>
          <motion.p
            className="max-w-[700px] text-muted-foreground text-gray-600 text-base font-medium md:text-xl/relaxed"
            variants={fadeUp}
            transition={{ delay: 0.3 }}
          >
            We're passionate about bringing the latest and greatest technology
            products to tech enthusiasts, professionals, and everyday consumers
            at competitive prices.
          </motion.p>
          <motion.div variants={fadeUp} transition={{ delay: 0.4 }}>
            <Link
              to="/products"
              className="gap-2 bg-gradient-to-br from-primary to-secondary p-2 rounded-lg text-white font-semibold flex items-center justify-center hover:from-primary-500 hover:to-secondary-500 transition-all duration-300"
            >
              <ShoppingBag className="h-4 w-4 mr-1" />
              Browse Products
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Abstract Background Elements */}
      <motion.div
        className="absolute -top-40 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-70"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, transition: { duration: 1.2 } }}
      />
      <motion.div
        className="absolute -bottom-20 left-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl opacity-70"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: { duration: 1.2, delay: 0.3 },
        }}
      />
    </section>
  );
};

export default HeroSection;
