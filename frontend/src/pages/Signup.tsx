import { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Input } from "../components/ui/input";
import { Link } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  interface FormState {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    agree: boolean;
  }

  interface ChangeEvent {
    target: {
      name: string;
      value: string;
      type: string;
      checked: boolean;
    };
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Registration successful!");
  }

  function handleChange (e: ChangeEvent){
    // const { name, value, type, checked } = e.target;
    // setForm((prev) => ({
    //   ...prev,
    //   [name]: type === "checkbox" ? checked : value,
    // }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-4xl p-6 flex shadow-lg bg-white rounded-lg">
        <div className="w-1/2 p-6">
          <h2 className="text-2xl font-bold mb-4">Sign up</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center border rounded px-3 py-2">
              <FaUser className="text-gray-400 mr-2" />
              <Input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                // onChange={handleChange}
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
                // onChange={handleChange}
                required
                className="w-full border-none focus:ring-0"
              />
            </div>
            <div className="flex items-center border rounded px-3 py-2">
              <FaLock className="text-gray-400 mr-2" />
              <Input
                type="text"
                name="prn"
                placeholder="PRN"
                value={form.password}
                // onChange={handleChange}
                required
                className="w-full border-none focus:ring-0"
              />
            </div>
            <div className="flex items-center border rounded px-3 py-2">
              <FaLock className="text-gray-400 mr-2" />
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                // onChange={handleChange}
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
