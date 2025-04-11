import axios from "axios";
import { useEffect, useState } from "react";

export default function Notify() {
  const url = "http://localhost:3000/guide/teams";
  const [teams, setTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState(new Set());
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function getTeams() {
      try {
        const res = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
        setTeams(res.data.data);
        console.log(res.data.data);
      } catch (err) {
        console.error("Failed to fetch teams", err);
      }
    }

    getTeams();
  }, []);

  const toggleTeam = (teamId) => {
    setSelectedTeams(prev => {
      const updated = new Set(prev);
      if (updated.has(teamId)) {
        updated.delete(teamId);
      } else {
        updated.add(teamId);
      }
      return updated;
    });
  };

  const handleSend = async () => {
    if (selectedTeams.size === 0) {
      alert("Please select at least one team.");
      return;
    }

    await selectedTeams.forEach(async (teamId) => {
      console.log(`Message to Team ${teamId}:`, message);
    });

    console.log(localStorage.getItem("token"));
    try {
        const res = await axios.post(
          "http://localhost:3000/guide/notify",
          {
            teamIds: Array.from(selectedTeams),
            message: message,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      
        console.log("Notification response:", res.data);
      
        setMessage("");
        setSelectedTeams(new Set());
        alert("messages sent");
      } catch (error) {
        console.error("Error sending notification:", error);
        alert("Error : check console");
      }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Send Notifications</h2>

      {teams.length === 0 ? (
        <div className="text-red-600 font-semibold">Team creation is pending</div>
      ) : (
        <>
          <div className="grid gap-4 mb-6">
            {teams.map((team) => (
              <label key={team.id} className="flex items-center space-x-3 bg-white p-3 rounded shadow">
                <input
                  type="checkbox"
                  checked={selectedTeams.has(team.id)}
                  onChange={() => toggleTeam(team.id)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <div>
                  <div className="font-semibold text-gray-700">{team.name}</div>
                  <div className="text-sm text-gray-500">Guide ID: {team.guideId}</div>
                </div>
              </label>
            ))}
          </div>

          <textarea
            placeholder="Enter your message here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded mb-4 resize-none h-28 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            onClick={handleSend}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition duration-200"
          >
            Send Message to Selected Teams
          </button>
        </>
      )}
    </div>
  );
}
