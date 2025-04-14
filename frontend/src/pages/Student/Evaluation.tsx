import axios from "axios";
import { useEffect, useState } from "react";

function TeamMarks() {
  const [marks, setMarks] = useState(null);

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const res = await axios.get("http://localhost:3000/student/marks", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("Fetched marks:", res.data);
        setMarks(res.data);
      } catch (error) {
        console.error("Error fetching marks:", error);
      }
    };

    fetchMarks();
  }, []);

  return (
    <div className="bg-white p-4 shadow-md rounded-md mt-4">
      <h3 className="text-lg font-semibold text-blue-600 mb-2">Team Marks</h3>
      {marks ? (
        <div>
          {/* <p>LA1: {marks.LA1_marks}</p>
          <p>LA2: {marks.LA2_marks}</p>
          <p>ESE: {marks.ESE_marks}</p> */}
        </div>
      ) : (
        <p className="text-gray-600">Loading marks...</p>
      )}
    </div>
  );
}

export default TeamMarks;
