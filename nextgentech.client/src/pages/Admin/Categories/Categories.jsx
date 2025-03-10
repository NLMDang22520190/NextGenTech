import React, { useState } from "react";
import { motion } from "framer-motion";
import { Filter, ChevronLeft, ChevronRight, Search } from "lucide-react";

const categoryData = [
    {
      id: "CAT001",
      name: "Smartphones & Accessories",
      description: "Devices that combine communication, computing, and entertainment, including cases, chargers, screen protectors, and wireless earbuds."
    },
    {
      id: "CAT002",
      name: "Laptops & Computers",
      description: "Portable and desktop computing devices used for work, gaming, and entertainment, along with peripherals like keyboards, mice, and cooling pads."
    },
    {
      id: "CAT003",
      name: "Gaming Gear",
      description: "Includes gaming consoles, controllers, mechanical keyboards, high-refresh-rate monitors, gaming headsets, and ergonomic chairs for immersive experiences."
    },
    {
      id: "CAT004",
      name: "Wearable Technology",
      description: "Smartwatches, fitness trackers, and augmented reality (AR) glasses that help with health tracking, notifications, and hands-free interaction."
    },
    {
      id: "CAT005",
      name: "Smart Home Devices",
      description: "AI-powered gadgets like smart speakers, security cameras, thermostats, and automated lighting systems to enhance convenience and security."
    },
    {
      id: "CAT006",
      name: "Audio & Entertainment",
      description: "High-quality headphones, speakers, soundbars, and home theater systems that offer immersive audio experiences for music, movies, and gaming."
    },
    {
      id: "CAT007",
      name: "Networking & Connectivity",
      description: "Routers, modems, mesh Wi-Fi systems, and network extenders that improve internet speed and reliability for homes and businesses."
    },
    {
      id: "CAT008",
      name: "Computer Components & Hardware",
      description: "Processors (CPUs), graphics cards (GPUs), motherboards, RAM, SSDs, and power supplies used for upgrading or building custom PCs."
    },
    {
      id: "CAT009",
      name: "Drones & Robotics",
      description: "Unmanned aerial vehicles (UAVs) for photography, surveillance, and entertainment, alongside robots for industrial and personal use."
    },
    {
      id: "CAT010",
      name: "Tech Gadgets & Innovations",
      description: "Cutting-edge devices like VR headsets, 3D printers, portable projectors, and AI-powered tools designed for productivity, creativity, and fun."
    }
];

export default function Categories() {
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = React.useState(8);
    const [searchQuery, setSearchQuery] = useState("");

    const filterCategoryData = categoryData.filter(row => 
      row.name.toLowerCase().includes(searchQuery.toLowerCase())
      // && ((filter != "" && subfilter != "") ? (filter === 'Loại' ? row.categoryName === subfilter : row.supplierName === subfilter): true)
    );

    const totalItems = filterCategoryData.length;
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
            <div className="relative mr-6 w-40 hover:w-64 hover:duration-300 duration-300" >
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
                  <thead className="bg-primary-300">
                    <tr>
                      <th scope="col" className="px-4 py-2 text-center text-md font-bold text-white uppercase tracking-wider">
                          STT
                      </th>
                      <th scope="col" className="px-4 py-2 text-center text-md font-bold text-white uppercase tracking-wider">
                          ID
                      </th>
                      <th scope="col" className="px-4 py-2 text-left text-md font-bold text-white uppercase tracking-wider">
                          NAME
                      </th>
                      <th scope="col" className="px-4 py-2 text-left text-md font-bold text-white uppercase tracking-wider">
                          DESCRIPTION
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
                      .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
                      .map((category, index) => (
                    <motion.tr key={category.id} variants={itemVariants} className="hover:bg-gray-50 h-[7.5vh]">
                      <td className="px-4 py-2 text-sm text-gray-900 text-center">
                        {currentPage * itemsPerPage + index + 1}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500">{category.id}</td>
                      <td className="px-4 py-2">
                        <div className="text-sm font-medium text-black">{category.name}</div>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500">{category.description}</td>
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
