import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Edit, Trash, ChevronLeft, ChevronRight } from "lucide-react";
import { Modal, Input, InputNumber, Select, message } from "antd";
import api from "../../../features/AxiosInstance/AxiosInstance";

const ProductStock = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  // Thêm state cho phân trang
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Fetch products from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch products
        const productsResponse = await api.get("/api/Product/AdminGetAllProduct");
        const mappedProducts = productsResponse.data.map(product => ({
          id: product.productId,
          name: product.name,
          category: product.category.categoryName,
          categoryId: product.category.categoryId,
          price: `$${product.price.toFixed(2)}`,
          piece: product.stockQuantity,
          availableColors: product.productColors?.map(c => c.color) || ["black"], // Lấy màu từ API
          // Sử dụng imageUrl từ productImages nếu có
          image: product.productImages && product.productImages.length > 0 
            ? product.productImages[0].imageUrl 
            : `https://picsum.photos/300/300?random=${product.productId}`
        }));
        setProducts(mappedProducts);
        
        // Fetch categories
        const categoriesResponse = await api.get("/api/Category/GetAllCategory");
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openEditModal = (product) => {
    setEditingProduct({ ...product }); // clone to avoid mutating original
    setIsEditModalOpen(true);
  };
  
  const handleEditChange = (field, value) => {
    setEditingProduct(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSaveEdit = async () => {
    try {
      // Upload ảnh nếu có chọn file mới
      let imageUrls = editingProduct.imageUrls || [];
      
      if (selectedFile) {
        const uploadedImageUrl = await handleImageUpload(selectedFile);
        if (uploadedImageUrl) {
          imageUrls = [uploadedImageUrl];
        }
      }
      
      // Chuẩn bị dữ liệu để gửi lên API
      const productData = {
        name: editingProduct.name,
        description: editingProduct.description,
        price: parseFloat(editingProduct.rawPrice || editingProduct.price.replace('$', '')),
        stockQuantity: editingProduct.piece,
        categoryId: editingProduct.categoryId,
        brandId: editingProduct.brandId || 1,
        longDescription: editingProduct.longDescription || editingProduct.description,
        imageUrls: imageUrls,
        colors: editingProduct.availableColors.map(color => ({
          color: color,
          colorCode: colorMap[color] ? colorMap[color].replace('bg-', '#') : '#000000',
          stockQuantity: Math.floor(editingProduct.piece / editingProduct.availableColors.length)
        }))
      };
      
      // Gọi API cập nhật sản phẩm
      const response = await api.put(`/api/Product/UpdateProduct/${editingProduct.id}`, productData);
      
      if (response.status === 200) {
        // Cập nhật state local với dữ liệu từ response
        const updatedProduct = response.data;
        
        setProducts(prev =>
          prev.map(p => (p.id === editingProduct.id ? {
            ...p,
            name: editingProduct.name,
            category: categories.find(c => c.categoryId === editingProduct.categoryId)?.categoryName || p.category,
            categoryId: editingProduct.categoryId,
            price: `$${productData.price.toFixed(2)}`,
            rawPrice: productData.price,
            piece: editingProduct.piece,
            // Sử dụng URL ảnh từ response nếu có
            image: updatedProduct.productImages && updatedProduct.productImages.length > 0 
              ? updatedProduct.productImages[0].imageUrl 
              : p.image,
            description: editingProduct.description,
            availableColors: editingProduct.availableColors
          } : p))
        );
        
        message.success("Cập nhật sản phẩm thành công");
        setIsEditModalOpen(false);
        setSelectedFile(null);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      message.error("Không thể cập nhật sản phẩm: " + (error.response?.data || error.message));
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Tính toán tổng số trang
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Lấy sản phẩm cho trang hiện tại
  const currentProducts = filteredProducts.slice(
    currentPage * itemsPerPage, 
    (currentPage + 1) * itemsPerPage
  );

  // Hàm tạo số trang để hiển thị
  const getPaginationNumbers = () => {
    const pages = [];
    const maxDisplayedPages = 5;
    
    if (totalPages <= maxDisplayedPages) {
      // Hiển thị tất cả các trang nếu tổng số trang <= số trang tối đa hiển thị
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Hiển thị một tập hợp con các trang với trang hiện tại ở giữa
      let startPage = Math.max(0, currentPage - Math.floor(maxDisplayedPages / 2));
      let endPage = Math.min(totalPages - 1, startPage + maxDisplayedPages - 1);
      
      // Điều chỉnh nếu chúng ta gần cuối
      if (endPage - startPage < maxDisplayedPages - 1) {
        startPage = Math.max(0, endPage - maxDisplayedPages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

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

  // Hàm xử lý upload ảnh
  const handleImageUpload = async (file) => {
    try {
      // Tạo FormData để gửi file
      const formData = new FormData();
      formData.append('file', file);
      
      // Gọi API upload ảnh
      const response = await api.post('/api/Upload/UploadImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Lấy đường dẫn ảnh từ response
      const imageUrl = response.data.imageUrl;
      
      // Cập nhật state với đường dẫn ảnh mới
      setImagePreview(imageUrl);
      
      // Cập nhật đường dẫn ảnh vào editingProduct
      handleEditChange("imageUrls", [imageUrl]);
      
      message.success("Tải ảnh lên thành công");
      return imageUrl;
    } catch (error) {
      console.error("Lỗi khi tải ảnh lên:", error);
      message.error("Không thể tải ảnh lên: " + (error.response?.data || error.message));
      return null;
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
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <motion.tr 
                  key={product.id}
                  variants={itemVariants}
                  whileHover={{ backgroundColor: "#f9fafb" }}
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="h-12 w-12 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                      <img 
                        src={product.image.startsWith('/api') 
                          ? `${api.defaults.baseURL}${product.image}` 
                          : product.image} 
                        alt={product.name} 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://picsum.photos/300/300?random=${product.id}`;
                        }}
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
                      <button className="p-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => openEditModal(product)}>
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 rounded border border-gray-200 text-red-500 hover:bg-gray-50 transition-colors cursor-pointer">
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
            
            {/* Thêm hàng trống nếu số sản phẩm ít hơn itemsPerPage */}
            {currentProducts.length > 0 && currentProducts.length < itemsPerPage && (
              Array.from({ length: itemsPerPage - currentProducts.length }).map((_, i) => (
                <tr key={`empty-${i}`} className="h-[72px]">
                  <td colSpan={7}></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>
      
      {/* Thêm phân trang */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-6 border-t border-gray-200 pt-4">
          <div className="flex items-center space-x-2">
            <button
              className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 border border-gray-300"
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
            >
              <ChevronLeft size={18} className="text-gray-600" />
            </button>
            
            {getPaginationNumbers().map((page) => (
              <motion.button
                key={page}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ${
                  currentPage === page 
                    ? 'bg-primary-500 text-white' 
                    : 'border border-gray-300 text-gray-600 hover:bg-gray-100'
                } transition-colors`}
                onClick={() => setCurrentPage(page)}
              >
                {page + 1}
              </motion.button>
            ))}
            
            <button
              className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 border border-gray-300"
              disabled={currentPage >= totalPages - 1}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
            >
              <ChevronRight size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
      )}

      <Modal
        title="Edit Product"
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          setSelectedFile(null);
          setImagePreview(null);
        }}
        onOk={handleSaveEdit}
        okText="Save"
        cancelText="Cancel"
        width={600}
      >
        {editingProduct && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <Input
                  value={editingProduct.name}
                  onChange={(e) => handleEditChange("name", e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Price ($)</label>
                <Input
                  value={editingProduct.price}
                  onChange={(e) => handleEditChange("price", e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                <InputNumber
                  value={editingProduct.piece}
                  onChange={(value) => handleEditChange("piece", value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Select
                  value={editingProduct.categoryId}
                  onChange={(value) => handleEditChange("categoryId", value)}
                  className="w-full"
                  options={categories?.map(c => ({ value: c.categoryId, label: c.categoryName }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Input.TextArea
                value={editingProduct.description}
                onChange={(e) => handleEditChange("description", e.target.value)}
                rows={3}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Product Image</label>
              <div className="flex items-center gap-4">
                <div
                  onClick={() => document.getElementById("imageUpload").click()}
                  className="w-24 h-24 rounded border border-gray-200 cursor-pointer overflow-hidden flex items-center justify-center hover:bg-gray-50 transition"
                >
                  {imagePreview || editingProduct.image ? (
                    <img
                      src={imagePreview || (editingProduct.image.startsWith('/api') 
                        ? `${api.defaults.baseURL}${editingProduct.image}` 
                        : editingProduct.image)}
                      alt="Preview"
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://picsum.photos/300/300?random=${editingProduct.id}`;
                      }}
                    />
                  ) : (
                    <div className="text-gray-400 text-sm text-center">
                      Click to upload
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col text-sm">
                  <span className="font-medium">Upload new image</span>
                  <span className="text-gray-500 text-xs">JPG, JPEG or PNG. Max 5MB.</span>
                </div>
              </div>

              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    if (file.size > 5 * 1024 * 1024) {
                      message.error("File size should not exceed 5MB");
                      return;
                    }
                    setSelectedFile(file);
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setImagePreview(reader.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default ProductStock;
