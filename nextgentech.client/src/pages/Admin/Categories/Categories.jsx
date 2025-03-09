import React, { useState } from "react";
import { motion } from "framer-motion";
import { Filter, ChevronLeft, ChevronRight } from "lucide-react";

const categoryData = [
    {
      id: "CAT001",
      name: "Electronics",
      description: "Electronic devices and accessories"
    },
    {
      id: "CAT002",
      name: "Books",
      description: "Physical and digital books"
    },
    {
      id: "CAT003",
      name: "Clothing",
      description: "Men's, women's and children's apparel"
    },
    {
      id: "CAT004",
      name: "Home & Kitchen",
      description: "Furniture, decor and kitchen items"
    },
    {
      id: "CAT005",
      name: "Beauty",
      description: "Cosmetics, skincare and personal care"
    },
    {
      id: "CAT006",
      name: "Sports",
      description: "Athletic gear and equipment"
    },
    {
      id: "CAT007",
      name: "Toys & Games",
      description: "Items for children and adult entertainment"
    },
    {
      id: "CAT008",
      name: "Automotive",
      description: "Car parts and accessories"
    },
    {
      id: "CAT009",
      name: "Health",
      description: "Supplements and wellness products"
    }
];

export default function Categories() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalItems = categoryData.length;
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

    return (
    <div className="space-y-3">
        <h1 className="text-2xl font-semibold text-gray-800">Categories</h1>

        <div className="flex space-x-2">
            <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 hover:shadow-md cursor-pointer">
                <Filter size={18} className="mr-2 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter By</span>
            </button>

            <button className="flex items-center px-4 py-2 text-red-500 font-medium text-sm">
                <span className="cursor-pointer">Reset Filter</span>
            </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            NAME
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            DESCRIPTION
                        </th>
                        </tr>
                    </thead>
                    <motion.tbody
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="bg-white divide-y divide-gray-200"
                    >
                        {categoryData.map((category) => (
                        <motion.tr key={category.id} variants={itemVariants} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {category.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{category.name}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                            {category.description}
                            </td>
                        </motion.tr>
                        ))}
                    </motion.tbody>
                </table>
            </div>
            
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="text-sm text-gray-500">
                Showing 1-{Math.min(itemsPerPage, totalItems)} of {totalItems}
                </div>
                <div className="flex items-center space-x-2">
                <button
                    className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                    <ChevronLeft size={20} className="text-gray-600" />
                </button>
                <button
                    className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                    <ChevronRight size={20} className="text-gray-600" />
                </button>
                </div>
            </div>
        </div>
    </div>
  )
}
