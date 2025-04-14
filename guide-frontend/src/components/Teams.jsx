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
        if (selectedYear) {
          url += `?year=${selectedYear}`;
        }

        const res = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
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

      const data = resp.data.data;
      setYears(data);
    } catch (error) {
      console.error("Error fetching years:", error);
      alert("Something went wrong while fetching years");
    }
  }

  return (
    <div>
      <div className="p-4">
        <div className="mb-4">
          <label className="mr-2 font-semibold">Select the year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Years</option>
            {years.map((obj) => (
              <option key={obj.year} value={obj.year}>
                {obj.year}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {teams == null ? (
            <div>Loading...</div>
          ) : teams.length === 0 ? (
            <div>No teams found for this year.</div>
          ) : (
            teams.map((team, index) => (
              <div
                key={team.id}
                className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {team.name || "Unnamed Team"} (ID: {team.id})
                </h2>

                <div className="mb-2">
                  <h3 className="font-medium text-gray-700">Students:</h3>
                  {teamDetails[index] && teamDetails[index].length > 0 ? (
                    <ul className="list-disc list-inside text-gray-600">
                      {teamDetails[index].map((student, idx) => (
                        <li key={student.prn}>
                          {student.name} (PRN: {student.prn})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No students in this team.</p>
                  )}
                </div>
                <button
                  className="bg-blue-500 p-3 m-2 text-white"
                  onClick={() => {
                    navigate("/teacher/team", {
                      state: {
                        team: team,
                        teamDetails: teamDetails[index]
                      }
                    });
                  }}
                >
                  Get Details
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
