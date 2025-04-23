import axios from "axios";

export default axios.create({
  baseURL: "https://projectsphere-wpv2.onrender.com/",
  // baseURL: "http://localhost:3000/",
  headers: {
    "Content-Type": "multipart/form-data"
  }
});
  
