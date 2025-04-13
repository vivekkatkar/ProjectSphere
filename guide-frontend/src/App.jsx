import { BrowserRouter, Route, Routes } from "react-router-dom";
import Profile from "./components/Profile";
import './App.css';
import SideBar from "./components/SideBar";
import Teams from "./components/Teams";
import SingleTeam from "./components/SingleTeam";
import { useEffect } from "react";
import Notify from "./components/Notify";

function App() {
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  return (

   <div className="flex gap-3">
      <BrowserRouter>
        <SideBar />
        <Routes>
          <Route path="/teacher">
            <Route path="profile" element={<Profile />} />
            <Route path="teams" element={<Teams />} />
            <Route  path="team" element={<SingleTeam />} />
            <Route  path="notify" element={<Notify />} />
          </Route>
          <Route path="/test" element={<div> Testing Page </div>} />
        </Routes>
      </BrowserRouter>
   </div>
  );
}

export default App;
