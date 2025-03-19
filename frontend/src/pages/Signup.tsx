import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

export default function Signup() {
  return (
      <div className="flex flex-col justify-center bg-blue-200">
        <div className="flex flex-row justify-center items-center pt-5">
          <button className="p-2 pl-4 pr-4 bg-blue-500 m-2 rounded-sm text-white">
            <Link to="teacher">Teacher</Link>
          </button>
          <button className="p-2 pl-4 pr-4 bg-blue-500 m-2 rounded-sm text-white">
            <Link to="student">Student</Link>
          </button>
        </div>
        <Outlet/> 
      </div>

      
  );
}
