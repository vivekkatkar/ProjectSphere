import axios from "axios";

export default axios.create({
  // baseURL: "https://pink-otters-ring.loca.lt/",
  baseURL: "http://localhost:3000/",
  headers: {
    "Content-Type": "multipart/form-data"
  }
});
  
