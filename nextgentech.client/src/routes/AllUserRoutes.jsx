import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/User/Home/Home";

const AllUserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export default AllUserRoutes;
