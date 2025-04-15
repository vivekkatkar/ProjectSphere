import axios from "../../api/uploader.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Teams() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [teamDetails, setTeamDetails] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    async function getData() {
      try {
        let url = "guide/teams";
        if (selectedYear) url += `?year=${selectedYear}`;
        const res = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        setTeams(res.data.data);
        setTeamDetails(res.data.teamDetails);
      } catch (err) {
        console.log(err);
      }
    }

    getData();
    getYears();
  }, [selectedYear]);

  async function getYears() {
    try {
      const resp = await axios.get("guide/years", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setYears(resp.data.data);
    } catch (error) {
      console.error("Error fetching years:", error);
      alert("Something went wrong while fetching years");
    }
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 px-8 py-10">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">My Teams</h1>
            <p className="text-gray-500 text-sm mt-1">View and manage all your guided teams.</p>
          </div>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="">All Years</option>
            {years.map((obj) => (
              <option key={obj.year} value={obj.year}>
                {obj.year}
              </option>
            ))}
          </select>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams == null ? (
            <div className="col-span-full text-center text-gray-500">Loading...</div>
          ) : teams.length === 0 ? (
            <div className="col-span-full text-center text-gray-400">No teams found for this year.</div>
          ) : (
            teams.map((team, index) => (
              <div
                key={team.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-bold text-gray-800">
                      {team.name || "Unnamed Team"}
                    </h2>
                    <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded">
                      ID: {team.id}
                    </span>
                  </div>

                  <div className="mb-3">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Students:</h3>
                    {teamDetails[index] && teamDetails[index].length > 0 ? (
                      <ul className="text-sm text-gray-600 space-y-1">
                        {teamDetails[index].map((student) => (
                          <li key={student.prn}>
                            <span className="font-medium">{student.name}</span>{" "}
                            <span className="text-gray-400 text-xs">(PRN: {student.prn})</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400">No students in this team.</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    navigate("/teacher/team", {
                      state: {
                        team: team,
                        teamDetails: teamDetails[index],
                      },
                    });
                  }}
                  className="mt-4 w-full text-sm font-medium bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  View Details
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
