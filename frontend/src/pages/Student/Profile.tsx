import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateTeam from "../../createdComp/CreateTeam";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../../store/userSlice";
import axios from "../../api/uploader.js";

const Profile = () => {
  const [student, setStudent] = useState({
    Name: "zy",
    PRN: "",
    Batch: 0,
    Guide: 0,
    Semester: 1,
    teamId: 0,
    year: 0,
    phone: "",
  });

  const [students, setStudents] = useState([
    {
      name: "vaish",
      prn: 0,
    },
  ]);

  const [team, setTeam] = useState([
    {
      name: "",
      prn: "",
    },
  ]);

  const [prevProjects, setPrevProjects] = useState([
    {
      Semester: 1,
      Title: "xyz",
      Description: "xyz",
      Github: "xyz.com",
    },
    {
      Semester: 1,
      Title: "xyz",
      Description: "xyz",
      Github: "xyz.com",
    },
  ]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function getDetails() {
    try {
      const token = localStorage.getItem("token");

      axios
        .get("student/profile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const data = response.data;
          console.log(data);
          setStudent(() => {
            console.log(data.data);
            const updatedStudent = {
              Name: data.data.name,
              PRN: data.data.prn,
              Batch: data.data.batch || 0,
              Guide: data.data.guide?.name || 0,
              Semester: data.data.semester,
              teamId: data.data.teamId || 0,
              year: data.data.year || 0,
              phone: data.data.phone || "",
            };
            return updatedStudent;
          });
          dispatch(
            setUser({
              name: data.data.name,
              email: data.data.email,
              year: data.data.year || 0,
              prn: data.data.prn,
              semester: data.data.semester,
              batchId: data.data.batch || 0,
              phone: data.data.phone || "",
              teamId: data.data.teamId || null,
            })
          );
        })
        .catch((error) => console.error("Error fetching details:", error));
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  }

  async function getTeamDetails() {
    if (!student?.teamId || student.teamId === 0) {
      console.warn("Invalid or missing teamId:", student?.teamId);
      return;
    }

    console.log("Fetching team details for teamId:", student.teamId);

    try {
      const response = await axios.get(`student/team/${student.teamId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Response status:", response.status);

      const data = response.data;
      console.log("Team details received:", data);

      const teamArray = data.data.map((member) => ({
        name: member.name,
        prn: member.prn,
      }));

      setTeam(teamArray);
    } catch (err) {
      console.error("Error while fetching team details:", err);
    }
  }

  useEffect(() => {
    getDetails();
  }, []);

  useEffect(() => {
    getTeamDetails();
  }, [student.teamId]);

  function directToProjectDetails({ index }) {
    const info = { semester: prevProjects[index].Semester, prn: student.teamId };
    navigate("/student-dashboard/project-details", { state: info });
  }

  return (
    <div className="min-h-screen w-full pt-12 bg-gradient-to-br from-blue-50 to-indigo-50 px-6 py-8">
      {student.Name === "zy" ? (
        <div className="flex justify-center items-center h-full">
          <div className="text-gray-600 text-2xl font-semibold animate-pulse">Loading Profile...</div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-12 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                Welcome, {student.Name} 👋
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mt-2 font-light">
                Explore your academic journey
              </p>
            </div>
            <div className="text-sm text-gray-500 font-medium">
              Semester: <span className="text-blue-600">{student.Semester}</span>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Student Information */}
            <div className="bg-white shadow-xl rounded-2xl p-6 col-span-2 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 mt-2">Student Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                  <div className="p-1 bg-blue-100 rounded-full">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Name</p>
                    <p className="text-sm font-semibold text-gray-900">{student.Name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                  <div className="p-1 bg-indigo-100 rounded-full">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">PRN</p>
                    <p className="text-sm font-semibold text-gray-900">{student.PRN}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                  <div className="p-1 bg-green-100 rounded-full">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Team ID</p>
                    <p className="text-sm font-semibold text-gray-900">{student.teamId || "Not Assigned"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                  <div className="p-1 bg-purple-100 rounded-full">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Guide</p>
                    <p className="text-sm font-semibold text-gray-900">{student.Guide || "Not Assigned"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Sidebar */}
            <div className="bg-gradient-to-b from-blue-600 to-indigo-600 text-white rounded-2xl p-6 shadow-lg flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold">Quick Stats</h3>
                <p className="text-sm mt-2 opacity-80">Your academic snapshot</p>
              </div>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-2xl font-bold">{prevProjects.length}</p>
                  <p className="text-sm opacity-80">Projects Completed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{student.Semester}</p>
                  <p className="text-sm opacity-80">Current Semester</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{team.length}</p>
                  <p className="text-sm opacity-80">Team Members</p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="mt-10 bg-white shadow-xl rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-4">
              {student.teamId === 0 ? "Create Your Team" : "Team Members"}
            </h2>
            {student.teamId === 0 ? (
              <div className="bg-blue-50 p-6 rounded-lg">
                <CreateTeam />
                <style jsx>{`
                  .create-team-form input,
                  .create-team-form select,
                  .create-team-form textarea {
                    width: 100%;
                    padding: 0.6rem;
                    border: none;
                    border-radius: 0.5rem;
                    background-color: #f1f5f9;
                    font-size: 0.9rem;
                    color: #1f2937;
                    transition: all 0.2s ease;
                    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
                  }
                  .create-team-form input:focus,
                  .create-team-form select:focus,
                  .create-team-form textarea:focus {
                    outline: none;
                    background-color: #ffffff;
                    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
                  }
                  .create-team-form label {
                    display: block;
                    font-weight: 600;
                    color: #1f2937;
                    margin-bottom: 0.5rem;
                    font-size: 0.9rem;
                  }
                  .create-team-form button {
                    padding: 0.6rem 1.5rem;
                    background-color: #4f46e5;
                    color: white;
                    border-radius: 0.5rem;
                    border: none;
                    font-weight: 600;
                    font-size: 0.9rem;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                  }
                  .create-team-form button:hover {
                    background-color: #4338ca;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
                  }
                  .create-team-form button:active {
                    transform: translateY(0);
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                  }
                `}</style>
                <div className="create-team-form"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {team.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-lg font-semibold">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-500">PRN: {member.prn}</p>
                    </div>
                  </div>
                ))}
                <div className="col-span-full mt-4">
                  <div className="relative pt-2">
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                      <div
                        style={{ width: `${(team.length / 4) * 100}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Team Members: {team.length}/4
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Previous Projects Section */}
          <div className="mt-10 bg-white shadow-xl rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            <div className="flex items-center justify-between mb-6 mt-4">
              <h2 className="text-2xl font-bold text-gray-900">Previous Projects</h2>
              <span className="bg-blue-100 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">
                {prevProjects.length} Projects
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {prevProjects.map((prevProject, index) => (
                <div
                  key={index}
                  onClick={() => directToProjectDetails({ index })}
                  className="p-6 bg-gray-50 rounded-xl hover:bg-blue-50 hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <svg
                      className="w-6 h-6 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900">{prevProject.Title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{prevProject.Description}</p>
                  <div className="flex items-center justify-between">
                    <a
                      href={prevProject.Github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 text-sm font-medium hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View on GitHub
                    </a>
                    <span className="text-xs font-medium bg-blue-100 text-blue-600 px-2 py-1 rounded">
                      Semester {prevProject.Semester}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;