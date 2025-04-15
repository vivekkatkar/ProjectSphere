import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/uploader";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

export function Details() {
  const { id } = useParams();
  const [guide, setGuide] = useState(null);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchGuideAndTeams() {
      try {
        // Fetch guide details
        const guideResponse = await axios.get(`/coordinator/guide/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(guideResponse.data.data);
        setGuide(guideResponse.data.data);

        // Fetch guide's teams
        const teamsResponse = await axios.get(`/coordinator/guide/${id}/teams`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(teamsResponse.data.data);
        
        setTeams(teamsResponse.data.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch guide or teams.");
      }
    }
    fetchGuideAndTeams();
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-blue-100 flex items-center justify-center">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen bg-blue-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Guide Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{guide.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Email:</span> {guide.email}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Phone:</span> {guide.phone}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Role:</span> {guide.role}
              </p>
            </div>
            <Button
              onClick={() => navigate("/coordinator/guides")}
              className="mt-4 bg-blue-500 hover:bg-blue-600"
            >
              Back to Guides
            </Button>
          </CardContent>
        </Card>

        {/* Teams Section */}
        <h2 className="text-xl font-bold mb-4">Teams</h2>
        {teams.length === 0 ? (
          <p className="text-gray-600">No teams assigned to this guide.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {teams.map((team) => (
              <Card key={team.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{team.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Semester:</span>{" "}
                      {team.semester}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Year:</span> {team.year}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Team ID:</span> {team.id}
                    </p>
                    {team.students && team.students.length > 0 && (
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Students:</span>{" "}
                        {team.students.map((s) => s.name || s.id).join(", ")}
                      </p>
                    )}
                    {team.projects && team.projects.length > 0 && (
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Projects:</span>{" "}
                        {team.projects.map((p) => p.name || p.id).join(", ")}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
