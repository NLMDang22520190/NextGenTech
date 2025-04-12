import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Edit, Trash } from "lucide-react";
import { Modal, Input, InputNumber, Select } from "antd";


const ProductStock = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Apple Watch Series 4",
      category: "Digital Product",
      price: "$690.00",
      piece: 63,
      availableColors: ["black", "gray", "pink"],
      image: "/lovable-uploads/67e7eb43-08e4-4375-ab40-06eb193e81cd.png"
    },
    {
      id: 2,
      name: "Microsoft Headsquare",
      category: "Digital Product",
      price: "$190.00",
      piece: 13,
      availableColors: ["black", "pink", "blue", "yellow"],
      image: "/lovable-uploads/67e7eb43-08e4-4375-ab40-06eb193e81cd.png"
    },
    {
      id: 3,
      name: "Women's Dress",
      category: "Fashion",
      price: "$640.00",
      piece: 635,
      availableColors: ["maroon", "blue", "black", "purple"],
      image: "/lovable-uploads/67e7eb43-08e4-4375-ab40-06eb193e81cd.png"
    },
    {
      id: 4,
      name: "Samsung A50",
      category: "Mobile",
      price: "$400.00",
      piece: 67,
      availableColors: ["navy", "black", "pink"],
      image: "/lovable-uploads/67e7eb43-08e4-4375-ab40-06eb193e81cd.png"
    },
    {
      id: 5,
      name: "Camera",
      category: "Electronic",
      price: "$420.00",
      piece: 52,
      availableColors: ["navy", "black", "pink"],
      image: "/lovable-uploads/67e7eb43-08e4-4375-ab40-06eb193e81cd.png"
    },
    {
      id: 6,
      name: "Microsoft Headsquare",
      category: "Digital Product",
      price: "$190.00",
      piece: 13,
      availableColors: ["black", "pink", "blue", "yellow"],
      image: "/lovable-uploads/67e7eb43-08e4-4375-ab40-06eb193e81cd.png"
    },
    {
      id: 7,
      name: "Women's Dress",
      category: "Fashion",
      price: "$640.00",
      piece: 635,
      availableColors: ["maroon", "blue", "black", "purple"],
      image: "/lovable-uploads/67e7eb43-08e4-4375-ab40-06eb193e81cd.png"
    }
  ]);

  const openEditModal = (product) => {
    setEditingProduct({ ...product }); // clone to avoid mutating original
    setIsEditModalOpen(true);
  };
  
  const handleEditChange = (field, value) => {
    setEditingProduct(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSaveEdit = () => {
    setProducts(prev =>
      prev.map(p => (p.id === editingProduct.id ? editingProduct : p))
    );
    setIsEditModalOpen(false);
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Color mapping for the dots
  const colorMap = {
    black: "bg-black",
    gray: "bg-gray-400",
    pink: "bg-pink-500",
    blue: "bg-blue-500",
    yellow: "bg-yellow-400",
    maroon: "bg-red-700",
    purple: "bg-purple-600",
    navy: "bg-blue-800"
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <motion.h1 
          className="text-2xl font-bold text-gray-800"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Product Stock
        </motion.h1>
        <motion.div 
          className="relative w-64"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <input
            type="text"
            placeholder="Search product name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full border border-gray-200 px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        </motion.div>
      </div>

      <motion.div 
        className="overflow-x-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 bg-white text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-4 py-3 bg-white text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-4 py-3 bg-white text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 bg-white text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 bg-white text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Piece
              </th>
              <th className="px-4 py-3 bg-white text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Available Color
              </th>
              <th className="px-4 py-3 bg-white text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <motion.tr 
                  key={product.id}
                  variants={itemVariants}
                  whileHover={{ backgroundColor: "#f9fafb" }}
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="h-12 w-12 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.category}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.price}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.piece}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex space-x-1">
                      {product.availableColors.map((color, index) => (
                        <div 
                          key={index} 
                          className={`h-5 w-5 rounded-full ${colorMap[color]}`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button className="p-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                        onClick={() => openEditModal(product)}>
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 rounded border border-gray-200 text-red-500 hover:bg-gray-50 transition-colors">
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No products found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
      <Modal
  title="Edit Product"
  open={isEditModalOpen}
  onCancel={() => setIsEditModalOpen(false)}
  onOk={handleSaveEdit}
  okText="Save"
  cancelText="Cancel"
>
  {editingProduct && (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm mb-1">Product Name</label>
        <Input
          value={editingProduct.name}
          onChange={(e) => handleEditChange("name", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Price</label>
        <Input
          value={editingProduct.price}
          onChange={(e) => handleEditChange("price", e.target.value)}
        />
      </div>

      <div>
  <label className="block text-sm mb-1">Image</label>
  
  {/* Preview + trigger file input */}
  <div
    onClick={() => document.getElementById("imageUpload").click()}
    className="w-24 h-24 rounded border border-gray-200 cursor-pointer overflow-hidden flex items-center justify-center hover:opacity-80 transition"
  >
    <img
      src={imagePreview || editingProduct.image}
      alt="Preview"
      className="object-cover w-full h-full"
    />
  </div>

  {/* File input hidden */}
  <input
    type="file"
    id="imageUpload"
    accept="image/*"
    className="hidden"
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result); 
          handleEditChange("image", reader.result); 
        };
        reader.readAsDataURL(file);
      }
    }}
  />
</div>


      <div>
        <label className="block text-sm mb-1">Available Colors</label>
        <Select
          mode="tags"
          style={{ width: "100%" }}
          value={editingProduct.availableColors}
          onChange={(value) => handleEditChange("availableColors", value)}
        >
          {/* Optional: preset color options */}
          {Object.keys(colorMap).map((color) => (
            <Select.Option key={color} value={color}>
              {color}
            </Select.Option>
          ))}
        </Select>
      </div>
    </div>
  )}
</Modal>

    </div>
  );
};

export default ProductStock;