import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Pencil, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPromotionDetail, updatePromotion } from "../../../features/Admin/Promotions/Promotion";
import { message, Spin, Modal, Form, Input, DatePicker, InputNumber, Select, Tag } from "antd";
import { fetchProductDetail } from "../../../features/Admin/Products/Product";
import { fetchAllProduct } from "../../../features/Admin/Products/Product";
import dayjs from "dayjs";

export default function PromotionDetail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { promotionId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = React.useState(8);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

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

  const {
    promotionDetail,
    status: promotionDetailStatus,
    error: promotionDetailError,
  } = useSelector((state) => state.promotion);

  const {
    productDetail,
    status: productDetailStatus,
    error: productDetailError,
  } = useSelector((state) => state.product);
  const fetchPromotionDetailData = async (Id) => {
    try {
      setLoading(true);
      await dispatch(fetchPromotionDetail(Id)).unwrap();
    } catch (err) {
      message.error(
        "Failed to fetch promotion details: " + (err.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    try {
      setProductsLoading(true);
      const result = await dispatch(fetchAllProduct()).unwrap();
      setAllProducts(
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

  const fetchProducts = async () => {
    if (
      promotionDetail &&
      promotionDetail.productIDs &&
      promotionDetail.productIDs.length > 0
    ) {
      try {
        setLoading(true);
        setProducts([]);

        const productResults = await Promise.all(
          promotionDetail.productIDs.map(async (ID) => {
            try {
              const result = await dispatch(fetchProductDetail(ID)).unwrap();
              return {
                id: result.productId,
                name: result.name,
                price: result.price,
                // rating: product.rating,
                rating:
                  result.rating === 0 && result.reviewCount == 0
                    ? 5
                    : result.rating || 0,
                reviews: result.reviewCount || 0,
                // image: product.productImages[0].imageUrl
                image:
                  result.productImages && result.productImages.length > 0
                    ? result.productImages[0].imageUrl
                    : result.imageUrl ||
                      `https://picsum.photos/300/300?random=${result.productId}`,
                category: result.category.categoryName,
                brand: result.brand.brandName,
              };
            } catch (error) {
              console.error(`Error fetching product ${ID}:`, error);
              return null;
            }
          })
        );
        setProducts(productResults.filter((product) => product !== null));
      } catch (err) {
        message.error(
          "Failed to fetch products: " + (err.message || "Unknown error")
        );
      } finally {
        setLoading(false);
      }
    } else {
      setProducts([]);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPromotionDetailData(promotionId);
    fetchAllProducts();
  }, [dispatch]);

  useEffect(() => {
    if (promotionDetail) {
      fetchProducts();
    }
  }, [promotionDetail]);

  // Modal handling functions
  const showEditModal = () => {
    setIsModalOpen(true);
    form.setFieldsValue({
      name: promotionDetail.name,
      description: promotionDetail.description,
      promotionCode: promotionDetail.promotionCode,
      discountPercentage: promotionDetail.discountPercentage,
      startDate: dayjs(promotionDetail.startDate),
      endDate: dayjs(promotionDetail.endDate),
      productIDs: promotionDetail.productIDs || [],
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
        promotionId: promotionDetail.promotionId,
        name: values.name,
        description: values.description || "",
        promotionCode: values.promotionCode,
        discountPercentage: values.discountPercentage,
        startDate: formatDate(values.startDate),
        endDate: formatDate(values.endDate),
        productIDs: values.productIDs || [],
      };

      await dispatch(updatePromotion(promotionData)).unwrap();
      message.success("Promotion updated successfully");
      setIsModalOpen(false);
      form.resetFields();
      
      // Refresh promotion details
      await fetchPromotionDetailData(promotionId);
    } catch (err) {
      message.error(
        `Failed to update promotion: ${err.message || "Unknown error"}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Filter products based on search query
  const filterProductsData = products.filter((row) =>
    row.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = filterProductsData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Pagination numbers function
  const getPaginationNumbers = () => {
    const pages = [];
    const maxDisplayedPages = 5;

    if (totalPages <= maxDisplayedPages) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(0, currentPage - Math.floor(maxDisplayedPages / 2));
      let endPage = Math.min(totalPages - 1, startPage + maxDisplayedPages - 1);

      if (endPage - startPage < maxDisplayedPages - 1) {
        startPage = Math.max(0, endPage - maxDisplayedPages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const handleBackToPromotions = () => {
    navigate("/promotions");
  };

  return (
    <div className="space-y-4">
      <motion.button
        onClick={handleBackToPromotions}
        className="flex items-center cursor-pointer text-primary-300 hover:text-primary-500 transition mb-2 group"
        whileHover={{ x: -5 }}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        <span>Back to Promotions</span>
      </motion.button>

      <h1 className="text-2xl font-semibold text-gray-800">
        Promotion Details ({promotionDetail.promotionCode})
      </h1>

      <div className="flex justify-between">
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
            placeholder="Search product"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              console.log(searchQuery);
            }}
          />
        </div>        <button
            className="flex items-center py-2 px-5 text-white bg-primary rounded-lg font-bold text-sm hover:scale-105 active:scale-95 transition-all duration-100"
            onClick={showEditModal}
          >
            <Pencil size={16} className="mr-1" />
            <span className="cursor-pointer">Edit Promotion</span>
          </button>
      </div>
      {loading ||
      promotionDetailStatus === "loading" ||
      productDetailStatus === "loading" ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" tip="Loading promotion details..." />
        </div>
      ) : promotionDetailError ? (
        <div className="text-red-500 text-center">
          Error loading promotion details: {promotionDetailError}
        </div>
      ) : productDetailError ? (
        <div className="text-red-500 text-center">
          Error loading products: {productDetailError}
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
                    className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    PRICE
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    RATING
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    REVIEWS
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    BRAND
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    CATEGORY
                  </th>
                </tr>
              </thead>
              <motion.tbody
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-white divide-y divide-gray-200 h-[60vh]"
              >
                {filterProductsData
                  .slice(
                    currentPage * itemsPerPage,
                    (currentPage + 1) * itemsPerPage
                  )
                  .map((product, index) => (
                    <motion.tr
                      key={product.id}
                      variants={itemVariants}
                      className="hover:bg-gray-50 h-[7.5vh]"
                    >
                      <td className="px-4 py-2 text-sm text-gray-500 text-center">
                        {product.id}
                      </td>
                      <td className="px-4 py-2">
                        <div className="text-sm font-medium text-black">
                          {product.name}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500 text-center">
                        {product.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500 text-center">
                        {product.rating}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500 text-center">
                        {product.reviews}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500">
                        {product.brand}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500">
                        {product.category}
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
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 0))
                      }
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
                            ? "bg-primary-500 text-white"
                            : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                        } transition-colors`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page + 1}
                      </motion.button>
                    ))}

                    <button
                      className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 border border-gray-300"
                      disabled={currentPage >= totalPages - 1}
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, totalPages - 1)
                        )
                      }
                    >
                      <ChevronRight size={18} className="text-gray-600" />
                    </button>
                  </div>
                </div>              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Promotion Modal */}
      <Modal
        title="Edit Promotion"
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
                className="w-full"
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
              options={allProducts}
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
              {submitting ? "Updating..." : "Update Promotion"}
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
