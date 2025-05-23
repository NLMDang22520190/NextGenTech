import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "../../../components/Admin/Products/ProductCard";
import { Search, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { message, Spin, Modal, Form, Input, Select, InputNumber, Upload, Button, Popconfirm } from "antd";
import { PlusOutlined, InboxOutlined } from "@ant-design/icons";
import { fetchAllProduct, addProduct, updateProduct, deleteProduct } from "../../../features/Admin/Products/Product";
import { fetchAllBrand } from "../../../features/Admin/Brands/Brand";
import { fetchAllCategory } from "../../../features/Admin/Categories/Category";
import dayjs from "dayjs";

export default function Products() {
  const dispatch = useDispatch();
  const { productItems, status, error } = useSelector((state) => state.product);
  const { brandItems } = useSelector((state) => state.brand);
  const { categoryItems } = useSelector((state) => state.category);

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // Color state
  const [colors, setColors] = useState([{ color: "", colorCode: "#000000", stockQuantity: 0 }]);

  // Image URLs state
  const [imageUrls, setImageUrls] = useState([]);

  // Function to fetch products data
  const fetchProducts = async () => {
    try {
      setLoading(true);
      await dispatch(fetchAllProduct()).unwrap();
    } catch (err) {
      message.error("Unable to fetch products. Please try again.");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch brands data
  const fetchBrands = async () => {
    try {
      await dispatch(fetchAllBrand()).unwrap();
    } catch (err) {
      message.error("Unable to fetch brands. Please try again.");
      console.error("Error fetching brands:", err);
    }
  };

  // Function to fetch categories data
  const fetchCategories = async () => {
    try {
      await dispatch(fetchAllCategory()).unwrap();
    } catch (err) {
      message.error("Unable to fetch categories. Please try again.");
      console.error("Error fetching categories:", err);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchProducts(),
        fetchBrands(),
        fetchCategories()
      ]);
    };

    fetchData();
  }, [dispatch]);

  // Map API response data to the format expected by the component
  const products = productItems.map(product => ({
    id: product.productId,
    name: product.name,
    price: product.price,
    image: product.imageUrl || `https://picsum.photos/300/300?random=${product.productId}`,
    rating: 4.5, // Default rating
    reviews: 100, // Default reviews
    brand: product.brand?.brandName || "Unknown Brand",
    category: product.category?.categoryName || "Unknown Category",
    description: product.description || "",
    stockQuantity: product.stockQuantity || 0,
    brandId: product.brand?.brandId,
    categoryId: product.category?.categoryId,
  }));

  const filterProductsData = products.filter(row =>
    row.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Modal handling functions
  const showAddModal = () => {
    setIsEditMode(false);
    setCurrentProduct(null);
    setIsModalOpen(true);
    setColors([{ color: "", colorCode: "#000000", stockQuantity: 0 }]);
    setImageUrls([]);
    form.resetFields();
  };

  const showEditModal = (product) => {
    setIsEditMode(true);
    setCurrentProduct(product);
    setIsModalOpen(true);

    // Find the original product data
    const productData = productItems.find(p => p.productId === product.id);

    // Set form values
    form.setFieldsValue({
      name: product.name,
      price: product.price,
      description: product.description,
      brandId: product.brandId,
      categoryId: product.categoryId,
    });

    // Set colors and images if available
    if (productData && productData.productColors) {
      setColors(productData.productColors.map(color => ({
        color: color.color,
        colorCode: color.colorCode,
        stockQuantity: color.stockQuantity
      })));
    } else {
      setColors([{ color: "", colorCode: "#000000", stockQuantity: 0 }]);
    }

    if (productData && productData.productImages) {
      setImageUrls(productData.productImages.map(img => img.imageUrl));
    } else {
      setImageUrls([]);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // Handle color changes
  const addColor = () => {
    setColors([...colors, { color: "", colorCode: "#000000", stockQuantity: 0 }]);
  };

  const removeColor = (index) => {
    const newColors = [...colors];
    newColors.splice(index, 1);
    setColors(newColors);
  };

  const updateColor = (index, field, value) => {
    const newColors = [...colors];
    newColors[index][field] = value;
    setColors(newColors);
  };

  // Handle image URL changes
  const addImageUrl = () => {
    setImageUrls([...imageUrls, ""]);
  };

  const removeImageUrl = (index) => {
    const newUrls = [...imageUrls];
    newUrls.splice(index, 1);
    setImageUrls(newUrls);
  };

  const updateImageUrl = (index, value) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);

      // Validate colors
      if (colors.length === 0 || colors.some(c => !c.color || c.stockQuantity < 0)) {
        message.error("Please provide valid colors and stock quantities");
        setSubmitting(false);
        return;
      }

      // Validate image URLs
      if (imageUrls.length === 0 || imageUrls.some(url => !url)) {
        message.error("Please provide at least one valid image URL");
        setSubmitting(false);
        return;
      }

      const productData = {
        name: values.name,
        description: values.description || "",
        longDescription: values.longDescription || values.description || "",
        price: values.price,
        brandId: values.brandId,
        categoryId: values.categoryId,
        colors: colors,
        imageUrls: imageUrls
      };

      if (isEditMode && currentProduct) {
        // Update existing product
        await dispatch(updateProduct({
          productId: currentProduct.id,
          ...productData
        })).unwrap();
        message.success("Product updated successfully");
      } else {
        // Add new product
        await dispatch(addProduct(productData)).unwrap();
        message.success("Product added successfully");
      }

      setIsModalOpen(false);
      form.resetFields();

      // Refresh data after successful operation
      await fetchProducts();
    } catch (err) {
      console.error("Error submitting product:", err);
      const action = isEditMode ? "update" : "add";
      message.error(`Unable to ${action} product. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await dispatch(deleteProduct(productId)).unwrap();
      message.success("Product deleted successfully");

      // Refresh data after successful deletion
      await fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      message.error("Unable to delete product. Please try again.");
    }
  };

  return (
    <div className='space-y-6'>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Products</h1>

        <button
          className="flex items-center py-2 px-5 text-white bg-primary rounded-lg font-bold text-sm hover:scale-105 active:scale-95 transition-all duration-100"
          onClick={showAddModal}
        >
          <Plus size={16} className="mr-1" />
          <span className="cursor-pointer">Add Product</span>
        </button>
      </div>

      <div className={`relative ${searchQuery.length > 0 ? "w-64" : "w-40"} focus-within:w-64 hover:w-64 hover:duration-300 duration-300`}>
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <Search size={18} />
        </span>
        <input
          type="text"
          className="pl-10 pr-4 py-2 w-full border rounded-full text-sm focus:outline-none focus:border-primary-600"
          placeholder="Search product"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
          }}
        />
      </div>

      {loading || status === "loading" ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" tip="Loading products..." />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">
          Error loading products: {error}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          {filterProductsData.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500">
              No products found. Try a different search or add a new product.
            </div>
          ) : (
            filterProductsData.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={() => showEditModal(product)}
                onDelete={handleDeleteProduct}
              />
            ))
          )}
        </motion.div>
      )}

      {/* Add/Edit Product Modal */}
      <Modal
        title={isEditMode ? "Edit Product" : "Add New Product"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label="Product Name"
              rules={[
                {
                  required: true,
                  message: "Please enter the product name",
                },
              ]}
            >
              <Input placeholder="Enter product name" />
            </Form.Item>

            <Form.Item
              name="price"
              label="Price"
              rules={[
                {
                  required: true,
                  message: "Please enter the price",
                },
              ]}
            >
              <InputNumber
                min={0}
                step={0.01}
                precision={2}
                style={{ width: '100%' }}
                placeholder="Enter price"
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="brandId"
              label="Brand"
              rules={[
                {
                  required: true,
                  message: "Please select a brand",
                },
              ]}
            >
              <Select placeholder="Select brand">
                {brandItems.map(brand => (
                  <Select.Option key={brand.brandId} value={brand.brandId}>
                    {brand.brandName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="categoryId"
              label="Category"
              rules={[
                {
                  required: true,
                  message: "Please select a category",
                },
              ]}
            >
              <Select placeholder="Select category">
                {categoryItems.map(category => (
                  <Select.Option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={3} placeholder="Enter product description" />
          </Form.Item>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Colors and Stock
            </label>
            {colors.map((color, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <Input
                  placeholder="Color name (e.g., Red)"
                  value={color.color}
                  onChange={(e) => updateColor(index, 'color', e.target.value)}
                  style={{ width: '40%' }}
                />
                <Input
                  type="color"
                  value={color.colorCode}
                  onChange={(e) => updateColor(index, 'colorCode', e.target.value)}
                  style={{ width: '15%' }}
                />
                <InputNumber
                  min={0}
                  placeholder="Stock"
                  value={color.stockQuantity}
                  onChange={(value) => updateColor(index, 'stockQuantity', value)}
                  style={{ width: '25%' }}
                />
                <Button
                  danger
                  onClick={() => removeColor(index)}
                  disabled={colors.length <= 1}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button type="dashed" onClick={addColor} block icon={<PlusOutlined />}>
              Add Color
            </Button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URLs
            </label>
            {imageUrls.map((url, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <Input
                  placeholder="Image URL"
                  value={url}
                  onChange={(e) => updateImageUrl(index, e.target.value)}
                  style={{ width: '85%' }}
                />
                <Button
                  danger
                  onClick={() => removeImageUrl(index)}
                  disabled={imageUrls.length <= 1}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button type="dashed" onClick={addImageUrl} block icon={<PlusOutlined />}>
              Add Image URL
            </Button>
          </div>

          <Form.Item className="mb-0 flex justify-end">
            <button
              type="button"
              className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              disabled={submitting}
            >
              {submitting
                ? (isEditMode ? "Updating..." : "Adding...")
                : (isEditMode ? "Update Product" : "Add Product")
              }
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
