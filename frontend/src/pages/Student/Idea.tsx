import { useState, useEffect } from "react";

const Idea = () => {
    const [idea, setIdea] = useState({
        "Description" : "",
        "status" : 0  // 0 -> pending, 1 -> approved, 2 -> rejected
    });
    
    const [ideaStatus, setIdeaStatus] = useState("approved"); // pending | approved | rejected
    const [synopsis, setSynopsis] = useState({
        "file" : null, 
        "status" : 0 // 0 -> pending, 1 -> approved, 2 -> rejected
    });

    const [newIdea, setNewIdea] = useState("");

    const [synopsisFile, setSynopsisFile] = useState(null);
 

    useEffect(() => {
        fetchIdea();
        fetchIdeaUnderReview();
        fetchSynopsis()
    }, []);

    const fetchIdea = async () => {
        
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

    const handlesubmit = async () => {
      // idea submission
    };

    // Guides remark section remaining 

    return (
        <div className="max-w-2xl mx-auto mt-6 p-6 bg-white shadow-lg rounded">
            <h2 className="text-xl font-bold mb-4">Project</h2>
                {/* // issue : multiple ideas even if we delete rejected there will be under review idea  */}
                {ideaStatus === "approved" ? (
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
                      onClick={handlesubmit}
                  >
                      Submit Idea
                  </button>

                  <div className="">
                    <h1 className="text-lg font-semibold p-2">Ideas under review</h1>
                    
                  </div>
              </div>
            )}
        </div>
    );
};

export default Idea;
