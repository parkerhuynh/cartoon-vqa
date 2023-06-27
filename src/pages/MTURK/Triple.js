import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'katex/dist/katex.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';
import '../../App.css';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

function WorkerProfile() {
    const { triple_id } = useParams();
    const [triple, setTriple] = useState({});
    const [loading, setLoading] = useState(true);
    const [assigments, setAssigments] = useState([]);
    const [dimmed, setDimmed] = useState(false);
    useEffect(() => {
        fetchData(triple);
    }, []);


    const fetchData = async () => {
        try {
            const response = await axios.get('/get_triple/' + triple_id);
            const responseData = response.data;
            setTriple(responseData.triple);
            setAssigments(responseData.assignments);
            console.log(responseData)
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };
    const handleWorkerClick = (workerId) => {
        window.location.href = `/profile/${workerId}`;
    };
    const handleAssignmentClick = (assignemtId) => {
        window.location.href = `/assignment/${assignemtId}`;
    };
    const getFontColor = (status) => {
        if (status === 'Submitted') {
          return 'blue';
        } else if (status === 'Rejected') {
          return 'red';
        } else {
          return 'green';
        }
      };
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
            if (item.assignment_id === assignemtId) {
                return {
                    ...item,
                    AssignmentStatus: 'Rejected',
                };
            }
            return item;
        });
        setAssigments(updatedData)
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
            if (item.assignment_id === assignemtId) {
                return {
                    ...item,
                    AssignmentStatus: 'Approved',
                };
            }
            return item;
        });
        setAssigments(updatedData)
    };

    return (
        <>
            {loading ? (<h3 class="text-center">Loading ....</h3>) : (
                <>
                    <div class="container my-5">
                        <h3 class="text-center">Triple ID</h3>
                        <h2 class="text-center text-info">{triple_id}</h2>
                        <div class="row">
                            <div class="col-4"></div>
                            <div class="col-4">
                                <div class="card h-100">
                                    <img key={triple.id} class="m-1" src={triple["Img path"]} alt={"sub_image"} style={{ height: "400px", "border-radius": "6px" }} />
                                    <div class="card-body text-center">
                                        <h4>{triple.Question}</h4>
                                        <h4>{triple.Answer}</h4>
                                    </div>
                                </div>
                            </div>
                            <div class="col-4"></div>
                        </div>
                    </div>
                    <div className={dimmed ? 'dimmed-screen' : ''}>
                        <div class="row">
                            <div class="col-3"></div>
                            <div class="col-6" >
                                <table class="table">
                                    <thead>
                                        <tr class="text-center">
                                            <th scope="col" >#</th>
                                            <th scope="col" >Worker ID</th>
                                            <th scope="col" >Assingment ID</th>
                                            <th scope="col" >Answer</th>
                                            <th scope="col" >Approve</th>
                                            <th scope="col" >Reject</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assigments.map((row) => (
                                            <tr key={row.index}>
                                                <td style={{ color: getFontColor(row["AssignmentStatus"]) }}>{row.index}</td>
                                                <td><Link to={`/profile/${row.worker_id}`} style={{color: getFontColor(row["AssignmentStatus"]), textDecoration: 'inherit'}} >{row.worker_id}</Link></td>
                                                <td><Link to={`/assignment/${row.assignment_id}`} style={{color: getFontColor(row["AssignmentStatus"]), textDecoration: 'inherit'}} >{row.assignment_id}</Link></td>
                                                <td>
                                                    {row.incorrect == 1 ? (<div class="text-center text-danger"><b>Incorrect</b></div>) : (null)}
                                                    {row.partially_incorrect == 1 ? (<div class="text-center text-danger"><b>Partially Incorrect</b></div>) : (null)}
                                                    {row.ambiguous == 1 ? (<div class="text-center text-danger"><b>Ambiguous</b></div>) : (null)}
                                                    {row.partially_correct == 1 ? (<div class="text-center text-success"><b>Partially Correct</b></div>) : (null)}
                                                    {row.correct == 1 ? (<div class="text-center text-success"><b>Correct</b></div>) : (null)}
                                                </td>
                                                <td>
                                                    {row["AssignmentStatus"] != "Approved" ? (<button style={{ width: "70px", height: "15px" }}
                                                type="button" class="btn btn-sm btn-success" onClick={() => handleApproveClick(row.assignment_id)}></button>) : (null)}
                                                </td>
                                                <td>
                                                    {row["AssignmentStatus"] != "Rejected" ? (<button style={{ width: "70px", height: "15px" }}
                                                type="button" class="btn btn-sm btn-danger" onClick={() => handleRejectClick(row.assignment_id)} ></button>) : (null)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div class="col-3"></div>
                        </div>
                    </div>
                    </>
            

            )}

        </>
    );
};
export default WorkerProfile;
