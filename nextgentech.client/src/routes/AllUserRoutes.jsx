import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/User/Home/Home";
import Products from "../pages/User/Products/Products";
import NotFound from "../pages/NotFound/NotFound";

const AllUserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AllUserRoutes;
