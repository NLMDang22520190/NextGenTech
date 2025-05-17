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
  const userRole = useSelector((state) => state.auth.userRole) ?? "admin";
  const userId = useSelector((state) => state.auth.user);

  // Fetch cart ID when the page is refreshed (component mounts)
  useEffect(() => {
    if (userId) {
      dispatch(fetchCartDetailsByCustomerId(userId));
    }
  }, [dispatch]);

  useEffect(() => {
    console.log("userRole: ", userRole);    
  }, []);

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
