import { useNavigate } from "react-router-dom";

export default function SideBar() {
    const navigate = useNavigate();

    return (
        <div className="w-20 lg:w-72 bg-gradient-to-b from-gray-900 to-gray-800 h-screen text-white flex flex-col p-6 transition-all duration-300 ease-in-out shadow-2xl">
            {/* Sidebar Header */}
            <div className="flex items-center mb-10">
                <div className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    App
                </div>
            </div>

            {/* Sidebar Menu */}
            <nav className="space-y-2 flex-1">
                {/* Profile Page */}
                <div 
                    onClick={() => navigate("/teacher/profile")} 
                    className="cursor-pointer hover:bg-gray-700/50 rounded-xl p-4 transition-all duration-200 flex items-center space-x-4 group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="hidden lg:block text-base font-medium group-hover:text-blue-300 transition-colors">Profile</span>
                </div>

                {/* Teams Page */}
                <div 
                    onClick={() => navigate("/teacher/teams")} 
                    className="cursor-pointer hover:bg-gray-700/50 rounded-xl p-4 transition-all duration-200 flex items-center space-x-4 group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="hidden lg:block text-base font-medium group-hover:text-blue-300 transition-colors">Teams</span>
                </div>

                {/* Notifications */}
                <div 
                    onClick={() => navigate("/teacher/notify")} 
                    className="cursor-pointer hover:bg-gray-700/50 rounded-xl p-4 transition-all duration-200 flex items-center space-x-4 group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="hidden lg:block text-base font-medium group-hover:text-blue-300 transition-colors">Notifications</span>
                </div>
            </nav>

            {/* Sidebar Footer */}
            <div className="text-sm text-gray-500 text-center mt-8 font-light">
                <span>Version 1.0</span>
            </div>
        </div>
    );
}