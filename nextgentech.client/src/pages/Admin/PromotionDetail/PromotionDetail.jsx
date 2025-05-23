import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "../../../components/Admin/Products/ProductCard";
import { Search } from "lucide-react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPromotionDetail } from "../../../features/Admin/Promotions/Promotion";
import { message, Spin } from "antd";
import { fetchProductDetail } from "../../../features/Admin/Products/Product";

export default function PromotionDetail() {
  const dispatch = useDispatch();

  const { promotionId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const {
    promotionDetail,
    status: promotionDetailStatus,
    error: promotionDetailError,
  } = useSelector((state) => state.promotion);

  const {
    productDetail,
    status: productDetailStatus,
    error: productDetailError,
  } = useSelector((state) => state.product);

  const fetchPromotionDetailData = async (Id) => {
    try {
      setLoading(true);
      await dispatch(fetchPromotionDetail(Id)).unwrap();
    } catch (err) {
      message.error(
        "Failed to fetch promotion details: " + (err.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    if (promotionDetail && promotionDetail.productIDs && promotionDetail.productIDs.length > 0) {
      try {
        setLoading(true);
        setProducts([]);

        const productResults = await Promise.all(
          promotionDetail.productIDs.map(async (ID) => {
            try {
              const result = await dispatch(fetchProductDetail(ID)).unwrap();
              return {
                id: result.productId,
                name: result.name,
                price: result.price,
                // rating: product.rating,
                rating: parseFloat((Math.random() * 3 + 2).toFixed(1)),
                // image: product.productImages[0].imageUrl
                image: `https://picsum.photos/300/300?random=${result.productId}`,
                category: result.category.categoryName,
                brand: result.brand.brandName,
              };
            } catch (error) {
              console.error(`Error fetching product ${ID}:`, error);
              return null;
            }
          })
        );
        setProducts(productResults.filter((product) => product !== null));
      } catch (err) {
        message.error(
          "Failed to fetch products: " + (err.message || "Unknown error")
        );
      } finally {
        setLoading(false);
      }
    } else {
      setProducts([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotionDetailData(promotionId);
  }, [dispatch]);

  useEffect(() => {
    if (promotionDetail) {
      fetchProducts();
    }
  }, [promotionDetail]);

  // Filter products based on search query
  const filterProductsData = products.filter((row) =>
    row.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        Promotion Details ({promotionDetail.promotionCode})
      </h1>

      <div
        className={`relative ${
          searchQuery.length > 0 ? "w-64" : "w-40"
        } focus-within:w-64 hover:w-64 hover:duration-300 duration-300`}
      >
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <Search size={18} />
        </span>
        <input
          type="text"
          className="pl-10 pr-4 py-2 w-full border rounded-full text-sm focus:outline-none focus:border-primary-600"
          placeholder="Search product"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            console.log(searchQuery);
          }}
        />
      </div>
      {loading ||
      promotionDetailStatus === "loading" ||
      productDetailStatus === "loading" ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" tip="Loading promotion details..." />
        </div>
      ) : promotionDetailError ? (
        <div className="text-red-500 text-center">
          Error loading promotion details: {promotionDetailError}
        </div>
      ) : productDetailError ? (
        <div className="text-red-500 text-center">
          Error loading products: {productDetailError}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          {filterProductsData.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
