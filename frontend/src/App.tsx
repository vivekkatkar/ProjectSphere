import { Routes, Route, Link } from "react-router-dom";
// import SignUpForm from "./SignUpForm";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import { Login } from "./pages/Login";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        {/* adding protected routes */}
      </Routes>
    </div>
  );
}
