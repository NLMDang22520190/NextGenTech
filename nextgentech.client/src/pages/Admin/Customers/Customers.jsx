import React, { useState } from "react";
import { motion } from "framer-motion";
import { Filter, ChevronLeft, ChevronRight, Search, ChevronDown, Eye, Pencil, Trash2 } from "lucide-react";

const customersData = [
    {
        id: 1,
        name: "John Bushmill",
        email: "John@gmail.com",
        phone: "078 5054 8877",
        orders: 124,
        balance: "$121.00",
        status: "Blocked",
        created: "29 Dec 2022"
    },
    {
        id: 2,
        name: "Laura Prichet",
        email: "laura_prichet@gmail.com",
        phone: "215 302 3376",
        orders: 45,
        balance: "$590.00",
        status: "Active",
        created: "24 Dec 2022"
    },
    {
        id: 3,
        name: "Mohammad Karim",
        email: "m_karim@gmail.com",
        phone: "050 414 8778",
        orders: 984,
        balance: "$125.00",
        status: "Blocked",
        created: "12 Dec 2022"
    },
    {
        id: 4,
        name: "Josh Bill",
        email: "josh_bill@gmail.com",
        phone: "216 75 612 706",
        orders: 99,
        balance: "$348.00",
        status: "Blocked",
        created: "21 Oct 2022"
    },
    {
        id: 5,
        name: "Josh Adam",
        email: "josh_adam@gmail.com",
        phone: "02 75 150 655",
        orders: 1540,
        balance: "$607.00",
        status: "Active",
        created: "21 Oct 2022"
    },
    {
        id: 6,
        name: "Sin Tae",
        email: "sin_tae@gmail.com",
        phone: "078 6013 3854",
        orders: 431,
        balance: "$234.00",
        status: "Active",
        created: "21 Oct 2022"
    },
    {
        id: 7,
        name: "Rajesh Masvidal",
        email: "rajesh_m@gmail.com",
        phone: "828 216 2190",
        orders: 36,
        balance: "$760.00",
        status: "Blocked",
        created: "19 Sep 2022"
    },
    {
        id: 8,
        name: "Fajar Surya",
        email: "fsurya@gmail.com",
        phone: "078 7173 9261",
        orders: 77,
        balance: "$400.00",
        status: "Active",
        created: "19 Sep 2022"
    },
    {
        id: 9,
        name: "Lisa Greg",
        email: "lisa@gmail.com",
        phone: "077 6157 4248",
        orders: 89,
        balance: "$812.00",
        status: "Active",
        created: "19 Sep 2022"
    },
    {
        id: 10,
        name: "Linda Blair",
        email: "lindablair@gmail.com",
        phone: "050 414 8778",
        orders: 1296,
        balance: "$723.00",
        status: "Active",
        created: "10 Aug 2022"
    }
];

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
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = React.useState(8);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCustomers, setSelectedCustomers] = useState([]);

    const filterCustomersData = customersData.filter(row => 
      row.name.toLowerCase().includes(searchQuery.toLowerCase())
      // && ((filter != "" && subfilter != "") ? (filter === 'Loại' ? row.categoryName === subfilter : row.supplierName === subfilter): true)
    );

    const totalItems = filterCustomersData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

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

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-gray-800">Customers</h1>
    
            <div className="flex space-x-2">
                <div className="relative w-40 hover:w-64 hover:duration-300 duration-300" >
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Search size={18} />
                    </span>
                    <input
                    type="text"
                    className="pl-10 pr-4 py-2 w-[160px] border rounded-full text-sm focus:outline-none focus:border-primary-600 hover:w-full hover:duration-300 duration-300"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value)
                        console.log(searchQuery)             
                    }}
                    />
                </div>
    
                <div className="flex items-center px-4 py-2">
                    <Filter size={18} className="mr-2 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Filter By</span>
                </div>
                
                <div className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-md shadow-sm">
                    <span className="text-sm font-medium text-gray-700 mr-2">Status</span>
                    <ChevronDown size={16} className="text-gray-500" />
                </div>

                <div className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-md shadow-sm">
                    <span className="text-sm font-medium text-gray-700 mr-2">Orders</span>
                    <ChevronDown size={16} className="text-gray-500" />
                </div>

                <button className="flex items-center px-4 py-2 text-red-500 font-medium text-sm">
                    <span className="cursor-pointer">Reset Filter</span>
                </button>
            </div>
    
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
                                    Orders
                                    <ChevronDown size={16} className="inline ml-3 text-gray-400" />
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center justify-center">
                                    Balance
                                    <ChevronDown size={16} className="inline ml-3 text-gray-400" />
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center justify-center">
                                    Status
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
                            .map((customer, index) => (
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
                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-end">{customer.orders}</td>
                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-end">{customer.balance} </td>
                            <td className="px-6 py-2 whitespace-nowrap text-center">
                                <CustomerStatusBadge status={customer.status} />
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-center">{customer.created}</td>
                            <td className="px-6 py-2 whitespace-nowrap">
                                <div className="flex space-x-2 justify-center">
                                    <button className="text-gray-400 hover:text-gray-600">
                                    <Eye size={16} />
                                    </button>
                                    <button className="text-gray-400 hover:text-gray-600">
                                    <Pencil size={16} />
                                    </button>
                                    <button className="text-gray-400 hover:text-gray-600">
                                    <Trash2 size={16} />
                                    </button>
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
                
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="text-sm text-gray-500">
                    Showing {currentPage * itemsPerPage + 1}-{Math.min((currentPage + 1) * itemsPerPage,totalItems)} of {totalItems}
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
                        disabled={currentPage === 0}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                    >
                        <ChevronLeft size={20} className="text-gray-600" />
                    </button>
                    <button
                        className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
                        disabled={(currentPage + 1) === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                    >
                        <ChevronRight size={20} className="text-gray-600" />
                    </button>
                </div>
                </div>
            </div>
        </div>
    )
}
