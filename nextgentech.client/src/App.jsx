import { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "@ant-design/v5-patch-for-react-19";

import AllUserRoutes from "./routes/AllUserRoutes";
import AllAdminRoutes from "./routes/AllAdminRoutes";
import Navbar from "./components/User/Navbar/Navbar";
import "./App.css";
import AdminLayout from "./components/Admin/Layout/AdminLayout";

function App() {
  const userRole = "admin";

  return (
    <div>
      {userRole === "admin" ? (
        <Router>
          <AdminLayout>
            <AllAdminRoutes />
          </AdminLayout>
        </Router>
      ) : (
        <div className="min-h-screen bg-bg ">
          <Router>
            <Navbar />
            <AllUserRoutes />
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
