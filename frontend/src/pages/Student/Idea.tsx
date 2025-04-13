import axios from "axios";
import { useState, useEffect } from "react";

const Idea = () => {
    
    const [student, setStudent] = useState({
        "Name" : "zy",
        "PRN" : "",
        "Batch" : 0,
        "Guide" : 0,
        "Semester" : 1,
        "teamId" : 0
    })

    const [idea, setIdea] = useState({
        "Description" : "",
        "status" : 0  // 0 -> pending, 1 -> approved, 2 -> rejected
    });
    
    const [ideaStatus, setIdeaStatus] = useState("rejected"); // pending | approved | rejected
    const [synopsis, setSynopsis] = useState({
        "file" : null, 
        "status" : 0 // 0 -> pending, 1 -> approved, 2 -> rejected
    });

    const [newIdea, setNewIdea] = useState("");
    const [synopsisFile, setSynopsisFile] = useState(null);
    const [ideas, setIdeas] = useState([]);

    const hasApprovedIdea = ideas.some(idea => idea.approved === 1);
    const approvedIdeas = ideas.filter(idea => idea.approved === 1);
    const pendingIdeas = ideas.filter(idea => idea.approved === 0);
    const rejectedIdeas = ideas.filter(idea => idea.approved === 2);

    async function getDetails() {
        try {
            const token = localStorage.getItem("token");
            await fetch("http://localhost:3000/student/profile", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }).then(resp => {
                if (!resp.ok) throw new Error("Failed to fetch student data");
                return resp.json();
            })
            .then(data => {
                console.log (data);
                setStudent(() => {
                    console.log (data.data);
                    const updatedStudent = {
                        Name: data.data.name,
                        PRN: data.data.prn ,
                        Batch: data.data.batch || 0,
                        Guide: data.data.guide?.name || 0,
                        Semester: data.data.semester || 6,
                        teamId: data.data.teamId || 0
                    };
                    return updatedStudent;
                });
                
            })
            .catch(error => console.error("Error fetching details:", error));           
        } catch (error) {
            console.error("Error fetching details:", error);
        }
    }

    // useEffect(() => {
    // }, []);

    useEffect(() => {
        getDetails();
        fetchIdea();
        fetchIdeaUnderReview();
        fetchSynopsis()
    }, []);

    const fetchIdea = async () => {
        try {
          const res = await axios.post(
            "http://localhost:3000/student/ideas",
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("Ideas --> ");
          console.log(res.data);
          setIdeas(res.data.ideas);
        } catch (error) {
          console.error("Failed to fetch ideas:", error);
        }
      };
    
      useEffect(() => {
        fetchIdea();
      }, []);
    
      const getApprovalStatus = (status) => {
        switch (status) {
          case 0:
            return "Pending";
          case 1:
            return "Approved";
          case 2:
            return "Rejected";
          default:
            return "Unknown";
        }
      };


    const fetchSynopsis = async () => {
        
    };

    const fetchIdeaUnderReview = async () => {
      try {

      }
      catch(e){

      }
    }

    const handleSynopsisFileUpload = (event : any) => {
        // synopsis submission
    };

    const handleSubmit = async () => {
        try {
          const res = await axios.post(
            "http://localhost:3000/student/addIdea",
            { topic : newIdea },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
      
          console.log("Idea submitted:", res.data);
          alert("Idea submitted successfully!");
          setNewIdea("");
        } catch (error) {
          console.error("Error submitting idea:", error);
          alert("Failed to submit idea.");
        }
      };

    // Guides remark section remaining 

    return (
        <>
        {/* // display ideas */}
        <div className="bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">My Submitted Ideas</h2>
            {ideas.length === 0 ? (
  <p className="text-gray-600">You haven't submitted any ideas yet.</p>
) : (
  <>
    {approvedIdeas.length > 0 && (
      <div className="mb-6">
        <h3 className="text-green-700 font-semibold">Approved Ideas</h3>
        {approvedIdeas.map((idea) => (
          <div key={idea.id} className="mb-3 p-3 border rounded-md bg-green-50">
            <p><strong>Topic:</strong> {idea.topic}</p>
            <p><strong>Status:</strong> {getApprovalStatus(idea.approved)}</p>
            <p>
              <strong>Comment:</strong>{" "}
              {idea.comment && idea.comment.trim() !== "" ? idea.comment : "Not yet reviewed"}
            </p>
          </div>
        ))}
      </div>
    )}

    {pendingIdeas.length > 0 && (
      <div className="mb-6">
        <h3 className="text-yellow-600 font-semibold">Pending Ideas</h3>
        {pendingIdeas.map((idea) => (
          <div key={idea.id} className="mb-3 p-3 border rounded-md bg-yellow-50">
            <p><strong>Topic:</strong> {idea.topic}</p>
            <p><strong>Status:</strong> {getApprovalStatus(idea.approved)}</p>
            <p>
              <strong>Comment:</strong>{" "}
              {idea.comment && idea.comment.trim() !== "" ? idea.comment : "Not yet reviewed"}
            </p>
          </div>
        ))}
      </div>
    )}

    {rejectedIdeas.length > 0 && (
      <div className="mb-6">
        <h3 className="text-red-600 font-semibold">Rejected Ideas</h3>
        {rejectedIdeas.map((idea) => (
          <div key={idea.id} className="mb-3 p-3 border rounded-md bg-red-50">
            <p><strong>Topic:</strong> {idea.topic}</p>
            <p><strong>Status:</strong> {getApprovalStatus(idea.approved)}</p>
            <p>
              <strong>Comment:</strong>{" "}
              {idea.comment && idea.comment.trim() !== "" ? idea.comment : "Not yet reviewed"}
            </p>
          </div>
        ))}
      </div>
    )}
  </>
)}

        </div>

       <div>
         {
            (student.teamId == 0 ? <div>Can't submit idea before team creation</div> :  
        
        <div className="max-w-2xl mx-auto mt-6 p-6 bg-white shadow-lg rounded">
            <h2 className="text-xl font-bold mb-4">Project</h2>
                {/* // issue : multiple ideas even if we delete rejected there will be under review idea  */}
                {hasApprovedIdea  ? (
                <div>
                    <h3 className="text-lg font-semibold ">Your Approved Idea :</h3>
                    <p className="text-gray-700 bg-gray-100 p-4 rounded">{}</p>
                    
                    {synopsis.status === 1 ? (
                        <div className="mt-4 p-4  rounded">
                            <h3 className="text-lg font-semibold">Your Approved Synopsis:</h3>
                            <a href={synopsis.file || ""} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                View Synopsis
                            </a>
                        </div>
                    ) : (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold text-blue-600">Submit Your Synopsis</h3>
                            <input 
                                type="file" 
                                className="mt-2 border p-2 rounded w-full"
                                accept=".pdf,.doc,.docx"
                            />
                            <button 
                                className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={handleSynopsisFileUpload}
                            >
                                Upload & Submit Synopsis
                            </button>
                            {/* guide should be able to give remarks aswell */}
                        </div>
                    )}
                </div>
            ) : (
                <div>
                  <h3 className="text-lg font-semibold">Submit your idea.</h3>
                  <textarea 
                      className="w-full p-2 border rounded"
                      placeholder="Enter new idea..."
                      value={newIdea}
                      onChange={(e) => setNewIdea(e.target.value)}
                  />
                  <button 
                      className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={handleSubmit}
                  >
                      Submit Idea
                  </button>

                  <div className="">
                    <h1 className="text-lg font-semibold p-2">Ideas under review</h1>
                    
                  </div>
              </div>
            )}
        </div>
        )
    }
       </div>
       </>
    );
};

export default Idea;
