import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/uploader";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { UserIcon, PhoneIcon, AcademicCapIcon, CalendarIcon } from "@heroicons/react/outline";
import { motion } from "framer-motion"; 

export function Details() {
  const { id } = useParams();
  const [guide, setGuide] = useState(null);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchGuideAndTeams() {
      try {
        const guideResponse = await axios.get(`/coordinator/guide/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setGuide(guideResponse.data.data);

        const teamsResponse = await axios.get(`/coordinator/guide/${id}/teams`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTeams(teamsResponse.data.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch guide or teams.");
      }
    }
    fetchGuideAndTeams();
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-white flex items-center justify-center p-8">
        <div className="text-red-600 text-sm font-medium">{error}</div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-white flex items-center justify-center p-8">
        <div className="text-gray-600 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-white py-12 px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Guide Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white shadow-md border border-gray-300 rounded-md">
            <CardHeader className="bg-gray-800 text-white p-5 rounded-t-md">
              <CardTitle className="text-xl font-semibold">{guide.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center space-x-3">
                <UserIcon className="h-5 w-5 text-gray-600" />
                <p className="text-sm text-gray-700">{guide.email}</p>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-gray-600" />
                <p className="text-sm text-gray-700">{guide.phone}</p>
              </div>
              <div className="flex items-center space-x-3">
                <AcademicCapIcon className="h-5 w-5 text-gray-600" />
                <p className="text-sm text-gray-700">{guide.role}</p>
              </div>
              <Button
                onClick={() => navigate("/dashboard")}
                className="mt-4 bg-blue-600 text-white hover:bg-blue-700 transition-all py-2 px-6 rounded-md text-sm font-medium"
              >
                Back to Guides
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Teams Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Teams Managed by {guide.name}</h2>
          {teams.length === 0 ? (
            <p className="text-gray-600 text-sm">No teams assigned to this guide.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {teams.map((team) => (
                <motion.div
                  key={team.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white shadow-md border border-gray-300 rounded-md">
                    <CardHeader className="bg-gray-200 text-gray-800 p-5 rounded-t-md">
                      <CardTitle className="text-lg font-semibold">{team.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center space-x-3">
                        <CalendarIcon className="h-5 w-5 text-gray-600" />
                        <p className="text-sm text-gray-700">Semester: {team.semester}</p>
                      </div>
                      <p className="text-sm text-gray-700">Year: {team.year}</p>
                      <p className="text-sm text-gray-700">Team ID: {team.id}</p>
                      {team.students && team.students.length > 0 && (
                        <p className="text-sm text-gray-700">
                          Students: {team.students.map((s) => s.name).join(", ")}
                        </p>
                      )}
                      {team.projects && team.projects.length > 0 && (
                        <p className="text-sm text-gray-700">
                          Projects: {team.projects.map((p) => p.name).join(", ")}
                        </p>
                      )}
                      <Button
                        onClick={() => {
                          navigate("/team", {
                            state: { team },
                          });
                        }}
                        className="mt-4 bg-green-600 text-white hover:bg-green-700 transition-all py-2 px-6 rounded-md text-sm font-medium"
                      >
                        View Team Details
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
