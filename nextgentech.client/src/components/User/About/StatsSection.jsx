import React from "react";
import { motion } from "framer-motion";
import { Package, Receipt, UserPlus, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

import CountUp from "../../ReactBitsComponent/CountUp";
import GradientText from "../../ReactBitsComponent/GradientText";

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
};

const StatsSection = () => {
  return (
    <section className="py-20 bg-background relative">
      <div className="container px-4 md:px-6 mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-primary-300">Our Growth</h2>
          </div>
          <motion.h2
            className="text-4xl bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent font-bold mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Leading the Tech Retail Revolution
          </motion.h2>
          <motion.p2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-muted-foreground text-gray-600 text-base font-medium"
          >
            Since our founding in 2015, we've grown to become one of the largest
            tech e-commerce platforms, serving customers nationwide with the
            latest and greatest in tech products.
          </motion.p2>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Products Stat */}
          <motion.div
            className="bg-card border rounded-xl p-8 text-center"
            variants={fadeInScale}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <GradientText
              colors={["#50bbf5", "#5069f5", "#50bbf5", "#5069f5", "#50bbf5"]}
              className="text-2xl"
              animationSpeed={3}
              showBorder={false}
            >
              <CountUp
                from={0}
                to={500000}
                separator=","
                direction="up"
                duration={0.5}
                className="text-4xl font-bold mb-2"
              />
            </GradientText>

            <p className="text-xl font-medium mb-2">Products</p>
            <p className="text-muted-foreground">
              Curated tech products across all categories
            </p>
          </motion.div>

          {/* Orders Stat */}
          <motion.div
            className="bg-card border rounded-xl p-8 text-center"
            variants={fadeInScale}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Receipt className="h-8 w-8 text-primary" />
            </div>
            <GradientText
              colors={["#50bbf5", "#5069f5", "#50bbf5", "#5069f5", "#50bbf5"]}
              className="text-2xl"
              animationSpeed={3}
              showBorder={false}
            >
              <CountUp
                from={0}
                to={500000}
                separator=","
                direction="up"
                duration={0.5}
                className="text-4xl font-bold mb-2"
              />
            </GradientText>
            <p className="text-xl font-medium mb-2">Orders Placed</p>
            <p className="text-muted-foreground">
              Successfully fulfilled with 99.8% satisfaction rate
            </p>
          </motion.div>

          {/* Users Stat */}
          <motion.div
            className="bg-card border rounded-xl p-8 text-center"
            variants={fadeInScale}
            transition={{ delay: 0.4 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
            <GradientText
              colors={["#50bbf5", "#5069f5", "#50bbf5", "#5069f5", "#50bbf5"]}
              className="text-2xl"
              animationSpeed={3}
              showBorder={false}
            >
              <CountUp
                from={0}
                to={1000000}
                separator=","
                direction="up"
                duration={0.5}
                className="text-4xl font-bold mb-2"
              />
            </GradientText>
            <p className="text-xl font-medium mb-2">Users Joined</p>
            <p className="text-muted-foreground">
              Tech enthusiasts who trust our platform
            </p>
          </motion.div>
        </motion.div>

        {/* Call to action */}
        <motion.div
          className="mt-12 text-center flex items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, delay: 0.6 },
          }}
          viewport={{ once: true }}
        >
          <Link
            to="/products"
            className="gap-2 bg-gradient-to-br from-primary to-secondary p-2 rounded-lg text-white font-semibold flex items-center justify-center hover:from-primary-500 hover:to-secondary-500 transition-all duration-300"
          >
            <ShoppingBag className="h-4 w-4 mr-1" />
            Browse Products
          </Link>
        </motion.div>
      </div>

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

export default StatsSection;
