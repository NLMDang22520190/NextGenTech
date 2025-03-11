import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Admin/Dashboard";
import NotFound from "../pages/Admin/NotFound";
import Products from "../pages/Admin/Products";
import Brands from "../pages/Admin/Brands";
import Categories from "../pages/Admin/Categories";
import Order from "../pages/Admin/Order/Order";
import Stock from "../pages/Admin/ProductStock/ProductStock"
import Customers from "../pages/Admin/Customers";

const AllAdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/products" element={<Products/>} />
      <Route path="/brands" element={<Brands/>} />      
      <Route path="/categories" element={<Categories/>} />    
      <Route path="/orders" element={<Order/>}/>  
      <Route path="/stock" element={<Stock/>}/>
      <Route path="/customers" element={<Customers/>}/>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AllAdminRoutes;