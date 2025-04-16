import React, { useState } from 'react'
import { motion } from 'framer-motion'
import BrandCard from '../../../components/Admin/Brands/BrandCard';

const brands = Array.from({length: 14}).map((_,i) => ({
  id: i + 1,
  name:
    [
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
    ][i % 10],
  image: ``
}))

export default function Brands() {
  const [brandList, setBrandList] = useState(brands);

  return (
    <div className='space-y-6'>
      <h1 className="text-2xl font-semibold text-gray-800">Brands</h1>

      <motion.div
        className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        {brandList.map((brand) => (
          <BrandCard
            key={brand.id}
            brand={brand}
          />
        ))}
      </motion.div>

    </div>
  )
}
