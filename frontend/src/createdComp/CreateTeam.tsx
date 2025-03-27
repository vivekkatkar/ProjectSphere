import React, { useEffect, useState } from 'react'


export default function CreateTeam() {

    const [students, setStudents] = useState([{
        name : "",
        prn : 0
    }])

    const [team, setTeam] = useState([{
        name : "", prn : 0
    }]); 

    const [error, setError] = useState("");

    useEffect (() => {
        getAllStudents();
    }, [])

    async function getAllStudents() {
        console.log ("All student data");
        const token = localStorage.getItem("token");
        await fetch("http://localhost:3000/student/getAll", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }).then(resp => {
            if (!resp.ok) {
                setError ("Failed to fetch student data");
                throw new Error("Failed to fetch student data");
                
            }
            return resp.json();
        })
        .then(data => {
            console.log (data);

            for (let i = 0; i < data.data.length; i++) {
                let d = data.data[i];
                setStudents ((prev) => {
                    return (
                        [...prev, {
                            "name" : d.name,
                            "prn" : d.prn
                        }]
                    )
                })
                console.log (students);
            }
            // setStudents(data.data);
        })
        .catch((error) => setError(`Error fetching details + ${error}`));           
    }   

    async function handleTeamCreation(){
        const token = localStorage.getItem("token");
        await fetch("http://localhost:3000/student/createTeam", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                "team": team
            })
        })
    }

  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg shadow">
        Create Team : 
        <div>
        {
            students.map ((student, index) => {
                console.log (team, student);
                // console.log (team.includes(student))
                if (!team.find((member) => member.name === student.name && member.prn === student.prn)){
                    return (
                        <div key={index}>
                                <span>{student.name}</span> <span>{student.prn}</span> <button onClick={() => setTeam((prev) => [...prev, {name : student.name, "prn" : student.prn}])} className="bg-blue-600 text-white p-1 rounded-sm">Add</button>
                        </div>
                    )
                }
            })
        }
        </div>
        <div>
            <h1 className= "p-2">Selected Team</h1>
            {

                team.length && 
                team.map((member, index) => {
                    return (
                       <div key={index}>
                            <span>{member.name}</span>
                            <span>{member.prn}</span>
                       </div>
                    )
                })
            
            }
        </div>

        <button onClick={() => handleTeamCreation()} className=''>Submit</button>
    </div>
  )
}
