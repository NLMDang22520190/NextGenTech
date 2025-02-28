import { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import AllUserRoutes from "./routes/AllUserRoutes";
import AllAdminRoutes from "./routes/AllAdminRoutes";
import "./App.css";

function App() {
  const userRole = "user";

  return (
    <div>
      {userRole === "admin" ? (
        <Router>
          <AllAdminRoutes />
        </Router>
      ) : (
        <Router>
          <AllUserRoutes />
        </Router>
      )}
    </div>
  );
}

export default App;
