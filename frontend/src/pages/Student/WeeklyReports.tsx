import { useEffect, useState } from "react";

export default function WeeklyReports() {

    const [reports, setReports] = useState ([{
      "status" : false,
      "week" : 1,
      "img" : null
    }, {
      "status" : true,
      "week" : 2,
      "img" : null
    } ]);

    const [file, setFile] = useState<File | null>(null);

    useEffect (() => getReportsDetails, []);

    function getReportsDetails () {

    }

    function handleReportSubmission (){
      
    }

    return (
      <div className="bg-white shadow-md p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-700">Weekly Reports</h2>
        <ul className="mt-3 space-y-2">
          {
            reports.map ((report) => {
                // if submitted show report
                if (report.status){
                  return (
                    <div className="mt-4 p-2">
                      <h3 className="text-lg font-semibold text-blue-600">Week {report.week} report pending</h3>
                      <h4>file</h4>
                    </div>
                  )
                }
                // option to upload report
                else{
                  return (
                    <div className="mt-4 p-2">
                      <h3 className="text-lg font-semibold text-blue-600">Week {report.week} report pending</h3>
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
                    </div>)
                }
            })
          }
        </ul>
      </div>
    );
  }
  