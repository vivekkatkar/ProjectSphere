import { useState } from "react";
import { FaUser, FaEnvelope, FaLock,FaChild, FaCriticalRole, FaGenderless } from "react-icons/fa";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Link } from "react-router-dom";

export default function StudentSignup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role : "",
    password : "",
    confirmPassword : ""
  });

  interface ChangeEvent {
    target: {
      name: string;
      value: string;
    };
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log (form);
    if (form.password != form.confirmPassword) {
        alert ("password and confirm password don't match")
        return
    }
    // backend request
    alert("Signup successful!");
  }

  function handleChange (e: ChangeEvent){
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name] : value,
    }));
  };  

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-200">
      <Card className="w-full max-w-4xl p-6 flex shadow-lg bg-white rounded-lg">
        <div className="w-1/2 p-6">
          <h2 className="text-2xl font-bold mb-4">Signup as teacher</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center border rounded px-3 py-2">
              <FaUser className="text-gray-400 mr-2" />
              <Input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border-none focus:ring-0"
              />
            </div>
            <div className="flex items-center border rounded px-3 py-2">
              <FaEnvelope className="text-gray-400 mr-2" />
              <Input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border-none focus:ring-0"
              />
            </div>
            <div className="flex items-center border rounded px-3 py-2">
              <FaUser className="text-gray-400 mr-2" />
              <select 
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                className="w-full border-none focus:ring-0"
              >
                <option value="">Select role</option>
                <option value="Guide">Guide</option>
                <option value="Coordinator">Coordinator</option>
              </select>
            </div>  
            <div className="flex items-center border rounded px-3 py-2">
              <FaLock className="text-gray-400 mr-2" />
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full border-none focus:ring-0"
              />
            </div>
            <div className="flex items-center border rounded px-3 py-2">
              <FaLock className="text-gray-400 mr-2" />
              <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full border-none focus:ring-0"
              />
            </div>          
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">
              Signup
            </Button>
          </form>
          <p className="mt-4 text-center">
            Already have an account?
             <Link to="/login" className="text-blue-600 hover:underline"> Login</Link>
          </p>
        </div>
        <div className="w-1/2 hidden md:flex justify-center items-center">
          <img src="https://cdni.iconscout.com/illustration/premium/thumb/project-management-1884978-1597916.png" alt="Illustration" className="max-w-xs" />
        </div>
      </Card>
    </div>
  );
}
