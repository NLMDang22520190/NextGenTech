import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Filter, ChevronLeft, ChevronRight, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { message, Spin, Modal, Form, Input, Popconfirm } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllCategory,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../../features/Admin/Categories/Category";

export default function Categories() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { categoryItems, status, error } = useSelector(
    (state) => state.category
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = React.useState(8);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      await dispatch(fetchAllCategory()).unwrap();
    } catch (err) {
      message.error(
        "Failed to fetch categories: " + (err.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [dispatch]);

  // Modal handling functions
  const showAddModal = () => {
    setIsModalOpen(true);
    setCurrentCategory(null);
    form.resetFields();
  };

  const showEditModal = (category) => {
    console.log(category);
    setIsEditMode(true);
    setIsModalOpen(true);
    setCurrentCategory(category);
    form.setFieldsValue({
      categoryName: category.name,
      description: category.description
    });
  }

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      const categoryData = {
        categoryName: values.categoryName,
        description: values.description || "",
      };

      if (isEditMode && currentCategory) {
        // Update existing category
        await dispatch(updateCategory({
          categoryId: currentCategory.id,
          ...categoryData
        })).unwrap();
        message.success("Category updated successfully");
      } else {
        // Add new category
        await dispatch(addCategory(categoryData)).unwrap();
        message.success("Category added successfully");
      }

      setIsModalOpen(false);
      form.resetFields();
    } catch (err) {
      message.error(
        "Failed to add category: " + (err.message || "Unknown error")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      await dispatch(deleteCategory(categoryId)).unwrap();
      message.success("Category deleted successfully");
    } catch (err) {
      message.error(
        "Failed to delete category: " + (err.message || "Unknown error")
      );
    }
  };

  const categoryData = categoryItems.map((category) => ({
    id: category.categoryId,
    name: category.categoryName,
    description: category.description,
  }));

  const filterCategoryData = categoryData.filter(
    (row) => row.name.toLowerCase().includes(searchQuery.toLowerCase())
    // && ((filter != "" && subfilter != "") ? (filter === 'Loại' ? row.categoryName === subfilter : row.supplierName === subfilter): true)
  );

  const totalItems = filterCategoryData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-800">Categories</h1>

      <div className="flex justify-between">
        <div
          className={`relative mr-6 ${
            searchQuery.length > 0 ? "w-64" : "w-44"
          } focus-within:w-64 hover:w-64 hover:duration-300 duration-300`}
        >
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            className="pl-10 pr-4 py-2 w-full border rounded-full text-sm focus:outline-none focus:border-primary-600"
            placeholder="Search category"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              console.log(searchQuery);
            }}
          />
        </div>

        <button
          className="flex items-center py-2 px-5 text-white bg-primary rounded-lg font-bold text-sm hover:scale-105 active:scale-95 transition-all duration-100"
          onClick={showAddModal}
        >
          <Plus size={16} className="mr-1" />
          <span className="cursor-pointer">Add Category</span>
        </button>
      </div>

      {loading || status === "loading" ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" tip="Loading categories..." />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">
          Error loading categories: {error}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    NAME
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    DESCRIPTION
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <motion.tbody
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-white divide-y divide-gray-200 h-[60vh]"
              >
                {filterCategoryData
                  .slice(
                    currentPage * itemsPerPage,
                    (currentPage + 1) * itemsPerPage
                  )
                  .map((category, index) => (
                    <motion.tr
                      key={category.id}
                      variants={itemVariants}
                      className="hover:bg-gray-50 h-[7.5vh]"
                    >
                      <td className="px-4 py-2 text-sm text-gray-500 text-center">
                        {category.id}
                      </td>
                      <td className="px-4 py-2">
                        <div className="text-sm font-medium text-black">
                          {category.name}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500">
                        {category.description}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        <div className="flex space-x-2 justify-center">
                          <button className="text-gray-400 hover:text-gray-600" onClick={() => showEditModal(category)}>
                            <Pencil size={16} />
                          </button>
                          <Popconfirm
                            title="Delete Category"
                            description="Are you sure you want to delete this category?"
                            onConfirm={() => handleDelete(category.id)}
                            okText="Yes"
                            cancelText="No"
                            placement="left"
                          >
                            <button className="text-gray-400 hover:text-gray-600">
                              <Trash2 size={16} />
                            </button>
                          </Popconfirm>
                        </div>
                      </td>
                    </motion.tr>
                  ))}

                {Array.from({
                  length:
                    itemsPerPage -
                    Math.min(
                      itemsPerPage,
                      totalItems - currentPage * itemsPerPage
                    ),
                }).map((_, i) => (
                  <tr key={`empty-${i}`} className="h-[7.5vh]">
                    <td className="px-4 py-2 text-sm text-gray-300 text-center">
                      -
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-300">-</td>
                    <td className="px-4 py-2 text-sm text-gray-300">-</td>
                    <td className="px-4 py-2 text-sm text-gray-300">-</td>
                  </tr>
                ))}
              </motion.tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="text-sm text-gray-500 mb-4 sm:mb-0">
                Showing {currentPage * itemsPerPage + 1}-
                {Math.min((currentPage + 1) * itemsPerPage, totalItems)} of{" "}
                {totalItems}
              </div>

              {/* Pagination - Centered */}
              {totalPages > 1 && (
                <div className="flex-grow flex justify-center">
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
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      <Modal
        title={isEditMode ? "Edit Category" : "Add New Category"}
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
            name="categoryName"
            label="Category Name"
            rules={[
              {
                required: true,
                message: "Please enter the category name",
              },
            ]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>

          <Form.Item name="description" label="Description (Optional)">
            <Input.TextArea placeholder="Enter category description" rows={4} />
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
                : (isEditMode ? "Update Category" : "Add Category")
              }
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
