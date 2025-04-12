import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { FaLock, FaUser } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

export function Login() {
    const query = useQuery();
    const user = query.get("user");
    console.log("user is ", user);

    const [form, setForm] = useState({
        email: '',
        password: '',
        semester : 0
    });
    const [error, setError] = useState('');

    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        if(user == "student"){
            console.log("Student auth");
            const resp = await fetch("http://localhost:3000/student-auth/login", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: form.email,
                  semester: form.semester,
                  password: form.password,
                }),
            })
            const data = await resp.json();
            console.log (data);  
            if (data.message == "fail") {
                setError (data.error);
                return ;
            }
            const token = data.token;
            localStorage.setItem("token", token);  
            navigate ("/student-dashboard")
        }else{
            console.log("guide auth");
            const resp = await fetch("http://localhost:3000/guide-auth/login", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: form.email,
                  semester: form.semester,
                  password: form.password,
                }),
            })
            const data = await resp.json();
            console.log (data);  
            if (data.message == "fail") {
                setError (data.error);
                return ;
            }
            const token = data.token;
            localStorage.setItem("token", token);  
            // navigate ("/student-dashboard")
            window.open(`http://localhost:9563/?token=${token}`);
        }

    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    return (
        
        <div className="flex justify-center items-center min-h-screen bg-blue-100">
            <Card className="w-full max-w-2xl p-8 flex shadow-lg bg-white rounded-lg">
                {/* Left Section (Login Form) */}
                <div>{error != "" ? error : ""}</div>
                <div className="w-1/2 p-6">
                    <h2 className="text-2xl font-bold mb-4">Login</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Input */}
                        <div className="flex items-center border rounded px-3 py-2">
                            <FaUser className="text-gray-400 mr-2" />
                            <Input
                                type="text"
                                name="email"
                                placeholder="Your Email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full border-none focus:ring-0"
                            />
                        </div>

                        {/* Password Input */}
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
                                type="text"
                                name="semester"
                                placeholder="Semester"
                                value={form.semester}
                                onChange={handleChange}
                                required
                                className="w-full border-none focus:ring-0"
                            />  
                        </div>


                        {/* Login Button */}
                        <Button type='submit' className="hover:bg-blue-600 w-full bg-blue-500 text-white rounded-lg py-2">
                            Login
                        </Button>
                    </form>

                    {/* Signup Link */}
                    <p className="text-sm text-center mt-4">
                        Don't have an account?{' '} 
                        <Link to="/signup/student" className="text-blue-600 hover:underline">
                            Sign up
                        </Link>
                    </p>    
                </div>      

                {/* Right Section (Illustration) */}
                <div className="w-1/2 flex items-center justify-center">
                    <img
                        src="https://tse4.mm.bing.net/th?id=OIP.lbDQWx2C-vTwLtr4FVxpSAHaHa&pid=Api&P=0&h=220"
                        alt="Login Illustration"
                        className="w-3/4"
                    />
                </div>
            </Card>
        </div>
    );
}
