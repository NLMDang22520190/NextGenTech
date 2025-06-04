import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Filter,
  ChevronLeft,
  ChevronRight,
  Search,
  ChevronDown,
  Eye,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  message,
  Spin,
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Popconfirm,
  Select,
  Tag,
} from "antd";
import {
  fetchAllPromotion,
  addPromotion,
  updatePromotion,
  deletePromotion,
} from "../../../features/Admin/Promotions/Promotion";
import { fetchAllProduct } from "../../../features/Admin/Products/Product";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const PromotionStatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case true:
        return "bg-green-100 text-green-800";
      case false:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${getStatusStyles()}`}
    >
      {status.toString()}
    </span>
  );
};

export default function Promotions() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { promotionItems, status, error } = useSelector(
    (state) => state.promotion
  );
  const {
    productItems,
    status: productStatus,
    error: productError,
  } = useSelector((state) => state.product);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = React.useState(8);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      await dispatch(fetchAllPromotion()).unwrap();
    } catch (err) {
      message.error(
        "Failed to fetch promotions: " + (err.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const result = await dispatch(fetchAllProduct()).unwrap();
      setProducts(
        result.map((product) => ({
          value: product.productId.toString(),
          label: product.name,
        }))
      );
    } catch (err) {
      message.error(
        "Failed to fetch products: " + (err.message || "Unknown error")
      );
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
    fetchProducts();
  }, [dispatch]);

  useEffect(() => {
    console.log(products);
  },[products])

  const showAddModal = () => {
    setIsEditMode(false);
    setCurrentPromotion(null);
    setIsModalOpen(true);
    form.resetFields();
  };

  const showEditModal = (promotion) => {
    setIsEditMode(true);
    setCurrentPromotion(promotion);
    setIsModalOpen(true);
    form.setFieldsValue({
      name: promotion.name,
      description: promotion.description,
      promotionCode: promotion.code,
      discountPercentage: parseFloat(promotion.discount),
      startDate: dayjs(promotion.originalData.startDate),
      endDate: dayjs(promotion.originalData.endDate),
      productIDs: promotion.originalData.productIDs || [],
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      const formatDate = (date) => {
        const d = date.hour(12).minute(0).second(0);
        return d.toISOString();
      };

      const promotionData = {
        name: values.name,
        description: values.description || "",
        promotionCode: values.promotionCode,
        discountPercentage: values.discountPercentage,
        startDate: formatDate(values.startDate),
        endDate: formatDate(values.endDate),
        productIDs: values.productIDs || [],
      };

      if (isEditMode && currentPromotion) {
        await dispatch(
          updatePromotion({
            promotionId: currentPromotion.id,
            ...promotionData,
          })
        ).unwrap();
        message.success("Promotion updated successfully");
      } else {
        await dispatch(addPromotion(promotionData)).unwrap();
        message.success("Promotion added successfully");
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (err) {
      const action = isEditMode ? "update" : "add";
      message.error(
        `Failed to ${action} promotion: ${err.message || "Unknown error"}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (promotionId) => {
    try {
      await dispatch(deletePromotion(promotionId)).unwrap();
      message.success("Promotion deleted successfully");
    } catch (err) {
      message.error(
        "Failed to delete promotion: " + (err.message || "Unknown error")
      );
    }
  };

  const promotionsData = promotionItems.map((promotion) => ({
    id: promotion.promotionId,
    name: promotion.name,
    description: promotion.description || "",
    discount: `${promotion.discountPercentage}%`,
    code: promotion.promotionCode,
    startDate: dayjs(promotion.startDate).format("DD-MM-YYYY"),
    endDate: dayjs(promotion.endDate).format("DD-MM-YYYY"),
    isProductPromotion: promotion.productIDs && promotion.productIDs.length > 0,
    originalData: promotion,
  }));

  const filterData = promotionsData.filter(
    (row) =>
      row.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterStatus !== ""
        ? row.isProductPromotion.toString() === filterStatus
        : true)
  );

  const totalItems = filterData.length;
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

  const handleFilterChange = async (e) => {
    const value = e.target.value;
    setFilterStatus(value);
    setCurrentPage(0);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-800">Promotions</h1>{" "}
      {/* Header */}
      <div className="flex justify-between">
        <div
          className={`relative ${
            searchQuery.length > 0 ? "w-64" : "w-44"
          } focus-within:w-64 hover:w-64 hover:duration-300 duration-300`}
        >
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            className="pl-10 pr-4 py-2 w-full border rounded-full text-sm focus:outline-none focus:border-primary-600"
            placeholder="Search promotion"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
          />
        </div>

        <div className="flex space-x-4">
          <div className="flex items-center py-2">
            <Filter size={18} className="mr-2 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter By</span>
          </div>

          <div className="relative w-48">
            <select
              title="status filter"
              className="w-full bg-white border border-gray-200 rounded-md shadow-sm py-2 px-4 focus:outline-none text-sm text-gray-700 appearance-none"
              value={filterStatus}
              onChange={handleFilterChange}
            >
              <option value="" className="italic">
                Promotion by product
              </option>
              <option value="true">TRUE</option>
              <option value="false">FALSE</option>
            </select>

            <ChevronDown
              size={16}
              className="text-gray-500 absolute inset-y-3 right-3 flex items-center pointer-events-none"
            />
          </div>

          <button
            className="flex items-center py-2 text-red-500 font-medium text-sm"
            onClick={() => {
              setFilterStatus("");
            }}
          >
            <span className="cursor-pointer">Reset Filter</span>
          </button>

          <button
            className="flex items-center py-2 px-5 text-white bg-primary rounded-lg font-bold text-sm hover:scale-105 active:scale-95 transition-all duration-100"
            onClick={showAddModal}
          >
            <Plus size={16} className="mr-1" />
            <span className="cursor-pointer">Add Promotion</span>
          </button>
        </div>
      </div>
      {/* Table */}
      {loading || status === "loading" ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" tip="Loading promotions..." />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">
          Error loading promotions: {error}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100 h-[5vh]">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Discount
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Code
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Start Date
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    End Date
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-1 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Promotion by product
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Action
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  ></th>
                </tr>
              </thead>
              <motion.tbody
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-white divide-y divide-gray-200 h-[60vh]"
              >
                {filterData
                  .slice(
                    currentPage * itemsPerPage,
                    (currentPage + 1) * itemsPerPage
                  )
                  .map((promotion) => (
                    <motion.tr
                      key={promotion.id}
                      variants={itemVariants}
                      className="hover:bg-gray-50 h-[7.5vh]"
                    >
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {promotion.name}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-center">
                        {promotion.discount}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {promotion.code}{" "}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500">
                        <div className="line-clamp-2">
                          {promotion.description}{" "}
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-end">
                        {promotion.startDate}{" "}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-end">
                        {promotion.endDate}{" "}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-center">
                        <PromotionStatusBadge
                          status={promotion.isProductPromotion}
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex justify-center space-x-2">
                          <button
                            className="text-gray-400 hover:text-green-600 transition-colors"
                            onClick={() => showEditModal(promotion)}
                          >
                            <Pencil size={16} />
                          </button>
                          <Popconfirm
                            title="Delete Promotion"
                            description="Are you sure you want to delete this promotion?"
                            onConfirm={() => handleDelete(promotion.id)}
                            okText="Yes"
                            cancelText="No"
                            placement="left"
                          >
                            <button className="text-gray-400 hover:text-red-600 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </Popconfirm>
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {promotion.isProductPromotion && (
                          <button
                            onClick={() => navigate(`/promotions/${promotion.id}`)}
                            className="flex text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition">
                            <ChevronRight size={20} />
                          </button>
                        )}
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
      {/* Add/Edit Promotion Modal */}
      <Modal
        title={isEditMode ? "Edit Promotion" : "Add New Promotion"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Promotion Name"
            rules={[
              {
                required: true,
                message: "Please enter the promotion name",
              },
            ]}
          >
            <Input placeholder="Enter promotion name" />
          </Form.Item>

          <Form.Item name="description" label="Description (Optional)">
            <Input.TextArea
              placeholder="Enter promotion description"
              rows={3}
            />
          </Form.Item>

          <div className="flex gap-4">
            <Form.Item
              name="promotionCode"
              label="Promotion Code"
              className="flex-1"
              rules={[
                {
                  required: true,
                  message: "Please enter the promotion code",
                },
              ]}
            >
              <Input placeholder="e.g. SUMMER20" />
            </Form.Item>

            <Form.Item
              name="discountPercentage"
              label="Discount Percentage"
              className="flex-1"
              rules={[
                {
                  required: true,
                  message: "Please enter the discount percentage",
                },
              ]}
            >
              <InputNumber
                min={0}
                max={100}
                formatter={(value) => `${value}%`}
                parser={(value) => value.replace("%", "")}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </div>

          <div className="flex gap-4">
            <Form.Item
              name="startDate"
              label="Start Date"
              className="flex-1"
              rules={[
                {
                  required: true,
                  message: "Please select the start date",
                },
              ]}
            >
              <DatePicker className="w-full" format="DD-MM-YYYY" />
            </Form.Item>

            <Form.Item
              name="endDate"
              label="End Date"
              className="flex-1"
              rules={[
                {
                  required: true,
                  message: "Please select the end date",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (
                      !value ||
                      !getFieldValue("startDate") ||
                      value.isAfter(getFieldValue("startDate"))
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("End date must be after start date")
                    );
                  },
                }),
              ]}
            >
              <DatePicker className="w-full" format="DD-MM-YYYY" />
            </Form.Item>
          </div>

          <Form.Item
            name="productIDs"
            label="Product IDs (Optional)"
            help="Select products to apply this promotion to. Leave empty for a global promotion."
          >
            <Select
              mode="multiple"
              placeholder="Select products"
              loading={productsLoading}
              options={products}
              optionRender={(option) => (
                <div className="flex items-center">
                  <span>
                    {option.value} - {option.label}
                  </span>
                </div>
              )}
              optionFilterProp="label"
              className="w-full"
              tokenSeparators={[","]}
              tagRender={({ label, closable, onClose }) => (
                <Tag
                  color="blue"
                  closable={closable}
                  onClose={onClose}
                  style={{ marginRight: 3 }}
                >
                  {label}
                </Tag>
              )}
              onChange={(value) => {
                console.log(value);
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
                ? isEditMode
                  ? "Updating..."
                  : "Adding..."
                : isEditMode
                ? "Update Promotion"
                : "Add Promotion"}
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}