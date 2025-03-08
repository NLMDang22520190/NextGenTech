import React, { useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "../../../components/Admin/Products/ProductCard";

const products = Array.from({length: 10}).map((_,i) => ({
  id: i + 1,
  name:
    [
      "Apple Watch Series 4",
      "Air-Max-270",
      "Minimal Chair Tool",
      "Amazfit Vip",
      "Gumbo Mouse",
      "Camera Tripod",
      "Fitness Tracker Watch",
      "Bluetooth Portable Speaker",
      "Leather Messenger Bag",
      "Wireless Charging Pad",
    ][i % 10],
  price: Math.floor(Math.random() * 900) + 100,
  image: `https://picsum.photos/300/300?random=${i}`,
  rating: 3,
  reviews: 45
}))

export default function Products() {
  const [productList, setProductList] = useState(products);

  return (
    <div className='space-y-6'>
      <h1 className="text-2xl font-semibold text-gray-800">Products</h1>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        {productList.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </motion.div>

    </div>
  )
}
