import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'katex/dist/katex.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';
import '../../App.css';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const FormComponent = () => {
    const [inputAssignment, setInputAssignment] = useState('');
    const [inputTripe, setInputTripe] = useState('');

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
            </div>
        </>

    );
};

export default FormComponent;