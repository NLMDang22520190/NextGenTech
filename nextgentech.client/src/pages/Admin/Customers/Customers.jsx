import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Filter, ChevronLeft, ChevronRight, Search, ChevronDown, Eye, Pencil, Trash2, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { message, Spin, Modal, Form, Input, Select, Popconfirm } from "antd";
import { fetchAllUser, addUser, updateUser, deleteUser } from "../../../features/Admin/Users/User";
import dayjs from "dayjs";

const CustomerStatusBadge = ({ status }) => {
    const getStatusStyles = () => {
      switch (status) {
        case "Active":
          return "bg-green-100 text-green-800";
        case "Blocked":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles()}`}>
        {status}
      </span>
    );
};

const CustomerAvatar = ({ name }) => {
    const initials = name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();

    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-medium">
        {initials}
      </div>
    );
};

export default function Customers() {
    const dispatch = useDispatch();
    const { userItems, status, error } = useSelector((state) => state.user);

    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(8);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [filterStatus, setFilterStatus] = useState("");
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState(null);
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    // Function to fetch customers data
    const fetchCustomers = async () => {
        try {
            setLoading(true);
            await dispatch(fetchAllUser()).unwrap();
        } catch (err) {
            message.error("Failed to fetch customers: " + (err.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    // Fetch customers on component mount
    useEffect(() => {
        fetchCustomers();
    }, [dispatch]);
    // UserId, FullName, Email, PasswordHash, Phone, City, District, Ward, AvatarImageUrl, Role, CreatedAt
    // Map API response data to the format expected by the component
    const customersData = userItems.map(user => ({
        id: user.userId,
        name: user.fullName || "No Name",
        email: user.email || "No Email",
        phone: user.phone || "No Phone",
        city: user.city || "No City",
        district: user.district || "No District",
        ward: user.ward || "No Ward",
        avatar: user.avatarImageUrl || "No Avatar",
        role: user.role || "No Role",
        created: user.createdAt ? dayjs(user.createdAt).format("DD-MM-YYYY") : "Unknown"
    }));

    const filterCustomersData = customersData.filter(row =>
        row.name.toLowerCase().includes(searchQuery.toLowerCase())
        && (filterStatus !== "" ? row.role.toLowerCase() === filterStatus.toLowerCase() : true)
    );

    const totalItems = filterCustomersData.length;
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

    const toggleSelectAll = () => {
        if (selectedCustomers.length === customersData.length) {
            setSelectedCustomers([]);
        } else {
            setSelectedCustomers(customersData.map(customer => customer.id));
        }
    };

    const toggleSelectCustomer = (customerId) => {
        if (selectedCustomers.includes(customerId)) {
            setSelectedCustomers(selectedCustomers.filter(id => id !== customerId));
        } else {
            setSelectedCustomers([...selectedCustomers, customerId]);
        }
    };

    // Modal handling functions
    const showAddModal = () => {
        setIsEditMode(false);
        setCurrentCustomer(null);
        setIsModalOpen(true);
        form.resetFields();
    };

    const showEditModal = (customer) => {
        setIsEditMode(true);
        setCurrentCustomer(customer);
        setIsModalOpen(true);

        // Find the original user data
        const userData = userItems.find(user => user.userId === customer.id);

        form.setFieldsValue({
            fullName: userData.fullName,
            email: userData.email,
            phone: userData.phone,
            city: userData.city,
            district: userData.district,
            ward: userData.ward,
            role: userData.role
        });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleSubmit = async (values) => {
        try {
            setSubmitting(true);
            const userData = {
                fullName: values.fullName,
                email: values.email,
                password: values.password,
                phone: values.phone || "",
                city: values.city || "",
                district: values.district || "",
                ward: values.ward || "",
                role: values.role || "customer"
            };

            if (isEditMode && currentCustomer) {
                // Update existing customer
                await dispatch(updateUser({
                    userId: currentCustomer.id,
                    ...userData
                })).unwrap();
                message.success("Customer updated successfully");
                setSubmitting(false);
            } else {
                // Add new customer
                try {
                    await dispatch(addUser(userData)).unwrap();
                    message.success("Customer added successfully");
                } catch (error) {
                    // Log error for debugging (not visible to users)
                    console.log("Error adding user:", error);

                    // Simple error message based on error type
                    if (error === "Email already exists") {
                        message.error("Email already exists. Please use a different email address.");

                        // Focus on the email field
                        try {
                            const emailField = form.getFieldInstance('email');
                            if (emailField) {
                                emailField.focus();
                            }
                        } catch (focusError) {
                            // Silent catch - no need to show this error to users
                        }
                    } else {
                        // Generic error message
                        message.error("Unable to add customer. Please try again.");
                    }
                } finally {
                    setSubmitting(false);
                    return; // Keep the modal open
                }
            }

            setIsModalOpen(false);
            form.resetFields();

            // Refresh data after successful operation
            await fetchCustomers();
        } catch (err) {
            // Log for debugging only
            console.error("Error in handleSubmit:", err);

            // Simple user-friendly message
            const action = isEditMode ? "update" : "add";
            message.error(`Unable to ${action} customer. Please try again.`);

            // Don't close the modal on error
            setSubmitting(false);
        }
    };

    const handleDeleteCustomer = async (customerId) => {
        try {
            await dispatch(deleteUser(customerId)).unwrap();
            message.success("Customer deleted successfully");

            // Refresh data after successful deletion
            await fetchCustomers();
        } catch (err) {
            // Log for debugging only
            console.error("Error deleting customer:", err);

            // Simple user-friendly message
            message.error("Unable to delete customer. Please try again.");
        }
    };

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05
        }
      }
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    const handleFilterChange = async (e) => {
        const value = e.target.value;
        setFilterStatus(value);
        setCurrentPage(0);
    };

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-gray-800">Customers</h1> {/* Header */}

            {/* Search and Filter */}
            <div className="flex justify-between">
                <div className={`relative ${searchQuery.length > 0 ? "w-64" : "w-44"} focus-within:w-64 hover:w-64 hover:duration-300 duration-300`}>
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Search size={18} />
                    </span>
                    <input
                    type="text"
                    className="pl-10 pr-4 py-2 w-full border rounded-full text-sm focus:outline-none focus:border-primary-600"
                    placeholder="Search customer"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value)
                        console.log(searchQuery)
                    }}
                    />
                </div>

                <div className="flex space-x-4">
                    <div className="flex items-center py-2">
                        <Filter size={18} className="mr-2 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Filter By</span>
                    </div>

                    <div className="relative w-30">
                        <select
                            title="status filter"
                            className="w-full bg-white border border-gray-200 rounded-md shadow-sm py-2 px-4 focus:outline-none text-sm text-gray-700 appearance-none"
                            value={filterStatus}
                            onChange={handleFilterChange}
                        >
                            <option value="" className="italic">
                                Role
                            </option>
                            <option value="Admin">Admin</option>
                            <option value="Customer">Customer</option>
                        </select>

                        <ChevronDown size={16} className="text-gray-500 absolute inset-y-3 right-3 flex items-center pointer-events-none" />
                    </div>

                    <button
                        className="flex items-center py-2 text-red-500 font-medium text-sm"
                        onClick={() => {setFilterStatus("")}}
                    >
                        <span className="cursor-pointer">Reset Filter</span>
                    </button>

                    <button
                        className="flex items-center py-2 px-5 text-white bg-primary rounded-lg font-bold text-sm hover:scale-105 active:scale-95 transition-all duration-100"
                        onClick={showAddModal}
                    >
                        <Plus size={16} className="mr-1" />
                        <span className="cursor-pointer">Add Customer</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            {loading || status === "loading" ? (
                <div className="flex justify-center items-center h-64">
                    <Spin size="large" tip="Loading customers..." />
                </div>
            ) : error && error !== "Email already exists" ? (
                <div className="text-red-500 text-center">
                    Error loading customers: {error}
                </div>
            ) : (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                        <tr>
                            <th scope="col" className="ps-4 py-3 text-left">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        checked={selectedCustomers.length === customersData.length}
                                        onChange={toggleSelectAll}
                                    />
                                    <span className="ml-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer Name</span>
                                    <ChevronDown size={16} className="ml-3 text-gray-400" />
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Phone
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center justify-center">
                                    City
                                    <ChevronDown size={16} className="inline ml-3 text-gray-400" />
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center justify-center">
                                    District
                                    <ChevronDown size={16} className="inline ml-3 text-gray-400" />
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center justify-center">
                                    Ward
                                    <ChevronDown size={16} className="inline ml-3 text-gray-400" />
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center justify-center">
                                    Role
                                    <ChevronDown size={16} className="inline ml-3 text-gray-400" />
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center justify-center">
                                    Created
                                    <ChevronDown size={16} className="inline ml-3 text-gray-400" />
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <div className="flex justify-center">
                                    Action
                                </div>
                            </th>
                        </tr>
                        </thead>
                        <motion.tbody
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="bg-white divide-y divide-gray-200 h-[60vh]"
                        >
                        {filterCustomersData
                            .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
                            .map((customer) => (
                        <motion.tr key={customer.id} variants={itemVariants} className="hover:bg-gray-50 h-[7.5vh]">
                            <td className="ps-4 py-2 whitespace-nowrap">
                                <div className="flex items-center">
                                    <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    checked={selectedCustomers.includes(customer.id)}
                                    onChange={() => toggleSelectCustomer(customer.id)}
                                    />
                                    <div className="ml-4 flex items-center">
                                    <CustomerAvatar name={customer.name} />
                                    <div className="ml-3">
                                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                        <div className="text-sm text-gray-500">{customer.email}</div>
                                    </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{customer.phone}</td>
                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{customer.city}</td>
                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{customer.district}</td>
                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{customer.ward}</td>
                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{customer.role}</td>
                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-center">{customer.created}</td>
                            <td className="px-6 py-2 whitespace-nowrap">
                                <div className="flex space-x-2 justify-center">
                                    <button
                                        className="text-gray-400 hover:text-green-600 transition-colors"
                                        onClick={() => showEditModal(customer)}
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <Popconfirm
                                        title="Delete Customer"
                                        description="Are you sure you want to delete this customer?"
                                        onConfirm={() => handleDeleteCustomer(customer.id)}
                                        okText="Yes"
                                        cancelText="No"
                                        placement="left"
                                    >
                                        <button
                                            className="text-gray-400 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </Popconfirm>
                                </div>
                            </td>
                        </motion.tr>
                        ))}

                        {Array.from({ length: itemsPerPage - Math.min(itemsPerPage,totalItems-(currentPage * itemsPerPage)) }).map((_, i) => (
                            <tr key={`empty-${i}`} className="h-[7.5vh]">
                                <td className="px-4 py-2 text-sm text-gray-300 text-center">-</td>
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
                            Showing {currentPage * itemsPerPage + 1}-{Math.min((currentPage + 1) * itemsPerPage,totalItems)} of {totalItems}
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

            {/* Add/Edit Customer Modal */}
            <Modal
                title={isEditMode ? "Edit Customer" : "Add New Customer"}
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
                        name="fullName"
                        label="Full Name"
                        rules={[
                            {
                                required: true,
                                message: "Please enter the customer's full name",
                            },
                        ]}
                    >
                        <Input placeholder="Enter full name" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            {
                                required: true,
                                message: "Please enter the email address",
                                type: "email"
                            },
                        ]}
                    >
                        <Input placeholder="Enter email address" />
                    </Form.Item>

                    {!isEditMode && (
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter a password",
                                },
                            ]}
                        >
                            <Input.Password placeholder="Enter password" />
                        </Form.Item>
                    )}

                    <div className="flex gap-4">
                        <Form.Item
                            name="phone"
                            label="Phone Number"
                            className="flex-1"
                        >
                            <Input placeholder="Enter phone number" />
                        </Form.Item>

                        <Form.Item
                            name="role"
                            label="Role"
                            className="flex-1"
                            initialValue="customer"
                        >
                            <Select>
                                <Select.Option value="Customer">Customer</Select.Option>
                                <Select.Option value="Admin">Admin</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <div className="flex gap-4">
                        <Form.Item
                            name="city"
                            label="City"
                            className="flex-1"
                        >
                            <Input placeholder="Enter city" />
                        </Form.Item>

                        <Form.Item
                            name="district"
                            label="District"
                            className="flex-1"
                        >
                            <Input placeholder="Enter district" />
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="ward"
                        label="Ward/Street"
                    >
                        <Input placeholder="Enter ward or street" />
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
                                : (isEditMode ? "Update Customer" : "Add Customer")
                            }
                        </button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
