import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/User/Home/Home";
import AboutUs from "../pages/User/AboutUs/AboutUs";
import Products from "../pages/User/Products/Products";
import NotFound from "../pages/NotFound/NotFound";
import Login from "../pages/Auth/Login";
import SignUp from"../pages/Auth/SignUp";

const AllUserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/products" element={<Products />} />

      <Route path="*" element={<NotFound />} />

      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<SignUp />}/>
    </Routes>
  );
};

export default AllUserRoutes;
