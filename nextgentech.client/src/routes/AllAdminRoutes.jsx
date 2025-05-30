import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Admin/Dashboard";
import NotFound from "../pages/Admin/NotFound";
import Products from "../pages/Admin/Products";
import Brands from "../pages/Admin/Brands";
import Categories from "../pages/Admin/Categories";
import Order from "../pages/Admin/Order/Order";
import Customers from "../pages/Admin/Customers";
import Promotions from "../pages/Admin/Promotions";
import PromotionDetail from "../pages/Admin/PromotionDetail";
import ProductDetail from "../pages/Admin/ProductDetail";
import Settings from "../pages/Admin/Settings/Settings";

const AllAdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/products" element={<Products/>} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/brands" element={<Brands/>} />
      <Route path="/categories" element={<Categories/>} />
      <Route path="/orders" element={<Order/>}/>
      <Route path="/customers" element={<Customers/>}/>
      <Route path="/promotions" element={<Promotions/>}/>
      <Route path="/promotions/:promotionId" element={<PromotionDetail/>}/>
      <Route path="/settings" element={<Settings/>}/>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AllAdminRoutes;