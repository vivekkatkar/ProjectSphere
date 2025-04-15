import axios from "../../api/uploader.js";
import { useEffect, useState } from "react";

export default function Notify() {
  const url = "http://localhost:3000/guide/teams";
  const [teams, setTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState(new Set());
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function getTeams() {
      try {
        const res = await axios.get("guide/teams", {
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

  const selectAllTeams = () => {
    if (selectedTeams.size === teams.length) {
      setSelectedTeams(new Set());
    } else {
      const allTeamIds = teams.map(team => team.id);
      setSelectedTeams(new Set(allTeamIds));
    }
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
        "guide/notify",
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
      alert("Messages sent");
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Error : check console");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-6 lg:px-16 flex items-start justify-center">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl p-10 transition-transform duration-300 hover:shadow-3xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Notify Teams
          </h2>
          <div className="text-white font-semibold text-sm bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 rounded-full shadow-md">
            {selectedTeams.size} Team{selectedTeams.size !== 1 ? 's' : ''} Selected
          </div>
        </div>

        {teams.length === 0 ? (
          <div className="flex items-center justify-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto text-red-600 mb-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xl font-semibold text-gray-800">No Teams Available</p>
              <p className="text-sm text-gray-500 mt-2">Team creation is pending</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Select Teams</h3>
                <button
                  onClick={selectAllTeams}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-100 px-3 py-1 rounded-full transition-colors duration-200"
                >
                  {selectedTeams.size === teams.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-50">
                {teams.map((team) => (
                  <div
                    key={team.id}
                    className={`flex items-center p-4 rounded-xl transition-all duration-200 cursor-pointer ${
                      selectedTeams.has(team.id)
                        ? 'bg-blue-100 border border-blue-300 shadow-sm'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => toggleTeam(team.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTeams.has(team.id)}
                      onChange={() => toggleTeam(team.id)}
                      className="h-5 w-5 text-blue-600 rounded-md border-gray-300 focus:ring-blue-600 mr-3"
                    />
                    <div>
                      <p className="text-md font-semibold text-gray-900">{team.name}</p>
                      <p className="text-xs text-gray-600">Guide ID: {team.guideId}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Compose Message</h3>
              <textarea
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-5 bg-gray-50 border border-gray-200 rounded-2xl resize-none h-64 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 mb-6 shadow-sm"
              />
              <button
                onClick={handleSend}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send Notification
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}