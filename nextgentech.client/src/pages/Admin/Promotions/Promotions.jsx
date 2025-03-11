import React, { useState } from "react";
import { motion } from "framer-motion";
import { Filter, ChevronLeft, ChevronRight, Search, ChevronDown, Eye, Pencil, Trash2 } from "lucide-react";

const promotionsData = [
    { id: 1, name: "Summer Sale", description: "Enjoy our hottest discounts of the season!", discount: "20%", code: "SUMMER20", startDate: "01 Jun 2025", endDate: "30 Jun 2025", isProductPromotion: true },
    { id: 2, name: "Buy One Get One Free", description: "Get a free item when you buy one of equal or greater value.", discount: "50%", code: "BOGO50", startDate: "01 Jul 2025", endDate: "15 Jul 2025", isProductPromotion: true },
    { id: 3, name: "Flash Sale 24H", description: "Limited-time deal! Grab your favorite items now.", discount: "30%", code: "FLASH30", startDate: "15 Mar 2025", endDate: "16 Mar 2025", isProductPromotion: true },
    { id: 4, name: "New Year Special", description: "Start the new year with amazing discounts!", discount: "25%", code: "NY2025", startDate: "31 Dec 2025", endDate: "05 Jan 2026", isProductPromotion: false },
    { id: 5, name: "Weekend Deal", description: "Exclusive discounts every weekend!", discount: "15%", code: "WKND15", startDate: "10 May 2025", endDate: "12 May 2025", isProductPromotion: true },
    { id: 6, name: "Free Shipping", description: "No shipping fees on all orders above $50.", discount: "100%", code: "FREESHIP50", startDate: "01 Apr 2025", endDate: "30 Apr 2025", isProductPromotion: false },
    { id: 7, name: "Back to School Sale", description: "Get ready for school with special discounts!", discount: "18%", code: "SCHOOL18", startDate: "01 Aug 2025", endDate: "15 Aug 2025", isProductPromotion: true },
    { id: 8, name: "Cyber Monday Mega Sale", description: "The biggest online shopping event of the year!", discount: "40%", code: "CYBER40", startDate: "24 Nov 2025", endDate: "25 Nov 2025", isProductPromotion: true },
    { id: 9, name: "Loyalty Rewards Bonus", description: "Exclusive discount for our loyal customers.", discount: "10%", code: "LOYAL10", startDate: "01 Jun 2025", endDate: "31 Dec 2025", isProductPromotion: false },
    { id: 10, name: "Holiday Gift Special", description: "Buy gifts and save big this holiday season!", discount: "35%", code: "GIFT35", startDate: "01 Dec 2025", endDate: "25 Dec 2025", isProductPromotion: true }
];

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
      <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${getStatusStyles()}`}>
        {status.toString()}
      </span>
    );
};
  
export default function Promotions() {
const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = React.useState(8);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const filterData = promotionsData.filter(row => 
      row.name.toLowerCase().includes(searchQuery.toLowerCase())
      && (filterStatus != "" ? row.isProductPromotion.toString() === filterStatus : true)
      // && ((filter != "" && subfilter != "") ? (filter === 'Loại' ? row.categoryName === subfilter : row.supplierName === subfilter): true)
    );

    const totalItems = filterData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
  
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
    };

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-gray-800">Promotions</h1> {/* Header */}
    
            {/* Search and Filter */}
            <div className="flex justify-between">
                <div className={`relative ${searchQuery.length > 0 ? "w-64" : "w-44"} focus-within:w-64 hover:w-64 hover:duration-300 duration-300`}>
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Search size={18} />
                    </span>
                    <input
                    type="text"
                    className="pl-10 pr-4 py-2 w-full border rounded-full text-sm focus:outline-none focus:border-primary-600"
                    placeholder="Search promotion"
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

                    <div class="relative w-48">
                        <select
                            title="status filter"
                            class="w-full bg-white border border-gray-200 rounded-md shadow-sm py-2 px-4 focus:outline-none text-sm text-gray-700 appearance-none"
                            value={filterStatus}
                            onChange={handleFilterChange}
                        >
                            <option value="" className="italic">
                                <em>Promotion by product</em>
                            </option>
                            <option value="true">TRUE</option>
                            <option value="false">FALSE</option>
                        </select>

                        <ChevronDown size={16} className="text-gray-500 absolute inset-y-3 right-3 flex items-center pointer-events-none" />
                    </div>
                    
                    {/* <div className="flex items-center py-2 bg-white border border-gray-200 rounded-md shadow-sm">
                        <span className="text-sm font-medium text-gray-700 mr-2">Status</span>
                        <ChevronDown size={16} className="text-gray-500" />
                    </div>

                    <div className="flex items-center py-2 bg-white border border-gray-200 rounded-md shadow-sm">
                        <span className="text-sm font-medium text-gray-700 mr-2">Orders</span>
                        <ChevronDown size={16} className="text-gray-500" />
                    </div> */}

                    <button 
                        className="flex items-center py-2 text-red-500 font-medium text-sm"
                        onClick={() => {setFilterStatus("")}}
                    >
                        <span className="cursor-pointer">Reset Filter</span>
                    </button>
                </div>
            </div>

            {/* Table */}    
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100 h-[5vh]">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Discount</th>
                            <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Start Date</th>
                            <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">End Date</th>
                            <th scope="col" className="px-4 py-1 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Promotion by product</th>
                            <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
                        </tr>
                        </thead>
                        <motion.tbody
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="bg-white divide-y divide-gray-200 h-[60vh]"
                        >
                            {filterData
                                .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
                                .map((promotion, index) => (
                            <motion.tr key={promotion.id} variants={itemVariants} className="hover:bg-gray-50 h-[7.5vh]">
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{promotion.name}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-center">{promotion.discount}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{promotion.code} </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{promotion.description} </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-end">{promotion.startDate} </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-end">{promotion.endDate} </td>
                                <td className="px-4 py-2 whitespace-nowrap text-center">
                                    <PromotionStatusBadge status={promotion.isProductPromotion} />
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                    <div className="flex justify-center">
                                        { promotion.isProductPromotion &&
                                        <button className="flex text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition">
                                            <ChevronRight size={20} />
                                        </button> }
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
