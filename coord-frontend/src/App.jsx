import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import { Login } from "./pages/Login";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />}>
        </Route>
        <Route path="/login" element={<Login />} /> 
        {/* adding protected routes */}
        <Route path="/student-dashboard" element= {<Dashboard/>}>
            <Route path="profile" element={<Profile/>} />
            <Route path="idea" element={<Idea/>} />
            <Route path="weekly-reports" element={<WeeklyReports />} />
            <Route path="notifications" element={<Notification />} />
            <Route path="all-projects" element = {<AllProjects/>}/>
            <Route path="project-details" element = {<ProjectDetails/>}/>
            <Route path="evaluation" element = {<Evaluation/>}/>
        </Route>
      </Routes>
    </div>
  );
}
