import { useState, useEffect } from "react";

import { Star, ShoppingCart } from "lucide-react";

const ProductCard = ({
  name,
  price,
  oldPrice,
  rating,
  image,
  category,
  brand,
  isNew,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setImageLoaded(true);
    }, Math.random() * 800 + 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col border rounded-lg overflow-hidden shadow-sm transition-transform hover:shadow-md hover:scale-105 bg-white h-full">
      {/* Product Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <div
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out bg-gray-200 ${
            imageLoaded ? "opacity-0" : "opacity-100"
          }`}
        />
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        {isNew && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
            New
          </div>
        )}
        {oldPrice && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Sale
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-gray-500 mb-1">{category}</div>
        <h3 className="font-medium text-base mb-1 line-clamp-1">{name}</h3>
        <div className="text-xs text-gray-500 mb-2">{brand}</div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) =>
            i < Math.round(rating) ? (
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
            {rating.toFixed(1)}
          </span>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline">
          {oldPrice && (
            <span className="text-sm text-gray-500 line-through mr-2">
              ${oldPrice.toFixed(2)}
            </span>
          )}
          <span className="text-lg font-medium">${price.toFixed(2)}</span>
        </div>

        {/* Add to Cart Button */}
        <button className="mt-auto w-full flex items-center justify-center gap-2 bg-gradient-to-br from-primary to-secondary cursor-pointer text-white py-2 text-sm rounded-lg hover:bg-gradient-to-br hover:from-primary-600 hover:to-secondary-600 transition-all">
          <ShoppingCart />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
