import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/uploader";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.jsx";
import { Button } from "../components/ui/button.jsx";
import { cn } from "../lib/utils.js";
import { Loader2 } from "lucide-react";

export function Dashboard() {
  const [guides, setGuides] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchGuides() {
      try {
        const response = await axios.get("/coordinator/guides", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(response.data.data);
        setGuides(response.data.data);
        
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch guides.");
      }
    }
    fetchGuides();
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

  return (
    <div className="min-h-screen bg-blue-100">
      {/* Navbar */}
      <nav className="bg-blue-500 p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">Coordinator Dashboard</h1>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-blue-500 hover:bg-gray-100"
          >
            Send Message
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className={cn("p-8", isModalOpen && "blur-sm")}>
        <h1 className="text-3xl font-bold text-center mb-8">Guides</h1>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides && guides.map((guide) => (
            <Card
              key={guide.id}
              className={cn("cursor-pointer hover:shadow-lg transition-shadow")}
              onClick={() => handleCardClick(guide.id)}
            >
              <CardHeader>
                <CardTitle>{guide.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Email: {guide.email}</p>
                <p className="text-sm text-gray-600">Phone: {guide.phone}</p>
                <p className="text-sm text-gray-600">Role: {guide.role}</p>
                <Button
                  variant="link"
                  className="mt-4 p-0"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click
                    handleCardClick(guide.id);
                  }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Send Message</h2>
            <textarea
              className="w-full h-32 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSending}
            />
            {sendError && (
              <p className="text-red-500 text-sm mt-2">{sendError}</p>
            )}
            <div className="flex justify-end mt-4 space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  setMessage("");
                  setSendError("");
                }}
                disabled={isSending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendMessage}
                className="bg-blue-500 hover:bg-blue-600"
                disabled={isSending}
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  "Send"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
