import { Routes, Route, Link } from "react-router-dom";
// import SignUpForm from "./SignUpForm";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import { Login } from "./pages/Login";
import StudentSignup from "./pages/studentSignup";
import TeacherSignup from "./pages/teacherSignup";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />}>
          <Route path="teacher" element={<TeacherSignup />} />
          <Route path="student" element={<StudentSignup />} />
        </Route>
        <Route path="/login" element={<Login />} /> 
        {/* adding protected routes */}
      </Routes>
    </div>
  );
}
