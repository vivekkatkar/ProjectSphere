import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function TeamInfo() {
  const location = useLocation();
  const team = location.state?.team || {};
  const teamDetails = location.state?.teamDetails || [];

  const [ideas, setIdeas] = useState([]);

  // Fetch ideas on load
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const res = await axios.post(
          "http://localhost:3000/guide/team/ideas",
          { teamId: team.id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIdeas(res.data.ideas);
      } catch (error) {
        console.error("Failed to fetch ideas:", error);
      }
    };

    fetchIdeas();
  }, [team.id]);

  // Handle actions: comment, accept, reject
  const handleAction = async (id, action) => {
    const commentBox = document.getElementById(`comment-${id}`);
    const comment = commentBox ? commentBox.value : "";

    try {
      await axios.put(
        `http://localhost:3000/guide/teams/${team.id}/idea/${id}/status`,
        {
          projectId: id,
          comment: comment,
          status: action,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update idea state locally
      setIdeas((prev) =>
        prev.map((idea) =>
          idea.id === id
            ? {
                ...idea,
                comment: comment,
                approved: action === "accepted" ? 1 : action === "rejected" ? 2 : idea.approved,
              }
            : idea
        )
      );

      alert("Student Notified");
    } catch (error) {
      console.error("Failed to update idea:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white p-4 shadow-md rounded-md mb-4">
        <h2 className="text-xl font-bold text-blue-700 mb-2">Team Info</h2>
        <p><strong>Team Name:</strong> {team.name}</p>
        <p><strong>Team ID:</strong> {team.id}</p>
      </div>

      <div className="bg-white p-4 shadow-md rounded-md mb-4">
        <h3 className="text-lg font-semibold text-blue-600">Students:</h3>
        {teamDetails.length > 0 ? (
          <ul className="list-disc pl-5">
            {teamDetails.map((student, index) => (
              <li key={index}>
                <span className="font-medium">{student.name}</span> - PRN: {student.prn}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No students found.</p>
        )}
      </div>

      <div className="bg-white p-4 shadow-md rounded-md">
        <h3 className="text-lg font-semibold text-blue-600 mb-2">Submitted Ideas</h3>
        {ideas.length === 0 ? (
          <p className="text-gray-600">No ideas submitted yet.</p>
        ) : (
          ideas.map((idea) => (
            <div key={idea.id} className="border rounded-md p-3 mb-3 bg-blue-50">
              <p><strong>ID:</strong> {idea.id}</p>
              <p><strong>Topic:</strong> {idea.topic}</p>
              <p><strong>Status:</strong> {idea.approved === 0 ? "Pending" : idea.approved === 1 ? "Approved" : "Rejected"}</p>
              <p><strong>Comment:</strong> {idea.comment || "Not yet reviewed"}</p>

              <textarea
                className="border p-2 w-full mt-2"
                rows={2}
                placeholder="Add a comment"
                id={`comment-${idea.id}`}
              ></textarea>

              <div className="flex gap-2 mt-2">
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() => handleAction(idea.id, "commented")}
                >
                  Notify
                </button>
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded"
                  onClick={() => handleAction(idea.id, "accepted")}
                >
                  Accept
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => handleAction(idea.id, "rejected")}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
