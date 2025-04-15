import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  return (
    <div className="w-20 lg:w-64 bg-gradient-to-b from-gray-900 to-gray-800 h-screen text-white flex flex-col p-6 transition-all duration-300 ease-in-out shadow-2xl sticky top-0">
      <div className="flex items-center mb-10">
        <div className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Dashboard
        </div>
      </div>

      <nav className="space-y-2 flex-1">
        <div className="cursor-pointer hover:bg-gray-700/50 rounded-xl p-4 transition-all duration-200 flex items-center space-x-4 group">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <Link to="/student-dashboard/profile" className="hidden lg:block text-base font-medium group-hover:text-blue-300 transition-colors">Profile</Link>
        </div>

        <div className="cursor-pointer hover:bg-gray-700/50 rounded-xl p-4 transition-all duration-200 flex items-center space-x-4 group">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <Link to="/student-dashboard/idea" className="hidden lg:block text-base font-medium group-hover:text-blue-300 transition-colors">Idea</Link>
        </div>

        <div className="cursor-pointer hover:bg-gray-700/50 rounded-xl p-4 transition-all duration-200 flex items-center space-x-4 group">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <Link to="/student-dashboard/weekly-reports" className="hidden lg:block text-base font-medium group-hover:text-blue-300 transition-colors">Weekly Reports</Link>
        </div>

        <div className="cursor-pointer hover:bg-gray-700/50 rounded-xl p-4 transition-all duration-200 flex items-center space-x-4 group">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <Link to="/student-dashboard/notifications" className="hidden lg:block text-base font-medium group-hover:text-blue-300 transition-colors">Notifications</Link>
        </div>

        <div className="cursor-pointer hover:bg-gray-700/50 rounded-xl p-4 transition-all duration-200 flex items-center space-x-4 group">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <Link to="/student-dashboard/all-projects" className="hidden lg:block text-base font-medium group-hover:text-blue-300 transition-colors">All Projects</Link>
        </div>

        <div className="cursor-pointer hover:bg-gray-700/50 rounded-xl p-4 transition-all duration-200 flex items-center space-x-4 group">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01m-.01 4h.01" />
          </svg>
          <Link to="/student-dashboard/evaluation" className="hidden lg:block text-base font-medium group-hover:text-blue-300 transition-colors">Evaluation</Link>
        </div>
      </nav>

      <button 
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
        }} 
        className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 text-base font-medium"
      >
        Logout
      </button>
    </div>
  );
}