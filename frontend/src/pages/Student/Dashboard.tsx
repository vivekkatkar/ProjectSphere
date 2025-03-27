import { Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "../../createdComp/Sidebar";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-[1fr,5fr] h-screen">
      {/* 1 / 6 */}
     <Sidebar/>
     {/* 5 / 6  */}
      <div className="p-6 bg-blue-200 h-full overflow-y-auto">
          <Outlet/>
        </div> 
    </div>
  );
}
