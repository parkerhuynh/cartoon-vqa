import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'katex/dist/katex.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';
import '../../App.css';
import { PieChart, Pie, Cell, Legend } from 'recharts';



function ImageGrid() {
    const [loading, setLoading] = useState(true);
    const [dimmed, setDimmed] = useState(false);
    const [status, setStatus] = useState([]);
    const sortStatusData = (status) => {
        const sortedData = [...status].sort((a, b) => a.name.localeCompare(b.name));
        setStatus(sortedData);
    };
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('/get_assignments/');
            const responseData = response.data;
            sortStatusData(responseData.status)
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };
    let sum = 0;
    for (let key in status) {
        if (status.hasOwnProperty(key)) {
            sum += status[key].value;
        }
    }
    const PIECOLORS = ['#14A44D',  '#DC4C64', '#3B71CA'];
    console.log(status)
    return (
        <>

            <div class="container mt-2">
                <h1 class="text-center m-2"> Assigments Analysis</h1>
                {loading ? (<p class="text-center"> Loading ...</p>) : (
                    <div className={dimmed ? 'dimmed-screen' : ''}>
                        <div class="container">
                            <div class="row m-5 ">
                                <div class="col-6">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Feature</th>
                                                <th scope="col">Value</th>
                                                <th scope="col">%</th>
                                                <th scope="col">Estimate</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td>Total Assigments</td>
                                                <td>26241</td>
                                                <td>100%</td>
                                                <td>{Math.floor(26241*0.05)} USD</td>
                                            </tr>
                                            <tr class="text-warning">
                                                <td>2</td>
                                                <td>Received Assigments</td>
                                                <td>{sum}</td>
                                                <td>{Math.round((sum/26241)*100)} %</td>
                                                <td>{Math.floor(sum*0.05)} USD</td>
                                            </tr>
                                            <tr class="text-success">
                                                <td>3</td>
                                                <td>Approved Assigments</td>
                                                <td>{status[0].value}</td>
                                                <td>{Math.round((status[0].value/26241)*100)}%</td>
                                                <td>{Math.floor(status[0].value*0.05)} USD</td>
                                            </tr>
                                            <tr class="text-danger">
                                                <td>4</td>
                                                <td>Rejected Assigments</td>
                                                <td>{status[1].value}</td>
                                                <td>{Math.round((status[1].value/26241)*100)}%</td>
                                                <td>{Math.floor(status[1].value*0.05)} USD</td>
                                            </tr>
                                            <tr class="text-primary">
                                                <td>5</td>
                                                <td>Reviewing Assignments</td>
                                                <td>{status[2].value}</td>
                                                <td>{Math.round((status[2].value/26241)*100)}%</td>
                                                <td>{Math.floor(status[2].value*0.05)} USD</td>
                                            </tr>
                                            <tr class="text-info">
                                                <td>6</td>
                                                <td>Remaining Assigments</td>
                                                <td>{26241 - status[0].value}</td>
                                                <td>{Math.round(((26241 - status[0].value)/26241)*100)}%</td>
                                                <td>{Math.floor((26241 - status[0].value)*0.05)} USD</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="col-6 ">
                                    <div style={{ "display": "flex", "justify-content": "center" }}>
                                    <PieChart width={450} height={350}>
                                        <Pie
                                            data={status}
                                            dataKey="value"
                                            nameKey="name"
                                            outerRadius={120}
                                            fill="#f50c2f"
                                            label
                                        >
                                            {status.map((entry, index) => (
                                                <Cell key={index} fill={PIECOLORS[index % PIECOLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Legend></Legend>
                                    </PieChart>
                                    </div>
                                
                                </div>
                            </div>
                        </div>
                    </div>

                )}

            </div>

        </>
    );
}

export default ImageGrid;