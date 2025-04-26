import { useEffect, useState } from "react";
import "@ant-design/v5-patch-for-react-19";

import AllUserRoutes from "./routes/AllUserRoutes";
import AllAdminRoutes from "./routes/AllAdminRoutes";
import Navbar from "./components/User/Navbar/Navbar";
import "./App.css";
import AdminLayout from "./components/Admin/Layout/AdminLayout";
import { useSelector } from "react-redux";

function App() {
  const userRole = useSelector((state) => state.auth.userRole);

  return (
    <div>
      {userRole === "admin" ? (
        <AdminLayout>
          <AllAdminRoutes />
        </AdminLayout>
      ) : (
        <div className="min-h-screen bg-bg">
          <Navbar />
          <AllUserRoutes />
        </div>
      )}
    </div>
  );
}

export default App;
