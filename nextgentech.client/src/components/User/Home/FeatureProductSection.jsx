import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

import InfiniteScroll from "../../ReactBitsComponent/InfiniteScroll";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-transparent flex shadow-lg items-center gap-2 rounded-lg ">
      <img
        src={product.image}
        alt={product.name}
        className="size-32 object-cover rounded-md justify-center "
      />
      <div className="flex flex-col gap-1 text-start w-full overflow-hidden">
        <div className="flex justify-between w-full pr-2">
          <h3 className="text-base font-semibold">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.category}</p>
        </div>
        <div className="text-xs text-yellow-400">⭐ {product.rating}</div>
        <p className="text-sm text-gray-600 truncate">{product.description}</p>
        <div className="flex justify-between w-full pr-2 items-center">
          <div className="flex gap-2 items-center">
            <p className="text-lg font-bold line-through">${product.price}</p>
            <p className="text-lg font-bold text-red-500">
              ${product.salePrice}
            </p>
          </div>
          <button className="p-3 m-1 cursor-pointer rounded-full font-semibold border-black bg-gradient-to-br from-primary to-secondary text-white w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]">
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const products = [
  {
    id: 1,
    name: "Ultra WirelessPods",
    category: "Audio",
    price: 199.99,
    salePrice: 149.99,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Premium sound quality with active noise cancellation",
  },
  {
    id: 2,
    name: "SmartWatch X",
    category: "Wearables",
    price: 249.99,
    salePrice: 199.99,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Track fitness, sleep, and receive notifications",
  },
  {
    id: 3,
    name: "ThinBook Pro",
    category: "Computing",
    price: 1299.99,
    salePrice: 999.99,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Ultra-thin, powerful laptop for professionals",
  },
  {
    id: 4,
    name: "PhotoMaster Camera",
    category: "Photography",
    price: 799.99,
    salePrice: 599.99,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1938&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Professional-grade camera with 4K video capability",
  },
];

const FeatureProductSection = () => {
  const items = products.map((product) => ({
    content: <ProductCard key={product.id} product={product} />,
  }));

  return (
    <div className="pt-10  bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-4xl p-6 ">
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        viewport={{
          once: true,
        }}
        className="text-center mb-16"
      >
        <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          Featured Products
        </h2>
        <p className="text-gray-600 text-base font-medium">
          Discover our carefully curated selection of premium tech
        </p>
      </motion.div>
      <div style={{ height: "500px", position: "relative" }}>
        <InfiniteScroll
          items={items}
          isTilted={true}
          tiltDirection="left"
          autoplay={true}
          autoplaySpeed={0.1}
          autoplayDirection="down"
          pauseOnHover={true}
        />
      </div>
    </div>
  );
};

export default FeatureProductSection;
