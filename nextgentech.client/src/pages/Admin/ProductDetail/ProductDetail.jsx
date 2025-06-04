import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { message } from "antd";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { ProductImageCarousel } from "../../../components/User/ProductDetail/ProductImageCarousel";
import ProductReviews from "../../../components/User/ProductDetail/ProductReviews";
import api from "../../../features/AxiosInstance/AxiosInstance";
import { addItemToCart } from "../../../features/Cart/Cart";

// Mock product data - in a real app this would come from an API
const mockProduct = {
  id: 1,
  name: "NextGen Pro Wireless Headphones",
  description:
    "Experience premium sound with our NextGen Pro Wireless Headphones. These over-ear headphones feature active noise cancellation, 40-hour battery life, and comfortable memory foam ear cushions. Perfect for music lovers, gamers, and professionals who need crystal clear audio.",
  longDescription: `
      <p>Experience premium sound quality with our NextGen Pro Wireless Headphones. These cutting-edge over-ear headphones combine sophisticated technology with exceptional comfort for an immersive audio experience.</p>

      <h4>Key Features:</h4>
      <ul>
        <li>Active Noise Cancellation technology blocks out ambient noise</li>
        <li>40-hour battery life on a single charge</li>
        <li>Memory foam ear cushions for extended comfort</li>
        <li>Voice assistant compatibility with Siri, Google Assistant, and Alexa</li>
        <li>Bluetooth 5.2 with multi-device connection</li>
        <li>Built-in high-quality microphone for calls</li>
        <li>Touch controls for volume, track selection, and calls</li>
        <li>Foldable design for easy storage and travel</li>
      </ul>

      <h4>Technical Specifications:</h4>
      <ul>
        <li>Driver Size: 40mm</li>
        <li>Frequency Response: 20Hz - 20kHz</li>
        <li>Impedance: 32 Ohm</li>
        <li>Bluetooth Range: Up to 10 meters</li>
        <li>Weight: 250g</li>
        <li>Fast charging: 10 minutes charge for 5 hours playback</li>
        <li>USB-C charging port</li>
      </ul>
    `,
  price: 249.99,
  oldPrice: 299.99,
  stockQuantity: 45,
  categoryId: 3,
  categoryName: "Audio",
  brandId: 2,
  brandName: "NextGen Audio",
  rating: 4.7,
  reviewCount: 128,
  images: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1577174881658-0f30ed549adc?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?q=80&w=2069&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=2070&auto=format&fit=crop",
  ],
  colors: ["Black", "Silver", "Blue"],
  createdAt: "2023-11-15T14:48:00.000Z",
  features: [
    "Noise Cancellation",
    "40hr Battery",
    "Bluetooth 5.2",
    "Voice Assistant",
  ],
};

// Mock reviews data
const mockReviews = [
  {
    id: 1,
    userId: 101,
    userName: "Alex Johnson",
    userAvatar: "https://i.pravatar.cc/150?img=1",
    productId: 1,
    rating: 5,
    comment:
      "These headphones are amazing! The sound quality is crystal clear, and the noise cancellation works perfectly. I use them during work and commuting, and they've made a huge difference.",
    createdAt: "2024-02-10T09:23:00.000Z",
    helpfulCount: 24,
  },
  {
    id: 2,
    userId: 102,
    userName: "Sarah Miller",
    userAvatar: "https://i.pravatar.cc/150?img=5",
    productId: 1,
    rating: 4,
    comment:
      "Great headphones overall. The sound is excellent and the battery life is impressive. My only complaint is that they're a bit tight on my head, but they might loosen up over time.",
    createdAt: "2024-01-25T15:41:00.000Z",
    helpfulCount: 15,
  },
  {
    id: 3,
    userId: 103,
    userName: "Michael Chen",
    userAvatar: "https://i.pravatar.cc/150?img=8",
    productId: 1,
    rating: 5,
    comment:
      "Best headphones I've ever owned! The sound is balanced with great bass, and the noise cancellation is top notch. They're comfortable enough to wear all day, and I love the touch controls.",
    createdAt: "2023-12-18T11:30:00.000Z",
    helpfulCount: 32,
  },
  {
    id: 4,
    userId: 104,
    userName: "Emily Rodriguez",
    userAvatar: "https://i.pravatar.cc/150?img=9",
    productId: 1,
    rating: 4,
    comment:
      "Very good product that delivers on its promises. The sound quality is excellent and the battery lasts forever. The only downside is that the app is a bit buggy sometimes.",
    createdAt: "2023-12-05T14:12:00.000Z",
    helpfulCount: 8,
  },
];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartId = useSelector((state) => state.cart.cartId);
  const cartItems = useSelector((state) => state.cart.items);
  //const cartId = 5;

  const [product, setProduct] = useState({});
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availableStock, setAvailableStock] = useState(0);

  //#region fetch data
  const fetchProduct = async () => {
    try {
      const response = await api.get(
        `/api/Product/CustomerGetProductById/${id}`
      );
      const data = response.data;
      const mappedData = {
        id: data.productId,
        name: data.name,
        description: data.description,
        longDescription: data.longDescription || "",
        price: data.salePrice,
        oldPrice: data.price,
        stockQuantity: data.stockQuantity,
        categoryId: data.category.categoryId,
        categoryName: data.category.categoryName,
        brandId: data.brand.brandId,
        brandName: data.brand.brandName,
        rating: data.rating || 0,
        reviewCount: data.reviewCount || 0,
        images: [
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1577174881658-0f30ed549adc?q=80&w=1974&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?q=80&w=2069&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=2070&auto=format&fit=crop",
        ],
        productColors: data.productColors.map((color) => ({
          id: color.productColorId,
          name: color.color,
          code: color.colorCode,
          stock: color.stockQuantity,
        })),
        createdAt: data.createdAt,
      };
      // Calculate total stock from all colors
      const totalStock = mappedData.productColors.reduce(
        (sum, color) => sum + color.stock,
        0
      );
      mappedData.stockQuantity = totalStock;
      setProduct(mappedData);
      setAvailableStock(totalStock);

      // Map reviews from API response
      if (data.reviews && data.reviews.length > 0) {
        const mappedReviews = data.reviews.map((review) => ({
          id: review.reviewId,
          userId: review.userId,
          userName: review.userName || "Anonymous",
          userAvatar:
            review.userAvatar ||
            `https://i.pravatar.cc/150?img=${review.userId}`,
          productId: review.productId,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
          helpfulCount: 0, // Default value since it's not in the API
        }));
        setReviews(mappedReviews);
      } else {
        setReviews([]);
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      message.error("Error fetching product: " + error.message);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);
  //#endregion

  const handleAddToCart = async () => {
    if (!selectedColor) {
      message.warning("Please select a color before adding to cart");
      return;
    }

    if (!cartId) {
      message.error("Cart not found. Please try again later.");
      return;
    }

    // Use cart items from the component level

    // Check if this product color is already in the cart
    const existingCartItem = cartItems.find(
      (item) => item.productColor.productColorId === selectedColor.id
    );

    console.log(cartItems);
    console.log(selectedColor.id);

    // Calculate total quantity (existing + new)
    const existingQuantity = existingCartItem ? existingCartItem.quantity : 0;
    const totalQuantity = existingQuantity + quantity;

    console.log(totalQuantity);
    console.log(selectedColor.stock);

    // Check if total quantity exceeds available stock
    if (totalQuantity > selectedColor.stock) {
      message.error(
        `Cannot add ${quantity} items to cart. You already have ${existingQuantity} in your cart and the total would exceed the available stock of ${selectedColor.stock}.`
      );
      return;
    }

    try {
      const itemData = {
        cartId: cartId,
        productColorId: selectedColor.id,
        quantity: quantity,
      };

      await dispatch(addItemToCart(itemData)).unwrap();
      message.success(`${product.name} added to cart successfully!`);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      message.error("Failed to add item to cart. Please try again.");
    }
  };

  // Handle quantity change
  // Handle color selection
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setAvailableStock(color.stock);
    // Reset quantity if it exceeds new stock
    if (quantity > color.stock) {
      setQuantity(1);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0 && newQuantity <= availableStock) {
      setQuantity(newQuantity);
    }
  };

  const handleBackToProducts = () => navigate("/products");

  return (
    <motion.div
      className="container mx-auto px-4 md:px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.button
        onClick={handleBackToProducts}
        className="flex items-center cursor-pointer text-primary-300 hover:text-primary-500 transition mb-2 group"
        whileHover={{ x: -5 }}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        <span>Back to Products</span>
      </motion.button>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <ProductImageCarousel
            images={product.images}
            productName={product.name}
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <div className="flex flex-col space-y-4">
            {/* Title and Brand */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold">
                {product.name}
              </h1>
              <div className="flex items-center mt-2">
                <span className="text-muted-foreground">By </span>
                <span className="ml-1 font-medium">{product.brandName}</span>
                <span className="mx-2 text-muted-foreground">in</span>
                <div className=" px-2 py-1 text-sm font-medium bg-primary-100 rounded">
                  {product.categoryName}
                </div>
              </div>
            </div>

            {/* Rating Summary */}
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-muted fill-muted"
                  }`}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                </svg>
              ))}
              <div className="text-sm font-medium ml-1">{product.rating}</div>
              <div className="text-sm text-muted-foreground">
                ({product.reviewCount} reviews)
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-bold">
                ${product.price ? product.price.toFixed(2) : "0.00"}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-muted-foreground line-through">
                  ${product.oldPrice ? product.oldPrice.toFixed(2) : "0.00"}
                </span>
              )}
              {product.oldPrice && product.oldPrice > product.price && (
                <div className="ml-2 px-2 py-1 text-sm font-medium bg-red-300 rounded">
                  Save $
                  {product.oldPrice && product.price
                    ? (product.oldPrice - product.price).toFixed(2)
                    : "0.00"}
                </div>
              )}
            </div>

            {/* Short Description */}
            <p className="text-muted-foreground line-clamp-2">
              {product.description}
            </p>

            {/* Color Selection */}
            <div className="mt-2">
              <span className="text-sm font-medium mb-2 block">
                Color: {selectedColor?.name || "None"}
              </span>
              <div className="flex space-x-2">
                {product.productColors &&
                  product.productColors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => handleColorSelect(color)}
                      className={`w-10 h-10 rounded-full border-2 cursor-pointer ${
                        selectedColor?.id === color.id
                          ? "border-primary"
                          : "border-transparent"
                      } transform transition-transform ${
                        selectedColor?.id === color.id
                          ? "scale-110"
                          : "scale-100"
                      } hover:scale-110`}
                      style={{
                        backgroundColor: color.code,
                        boxShadow:
                          selectedColor?.id === color.id
                            ? "0 0 0 2px rgba(59, 130, 246, 0.3)"
                            : "none",
                      }}
                      aria-label={`Select ${color.name} color`}
                    />
                  ))}
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center mt-2">
              <span className="text-sm font-medium mr-4">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="px-3 py-1 text-lg disabled:opacity-50 cursor-pointer hover:bg-muted transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-1 font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= availableStock}
                  className="px-3 py-1 text-lg disabled:opacity-50 cursor-pointer hover:bg-muted transition-colors"
                >
                  +
                </button>
              </div>
              <span className="ml-4 text-sm text-muted-foreground">
                {selectedColor
                  ? `${availableStock} available`
                  : `Total stock: ${product.stockQuantity}`}
              </span>
            </div>

            {/* Action Buttons */}
            <motion.button
              onClick={handleAddToCart}
              disabled={!selectedColor}
              className={`flex items-center px-4 py-2 w-fit cursor-pointer text-white rounded-lg transition mt-4 ${
                selectedColor
                  ? "bg-gradient-to-br from-primary to-secondary hover:from-primary-500 hover:to-primary-500"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              whileHover={selectedColor ? { scale: 1.05 } : {}}
              whileTap={selectedColor ? { scale: 0.95 } : {}}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {selectedColor ? "Add to Cart" : "Select a Color"}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Additional Details & Specs */}
      <motion.div
        className="pb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
      >
        <h2 className="text-2xl font-semibold mb-4">Product Details</h2>
        <div className="bg-white rounded-lg shadow-sm p-6 min-h-96">
          <div
            className="prose prose-stone max-w-none"
            dangerouslySetInnerHTML={{ __html: product.longDescription }}
          />
        </div>
      </motion.div>
      <ProductReviews
        reviews={reviews}
        productId={product.id}
        averageRating={product.rating}
        totalReviews={product.reviewCount}
      />
    </motion.div>
  );
}
