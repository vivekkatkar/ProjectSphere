import { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "../../api/uploader.js";

const SynopsisDisplay = ({ teamId }) => {
  const [synopsis, setSynopsis] = useState({
    file: null,
    status: 0, // 0 -> pending, 1 -> approved, 2 -> rejected
    comments: "",
  });
  const [loading, setLoading] = useState(true);
  const [updateMode, setUpdateMode] = useState(false);
  const [updateFile, setUpdateFile] = useState(null);
  const [updating, setUpdating] = useState(false);

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
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch synopsis:", error);
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchSynopsis();
  }, [fetchSynopsis]);

  const handleUpdateSubmit = async () => {
    if (!updateFile) {
      alert("Please select a file to update.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", updateFile);
      formData.append("teamId", teamId);
      formData.append("topic", "");
      setUpdating(true);

      const res = await axios.post("student/synopsisUpload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Synopsis updated successfully!");
      setUpdateMode(false);
      setUpdateFile(null);
      fetchSynopsis();
    } catch (error) {
      console.error("Error updating synopsis:", error);
      alert("Failed to update synopsis.");
    }
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-gray-600 text-lg font-semibold animate-pulse flex items-center">
          <svg className="w-6 h-6 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004 9.582V4m0 16v-5h-.582m-9.774-2A8.001 8.001 0 0120 14.418V20" />
          </svg>
          Loading synopsis...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 transform hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <svg className="w-6 h-6 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Synopsis Details
      </h2>
      <div className="space-y-4">
        {synopsis.file ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <a
                  href={synopsis.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  View Synopsis
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    synopsis.status === 1
                      ? "bg-green-100 text-green-800"
                      : synopsis.status === 2
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {synopsis.status === 1
                    ? "Approved"
                    : synopsis.status === 2
                    ? "Rejected"
                    : "Pending"}
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-start space-x-3 mb-4">
                <svg className="w-5 h-5 text-gray-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-gray-600">{synopsis.comments || "No remarks provided"}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setUpdateMode((prev) => !prev)}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004 9.582V4m0 16v-5h-.582m-9.774-2A8.001 8.001 0 0120 14.418V20" />
                  </svg>
                  {updateMode ? "Cancel" : "Update Synopsis"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-600 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            No synopsis uploaded yet.
          </div>
        )}
        {updateMode && (
          <div className="mt-6 p-6 bg-indigo-50 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Update Synopsis
            </h3>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Select new synopsis file
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                  setUpdateFile(e.target.files ? e.target.files[0] : null)
                }
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              <button
                onClick={handleUpdateSubmit}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors flex items-center disabled:opacity-50"
                disabled={updating}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                {updating ? "Updating..." : "Submit Update"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Idea = () => {
  const [student, setStudent] = useState({
    Name: "zy",
    PRN: "",
    Batch: 0,
    Guide: 0,
    Semester: 1,
    teamId: 0,
  });

  const [synopsis, setSynopsis] = useState({
    file: null,
    status: 0,
    comments: "",
  });

  const [newIdea, setNewIdea] = useState("");
  const [file, setFile] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const inputRef = useRef(null);

  const selector = useSelector((state) => state.user);
  const teamId = selector.teamId;

  const hasApprovedIdea = ideas.some((idea) => idea.approved === 1);
  const approvedIdeas = ideas.filter((idea) => idea.approved === 1);
  const pendingIdeas = ideas.filter((idea) => idea.approved === 0);
  const rejectedIdeas = ideas.filter((idea) => idea.approved === 2);

  async function getDetails() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("student/profile", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      setStudent({
        Name: data.data.name,
        PRN: data.data.prn,
        Batch: data.data.batch || 0,
        Guide: data.data.guide?.name || 0,
        Semester: data.data.semester || 6,
        teamId: data.data.teamId || 0,
      });
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  }

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
      setIdeas(res.data.ideas);
    } catch (error) {
      console.error("Failed to fetch ideas:", error);
    }
  };

  const getSynopsis = async () => {
    try {
      const res = await axios.get(`student/synopsis/${teamId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const details = res.data.details;

      if (!details?.file) {
        setSynopsis({
          file: null,
          status: 0,
          comments: "",
        });
        return;
      }

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

  useEffect(() => {
    getDetails();
    fetchIdea();
    getSynopsis();
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
      const response = await axios.post("student/synopsisUpload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status >= 200 && response.status < 300) {
        alert("Report uploaded successfully!");
        setFile(null);
        if (inputRef.current) inputRef.current.value = "";
        getSynopsis();
      } else {
        alert("Upload failed: " + response.data.error);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Upload failed.");
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "student/addIdea",
        { topic: newIdea },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Idea submitted successfully!");
      setNewIdea("");
      fetchIdea();
    } catch (error) {
      console.error("Error submitting idea:", error);
      alert("Failed to submit idea.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center relative">
          <div className="absolute inset-0 bg-indigo-200 opacity-20 rounded-full blur-3xl animate-pulse-slow"></div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight relative z-10">
            Project Innovation Hub
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto relative z-10">
            Spark creativity, submit ideas, and track your project’s progress with ease.
          </p>
        </div>

        {/* Ideas Section */}
        <div className="bg-white rounded-3xl shadow-lg p-8 transform hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-7 h-7 text-indigo-600 mr-3 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Your Ideas
          </h2>
          {ideas.length === 0 ? (
            <div className="text-center py-8 text-gray-600 flex items-center justify-center animate-fade-in">
              <svg className="w-8 h-8 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              No ideas submitted yet. Let’s get started!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {approvedIdeas.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-700 flex items-center">
                    <svg className="w-6 h-6 text-green-600 mr-2 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Approved
                  </h3>
                  {approvedIdeas.map((idea) => (
                    <div
                      key={idea.id}
                      className="p-5 bg-green-50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex items-start space-x-4"
                    >
                      <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="font-semibold text-gray-900">{idea.topic}</p>
                        <p className="text-sm text-gray-600 mt-1 flex items-center">
                          <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          {idea.comment && idea.comment.trim() !== ""
                            ? idea.comment
                            : "No comments provided"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {pendingIdeas.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-yellow-600 flex items-center">
                    <svg className="w-6 h-6 text-yellow-600 mr-2 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l1.5 1.5" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Pending
                  </h3>
                  {pendingIdeas.map((idea) => (
                    <div
                      key={idea.id}
                      className="p-5 bg-yellow-50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex items-start space-x-4"
                    >
                      <svg className="w-6 h-6 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l1.5 1.5" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="font-semibold text-gray-900">{idea.topic}</p>
                        <p className="text-sm text-gray-600 mt-1 flex items-center">
                          <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          {idea.comment && idea.comment.trim() !== ""
                            ? idea.comment
                            : "Awaiting review"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {rejectedIdeas.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-red-600 flex items-center">
                    <svg className="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Rejected
                  </h3>
                  {rejectedIdeas.map((idea) => (
                    <div
                      key={idea.id}
                      className="p-5 bg-red-50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex items-start space-x-4"
                    >
                      <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="font-semibold text-gray-900">{idea.topic}</p>
                        <p className="text-sm text-gray-600 mt-1 flex items-center">
                          <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          {idea.comment && idea.comment.trim() !== ""
                            ? idea.comment
                            : "No feedback provided"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Idea Submission and Synopsis Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-lg p-8 transform hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-7 h-7 text-indigo-600 mr-3 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              {student.teamId === 0
                ? "Team Required"
                : hasApprovedIdea
                ? "Your Project"
                : "Submit New Idea"}
            </h2>
            {student.teamId === 0 ? (
              <div className="text-center py-8 text-gray-600 flex items-center justify-center animate-fade-in">
                <svg className="w-8 h-8 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Please create a team to submit ideas.
              </div>
            ) : hasApprovedIdea ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <svg className="w-6 h-6 text-green-600 mr-2 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Approved Project
                  </h3>
                  <p className="mt-3 bg-indigo-50 p-4 rounded-2xl text-gray-700 font-medium flex items-center">
                    <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    {approvedIdeas[0]?.topic || "No topic available"}
                  </p>
                </div>
                {synopsis.status === 1 ? (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <svg className="w-6 h-6 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Approved Synopsis
                    </h3>
                    <div className="mt-4 border rounded-2xl overflow-hidden shadow-inner">
                      <iframe
                        src={synopsis.file || ""}
                        width="100%"
                        height="400px"
                        title="Synopsis PDF"
                        className="w-full"
                      />
                    </div>
                    <a
                      href={synopsis.file || ""}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-3 text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Open Synopsis
                    </a>
                  </div>
                ) : (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-indigo-600 mb-4 flex items-center">
                      <svg className="w-6 h-6 text-indigo-600 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Synopsis Submission
                    </h3>
                    {synopsis.file && synopsis.status !== 2 ? (
                      <div className="p-5 bg-green-50 rounded-2xl shadow-sm">
                        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                          <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {synopsis.status === 1
                            ? "Approved Synopsis"
                            : "Synopsis Under Review"}
                        </h4>
                        <a
                          href={synopsis.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download Synopsis
                        </a>
                      </div>
                    ) : (
                      <div className="p-5 bg-indigo-50 rounded-2xl space-y-4">
                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          Upload Synopsis (PDF/DOC)
                        </label>
                        <input
                          ref={inputRef}
                          type="file"
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                          onChange={(e) => {
                            const selectedFile = e.target.files?.[0] || null;
                            setFile(selectedFile);
                          }}
                          accept=".pdf,.doc,.docx"
                        />
                        <button
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-medium transition-colors flex items-center"
                          onClick={handleSynopsisSubmission}
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                          </svg>
                          Upload Synopsis
                        </button>
                        {synopsis.status === 2 && (
                          <div className="mt-4 bg-red-50 p-4 rounded-2xl">
                            <h4 className="font-semibold text-red-700 mb-2 flex items-center">
                              <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Rejection Feedback
                            </h4>
                            <p className="text-sm text-gray-700">
                              {synopsis.comments || "No remarks provided."}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <svg className="w-6 h-6 text-indigo-600 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Pitch Your Idea
                </h3>
                <textarea
                  className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
                  placeholder="Describe your project idea..."
                  value={newIdea}
                  onChange={(e) => setNewIdea(e.target.value)}
                  rows={5}
                />
                <button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-medium transition-colors flex items-center"
                  onClick={handleSubmit}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Submit Idea
                </button>
              </div>
            )}
          </div>

          {/* Synopsis Display */}
          <SynopsisDisplay teamId={teamId} />
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        iframe {
          border: none;
        }
        input[type="file"] {
          transition: all 0.3s ease;
        }
        input[type="file"]:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }
        textarea {
          transition: all 0.3s ease;
        }
        textarea:focus {
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }
        button {
          transition: all 0.3s ease;
        }
        button:hover {
          transform: translateY(-2px);
        }
        .animate-pulse-slow {
          animation: pulseSlow 3s ease-in-out infinite;
        }
        @keyframes pulseSlow {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }
        .animate-spin-slow {
          animation: spinSlow 4s linear infinite;
        }
        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </div>
  );
};

export default Idea;