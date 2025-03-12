import { useState, useEffect } from "react";
import { Star, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/products/${product.id}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setImageLoaded(true);
    }, Math.random() * 800 + 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      onClick={() => handleProductClick()}
      className="flex cursor-pointer flex-col border rounded-lg overflow-hidden shadow-sm transition-transform hover:shadow-md hover:scale-105 bg-white h-full"
    >
      {/* Product Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <div
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out bg-gray-200 ${
            imageLoaded ? "opacity-0" : "opacity-100"
          }`}
        />
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />

        {product.oldPrice && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Sale
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-gray-500 mb-1">{product.category}</div>
        <h3 className="font-medium text-base mb-1 line-clamp-1">
          {product.name}
        </h3>
        <div className="text-xs text-gray-500 mb-2">{product.brand}</div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) =>
            i < Math.round(product.rating) ? (
              <Star
                key={i}
                size={16}
                fill="yellow"
                className="text-yellow-400"
              />
            ) : (
              <Star key={i} size={16} className="text-gray-300" />
            )
          )}
          <span className="text-xs text-gray-500 ml-1">
            {product.rating.toFixed(1)}
          </span>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline">
          {product.oldPrice && (
            <span className="text-sm text-gray-500 line-through mr-2">
              ${product.oldPrice.toFixed(2)}
            </span>
          )}
          <span className="text-lg font-medium">
            ${product.price.toFixed(2)}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Ngăn chặn sự kiện click lan lên div cha
            console.log("Added to cart:", product.name);
          }}
          className="mt-auto w-full flex items-center justify-center gap-2 bg-gradient-to-br from-primary to-secondary cursor-pointer text-white py-2 text-sm rounded-lg hover:bg-gradient-to-br hover:from-primary-600 hover:to-secondary-600 transition-all">
          <ShoppingCart />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
