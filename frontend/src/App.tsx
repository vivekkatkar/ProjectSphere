import { Routes, Route, Link } from "react-router-dom";
// import SignUpForm from "./SignUpForm";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import { Login } from "./pages/Login";
// import Dashboard from "./Dashboard";
// import ProtectedRoute from "./ProtectedRoute";
// import { useAuth } from "./AuthContext";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        {/* Protected Route */}
        {/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    </div>
  );
}
