import axios from "axios";

export default axios.create({
  // baseURL: "https://busy-falcons-stay.loca.lt",
  baseURL: "http://localhost:3000/",
  headers: {
    "Content-Type": "multipart/form-data"
  }
});
  
