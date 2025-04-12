import { useNavigate } from "react-router-dom"

export default function SideBar(){
    const navigate = useNavigate();

    return <div className="w-50 bg-blue-300 h-screen">
        Side bar 
        <div onClick={() =>{
            navigate("/teacher/profile");
        }}>
            Profile Page 
        </div>
        <div onClick={() => {
            navigate("/teacher/teams")
        }} >
            Teams Page 
        </div>
        <div onClick={() => {
            navigate("/teacher/notify")
        }} >
            Notifications 
        </div>
    </div>
}