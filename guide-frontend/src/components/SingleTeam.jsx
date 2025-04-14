import axios from "../../api/uploader.js";
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function TeamMarks({ teamId }) {
  const [marks, setMarks] = useState(null);

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const res = await axios.get(`guide/teams/${teamId}/marks`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("Fetched marks:", res.data);
        setMarks(res.data);
      } catch (error) {
        console.error("Error fetching marks:", error);
      }
    };

    fetchMarks();
  }, [teamId]);

  function handleUpdate(){
    console.log("Handle update");
  }

  return (
    // <div className="bg-white p-4 shadow-md rounded-md mt-4">
    //   <h3 className="text-lg font-semibold text-blue-600 mb-2">Team Marks</h3>
    //   {marks ? (
    //     <div>
    //       <p>LA1: {marks.LA1_marks}</p>
    //       <p>LA2: {marks.LA2_marks}</p>
    //       <p>ESE: {marks.ESE_marks}</p>
    //     </div>
    //   ) : (
    //     <p className="text-gray-600">Loading marks...</p>
    //   )}
    // </div>

    <div className="bg-white p-4 shadow-md rounded-md mt-4">
      <h3 className="text-lg font-semibold text-blue-600 mb-2">Team Marks</h3>
      {marks ? (
        <div>
          <p>LA1: {marks.LA1_marks}</p>
          <p>LA2: {marks.LA2_marks}</p>
          <p>ESE: {marks.ESE_marks}</p>
          <button
            onClick={handleUpdate}
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          >
            Update
          </button>
        </div>
      ) : (
        <p className="text-gray-600">Loading marks...</p>
      )}
    </div>
  );
}

function TeamSynposis({ teamId }) {
  const [synopsis, setSynopsis] = useState({
    file: null,
    status: 0, // 0 -> pending, 1 -> approved, 2 -> rejected
    comments: "",
  });
  const [loading, setLoading] = useState(true);
  
  const [reviewStatus, setReviewStatus] = useState(0);
  const [reviewComments, setReviewComments] = useState("");

  const fetchSynopsis = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`student/synopsis/${teamId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const details = res.data.details;
      if (!details?.file) {
        setSynopsis({
          file: null,
          status: 0,
          comments: "",
        });
        setLoading(false);
        return;
      }
      
      const byteArray = Uint8Array.from(atob(details.file), (c) =>
        c.charCodeAt(0)
      );
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(blob);
      setSynopsis({
        file: fileURL,
        status: details.synopsisApproval,
        comments: details.comments || "",
      });
      
      setReviewStatus(details.synopsisApproval || 0);
      setReviewComments(details.comments || "");
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch synopsis:", error);
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchSynopsis();
  }, [fetchSynopsis]);

  const handleReviewSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const payload = {
        teamId: teamId,
        status: reviewStatus, // 0: pending, 1: approved, 2: rejected
        comments: reviewComments,
      };

      const res = await axios.post("student/updateSynopsisReview", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Synopsis review updated successfully!");
      // Refresh the synopsis display.
      fetchSynopsis();
    } catch (error) {
      console.error("Error updating synopsis review:", error);
      alert("Failed to update synopsis review.");
    }
  };

  if (loading) {
    return <div>Loading synopsis...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Team Synopsis Review</h2>
      {synopsis.file ? (
        <div>
          <p>
            <strong>File:</strong>{" "}
            <a
              href={synopsis.file}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              View Synopsis
            </a>
          </p>
          <p>
            <strong>Current Status:</strong>{" "}
            {synopsis.status === 1
              ? "Approved"
              : synopsis.status === 2
              ? "Rejected"
              : "Pending Approval"}
          </p>
          <p>
            <strong>Current Comments:</strong>{" "}
            {synopsis.comments || "No comments yet"}
          </p>
          <hr className="my-4" />
          <div className="mb-4">
            <label className="block mb-2 font-medium">
              Update Review Status:
            </label>
            <select
              value={reviewStatus}
              onChange={(e) => setReviewStatus(parseInt(e.target.value))}
              className="border p-2 rounded w-full"
            >
              <option value={0}>Pending Approval</option>
              <option value={1}>Approved</option>
              <option value={2}>Rejected</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Add/Edit Comments:</label>
            <textarea
              value={reviewComments}
              onChange={(e) => setReviewComments(e.target.value)}
              placeholder="Enter your comments"
              className="w-full border p-2 rounded"
            ></textarea>
          </div>
          <button
            onClick={handleReviewSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Submit Review
          </button>
        </div>
      ) : (
        <div>No synopsis uploaded yet for team {teamId}.</div>
      )}
    </div>
  );
}

function TeamReports({ teamId }) {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (teamId) {
      getReportsDetails();
    }
  }, [teamId]);

  async function getReportsDetails() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`student/reports/${teamId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      if (response.status === 200 && data.reports) {
        const submittedReports = data.reports;

        const allWeeks = Array.from({ length: 10 }, (_, i) => {
          const weekNum = i + 1;
          const existing = submittedReports.find((r) => r.week === weekNum);
          return {
            week: weekNum,
            status: !!existing,
            reportId: existing?.id || null,
            file: existing?.file || null,
          };
        });

        setReports(allWeeks);
      }
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    }
  }

  async function handleDownload(reportId) {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:3000/student/report/${reportId}/download`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Week-${reportId}-report.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        alert("Failed to download the report");
      }
    } catch (err) {
      console.error("Error downloading the report:", err);
    }
  }

  return (
    <div className="flex">
    <div className="bg-white shadow-md p-6 rounded-lg ">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">Weekly Reports</h2>
      {reports.length > 0 ? (
        <ul className="space-y-4">
          {reports.map((report) =>
            report.status ? (
              <li key={report.week} className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold text-blue-600">
                  Week {report.week}
                </h3>
                <button
                  onClick={() => handleDownload(report.reportId)}
                  className="text-blue-500 underline mt-1"
                >
                  Download Report
                </button>
                <iframe
                  src={`http://localhost:3000/student/report/${report.reportId}/view`}
                  width="100%"
                  height="500px"
                  title={`Report Week ${report.week}`}
                  className="mt-3 border"
                />
              </li>
            ) : null
          )}
        </ul>
      ) : (
        <p>No reports available yet.</p>
      )}
    </div>
    </div>
  );
}

export default function TeamInfo() {
  const location = useLocation();
  const team = location.state?.team || {};
  const teamDetails = location.state?.teamDetails || [];

  const [ideas, setIdeas] = useState([]);

  console.log(team);

  // Fetch ideas on load
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        console.log("Here team id : ", team.id);
        const res = await axios.post(
          "guide/team/ideas",
          { teamId: team.id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
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
        `guide/teams/${team.id}/idea/${id}/status`,
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

      <TeamMarks teamId={team.id} />

      <TeamReports teamId={team.id} />
      <TeamSynposis teamId={team.id} /> 
    </div>
  );
}
