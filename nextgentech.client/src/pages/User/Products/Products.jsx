import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";

import SideBar from "../../../components/User/Products/SideBar";
import SearchAndSort from "../../../components/User/Products/SearchAndSort";
import ProductCard from "../../../components/User/Products/ProductCard";
import { useIsMobile } from "../../../hooks/use-mobile";

const mockProducts = Array.from({ length: 20 }).map((_, i) => ({
  id: i + 1,
  name:
    [
      "Premium Wireless Headphones",
      "Ultra HD Smart TV",
      "Professional Camera Kit",
      "Ergonomic Office Chair",
      "Ceramic Coffee Mug Set",
      "Stainless Steel Water Bottle",
      "Fitness Tracker Watch",
      "Bluetooth Portable Speaker",
      "Leather Messenger Bag",
      "Wireless Charging Pad",
    ][i % 10] + ` ${i + 1}`,
  price: Math.floor(Math.random() * 900) + 100,
  oldPrice:
    Math.random() > 0.7 ? Math.floor(Math.random() * 1200) + 150 : undefined,
  rating: parseFloat((Math.random() * 3 + 2).toFixed(1)),
  image: `https://picsum.photos/300/300?random=${i}`,
  category: ["Electronics", "Home", "Clothing", "Sports", "Beauty"][
    Math.floor(i / 4)
  ],
  categoryId: Math.floor(i / 4) + 1,
  brand: ["Apple", "Samsung", "Sony", "Google", "Nike", "Adidas", "LG", "Bose"][
    i % 8
  ],
  brandId: (i % 8) + 1,
  dateAdded: new Date(
    Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
  ),
}));

const generateCategories = (products) => {
  const categoriesMap = {};
  products.forEach((product) => {
    if (!categoriesMap[product.categoryId]) {
      categoriesMap[product.categoryId] = {
        id: product.categoryId,
        name: product.category,
        count: 0,
      };
    }
    categoriesMap[product.categoryId].count++;
  });
  return Object.values(categoriesMap);
};

const generateBrands = (products) => {
  const brandsMap = {};
  products.forEach((product) => {
    if (!brandsMap[product.brandId]) {
      brandsMap[product.brandId] = {
        id: product.brandId,
        name: product.brand,
        count: 0,
      };
    }
    brandsMap[product.brandId].count++;
  });
  return Object.values(brandsMap);
};

const categories = generateCategories(mockProducts);
const brands = generateBrands(mockProducts);

const Products = ({ initialSearchTerm = "", initialCategory = null }) => {
  const [searchParams] = useSearchParams();

  // Lấy searchKeyword từ URL nếu có, nếu không thì dùng initialSearchTerm
  const initialSearch = useMemo(
    () => searchParams.get("searchkeyword") || initialSearchTerm,
    [searchParams, initialSearchTerm]
  );

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortOption, setSortOption] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Cập nhật searchTerm khi URL thay đổi
  useEffect(() => {
    setSearchTerm(searchParams.get("searchkeyword") || "");
  }, [searchParams]);

  const minPrice = Math.min(...mockProducts.map((p) => p.price));
  const maxPrice = Math.max(...mockProducts.map((p) => p.price));
  const [selectedPriceRange, setSelectedPriceRange] = useState([
    minPrice,
    maxPrice,
  ]);

  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile && isMobileOpen) {
      setIsMobileOpen(false);
    }
  }, [isMobile, isMobileOpen]);

  const filteredProducts = mockProducts.filter((product) => {
    if (
      searchTerm &&
      !product.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    if (selectedCategory !== null && product.categoryId !== selectedCategory) {
      return false;
    }
    if (
      selectedBrands.length > 0 &&
      !selectedBrands.includes(product.brandId)
    ) {
      return false;
    }
    if (
      product.price < selectedPriceRange[0] ||
      product.price > selectedPriceRange[1]
    ) {
      return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating-desc":
        return b.rating - a.rating;
      case "newest":
      default:
        return (
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
    }
  });

  const handleFilterReset = () => {
    setSelectedCategory(null);
    setSelectedBrands([]);
    setSelectedPriceRange([minPrice, maxPrice]);
  };

  const handleBrandChange = (brandId) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  return (
    <div className="flex py-20 min-h-screen container mx-auto gap-6 px-4 md:px-6">
      {/* Sidebar */}
      <SideBar
        categories={categories}
        brands={brands}
        priceRange={[minPrice, maxPrice]}
        maxPrice={maxPrice}
        selectedCategory={selectedCategory}
        selectedBrands={selectedBrands}
        selectedPriceRange={selectedPriceRange}
        onCategoryChange={setSelectedCategory}
        onBrandChange={handleBrandChange}
        onPriceRangeChange={setSelectedPriceRange}
        onFilterReset={handleFilterReset}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content */}
      <div className="flex-1 ">
        {/* Search and Sort */}
        <SearchAndSort
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortOption={sortOption}
          onSortChange={setSortOption}
          totalProducts={filteredProducts.length}
        />

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mt-6">
            {sortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  delay: index * 0.05,
                }} // Delay theo index
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[50vh]">
            <div className="text-center">
              <p className="text-xl font-medium mb-2">
                No products found for{" "}
                {searchTerm && `search term "${searchTerm}"`}
              </p>
              <p className="text-muted-foreground">
                Try adjusting your filters or search term
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
