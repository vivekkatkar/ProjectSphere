import { useEffect, useState } from "react";
import axios from "../../api/uploader.js";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  let teamId = parseInt(localStorage.getItem("teamId")  || "0"); 
  
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
  }, []);

  const handleMarkAsRead = async (id) => {
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

  const unread = notifications.filter((n) => !n.isRead);
  const read = notifications.filter((n) => n.isRead);

  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">Notifications</h2>

      {/* Unread Section */}
      <div className="mb-4">
        <h3 className="text-lg font-medium text-red-600 mb-2">Unread</h3>
        {unread.length ? (
          unread.map((notification) => (
            <div
              key={notification.id}
              className="m-1 p-2 rounded-sm border bg-blue-50 border-blue-100"
            >
              <p className="text-sm text-gray-800">
                <strong>{notification.fromName}</strong>: {notification.message}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
              <button
                onClick={() => handleMarkAsRead(notification.id)}
                className="text-xs mt-1 text-blue-600 hover:underline"
              >
                Mark as read
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No unread notifications.</p>
        )}
      </div>

      {/* Read Section */}
      <div>
        <h3 className="text-lg font-medium text-green-600 mb-2">Read</h3>
        {read.length ? (
          read.map((notification) => (
            <div
              key={notification.id}
              className="m-1 p-2 rounded-sm border bg-gray-50 border-gray-200"
            >
              <p className="text-sm text-gray-700">
                <strong>{notification.fromName}</strong>: {notification.message}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No read notifications.</p>
        )}
      </div>
    </div>
  );
}
