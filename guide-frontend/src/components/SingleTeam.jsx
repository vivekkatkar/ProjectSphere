import axios from "axios";
import { act, useState } from "react";
import { useLocation } from "react-router-dom";

export default function TeamInfo() {
    const location = useLocation();
    const team = location.state?.team || {};
    const teamDetails = location.state?.teamDetails || [];

    // http://10.40.5.29:3000/guide/teams/${team.id}/ideas 
    const [ideas, setIdeas] = useState([
        {
            id : 1,
            topic : "Mockmate : AI Powered mock interview platform"
        },
        {
            id : 2,
            topic : "ProjectSpare : MP Tracking system"
        }
    ])
    // console.log(team);
    // console.log(teamDetails);

    const handleAction =  async (id, action) => {
        const commentBox = document.getElementById(`comment-${id}`);
        const comment = commentBox ? commentBox.value : "";
        
        const res = await axios.put(`http://10.40.5.29:3000/guide/teams/${team.id}/idea/${id}/status`, {
           projectId : id,
           comment : comment,
           status : action 
        });

        alert("Notified");

        console.log(action);
        console.log(comment);
    };
    


    return (
        <div>
            <div>Team Name: {team.name}</div>
            <div>Team ID: {team.id}</div>

            <div>
                <h3>Students:</h3>
                {teamDetails.length > 0 ? (
                    <ul>
                        {teamDetails.map((student, index) => (
                            <li key={index}>
                                Name: {student.name}, PRN: {student.prn}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No students found.</p>
                )}
            </div>

            <div >
                {
                    ideas == null ? <div> No any idea submitted </div> :
                    ideas.map((idea) => {
                        return (
                            <div key={idea.id} className="flex gap-3 items-center m-2">
                                <div>{idea.id}</div>
                                <div>{idea.topic}</div>
                                <textarea
                                    className="border p-2"
                                    rows={2}
                                    cols={15}
                                    placeholder="comment here"
                                    id={`comment-${idea.id}`}
                                ></textarea>
                                <button
                                    className="p-1 bg-blue-600 text-white h-10"
                                    onClick={() => handleAction(idea.id, "commented")}
                                >
                                    Notify
                                </button>
                                <button
                                    className="p-1 bg-red-600 text-white h-10"
                                    onClick={() => handleAction(idea.id, "rejected")}
                                >
                                    Reject
                                </button>
                                <button
                                    className="p-1 bg-green-500 text-white h-10"
                                    onClick={() => handleAction(idea.id, "accepted")}
                                >
                                    Accept 
                                </button>
                            </div>
                        );
                    })}                    
            </div>
        </div>
    );
}
