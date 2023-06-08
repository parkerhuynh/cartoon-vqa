import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { PieChart, Pie, Cell, Legend } from 'recharts';

function WorkerProfile() {
    const { worker_id } = useParams();
    const [profileData, setProfileData] = useState({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchData();
    }, []);
    
    const fetchData = async () => {
        try {
            const response = await axios.get('/get_worker_profile/' + worker_id);
            const responseData = response.data;
            setProfileData(responseData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };
    const handleAssigmentClick = (assignemtId) => {
        window.location.href = `/assignment/${assignemtId}`;
      };
    const lifedata = profileData["lifeAprovalRate"];
    const monthdata = profileData["30AprovalRate"];
    const weekdata = profileData["7AprovalRate"];
    const assigment_data = profileData["data"];
    const summary_data = profileData["summary"];

    const PIECOLORS = ['#0088FE', '#FF8042'];
    const PIESIZE = 250;
    const getFontColor = (status) => {
        if (status === 'Rejected') {
          return 'red';
        } else if (status === 'Approved') {
          return 'green';
        } else {
          return 'black';
        }
      };
      
    return (
    <div>
        {loading ? (
        <p class="text-center"> Loading ...</p>
        ) : profileData ? (
            <>
                <div class="container">
                    <div class="row mt-4">
                        <div class="col-4 ms-5 ml-5">
                            <h5>Profile of worker ID </h5>
                            <h1 class="text-info"> {worker_id}</h1>
                        </div>
                        <div class="col-8 ms-5 ml-5"></div>
                    </div>
                </div>
                <div class="container">
                    <div class="row">
                        <div class="col-4">
                        <table class="table">
                            <thead>
                                <tr>
                                <th scope="col">#</th>
                                <th scope="col">Feature</th>
                                <th scope="col">Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {summary_data.map((row) => (
                                <tr key={row.id}>
                                    <td>{row.id}</td>
                                    <td>{row.feature}s</td>
                                    <td>{row.value}</td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                        <div class="col-8" style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <div class="text-center">
                                <h7 ><b>Life Time</b></h7>
                                <PieChart width={PIESIZE} height={PIESIZE}>
                                    <Pie
                                        data={lifedata}
                                        dataKey="value"
                                        nameKey="name"
                                        outerRadius={PIESIZE*(1.2/4)}
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
                            <div class="text-center">
                                <h7 ><b>Last 30 Dates</b></h7>
                                <PieChart width={PIESIZE} height={PIESIZE}>
                                    <Pie
                                    data={monthdata}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={PIESIZE*(1.2/4) }
                                    fill="#8884d8"
                                    label
                                    >
                                    {monthdata.map((entry, index) => (
                                        <Cell key={index} fill={PIECOLORS[index % PIECOLORS.length]} />
                                    ))}
                                    </Pie>
                                    <Legend />
                                </PieChart>
                            </div>
                            <div class="text-center">
                                <h7 ><b>Last 7 Dates</b></h7>
                                <PieChart width={PIESIZE} height={PIESIZE}>
                                    <Pie
                                    data={weekdata}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={PIESIZE*(1.2/4)}
                                    fill="#8884d8"
                                    label
                                    >
                                    {weekdata.map((entry, index) => (
                                        <Cell key={index} fill={PIECOLORS[index % PIECOLORS.length]} />
                                    ))}
                                    </Pie>
                                    <Legend />
                                </PieChart>

                            </div>
                        </div>
                    </div>
                    
                </div>
                <div class="container">
                    <div class="row">
                    <div class="text-center my-4">
                        <h3>List of Assignment:</h3>
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                            <th>id</th>
                            <th>Assignment ID</th>
                            <th>Submit Time</th>
                            <th>Work Time In Seconds</th>
                            <th>Assignment Status</th>
                            <th>Approve</th>
                            <th>Reject</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assigment_data.map((row) => (
                            <tr key={row.id} style={{ color: getFontColor(row.AssignmentStatus) }}>
                                <td onClick={() => handleAssigmentClick(row.AssignmentId)}>{row.id}</td>
                                <td onClick={() => handleAssigmentClick(row.AssignmentId)}>{row.AssignmentId}</td>
                                <td onClick={() => handleAssigmentClick(row.AssignmentId)}>{row.SubmitTime}</td>
                                <td onClick={() => handleAssigmentClick(row.AssignmentId)}>{row.WorkTimeInSeconds}</td>
                                <td onClick={() => handleAssigmentClick(row.AssignmentId)}>{row.AssignmentStatus}</td>
                                <td>{row.AssignmentStatus === "Approved" ? (null):(<button style={{width:"70px", height:"15px"}} type="button" class="btn btn-sm btn-success"></button>)}</td>
                                <td>{row.AssignmentStatus === "Rejected" ? (null):(<button style={{width:"70px", height:"15px"}} type="button" class="btn btn-sm btn-danger"></button>)}</td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                </div>
            </>
        ) : (
        <p>Data unavailable</p>
        )}
    </div>
    );
};
export default WorkerProfile;