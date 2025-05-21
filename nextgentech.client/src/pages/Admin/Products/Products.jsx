import React, { useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "../../../components/Admin/Products/ProductCard";
import { Search } from "lucide-react";

//productId, name, description, price, stockQuantity, createdAt, brand, category, productImage, imageUrl
const products = Array.from({length: 14}).map((_,i) => ({
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
  rating: Math.floor(Math.random() * 4.5) + 0.5,
  reviews: Math.floor(Math.random() * 999) + 1,
  brand: [
    "Apple",
    "Microsoft",
    "Amazon",
    "Samsung",
    "Intel",
    "NVIDIA",
    "AMD",
    "Sony",
    "Dell",
    "Cisco",
  ][i%10],
}))

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filterProductsData = products.filter(row => 
    row.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='space-y-6'>
      <h1 className="text-2xl font-semibold text-gray-800">Products</h1>

      <div className={`relative ${searchQuery.length > 0 ? "w-64" : "w-40"} focus-within:w-64 hover:w-64 hover:duration-300 duration-300`}>
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <Search size={18} />
        </span>
        <input
          type="text"
          className="pl-10 pr-4 py-2 w-full border rounded-full text-sm focus:outline-none focus:border-primary-600"
          placeholder="Search product"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            console.log(searchQuery)             
          }}
        />
      </div>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        {filterProductsData.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </motion.div>

    </div>
  )
}
