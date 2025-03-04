import { useState, useEffect, useRef } from "react";
import { Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const SearchAndSort = ({
  searchTerm,
  onSearchChange,
  sortOption,
  onSortChange,
  totalProducts,
}) => {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const searchTimeoutRef = useRef(null);

  // Debounce search input
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      onSearchChange(localSearch);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [localSearch, onSearchChange]);

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 w-full">
      {/* Search Input */}
      <div className="relative w-full sm:max-w-sm">
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          type="text"
          placeholder="Search products..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full transition-all duration-200"
        />
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
        <p className="text-sm text-gray-500">
          {totalProducts} product{totalProducts !== 1 ? "s" : ""}
        </p>

        <Select
          value={sortOption}
          style={{ width: 180 }}
          onChange={onSortChange}
          options={[
            { value: "newest", label: "Newest" },
            { value: "price-asc", label: "Price: Low to High" },
            { value: "price-desc", label: "Price: High to Low" },
            { value: "rating-desc", label: "Highest Rated" },
          ]}
        />
      </div>
    </div>
  );
};

export default SearchAndSort;
