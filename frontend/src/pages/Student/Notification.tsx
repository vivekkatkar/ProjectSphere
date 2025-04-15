import { useEffect, useState } from "react";
import axios from "../../api/uploader.js";

export default function Notification() {
  interface Notification {
    id: number;
    fromName: string;
    message: string;
    createdAt: string;
    isRead: boolean;
  }
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  let teamId = parseInt(localStorage.getItem("teamId") || "0"); 
  
  useEffect(() => {
    async function fetchNotification() {
      try {
        const res = await axios.post(
          "guide/notifications/team",
          { teamId },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (res.data?.notifications) {
          setNotifications(res.data.notifications);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    }

    fetchNotification();
    // Polling for real-time effect (every 10 seconds)
    const interval = setInterval(fetchNotification, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id: any) => {
    try {
      await axios.patch(
        `guide/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
      for (const id of unreadIds) {
        await axios.patch(
          `guide/notifications/${id}/read`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const unread = notifications.filter((n) => !n.isRead);
  const read = notifications.filter((n) => n.isRead);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 to-violet-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-cyan-600 to-violet-600 text-white rounded-3xl p-6 mb-10 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <svg
                  className="w-10 h-10 animate-glow"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {unread.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                    {unread.length}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Team Pulse</h1>
            </div>
            {unread.length > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm bg-white text-cyan-600 px-4 py-1 rounded-full font-medium hover:bg-cyan-100 transition-colors flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Clear All
              </button>
            )}
          </div>
          <p className="mt-2 text-sm opacity-90">Catch the latest team vibes</p>
          {/* Background Glow */}
          <div className="absolute inset-0 bg-cyan-300 opacity-20 rounded-3xl blur-3xl animate-glow-slow"></div>
        </div>

        {/* Notification Constellation */}
        {notifications.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center animate-constellate">
            <svg
              className="w-16 h-16 text-gray-200 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-500 text-sm font-medium">No signals detected yet!</p>
          </div>
        ) : (
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6">
            {notifications.map((notification, index) => (
              <div
                key={notification.id}
                className={`relative bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-500 hover:scale-105 animate-constellate delay-${
                  index * 100
                } ${notification.isRead ? "opacity-85" : "ring-2 ring-cyan-300"}`}
                style={{
                  transform: `rotate(${index % 2 === 0 ? "2deg" : "-2deg"})`,
                }}
              >
                {/* Constellation Node Effect */}
                <div className={`absolute -top-2 -left-2 w-4 h-4 rounded-full ${
                  notification.isRead ? "bg-gray-200" : "bg-cyan-400 animate-pulse"
                }`}></div>
                <div className={`absolute -bottom-2 -right-2 w-4 h-4 rounded-full ${
                  notification.isRead ? "bg-gray-200" : "bg-violet-400 animate-pulse"
                }`}></div>

                <div className="relative flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      notification.isRead ? "bg-gray-100" : "bg-cyan-100"
                    }`}>
                      <svg
                        className={`w-6 h-6 ${
                          notification.isRead ? "text-gray-400" : "text-cyan-600 animate-bounce"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <svg
                          className={`w-5 h-5 ${
                            notification.isRead ? "text-gray-400" : "text-cyan-500"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {notification.fromName}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l1.5 1.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {new Date(notification.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2 mb-3 flex items-start">
                      <svg
                        className={`w-5 h-5 mr-2 mt-1 ${
                          notification.isRead ? "text-gray-400" : "text-violet-500"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-xs bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full font-medium hover:bg-cyan-200 transition-colors flex items-center"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Acknowledge
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* Connecting Lines */}
            <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
              {notifications.map((_, index) => {
                if (index < notifications.length - 1) {
                  const startX = index % 2 === 0 ? 20 : 80;
                  const startY = (index + 1) * 20 + 10;
                  const endX = (index + 1) % 2 === 0 ? 20 : 80;
                  const endY = (index + 2) * 20 + 10;
                  return (
                    <path
                      key={index}
                      d={`M${startX},${startY} C${startX + 20},${startY + 20} ${endX - 20},${endY - 20} ${endX},${endY}`}
                      fill="none"
                      stroke="rgba(103, 232, 249, 0.3)"
                      strokeWidth="2"
                      className="animate-trace"
                    />
                  );
                }
                return null;
              })}
            </svg>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .animate-constellate {
          animation: constellate 3s ease-in-out infinite;
        }
        @keyframes constellate {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-6px) rotate(1deg);
          }
        }
        .delay-100 {
          animation-delay: 100ms;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
        .delay-300 {
          animation-delay: 300ms;
        }
        .delay-400 {
          animation-delay: 400ms;
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        @keyframes glow {
          0%, 100% {
            filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.5));
          }
          50% {
            filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
          }
        }
        .animate-glow-slow {
          animation: glowSlow 4s ease-in-out infinite;
        }
        @keyframes glowSlow {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }
        .animate-trace {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: trace 3s linear infinite;
        }
        @keyframes trace {
          to {
            stroke-dashoffset: 0;
          }
        }
        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        button {
          transition: all 0.3s ease;
        }
        button:hover {
          transform: scale(1.1);
        }
        .animate-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}