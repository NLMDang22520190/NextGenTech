import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Admin/Dashboard/Dashboard";
import NotFound from "../pages/Admin/NotFound/NotFound";

const AllAdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AllAdminRoutes;
