import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/User/Home/Home";
import AboutUs from "../pages/User/AboutUs/AboutUs";
import Products from "../pages/User/Products/Products";
import ProductDetail from "../pages/User/ProductDetail/ProductDetail";
import Cart from "../pages/User/Cart/Cart";
import Checkout from "../pages/User/Checkout/Checkout";
import CheckoutSuccess from "../pages/User/Checkout/CheckoutSuccess";
import NotFound from "../pages/NotFound/NotFound";
import Login from "../pages/Auth/Login";
import SignUp from "../pages/Auth/SignUp";
import Setting from "../pages/User/Setting/Setting"

const AllUserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetail />} />

      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/checkout/success" element={<CheckoutSuccess />} />

      <Route path="*" element={<NotFound />} />

      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<SignUp />} />
      <Route path="/setting" element={<Setting />}/>
    </Routes>
  );
};

export default AllUserRoutes;
