import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'katex/dist/katex.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';
import '../../App.css';


function WorkerProfile() {
    const { triple_id } = useParams();
    const [triple, setTriple] = useState({});
    const [loading, setLoading] = useState(true);
    const [assigments, setAssigments] = useState([]);

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
                    <div class="container">
                        <div class="row">
                            <div class="col-3"></div>
                            <div class="col-6">
                                <table class="table">
                                    <thead>
                                        <tr class="text-center">
                                            <th scope="col" >#</th>
                                            <th scope="col" >Worker ID</th>
                                            <th scope="col" >Assingment ID</th>
                                            <th scope="col" >Answer</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assigments.map((row) => (
                                            <tr key={row.index}>
                                                <td >{row.index}</td>
                                                <td onClick={() => handleWorkerClick(row.worker_id)}>{row.worker_id}</td>
                                                <td onClick={() => handleAssignmentClick(row.assignment_id)}>{row.assignment_id}</td>
                                                <td>
                                                    {row.incorrect == 1 ? (<div class="text-center text-danger"><b>Incorrect</b></div>) : (null)}
                                                    {row.partially_incorrect == 1 ? (<div class="text-center text-danger"><b>Partially Incorrect</b></div>) : (null)}
                                                    {row.ambiguous == 1 ? (<div class="text-center text-danger"><b>Ambiguous</b></div>) : (null)}
                                                    {row.partially_correct == 1 ? (<div class="text-center text-success"><b>Partially Correct</b></div>) : (null)}
                                                    {row.correct == 1 ? (<div class="text-center text-success"><b>Correct</b></div>) : (null)}
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