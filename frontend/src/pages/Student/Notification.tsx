import { useEffect, useState } from "react";

export default function Notification() {
    const [notifications, setNotification] = useState(["xyz", "abc"]);

    useEffect(() => {
        async function fetchNotification() {
          // fetch notif
        }
        fetchNotification();
    }, [])

    

    return (
      <div className="bg-white shadow-md p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-700">Notifications</h2>
        {
          (notifications.length ? (
            notifications.map ((notification) => <p className="m-1 bg-blue-50 p-1  rounded-sm">{notification}</p>)
          ) : (
            <p className="text-gray-600">You have no new notifications.</p>
          ))
        }
      </div>
    );
  }
  