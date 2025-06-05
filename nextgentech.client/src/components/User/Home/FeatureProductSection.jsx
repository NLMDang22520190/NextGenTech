import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { message } from "antd";

import InfiniteScroll from "../../ReactBitsComponent/InfiniteScroll";
import api from "../../../features/AxiosInstance/AxiosInstance";

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
        <div className="text-xs text-yellow-400">
          ⭐ {product.rating > 0 ? product.rating.toFixed(1) : "0.0"} (
          {product.reviewCount || 0})
        </div>
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

const FeatureProductSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await api.get("/api/Product/GetFeatureProducts");
        const data = response.data;
        // Map and transform the product data
        const mappedData = data.map((product) => ({
          id: product.productId,
          name: product.name,
          price: product.price,
          salePrice: product.salePrice,
          rating: product.rating || 0,
          reviewCount: product.reviewCount || 0,
          image:
            product.imageUrl ||
            `https://picsum.photos/300/300?random=${product.productId}`,
          category: product.category.categoryName,
          description: product.description || "No description available",
        }));
        setProducts(mappedData);
      } catch (error) {
        console.error(error);
        message.error("Error fetching featured products");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const items = loading
    ? Array(4).fill({
        content: <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />,
      })
    : products.map((product) => ({
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
