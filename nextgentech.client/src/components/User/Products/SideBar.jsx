import { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Checkbox, Button } from "antd";
import {
  ChevronDown,
  ChevronUp,
  X,
  Tag,
  ShoppingBag,
  BoxSelect,
  Circle,
  DollarSign,
  Filter,
} from "lucide-react";

const SideBar = ({
  categories,
  brands,
  priceRange,
  maxPrice,
  selectedCategory,
  selectedBrands,
  selectedPriceRange,
  onCategoryChange,
  onBrandChange,
  onPriceRangeChange,
  onFilterReset,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isBrandOpen, setIsBrandOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);

  const activeFiltersCount =
    (selectedCategory !== null ? 1 : 0) +
    selectedBrands.length +
    (selectedPriceRange[0] !== priceRange[0] ||
    selectedPriceRange[1] !== priceRange[1]
      ? 1
      : 0);

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="md:hidden sticky top-0 z-10 bg-background ">
        <Button
          variant="outline"
          size="sm"
          className="w-full flex items-center justify-between"
          onClick={() => setIsMobileOpen(true)}
        >
          <Filter size={16} />

          {activeFiltersCount > 0 && (
            <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>

      {/* Sidebar Content */}
      <aside
        className={`fixed md:sticky  top-15  bg-white border rounded-lg overflow-hidden md:h-[calc(100vh-2rem)] z-30 w-[280px] transition-all duration-300 ease-in-out md:transition-none h-full ${
          isMobileOpen
            ? "translate-x-0"
            : "-translate-x-full left-0 md:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-medium flex items-center gap-2">
            <BoxSelect size={18} />
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                {activeFiltersCount}
              </span>
            )}
          </h2>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs text-muted-foreground"
                onClick={onFilterReset}
              >
                Clear all
              </Button>
            )}
            <button
              className="md:hidden hover:bg-gray-200 cursor-pointer p-1.5 rounded-lg"
              onClick={() => setIsMobileOpen(false)}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="h-[calc(100%-60px)] p-4 overflow-auto no-scrollbar">
          {/* Category Section */}
          <div className="filter-section">
            <button
              className="w-full flex items-center justify-between sidebar-title"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              <span className="flex items-center gap-2">
                <Tag size={16} />
                Categories
              </span>
              {isCategoryOpen ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>

            {isCategoryOpen && (
              <div className="mt-2 space-y-1 animate-fade-in">
                <div
                  className={`category-item ${
                    selectedCategory === null ? "active" : ""
                  }`}
                  onClick={() => onCategoryChange(null)}
                >
                  <span>All Categories</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {categories.reduce((acc, cat) => acc + cat.count, 0)}
                  </span>
                </div>

                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`category-item ${
                      selectedCategory === category.id ? "active" : ""
                    }`}
                    onClick={() => onCategoryChange(category.id)}
                  >
                    <span>{category.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {category.count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price Range Section */}
          <div className="filter-section">
            <button
              className="w-full flex items-center justify-between sidebar-title"
              onClick={() => setIsPriceOpen(!isPriceOpen)}
            >
              <span className="flex items-center gap-2">
                <DollarSign size={16} className="text-primary" />
                Price Range
              </span>
              {isPriceOpen ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>

            {isPriceOpen && (
              <div className="px-2 pt-4 pb-2 animate-fade-in">
                {/* <Slider
                  defaultValue={[priceRange[0], priceRange[1]]}
                  min={priceRange[0]}
                  max={maxPrice}
                  step={1}
                  value={[selectedPriceRange[0], selectedPriceRange[1]]}
                  onValueChange={(value) => {
                    onPriceRangeChange([value[0], value[1]]);
                  }}
                  className="price-slider"
                /> */}

                <Slider
                  range
                  min={priceRange[0]}
                  max={priceRange[1]}
                  value={[selectedPriceRange[0], selectedPriceRange[1]]}
                  onChange={(value) => {
                    onPriceRangeChange([value[0], value[1]]);
                  }}
                  className="mb-4"
                />

                <div className="flex items-center justify-between mt-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">$</span>
                    <span>{selectedPriceRange[0]}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">$</span>
                    <span>{selectedPriceRange[1]}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Brands Section */}
          <div className="filter-section">
            <button
              className="w-full flex items-center justify-between sidebar-title"
              onClick={() => setIsBrandOpen(!isBrandOpen)}
            >
              <span className="flex items-center gap-2">
                <ShoppingBag size={16} />
                Brands
              </span>
              {isBrandOpen ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>

            {isBrandOpen && (
              <div className="mt-2 space-y-0.5 animate-fade-in">
                {brands.map((brand) => (
                  <div key={brand.id} className="checkbox-item">
                    <Checkbox
                      id={`brand-${brand.id}`}
                      checked={selectedBrands.includes(brand.id)}
                      onChange={() => onBrandChange(brand.id)}
                    />
                    <label
                      htmlFor={`brand-${brand.id}`}
                      className="flex items-center justify-between w-full cursor-pointer text-sm"
                    >
                      <span>{brand.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {brand.count}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
