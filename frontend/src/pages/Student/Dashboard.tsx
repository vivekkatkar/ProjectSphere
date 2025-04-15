import { Outlet } from "react-router-dom";
import Sidebar from "../../createdComp/Sidebar";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-[1fr,5fr] h-screen">
      {/* Sidebar: 1/6 */}
      <Sidebar />
      {/* Main Content: 5/6 */}
      <div className="bg-blue-200 h-full overflow-y-auto hide-scrollbar">
        <Outlet />
        <style jsx>{`
          .hide-scrollbar {
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE and Edge */
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Edge */
          }
        `}</style>
      </div>
    </div>
  );
}