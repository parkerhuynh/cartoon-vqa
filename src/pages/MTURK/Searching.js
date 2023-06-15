import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'katex/dist/katex.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';
import '../../App.css';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
const FormComponent = () => {
    const [inputAssignment, setInputAssignment] = useState('');
    const [inputTripe, setInputTripe] = useState('');
    const [inputHit, setInputHIT] = useState('');
    const [inputAssignments, setAssignments] = useState('');


    const handleAssignmentSubmit = (e) => {
        e.preventDefault();
        window.location.href = `/assignment/${inputAssignment}`;
    };

    const handleAssignmentChange = (e) => {
        setInputAssignment(e.target.value);
    };

    const handleTripleSubmit = (e) => {
        e.preventDefault();
        window.location.href = `/Triple/${inputTripe}`;
    };
    const handleTripleChange = (e) => {
        setInputTripe(e.target.value);
    };
    const handleHITChange = (e) => {
        setInputHIT(e.target.value);
    };
    const handleHITSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.get('/get_hit/'+inputHit);
        setAssignments(response.data)
        console.log(response.data)
    };


    return (
        <>
            <div class="container">
                <div class="row">
                    <div class="col-2"></div>
                    <div class="col-8 text-center">
                        <form onSubmit={handleAssignmentSubmit}>
                            <div className="form-group">
                                <label htmlFor="inputField" class="mt-5"><h2>Find Assigment via Assignment ID</h2></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="inputField"
                                    placeholder="Enter Assignment ID"
                                    value={inputAssignment}
                                    onChange={handleAssignmentChange}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary my-3">
                                Submit
                            </button>
                        </form>
                    </div>
                    <div class="col-2"></div>
                </div>
                <div class="row">
                    <div class="col-2"></div>
                    <div class="col-8 text-center">
                        <form onSubmit={handleTripleSubmit}>
                            <div className="form-group">
                                <label htmlFor="inputField" class="mt-5"><h2>Find Triple via ID</h2></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="inputField"
                                    placeholder="Enter ID"
                                    value={inputTripe}
                                    onChange={handleTripleChange}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary my-3">
                                Submit
                            </button>
                        </form>
                    </div>
                    <div class="col-2"></div>
                </div>
                <div class="row">
                    <div class="col-2"></div>
                    <div class="col-8 text-center">
                        <form onSubmit={handleHITSubmit}>
                            <div className="form-group">
                                <label htmlFor="inputField" class="mt-5"><h2>Find HIT</h2></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="inputField"
                                    placeholder="Enter HIT ID"
                                    value={inputHit}
                                    onChange={handleHITChange}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary my-3">
                                Submit
                            </button>
                        </form>
                        {inputAssignments.length === 0? (null): (
                        <div>
                        <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Workers</th>
                                <th scope="col">HIT</th>
                                <th scope="col">Assignment</th>
                            </tr>
                        </thead>

                        <tbody>
                            {Object.entries(inputAssignments).map(([key, assignment]) => (
                                <tr>
                                    <td>{key}</td>
                                    <td> <Link to={`/profile/${assignment.WorkerId}`} style={{ textDecoration: 'inherit'}} >{assignment.WorkerId}</Link> </td>
                                    <td>{assignment.HITId}</td>
                                    <td><Link to={`/assignment/${assignment.AssignmentId}`} style={{ textDecoration: 'inherit'}} >{assignment.AssignmentId}</Link></td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>)}
                    </div>
                    
                    
                    <div class="col-2"></div>
                </div>
            </div>
        </>

    );
};

export default FormComponent;