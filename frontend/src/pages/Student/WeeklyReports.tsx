import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "../../api/uploader.js";

export default function WeeklyReports() {
  const [reports, setReports] = useState([]);
  const [file, setFile] = useState(null);
  const [currWeek, setCurrWeek] = useState(0);
  const inputRef = useRef(null);

  const selector = useSelector((state) => state.user);
  const teamId = selector.teamId;

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

  async function handleReportSubmission(week) {
    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("teamId", teamId);
      formData.append("week", week.toString());

      const response = await axios.post("student/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      if (response.status >= 200 && response.status < 300) {
        alert("Report uploaded successfully!");
        setFile(null);
        if (inputRef.current) inputRef.current.value = "";
        getReportsDetails();
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Upload failed.");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Weekly Reports</h1>
          <p className="mt-2 text-lg text-gray-600">Submit and review your weekly project updates</p>
        </div>

        {teamId ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reports.map((report) => (
              <div
                key={report.week}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <svg
                      className="w-6 h-6 text-blue-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900">Week {report.week}</h3>
                  </div>
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                      report.status
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {report.status ? "Submitted" : "Not Submitted"}
                  </span>
                </div>

                {/* Card Content */}
                {report.status ? (
                  <div className="space-y-4">
                    <button
                      onClick={() => handleDownload(report.reportId)}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Download Report
                    </button>
                    <div className="border rounded-lg overflow-hidden">
                      <iframe
                        src={`http://localhost:3000/student/report/${report.reportId}/view`}
                        width="100%"
                        height="200px"
                        title={`Report Week ${report.week}`}
                        className="w-full"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <input
                      ref={inputRef}
                      type="file"
                      className="w-full border border-gray-200 rounded-lg p-2 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                      onChange={(e) => {
                        const selectedFile = e.target.files?.[0] || null;
                        setFile(selectedFile);
                        setCurrWeek(report.week);
                      }}
                      accept=".pdf,.doc,.docx"
                    />
                    <button
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                      onClick={() => handleReportSubmission(report.week)}
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      Upload Report
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-400 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900">Weekly Reports</h2>
            </div>
            <p className="text-gray-600 text-sm">
              Please create a team to access weekly reports.
            </p>
          </div>
        )}
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
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        button {
          transition: all 0.3s ease;
        }
        button:hover {
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}