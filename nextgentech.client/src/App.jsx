import { use, useEffect } from "react";
import "@ant-design/v5-patch-for-react-19";

import AllUserRoutes from "./routes/AllUserRoutes";
import AllAdminRoutes from "./routes/AllAdminRoutes";
import Navbar from "./components/User/Navbar/Navbar";
import "./App.css";
import AdminLayout from "./components/Admin/Layout/AdminLayout";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCartDetailsByCustomerId,
  fetchCartIdByCustomerId,
} from "./features/Cart/Cart";

function App() {
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.auth.userRole);
  const userId = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Fetch cart ID when the page is refreshed (component mounts)
  useEffect(() => {
    if (userId) {
      dispatch(fetchCartDetailsByCustomerId(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    console.log("userRole: ", userRole);
    console.log("isAuthenticated: ", isAuthenticated);
  }, [userRole, isAuthenticated]);

  return (
    <div>
      {isAuthenticated && userRole === "Admin" ? (
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
