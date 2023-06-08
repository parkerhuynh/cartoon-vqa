import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { PieChart, Pie, Cell, Legend } from 'recharts';

function WorkerProfile() {
    const { worker_id } = useParams();
    const [profileData, setProfileData] = useState({});
    useEffect(() => {
        axios.get('/get_worker_profile/' + worker_id).then(res => {
            setProfileData(res.data);
        });
    }, {});
    if (profileData == {}) {
        return (
            <div> Loading..</div>
        )
    } else {
        const lifedata = profileData["30AprovalRate"]
        const PIECOLORS = ['#0088FE', '#FF8042'];
        console.log()
        const PIESIZE = "100px";
        return (
            <>
                <div class="container">
                    <div class="row mt-4">
                        <div class="col-4 ms-5 ml-5">
                            <h5>Profile of worker ID </h5>
                            <h1 class="text-info"> {worker_id}</h1>
                        </div>
                        <div class="col-8 ms-5 ml-5"></div>
                    </div>
                    <div class="row mt-4">
                        <div class="col-4 ms-5 ml-5">
                        </div>
                        <div class="col-8 ms-5 ml-5">
                        <PieChart width={400} height={400}>
                            <Pie
                            data={lifedata}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            label
                            >
                            {lifedata.map((entry, index) => (
                                <Cell key={index} fill={PIECOLORS[index % PIECOLORS.length]} />
                            ))}
                            </Pie>
                            <Legend />
                        </PieChart>
                        </div>
                    </div>
                </div>
            </>
    );
}
}
export default WorkerProfile;