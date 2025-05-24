import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Spin, message, Modal, Input, Form } from "antd";
import BrandCard from "../../../components/Admin/Brands/BrandCard";
import { fetchAllBrand, addBrand, updateBrand, deleteBrand } from "../../../features/Admin/Brands/Brand";
import { Search, Plus, Upload as UploadIcon } from "lucide-react";
import api from "../../../features/AxiosInstance/AxiosInstance";

export default function Brands() {
  const dispatch = useDispatch();
  const { brandItems, status, error } = useSelector((state) => state.brand);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBrand, setCurrentBrand] = useState(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Function to fetch brands data
  const fetchBrands = async () => {
    try {
      setLoading(true);
      await dispatch(fetchAllBrand()).unwrap();
    } catch (err) {
      message.error(
        "Failed to fetch brands: " + (err.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch brands on component mount
  useEffect(() => {
    fetchBrands();
  }, [dispatch]);

  // Modal handling functions
  const showAddModal = () => {
    setIsEditMode(false);
    setCurrentBrand(null);
    setIsModalOpen(true);
    setImagePreview(null);
    setSelectedFile(null);
    form.resetFields();
  };

  const showEditModal = (brand) => {
    setIsEditMode(true);
    setCurrentBrand(brand);
    setIsModalOpen(true);

    // Handle image preview for API URLs
    const imageUrl = brand.image || null;
    setImagePreview(imageUrl);
    setSelectedFile(null);

    form.setFieldsValue({
      brandName: brand.name,
      brandImageUrl: imageUrl
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setImagePreview(null);
    setSelectedFile(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);

      // Upload image if a file is selected
      let imageUrl = values.brandImageUrl || "";
      if (selectedFile) {
        const uploadedImageUrl = await handleImageUpload(selectedFile);
        if (uploadedImageUrl) {
          imageUrl = uploadedImageUrl;
        }
      }

      const brandData = {
        brandName: values.brandName,
        brandImageUrl: imageUrl
      };

      if (isEditMode && currentBrand) {
        // Update existing brand
        await dispatch(updateBrand({
          brandId: currentBrand.id,
          ...brandData
        })).unwrap();
        message.success("Brand updated successfully");
      } else {
        // Add new brand
        await dispatch(addBrand(brandData)).unwrap();
        message.success("Brand added successfully");
      }

      setIsModalOpen(false);
      setImagePreview(null);
      setSelectedFile(null);
      form.resetFields();

      // Refresh data after successful operation
      await fetchBrands();
    } catch (err) {
      const action = isEditMode ? "update" : "add";
      message.error(`Failed to ${action} brand: ${err.message || "Unknown error"}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle brand deletion
  const handleDeleteBrand = async (brandId) => {
    try {
      await dispatch(deleteBrand(brandId)).unwrap();
      message.success("Brand deleted successfully");

      // Refresh data after successful deletion
      await fetchBrands();
    } catch (err) {
      message.error("Failed to delete brand: " + (err.message || "Unknown error"));
    }
  };

  // Handle image upload
  const handleImageUpload = async (file) => {
    try {
      // Create FormData to send the file
      const formData = new FormData();
      formData.append('file', file);

      // Call the upload API
      const response = await api.post('/api/Upload/UploadImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Get the image URL from the response
      const imageUrl = response.data.imageUrl;

      // Update the image preview
      setImagePreview(imageUrl);

      // Update the form field with the new image URL
      form.setFieldsValue({
        brandImageUrl: imageUrl
      });

      message.success("Image uploaded successfully");
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error("Failed to upload image: " + (error.response?.data || error.message));
      return null;
    }
  };

  // Map API response data to the format expected by BrandCard
  const mappedBrands = brandItems
    .filter((brand) =>
      brand.brandName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map((brand) => ({
      id: brand.brandId,
      name: brand.brandName,
      image: brand.brandImageUrl || "",
    }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Brands</h1>

      <div className="flex justify-between items-center">
        <div
          className={`relative ${
            searchQuery.length > 0 ? "w-64" : "w-40"
          } focus-within:w-64 hover:w-64 hover:duration-300 duration-300`}
        >
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            className="pl-10 pr-4 py-2 w-full border rounded-full text-sm focus:outline-none focus:border-primary-600"
            placeholder="Search brand"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
          />
        </div>

        <button
          className="flex items-center py-2 px-5 text-white bg-primary rounded-lg font-bold text-sm hover:scale-105 active:scale-95 transition-all duration-100"
          onClick={showAddModal}
        >
          <Plus size={16} className="mr-1" />
          <span className="cursor-pointer">Add Brand</span>
        </button>
      </div>

      {loading || status === "loading" ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" tip="Loading brands..." />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">
          Error loading brands: {error}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          {mappedBrands.map((brand) => (
            <BrandCard
              key={brand.id}
              brand={brand}
              onEdit={showEditModal}
              onDelete={handleDeleteBrand}
            />
          ))}
        </motion.div>
      )}

      {/* Add/Edit Brand Modal */}
      <Modal
        title={isEditMode ? "Edit Brand" : "Add New Brand"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            name="brandName"
            label="Brand Name"
            rules={[
              {
                required: true,
                message: "Please enter the brand name",
              },
            ]}
          >
            <Input placeholder="Enter brand name" />
          </Form.Item>

          <Form.Item
            label="Brand Image"
          >
            <div className="flex items-center gap-4">
              <div
                onClick={() => document.getElementById("brandImageUpload").click()}
                className="w-24 h-24 rounded border border-gray-200 cursor-pointer overflow-hidden flex items-center justify-center hover:bg-gray-50 transition"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview.startsWith('/api')
                      ? `${api.defaults.baseURL}${imagePreview}`
                      : imagePreview}
                    alt="Preview"
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/300x300?text=No+Image";
                    }}
                  />
                ) : (
                  <div className="text-gray-400 text-sm text-center flex flex-col items-center justify-center">
                    <UploadIcon size={20} className="mb-1" />
                    <span>Upload</span>
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
              id="brandImageUpload"
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
          </Form.Item>

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
                : (isEditMode ? "Update Brand" : "Add Brand")
              }
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
