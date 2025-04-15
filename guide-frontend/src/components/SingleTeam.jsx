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
        setMarks(res.data);
      } catch (error) {
        console.error("Error fetching marks:", error);
      }
    };

    fetchMarks();
  }, [teamId]);

  function handleUpdate() {
    console.log("Handle update");
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Marks
      </h3>
      {marks ? (
        <div className="space-y-3">
          <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">LA1</span>
            <span className="text-gray-800 font-medium">{marks.LA1_marks}</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">LA2</span>
            <span className="text-gray-800 font-medium">{marks.LA2_marks}</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">ESE</span>
            <span className="text-gray-800 font-medium">{marks.ESE_marks}</span>
          </div>
          <button
            onClick={handleUpdate}
            className="w-full py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Update Marks
          </button>
        </div>
      ) : (
        <p className="text-gray-500 text-center">Loading...</p>
      )}
    </div>
  );
}

function TeamSynposis({ teamId }) {
  const [synopsis, setSynopsis] = useState({
    file: null,
    status: 0,
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

      const byteArray = Uint8Array.from(atob(details.file), (c) => c.charCodeAt(0));
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
        status: reviewStatus,
        comments: reviewComments,
      };

      await axios.post("student/updateSynopsisReview", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Synopsis review updated successfully!");
      fetchSynopsis();
    } catch (error) {
      console.error("Error updating synopsis review:", error);
      alert("Failed to update synopsis review.");
    }
  };

  if (loading) {
    return <div className="text-gray-500 text-center">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        Synopsis
      </h2>
      {synopsis.file ? (
        <div className="space-y-4">
          <a
            href={synopsis.file}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-500 hover:underline flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9l-7-7H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            View Synopsis
          </a>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              Status: {" "}
              <span
                className={`px-2 py-1 rounded text-sm ${
                  synopsis.status === 1
                    ? "bg-green-100 text-green-700"
                    : synopsis.status === 2
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {synopsis.status === 1 ? "Approved" : synopsis.status === 2 ? "Rejected" : "Pending"}
              </span>
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Comments: {synopsis.comments || "None"}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Review Status</label>
            <select
              value={reviewStatus}
              onChange={(e) => setReviewStatus(parseInt(e.target.value))}
              className="w-full p-2 border border-gray-200 rounded-lg"
            >
              <option value={0}>Pending</option>
              <option value={1}>Approved</option>
              <option value={2}>Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Comments</label>
            <textarea
              value={reviewComments}
              onChange={(e) => setReviewComments(e.target.value)}
              placeholder="Add comments"
              className="w-full p-2 border border-gray-200 rounded-lg h-24 resize-none"
            ></textarea>
          </div>
          <button
            onClick={handleReviewSubmit}
            className="w-full py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Submit Review
          </button>
        </div>
      ) : (
        <p className="text-gray-500 text-center">No synopsis uploaded.</p>
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

      if (response.status === 200 && response.data.reports) {
        const submittedReports = response.data.reports;
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
      const response = await fetch(
        `http://localhost:3000/student/report/${reportId}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Weekly Reports
      </h2>
      {reports.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {reports.map((report) =>
            report.status ? (
              <div
                key={report.week}
                className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-gray-800 font-medium text-sm">
                      Week {report.week}
                    </h3>
                    <button
                      onClick={() => handleDownload(report.reportId)}
                      className="text-indigo-500 hover:underline text-sm flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <iframe
                      src={`http://localhost:3000/student/report/${report.reportId}/view`}
                      width="100%"
                      height="150px"
                      title={`Report Week ${report.week}`}
                      className="border border-gray-100 rounded-md"
                    />
                  </div>
                </div>
              </div>
            ) : null
          )}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No reports available.</p>
      )}
    </div>
  );
}


function TeamIdeas({ teamId, ideas, setIdeas }) {
  const handleAction = async (id, action) => {
    const commentBox = document.getElementById(`comment-${id}`);
    const comment = commentBox ? commentBox.value : "";

    try {
      await axios.put(
        `guide/teams/${teamId}/idea/${id}/status`,
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

      setIdeas((prev) =>
        prev.map((idea) =>
          idea.id === id
            ? {
                ...idea,
                comment: comment,
                approved:
                  action === "accepted"
                    ? 1
                    : action === "rejected"
                    ? 2
                    : idea.approved,
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
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        Project Ideas
      </h3>
      {ideas.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No ideas submitted yet.</p>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {ideas.map((idea) => (
            <div
              key={idea.id}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-gray-800 font-medium flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    {idea.topic}
                  </p>
                  <p className="text-gray-600 text-sm flex items-center gap-2 mt-1">
                    <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    ID: {idea.id}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    idea.approved === 1
                      ? "bg-green-100 text-green-700"
                      : idea.approved === 2
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {idea.approved === 0 ? "Pending" : idea.approved === 1 ? "Approved" : "Rejected"}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {idea.comment || "No comments yet"}
              </p>
              <div className="flex gap-2 flex-col sm:flex-row">
                <textarea
                  className="w-full p-2 border border-gray-200 rounded-lg h-16 resize-none text-sm"
                  placeholder="Add a comment"
                  id={`comment-${idea.id}`}
                ></textarea>
                <div className="flex gap-2 sm:flex-col">
                  <button
                    className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors text-sm"
                    onClick={() => handleAction(idea.id, "commented")}
                  >
                    Notify
                  </button>
                  <button
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
                    onClick={() => handleAction(idea.id, "accepted")}
                  >
                    Accept
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                    onClick={() => handleAction(idea.id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


export default function TeamInfo() {
  const location = useLocation();
  const team = location.state?.team || {};
  const teamDetails = location.state?.teamDetails || [];

  const [ideas, setIdeas] = useState([]);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
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

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
            <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            {team.name}
          </h1>
          <p className="text-gray-600 mt-1">Team ID: {team.id}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex flex-wrap gap-2 border-b border-gray-200">
            {["Overview", "Ideas", "Marks", "Synopsis", "Reports"].map((section) => (
              <button
                key={section}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeSection.toLowerCase() === section.toLowerCase()
                    ? "bg-indigo-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setActiveSection(section.toLowerCase())}
              >
                {section}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {activeSection === "overview" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    Team Details
                  </h3>
                  <p className="text-gray-800 font-medium">{team.name}</p>
                  <p className="text-gray-600">ID: {team.id}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Members
                  </h3>
                  {teamDetails.length > 0 ? (
                    <ul className="space-y-2">
                      {teamDetails.map((student, index) => (
                        <li key={index} className="text-gray-600 flex items-center gap-2">
                          <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {student.name} ({student.prn})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No members found.</p>
                  )}
                </div>
              </div>
            </div>
          )}
          {activeSection === "ideas" && (
            <TeamIdeas teamId={team.id} ideas={ideas} setIdeas={setIdeas} />
          )}
          {activeSection === "marks" && <TeamMarks teamId={team.id} />}
          {activeSection === "synopsis" && <TeamSynposis teamId={team.id} />}
          {activeSection === "reports" && <TeamReports teamId={team.id} />}
        </div>
      </div>
    </div>
  );
}