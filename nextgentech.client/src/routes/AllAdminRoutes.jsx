import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Admin/Dashboard";
import NotFound from "../pages/Admin/NotFound";
import Products from "../pages/Admin/Products";

const AllAdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/products" element={<Products/>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AllAdminRoutes;