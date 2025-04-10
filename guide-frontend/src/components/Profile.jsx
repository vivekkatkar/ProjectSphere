import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import axios from "axios";

export default function Profile() {
    const [data, setData] = useState();
    useEffect(()=>{
        async function getData() {
            try {
                const res = await axios.get("http://10.40.5.29:3000/guide/profile");
                setData(res.data.data);
                // console.log(res.data.data);
                // console.log(res.data.data);
            } catch (err) {
                console.log(err);
            }
        }

        getData();
    }, []);
    
    return (
        <div className="flex "> 
            {data == null ? <div>Loading Data </div>  :
            
            <div> 
                <div>{data.name}</div>    
                <div>{data.email}</div>    
                <div>{data.semester}</div>    
                <div>{data.role}</div>    
            </div>
            }
        </div>
    );
}