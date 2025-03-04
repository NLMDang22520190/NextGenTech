import React, { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;
    setSearchValue("");
    navigate(`/products?searchkeyword=${encodeURIComponent(searchValue)}`);
  };

  return (
    <div className="p-1.5 gap-2 overflow-hidden group size-8 hover:w-[270px] bg-gradient-to-br from-primary-dark to-secondary-dark shadow-[2px_2px_20px_rgba(0,0,0,0.08)] rounded-full flex items-center hover:duration-300 duration-300">
      <div className="flex items-center justify-center">
        <Search className="text-whiteSmoke" size={20} />
      </div>
      <input
        className="text-lg focus:outline-none text-black bg-transparent focus:ring-transparent w-0 opacity-0 group-hover:w-auto group-hover:opacity-100 "
        placeholder="Search..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
      />
    </div>
  );
};

export default SearchBar;
