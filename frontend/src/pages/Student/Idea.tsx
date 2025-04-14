import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const Idea = () => {
    
    const [student, setStudent] = useState({
        "Name" : "zy",
        "PRN" : "",
        "Batch" : 0,
        "Guide" : 0,
        "Semester" : 1,
        "teamId" : 0
    })

    const [synopsism, setSynopsism] = useState({
        "file" : null, 
        "status" : 0, // 0 -> pending, 1 -> approved, 2 -> rejected,
        "comments" : ""
    })

    const selector = useSelector((state: any) => state.user);
    const teamId = selector.teamId;
    console.log (teamId)
    const [synopsis, setSynopsis] = useState<{
        file: string | null;
        status: number;
        comments: string;
    }>({
        file: null,
        status: 0, // 0 -> pending, 1 -> approved, 2 -> rejected
        comments: ""
    });

    const [newIdea, setNewIdea] = useState("");
    const [file, setFile] = useState<File | null>(null);
    
    const [ideas, setIdeas] = useState<{ id: number; topic: string; approved: number; comment?: string }[]>([]);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const hasApprovedIdea = ideas.some(idea => idea.approved === 1);
    const approvedIdeas = ideas.filter(idea => idea.approved === 1);
    const pendingIdeas = ideas.filter(idea => idea.approved === 0);
    const rejectedIdeas = ideas.filter(idea => idea.approved === 2);
    
    async function getDetails() {
        try {
            const token = localStorage.getItem("token");
            
            // await fetch("http://localhost:3000/student/profile", {
            //     method: "GET",
            //     headers: {
            //         "Content-Type": "application/json",
            //         "Authorization": `Bearer ${token}`
            //     }
            // }).then(resp => {
            //     if (!resp.ok) throw new Error("Failed to fetch student data");
            //     return resp.json();
            // })
            // .then(data => {
            //     console.log (data);
            //     setStudent(() => {
            //         console.log (data.data);
            //         const updatedStudent = {
            //             Name: data.data.name,
            //             PRN: data.data.prn ,
            //             Batch: data.data.batch || 0,
            //             Guide: data.data.guide?.name || 0,
            //             Semester: data.data.semester || 6,
            //             teamId: data.data.teamId || 0
            //         };
            //         return updatedStudent;
            //     });
                
            // })
            // .catch(error => console.error("Error fetching details:", error));  

            
          axios.get("student/profile", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
          })
          .then(response => {
            const data = response.data;
            console.log(data);
            setStudent(() => {
                console.log(data.data);
                const updatedStudent = {
                    Name: data.data.name,
                    PRN: data.data.prn,
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
        getSynopsis();
    }, []);

    const fetchIdea = async () => {
        try {
          const res = await axios.post(
            "student/ideas",
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
    
      interface ApprovalStatus {
        status: number;
      }

      const getApprovalStatus = (status: ApprovalStatus["status"]): string => {
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

      const handleSynopsisSubmission = async () => {
        if (!file) {
          alert("Please select a file before uploading.");
          return;
        }
        try {
          const token = localStorage.getItem("token");

          const formData = new FormData();

          formData.append("file", file || "");
          formData.append("teamId", teamId || 0);
          formData.append("topic", approvedIdeas?.[0]?.topic || "");

          console.log ("Form data:", formData);

          const response = await axios.post(
            "http://localhost:3000/student/synopsisUpload",
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data", 
              },
            }
          );
    
          const data = response.data;
    
          if (response.status >= 200 && response.status < 300) {
            alert("Report uploaded successfully!");
            setFile(null);
            if (inputRef.current) inputRef.current.value = "";
          } else {
            alert("Upload failed: " + data.error);
          }
        } catch (error) {
          console.error("Error uploading file:", error);
          alert("Upload failed.");
        }
      }

      const getSynopsis = async () => {
        try {
          const res = await axios.get(
            `http://localhost:3000/student/synopsis/${teamId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
      
          console.log("Synopsis --> ", res.data);
      
          const details = res.data.details;
      
          if (!details?.file) {
            setSynopsis({
              file: null,
              status: 0,
              comments: "",
            });
            return;
          }
      
          // Convert base64 to Blob and generate URL
          const byteArray = Uint8Array.from(atob(details.file), (c) =>
            c.charCodeAt(0)
          );
          const blob = new Blob([byteArray], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(blob);
      
          setSynopsis({
            file: fileURL || "",
            status: details.synopsisApproval,
            comments: details.comments || "",
          });
        } catch (error) {
          console.error("Failed to fetch synopsis:", error);
        }
      };
      

      

    const handleSubmit = async () => {
        try {
          const res = await axios.post(
            "student/addIdea",
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
                {hasApprovedIdea ? (
                <div>
                    <h3 className="text-lg font-semibold ">Your Approved Idea :</h3>
                    <p className="text-gray-700 bg-gray-100 p-4 rounded">{
                      }</p>
                    
                    {synopsis.status === 1 ? (
                        <div className="mt-4 p-4  rounded">
                            <h3 className="text-lg font-semibold">Your Approved Synopsis:</h3>
                            <iframe src={synopsis.file || ""} width="100%" height="600px" title="Synopsis PDF" />
                            <a href={synopsis.file || ""} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                View Synopsis
                            </a>
                        </div>
                    ) : (
                      <div className="mt-4">
                      <h3 className="text-lg font-semibold text-blue-600 mb-2">Synopsis</h3>
                    
                      {synopsis.file && synopsis.status !== 2 ? (
                        <div className="p-4 border rounded bg-green-50">
                          {synopsis.status === 1 ? <h4 className="text-md font-semibold mb-2">Your Approved Synopsis</h4> : <h4 className="text-md font-semibold mb-2">Your Synopsis Under Review</h4>}
                          <a
                            href={synopsis.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            Download/View Synopsis
                          </a>
                        </div>
                      ) : (
                        <div className="p-4 border rounded bg-gray-50">
                          <label className="block font-medium mb-2">Upload Synopsis (PDF/DOC)</label>
                          <input
                            ref={inputRef}
                            type="file"
                            className="border p-2 rounded w-full mb-3"
                            onChange={(e) => {
                              const selectedFile = e.target.files?.[0] || null;
                              setFile(selectedFile);
                            }}
                            accept=".pdf,.doc,.docx"
                          />
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={handleSynopsisSubmission}
                          >
                            Upload Report
                          </button>
                    
                          {synopsis.status === 2 && (
                            <div className="mt-4 bg-red-100 p-3 rounded border border-red-300">
                              <h4 className="font-semibold text-red-700 mb-1">Rejected Comments:</h4>
                              <p className="text-gray-800">{synopsis.comments || "No remarks given."}</p>
                            </div>
                          )}
                        </div>
                      )}
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
