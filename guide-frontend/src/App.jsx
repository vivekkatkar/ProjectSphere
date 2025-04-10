import { BrowserRouter, Route, Routes } from "react-router-dom";
import Profile from "./components/Profile";
import './App.css';
import SideBar from "./components/SideBar";
import Teams from "./components/Teams";
import SingleTeam from "./components/SingleTeam";

function App() {
  return (

   <div className="flex gap-3">
      <BrowserRouter>
        <SideBar />
        <Routes>
          <Route path="/teacher">
            <Route path="profile" element={<Profile />} />
            <Route path="teams" element={<Teams />} />
            <Route  path="team" element={<SingleTeam />} />
          </Route>
          <Route path="/test" element={<div> Testing Page </div>} />
        </Routes>
      </BrowserRouter>
   </div>
  );
}

export default App;
