import { useEffect, useState } from "react";
import axios from "../../api/uploader.js"


export default function WeeklyReports() {
  const [reports, setReports] = useState([
    { "status": false, "week": 1, "img": null },
    { "status": true, "week": 2, "img": null }
  ]);

  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    getReportsDetails();
  }, []);

  // Fetch reports from the server
  async function getReportsDetails() {
    try {
      const token = localStorage.getItem("token");

      // const response = await fetch("http://localhost:3000/student/reports", {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });

      // const data = await response.json();

      // if (response.ok && data.reports) {
      //   const formattedReports = data.reports.map((report) => ({
      //     status: true,
      //     week: report.week,
      //     reportId: report.id, // Assume `id` is the report identifier
      //   }));

      //   setReports(formattedReports);

      const response = await axios.get("student/reports", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    
      const data = response.data;
    
      if (data.reports) {
        const formattedReports = data.reports.map((report) => ({
          status: true,
          week: report.week,
          reportId: report.id,
        }));
    
        setReports(formattedReports);

      }
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    }
  }

  // Handle report submission
  async function handleReportSubmission() {
    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("file", file);

      // const response = await fetch("http://localhost:3000/student/upload", {
      //   method: "POST",
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: formData,
      // });

      // const data = await response.json();
      // console.log(data);

      // if (response.ok) {
      //   alert("Report uploaded successfully!");
      // } else {
      //   alert("Upload failed: " + data.error);
      // }


      const response = await axios.post("student/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Do NOT set 'Content-Type' explicitly for FormData — Axios handles it automatically
        },
      });
    
      const data = response.data;
      console.log(data);
    
      alert("Report uploaded successfully!");

    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Upload failed.");
    }
  }

  // Handle report download using report ID
  async function handleDownload(reportId) {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`report/${reportId}/download`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob', 
      });
    
      const url = URL.createObjectURL(new Blob([response.data]));
      window.open(url); // Open

    } catch (err) {
      console.error("Error downloading the report:", err);
    }
  }

  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-xl font-semibold text-blue-700">Weekly Reports</h2>
      <ul className="mt-3 space-y-2">
        {
          reports.map((report) => {
            return (
              <div className="mt-4 p-2" key={report.week}>
                <h3 className="text-lg font-semibold text-blue-600">
                  Week {report.week} report
                </h3>

                {report.status && (
                  <button
                    onClick={() => handleDownload(report.reportId)} // Trigger download with report ID
                    className="text-blue-500 underline block mt-1"
                  >
                    Download Report
                  </button>
                )}
              </div>
            );
          })
        }

        <div className="mt-6">
          <input
            type="file"
            className="mt-2 border p-2 rounded w-full"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0] || null;
              setFile(selectedFile);
            }}
            accept=".pdf,.doc,.docx"
          />
          <button
            className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleReportSubmission}
          >
            Upload Report
          </button>
        </div>
      </ul>
    </div>
  );
}
