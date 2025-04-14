import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  return (
    <div className="rounded-tr-3xl sticky top-0 bg-white shadow-lg p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h2>
        <ul className="space-y-4">
          <li className="p-3 rounded-md text-gray-700 hover:bg-blue-100">
            <Link to="/student-dashboard/profile">Profile</Link>
          </li>
          <li className="p-3 rounded-md text-gray-700 hover:bg-blue-100">
            <Link to="/student-dashboard/idea">Idea</Link>
          </li>
          <li className="p-3 rounded-md text-gray-700 hover:bg-blue-100">
            <Link to="/student-dashboard/weekly-reports">Weekly Reports</Link>
          </li>
          <li className="p-3 rounded-md text-gray-700 hover:bg-blue-100">
            <Link to="/student-dashboard/notifications">Notifications</Link>
          </li>
          <li className="p-3 rounded-md text-gray-700 hover:bg-blue-100">
            <Link to="/student-dashboard/all-projects">All Projects</Link>
          </li>
          <li className="p-3 rounded-md text-gray-700 hover:bg-blue-100">
            <Link to="/student-dashboard/evaluation">Evaluation</Link>
          </li>
        </ul>
      </div>
      <button onClick={()=>{
          localStorage.removeItem("token");
          navigate("/");
      }} className="p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Logout
      </button>
    </div>
  );
}
