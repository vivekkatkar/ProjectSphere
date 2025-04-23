import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import axios from "../../api/uploader.js";

export default function Profile() {
    const [data, setData] = useState();

    useEffect(() => {
        const token = localStorage.getItem("token");
        async function getData() {
            try {
                const res = await axios.get("guide/profile", {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                setData(res.data.data);
            } catch (err) {
                console.log(err);
            }
        }

        getData();
    }, []);

    return (
        <div className="min-h-screen w-full pt-10 bg-gradient-to-br from-blue-50 to-purple-50 px py">
            {data == null ? (
                <div className="flex justify-center items-center h-full">
                    <div className="text-gray-600 text-2xl font-semibold animate-pulse">Loading Profile...</div>
                </div>
            ) : (
                <div className="max-w-5xl mx-auto">
                    <div className="mb-12 flex items-center justify-between">
                        <div>
                            <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
                                Welcome, {data.name} 👋
                            </h1>
                            <p className="text-xl text-gray-600 mt-3 font-light">Your dashboard overview</p>
                        </div>
                        <div className="hidden lg:block">
                            <div className="text-sm text-gray-500 font-medium">Last Login: <span className="text-blue-600">Today</span></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-8">
                        <div className="bg-white shadow-2xl  rounded-2xl p-8 col-span-2 overflow-hidden relative ">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-4">Guide Information</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
                                    <div className="p-2 bg-blue-100 rounded-full">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Name</p>
                                        <p className="text-lg font-semibold text-gray-900">{data.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
                                    <div className="p-2 bg-purple-100 rounded-full">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Email</p>
                                        <p className="text-lg font-semibold text-gray-900">{data.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
                                    <div className="p-2 bg-green-100 rounded-full">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Semester</p>
                                        <p className="text-lg font-semibold text-gray-900">{data.semester}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
                                    <div className="p-2 bg-red-100 rounded-full">
                                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Role</p>
                                        <p className="text-lg font-semibold text-gray-900">{data.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl p-6 shadow-lg flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">Quick Stats</h3>
                                <p className="text-sm mt-2 opacity-80">Your activity at a glance</p>
                            </div>
                            <div className="mt-4">
                                <p className="text-2xl font-bold">12</p>
                                <p className="text-sm opacity-80">Tasks Completed</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

