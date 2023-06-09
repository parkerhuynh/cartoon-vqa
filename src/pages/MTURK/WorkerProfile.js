import React, { useState, useEffect, CSSProperties } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import 'katex/dist/katex.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';
import '../../App.css';
import ClipLoader from "react-spinners/ClipLoader";
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

function WorkerProfile() {
    const { worker_id } = useParams();
    const [profileData, setProfileData] = useState({});
    const [assigments, setAssigments] = useState(true);
    const [filterAssignement, setFilterAssignement] = useState([]);
    const [pieChart, setPieChart] = useState([]);
    const [reviewing, setReviewing] = useState("");


    const [dimmed, setDimmed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('Submitted');


    const handlePie = (assigments) => {
        const data = [
            { AssignmentStatus: 'Reviewing', count: 0 },
            { AssignmentStatus: 'Approved', count: 0 },
            { AssignmentStatus: 'Rejected', count: 0 },
        ];
        assigments.forEach((assignment) => {
            switch (assignment.AssignmentStatus) {
                case 'Submitted':
                    data[0].count++;
                    break;
                case 'Approved':
                    data[1].count++;
                    break;
                case 'Rejected':
                    data[2].count++;
                    break;
                default:
                    break;
            }
        })
        setPieChart(data)
    }


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('/get_worker_profile/' + worker_id);
            const responseData = response.data;
            setProfileData(responseData);
            setAssigments(responseData["data"])
            setFilterAssignement(responseData["data"])
            handlePie(responseData["data"]);
            setReviewing(responseData["Reviewed"])
            console.log(responseData)
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };
    const handleAssigmentClick = (assignemtId) => {
        window.location.href = `/assignment/${assignemtId}`;
    };
    const PIECOLORS = ['#14A44D', '#DC4C64'];
    const STATUSCOLORS = ['#3B71CA', '#14A44D', '#DC4C64'];
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
    const handleSearch = (event) => {
        const query = event.target.value.replace(/\s/g, '');
        setSearchQuery(query);
        const filtered = assigments.filter((assigment) =>
            assigment.AssignmentId.toLowerCase().includes(query.toLowerCase())
        );
        setFilterAssignement(filtered);
    };

    const handleStatusFilter = (value) => {
        setStatusFilter(value);
    };

    const filteredAssignment = filterAssignement.filter((assignment) => {
        if (statusFilter === 'All') {
            return true; // Show all workers if 'All' is selected
        } else {
            return assignment.AssignmentStatus === statusFilter; // Filter workers based on the selected status
        }
    });

    const handleRejectClick = (assignemtId) => {
        setDimmed(true);
        axios.post('/reject_assignment/' + assignemtId)
            .then(() => {
                console.log("Done!")
            })
            .finally(() => {
                setDimmed(false)
            })
        const updatedData = assigments.map(item => {
            if (item.AssignmentId === assignemtId) {
                return {
                    ...item,
                    AssignmentStatus: 'Rejected',
                };
            }
            return item;
        });
        setAssigments(updatedData)
        setFilterAssignement(updatedData)
        handlePie(updatedData)
    };


    const handleApproveClick = (assignemtId) => {
        setDimmed(true);
        axios.post('/approve_assignment/' + assignemtId)
            .then(() => {
                console.log("Done!")
            })
            .finally(() => {
                setDimmed(false)
            })

        const updatedData = assigments.map(item => {
            if (item.AssignmentId === assignemtId) {
                return {
                    ...item,
                    AssignmentStatus: 'Approved',
                };
            }
            return item;
        });
        setAssigments(updatedData)
        setFilterAssignement(updatedData)
        handlePie(updatedData)
    };


    const handleRejectAll = () => {
        setDimmed(true);
        axios.post('/reject_worker/' + worker_id)
            .then(() => {
                console.log("Done!")
            })
            .finally(() =>
                window.location.href = `/workerlist/`
                //window.close()
            )
    };

    const handleApproveAll = () => {
        setDimmed(true);
        axios.post('/approve_worker/' + worker_id)
            .then(() => {
                console.log("Done!")
            })
            .finally(() =>
                window.location.href = `/workerlist/`
                //window.close()
            )
    };
    const handleWorkers = () => {
        window.location.href = `/workerlist/`
        //window.close()
    };

    const handleApproveRest = () => {
        setDimmed(true);
        axios.post('/approve_worker_rest/' + worker_id)
            .then(() => {
                console.log("Done!")
            })
            .then(() => {
                setDimmed(false)
            })

        const updatedData = assigments.map(item => {
            if (item.AssignmentStatus === "Submitted") {
                item.AssignmentStatus = "Approved"
                return item
            } else {
                return item
            }
        }
        );
        setAssigments(updatedData)
        setFilterAssignement(updatedData)
        handlePie(updatedData)
    };

    const handleRejectRest = () => {
        setDimmed(true);
        axios.post('/reject_worker_rest/' + worker_id)
            .then(() => {
                console.log("Done!")
            })
            .then(() => {
                setDimmed(false)
            })

        const updatedData = assigments.map(item => {
            if (item.AssignmentStatus === "Submitted") {
                item.AssignmentStatus = "Rejected"
                return item
            } else {
                return item
            }
        }
        );
        setAssigments(updatedData)
        setFilterAssignement(updatedData)
        handlePie(updatedData)
    };
    const handleCheck = (action) => {
        setDimmed(true);
        axios.post('/reviewing_check/' + worker_id + "/" + action)
            .then(() => {
                console.log("Done!")
            })
            .then(() => {
                setReviewing("yes")
                setDimmed(false)
            })
            .finally(() => {
                handleWorkers()
            })
    };
    const handleUncheck = (action) => {
        setDimmed(true);
        axios.post('/reviewing_check/' + worker_id + "/" + action)
            .then(() => {
                console.log("Done!")
            })
            .finally(() => {
                setReviewing("no")
                setDimmed(false)
            })

    };
    const handleworkerhits = (worker_id) => {
        axios.get('/download-data/' + worker_id).then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', worker_id + '.csv');
          document.body.appendChild(link);
          link.click();
        });
      }; 

    return (
        <div>
            {loading ? (
                <div className={dimmed ? 'dimmed-screen' : ''}>
                    <div className="loading-indicator row text-center">
                        <ClipLoader
                            color="#36d7b7"
                            loading={dimmed}
                            size={80}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </div>
                </div>
            ) : profileData ? (
                <div className={dimmed ? 'dimmed-screen' : ''}>
                    {dimmed && (
                        <div className="loading-overlay container ">
                            <div className="loading-indicator row text-center">
                                <div class="rol-4"> </div>
                                <div class="rol-4">
                                    <ClipLoader
                                        color="#36d7b7"
                                        loading={dimmed}
                                        size={80}
                                        aria-label="Loading Spinner"
                                        data-testid="loader"
                                    />
                                </div>
                                <div class="rol-4"> </div>

                            </div>
                        </div>
                    )}
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
                                        {profileData.summary.map((row) => (
                                            <tr key={row.id}>
                                                <td>{row.id}</td>
                                                <td>{row.feature}s</td>
                                                <td>{row.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div class="row text-center">
                                    <div class="col-6"><button style={{ width: "120px" }} type="button" class="btn btn-sm btn-info"
                                        onClick={() => handleWorkers()}>Workers</button></div>
                                    <div class="col-6">
                                        {reviewing === "no" ? (
                                            <button style={{ width: "120px" }} type="button" class="btn btn-sm btn-outline-primary" onClick={() => handleCheck("yes")}>Done!</button>
                                        ) : (<button style={{ width: "120px" }} type="button" class="btn btn-sm btn-primary" onClick={() => handleUncheck("no")}>Reviewed</button>)}

                                    </div>
                                </div>
                                <div class="row text-center mt-5">
                                    <div class="col-6"><button style={{ width: "120px" }} type="button" class="btn btn-sm btn-success"
                                        onClick={() => handleApproveAll()}>Approve All</button></div>
                                    <div class="col-6"><button style={{ width: "120px" }} type="button" class="btn btn-sm btn-danger"
                                        onClick={() => handleRejectAll()}>Reject All</button></div>

                                </div>

                                <div class="row text-center mt-5">
                                    <div class="col-6"><button style={{ width: "120px" }} type="button" class="btn btn-sm btn-warning"
                                        onClick={() => handleworkerhits(worker_id)}>Download Worker Hits</button></div>


                                </div>

                            </div>
                            <div class="col-8" style={{ display: 'flex', justifyContent: 'space-around' }}>
                                <div class="text-center">
                                    <h7 ><b>Life Time</b></h7>
                                    <PieChart width={PIESIZE} height={PIESIZE}>
                                        <Pie
                                            data={profileData.lifeAproval}
                                            dataKey="value"
                                            nameKey="name"
                                            outerRadius={PIESIZE * (1.2 / 4)}
                                            fill="#f50c2f"
                                            label
                                        >
                                            {profileData.lifeAproval.map((entry, index) => (
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
                                            data={profileData.monthAproval}
                                            dataKey="value"
                                            nameKey="name"
                                            outerRadius={PIESIZE * (1.2 / 4)}
                                            fill="#f50c2f"
                                            label
                                        >
                                            {profileData.monthAproval.map((entry, index) => (
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
                                            data={profileData.weekAproval}
                                            dataKey="value"
                                            nameKey="name"
                                            outerRadius={PIESIZE * (1.2 / 4)}
                                            fill="#f50c2f"
                                            label
                                        >
                                            {profileData.weekAproval.map((entry, index) => (
                                                <Cell key={index} fill={PIECOLORS[index % PIECOLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Legend />
                                    </PieChart>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="container ">
                        <div class="row text-center">
                            <div class="col-4"></div>
                            <div class="col-4">
                                <PieChart width={400} height={300}>
                                    <Pie
                                        data={pieChart}
                                        dataKey="count"
                                        nameKey="AssignmentStatus"
                                        outerRadius={100}
                                        fill='#DC4C64'
                                        label
                                    >
                                        {pieChart.map((entry, index) => (
                                            <Cell key={index} fill={STATUSCOLORS[index % STATUSCOLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend />
                                </PieChart>
                                <h6>Review Processing</h6>
                            </div>
                            <div class="col-4"></div>

                        </div>

                    </div>
                    <div class="container">
                        <div class="row">
                            <div class="text-center my-4">
                                <h3>List of Assignment:</h3>

                            </div>
                            <div class="row">
                                <div class="col-11"><input type="text" class="form-control" value={searchQuery} onChange={handleSearch} placeholder="Search Assignment ..." /></div>
                                <div class="col-1">
                                    <div>
                                        <label></label>
                                        <select value={statusFilter} onChange={(e) => handleStatusFilter(e.target.value)}>
                                            <option value="All">All</option>
                                            <option value="Submitted">Reviewing</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row ">
                                <div class="col-5"></div>
                                <div class="col-1 text-center"><button style={{ width: "70px", height: "15px" }} type="button" class="btn btn-sm btn-success" onClick={() => handleApproveRest()}></button></div>
                                <div class="col-1 text-center"><button style={{ width: "70px", height: "15px" }} type="button" class="btn btn-sm btn-danger" onClick={() => handleRejectRest()}></button></div>
                                <div class="col-5"></div>
                            </div>
                            <div class="row">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>id</th>
                                            <th>Assignment ID</th>
                                            <th>Time</th>
                                            <th>Work Time</th>
                                            <th>Status</th>
                                            <th>Approve</th>
                                            <th>Reject</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(filteredAssignment).map(([key, row]) => (
                                            <tr key={key} style={{ color: getFontColor(row.AssignmentStatus) }}>
                                                <td onClick={() => handleAssigmentClick(row.AssignmentId)}>{key}</td>
                                                <td ><Link to={`/assignment/${row.AssignmentId}`} style={{ textDecoration: 'inherit' }} >{row.AssignmentId}</Link></td>
                                                <td onClick={() => handleAssigmentClick(row.AssignmentId)}>{row.SubmitTime}</td>
                                                <td onClick={() => handleAssigmentClick(row.AssignmentId)}>{row.WorkTimeInSeconds}</td>
                                                <td onClick={() => handleAssigmentClick(row.AssignmentId)}>{row.AssignmentStatus}</td>
                                                <td>{row.AssignmentStatus === "Approved" ? (null) : (<button style={{ width: "70px", height: "15px" }}
                                                    type="button" class="btn btn-sm btn-success" onClick={() => handleApproveClick(row.AssignmentId)}></button>)}</td>
                                                <td>{row.AssignmentStatus === "Rejected" ? (null) : (<button style={{ width: "70px", height: "15px" }}
                                                    type="button" onClick={() => handleRejectClick(row.AssignmentId)} class="btn btn-sm btn-danger"></button>)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Data unavailable</p>
            )}
        </div>
    );
};
export default WorkerProfile;
