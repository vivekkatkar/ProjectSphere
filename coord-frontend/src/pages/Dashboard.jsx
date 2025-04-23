import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/uploader";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.jsx";
import { Button } from "../components/ui/button.jsx";
import { cn } from "../lib/utils.js";
import { Loader2, UserRound, Phone, Mail, Users, BookOpen, Calendar, ChevronRight, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select.jsx";
import { motion } from "framer-motion";

const cardVariants = {
  initial: { opacity: 0, y: 15, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
  hover: { 
    y: -3,
    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.06)",
    transition: { duration: 0.2 }
  },
  tap: { scale: 0.99 },
};

const modalVariants = {
  initial: { opacity: 0, y: -20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const buttonVariants = {
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98 },
};

const navbarVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

export function Dashboard() {
  const [guides, setGuides] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [selectedGuides, setSelectedGuides] = useState({});
  const [isAssigning, setIsAssigning] = useState(false);
  const [activeTab, setActiveTab] = useState("guides");

  useEffect(() => {
    async function fetchGuides() {
      try {
        const response = await axios.get("/coordinator/guides", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setGuides(response.data.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch guides.");
      }
    }
    fetchGuides();

    async function fetchTeams() {
      try {
        const res = await axios.get("/coordinator/all-teams");
        setTeams(res.data.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch teams.");
      }
    }

    fetchTeams();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/details/${id}`);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      setSendError("Message cannot be empty.");
      return;
    }
    setIsSending(true);
    setSendError("");
    try {
      await axios.post(
        "/coordinator/send-message", // Placeholder route
        { message },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setIsModalOpen(false);
      setMessage("");
    } catch (err) {
      setSendError(err.response?.data?.error || "Failed to send message.");
    } finally {
      setIsSending(false);
    }
  };

  const handleAssignGuide = async (teamId, semester) => {
    const guideId = selectedGuides[teamId];
    if (!guideId) return;

    setIsAssigning(true);
    try {
      await axios.post(
        "/coordinator/assign-guide",
        { teamId, semester, guideId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const res = await axios.get("/coordinator/all-teams");
      setTeams(res.data.data);
      setSelectedGuides({...selectedGuides, [teamId]: ''}); // Clear selection after successful assignment
    } catch (err) {
      console.error("Error assigning guide:", err);
      setError(err.response?.data?.error || "Failed to assign guide.");
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-100 text-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Navbar */}
      <motion.nav
        className="bg-white border-b border-gray-200 py-4 sticky top-0 z-10 shadow-sm"
        variants={navbarVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800 tracking-tight flex items-center">
            <Users className="mr-2 h-6 w-6 text-gray-700" /> 
            Coordinator Dashboard
          </h1>
          <div className="flex items-center">
            <motion.button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-700 text-white hover:bg-blue-800 font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out flex items-center"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Mail className="mr-2 h-4 w-4" /> Send Message
            </motion.button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
          <div className="flex space-x-8 border-b border-gray-200">
            <button 
              className={`py-3 font-medium text-sm transition-colors relative ${
                activeTab === "guides" 
                  ? "text-blue-700 border-b-2 border-blue-700" 
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("guides")}
            >
              <span className="flex items-center">
                <UserRound className="mr-2 h-4 w-4" /> Project Guides
              </span>
            </button>
            <button 
              className={`py-3 font-medium text-sm transition-colors relative ${
                activeTab === "teams" 
                  ? "text-blue-700 border-b-2 border-blue-700" 
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("teams")}
            >
              <span className="flex items-center">
                <Users className="mr-2 h-4 w-4" /> Manage Teams
              </span>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <motion.div 
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6" 
            role="alert"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span><strong className="font-bold">Error:</strong> {error}</span>
            </div>
          </motion.div>
        )}

        {/* Guides Section */}
        {activeTab === "guides" && (
          <>
            <motion.h2
              className="text-xl font-semibold text-gray-800 mb-6 flex items-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <UserRound className="mr-2 h-5 w-5 text-gray-700" /> Project Guides
            </motion.h2>
            
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {guides && guides.length > 0 ? (
                guides.map((guide) => (
                  <motion.div key={guide.id} variants={cardVariants} initial="initial" animate="animate" whileHover="hover" whileTap="tap">
                    <Card className="bg-white shadow-md rounded-md overflow-hidden border border-gray-200 h-full transition-all duration-150">
                      <CardHeader className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <CardTitle className="text-base font-medium text-gray-800 flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 border border-blue-100">
                            <UserRound className="h-4 w-4 text-blue-700" />
                          </div> 
                          {guide.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 text-sm text-gray-600">
                        <p className="mb-2 flex items-center">
                          <Mail className="mr-2 h-4 w-4 text-gray-500" /> {guide.email}
                        </p>
                        <p className="mb-2 flex items-center">
                          <Phone className="mr-2 h-4 w-4 text-gray-500" /> {guide.phone}
                        </p>
                        <p className="mb-4 flex items-center">
                          <BookOpen className="mr-2 h-4 w-4 text-gray-500" /> 
                          <span className="font-medium text-gray-700">Role:</span> 
                          <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                            {guide.role}
                          </span>
                        </p>
                        <Button
                          size="sm"
                          className="mt-2 w-full justify-center bg-blue-700 hover:bg-blue-800 text-white rounded transition-colors duration-150"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card click
                            handleCardClick(guide.id);
                          }}
                        >
                          View Details <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  className="col-span-full flex flex-col items-center justify-center p-8 bg-white rounded border border-gray-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <UserRound className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500">No guides available at this time</p>
                  <p className="text-gray-400 text-sm mt-1">Guides will be displayed here once added to the system</p>
                </motion.div>
              )}
            </motion.div>
          </>
        )}

        {/* Teams Section */}
        {activeTab === "teams" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h2
              className="text-xl font-semibold text-gray-800 mb-6 flex items-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Users className="mr-2 h-5 w-5 text-gray-700" /> Manage Teams
            </motion.h2>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
             {teams && teams.length > 0 ? (
  teams.map((team) => (
    <motion.div
      key={team.id}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      className="transition-transform"
    >
      <Card className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-200">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
          <CardTitle className="text-lg font-semibold text-gray-800 tracking-wide">
            {team.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 text-gray-600 text-sm">
          <div className="mb-4">
            <span className="font-semibold text-gray-700">Team ID:</span>
            <span className="ml-2 text-gray-600">{team.id}</span>
          </div>

          <div className="mb-4 flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-blue-500" />
            <span className="font-semibold text-gray-700">Semester:</span>
            <span className="ml-2">{team.semester}</span>
          </div>

          <div className="mb-4 flex items-center">
            <span className="font-semibold text-gray-700">Year:</span>
            <span className="ml-2">{team.year}</span>
          </div>

          {team.guideId ? (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 shadow-inner">
              <p className="font-semibold text-blue-800 flex items-center">
                <UserRound className="mr-2 h-5 w-5 text-blue-700" /> Assigned Guide:
              </p>
              <p className="mt-2 text-blue-700 font-medium text-sm">
                {guides.find((g) => g.id === team.guideId)?.name || `Guide ID: ${team.guideId}`}
              </p>
            </div>
          ) : (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
              <p className="font-semibold text-gray-700 mb-3">Assign Guide</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Select
                  onValueChange={(value) =>
                    setSelectedGuides({ ...selectedGuides, [team.id]: value })
                  }
                  value={selectedGuides[team.id] || ""}
                >
                  <SelectTrigger className="w-full sm:w-48 text-sm bg-white border border-gray-300 rounded-md text-gray-700 focus:ring-blue-500">
                    <SelectValue placeholder="Select guide" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 rounded-md">
                    {guides.map((guide) => (
                      <SelectItem
                        key={guide.id}
                        value={guide.id.toString()}
                        className="text-gray-700 hover:bg-gray-100"
                      >
                        {guide.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <motion.button
                  onClick={() => handleAssignGuide(team.id, team.semester)}
                  disabled={!selectedGuides[team.id] || isAssigning}
                  className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out text-sm flex items-center justify-center ${
                    !selectedGuides[team.id] || isAssigning ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  variants={buttonVariants}
                  whileHover={!selectedGuides[team.id] || isAssigning ? {} : "hover"}
                  whileTap={!selectedGuides[team.id] || isAssigning ? {} : "tap"}
                >
                  {isAssigning ? (
                    <Loader2 className="h-4 w-4 animate-spin text-white mr-1" />
                  ) : (
                    "Assign"
                  )}
                </motion.button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  ))
) : (
  <motion.div
    className="col-span-full flex flex-col items-center justify-center p-10 bg-white rounded-xl border border-gray-200 shadow-md"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.3 }}
  >
    <Users className="h-12 w-12 text-gray-300 mb-4" />
    <p className="text-gray-500 text-base font-medium">No teams available at this time</p>
    <p className="text-gray-400 text-sm mt-1">Teams will be displayed here once created</p>
  </motion.div>
)}




            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="bg-white rounded p-6 w-full max-w-md shadow-lg border border-gray-200"
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Mail className="mr-2 h-5 w-5 text-blue-700" /> Send Message
            </h2>
            <textarea
              className="w-full h-32 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50 text-sm"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSending}
            />
            {sendError && (
              <p className="text-red-600 text-sm mt-2 flex items-center">
                <AlertCircle className="h-4 w-4 text-red-600 mr-1" />
                {sendError}
              </p>
            )}
            <div className="flex justify-end mt-4 space-x-3">
              <Button
                variant="outline"
                className="text-sm border-gray-300 hover:bg-gray-50"
                onClick={() => {
                  setIsModalOpen(false);
                  setMessage("");
                  setSendError("");
                }}
                disabled={isSending}
              >
                Cancel
              </Button>
              <motion.button
                className={`bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out text-sm flex items-center justify-center ${
                  isSending ? "opacity-80 cursor-not-allowed" : ""
                }`}
                onClick={handleSendMessage}
                disabled={isSending}
                variants={buttonVariants}
                whileHover={isSending ? {} : "hover"}
                whileTap={isSending ? {} : "tap"}
              >
                {isSending ? <Loader2 className="h-4 w-4 animate-spin text-white mr-2" /> : <Mail className="mr-2 h-4 w-4" />} Send
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}