import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ProjectDetails() {
    const location = useLocation ();
    const info = location.state;

    // const [projectDetails, setProjectDetails] = {

    // }

    useEffect (() => {
        // requesting backend => route getProjectDetails (sem, teamId) 
        // => idea, synopsis details, github repo , team details
    }, []) 

    return (
        <div>
            {info.semester } {info.teamId}
            <div>
                <h1 className='text-3xl font-bold'>Project Heading</h1>
                <p>Idea </p>
                <p>Synopsis</p>
                <a href="https://github.com/100xdevs-cohort-2/assignments">githubLink</a>
            </div>
        </div>
    )
}
