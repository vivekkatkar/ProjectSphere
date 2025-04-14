import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function WeeklyReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [currWeek, setCurrWeek] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const selector = useSelector((state: any) => state.user);
  const teamId = selector.teamId;

  useEffect(() => {
    if (teamId) {
      getReportsDetails();
    }
  }, [teamId]);

  async function getReportsDetails() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/student/reports/${teamId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.reports) {
        const submittedReports = data.reports;

        const allWeeks = Array.from({ length: 10 }, (_, i) => {
          const weekNum = i + 1;
          const existing = submittedReports.find((r: any) => r.week === weekNum);
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

  async function handleReportSubmission(week: number) {
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

      const response = await fetch("http://localhost:3000/student/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Report uploaded successfully!");
        setFile(null);
        if (inputRef.current) inputRef.current.value = "";
        getReportsDetails(); // Refresh the report list
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Upload failed.");
    }
  }

  async function handleDownload(reportId: number) {
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

  return teamId ? (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-xl font-semibold text-blue-700">Weekly Reports</h2>
      <ul className="mt-3 space-y-4">
        {reports.map((report) => (
          <li key={report.week} className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold text-blue-600">
              Week {report.week}
            </h3>

            {report.status ? (
              <>
                <button
                  onClick={() => handleDownload(report.reportId)}
                  className="text-blue-500 underline mt-1"
                >
                  Download Report
                </button>
                <iframe
                  src={`http://localhost:3000/student/report/${report.reportId}/view`}
                  width="100%"
                  height="600px"
                  title={`Report Week ${report.week}`}
                  className="mt-3 border"
                />
              </>
            ) : (
              <>
                <input
                  ref={inputRef}
                  type="file"
                  className="mt-2 border p-1 rounded w-full"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0] || null;
                    setFile(selectedFile);
                    setCurrWeek(report.week);
                  }}
                  accept=".pdf,.doc,.docx"
                />
                <button
                  className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => handleReportSubmission(report.week)}
                >
                  Upload Report
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-xl font-semibold text-blue-700">Weekly Reports</h2>
      <p className="mt-3 text-gray-600">
        Please create a team to access weekly reports.
      </p>
    </div>
  );
}
