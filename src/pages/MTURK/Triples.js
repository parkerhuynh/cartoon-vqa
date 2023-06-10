import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'katex/dist/katex.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';
import '../../App.css';
import { PieChart, Pie, Cell, Legend, LineChart, Tooltip, CartesianGrid, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';
import ClipLoader from "react-spinners/ClipLoader";
import chroma from 'chroma-js';




function ImageGrid() {
    const [loading, setLoading] = useState(true);
    const [summary, getSummary] = useState({});
    const [categories, getCategories] = useState([]);
    const [status, getStatus] = useState([]);
    const [topics, getTopic] = useState([]);
    const [firstWords, getFirstWords] = useState([]);
    const [statusFilter, setStatusFilter] = useState('All');

    const sortStatusData = (status) => {
        const sortedData = [...status].sort((a, b) => a.count - b.count);
        getStatus(sortedData);
    };
    useEffect(() => {
        fetchData();
    }, []);


    const fetchData = async () => {
        try {
            const response = await axios.get('/get_triple_summary/all');
            const responseData = response.data;
            getSummary(responseData)
            getStatus(responseData.statusCount)
            sortStatusData(responseData.statusCount)
            getCategories(responseData.categoryCount)
            getTopic(responseData.topicCount)
            getFirstWords(responseData.firstWordCount)
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };
    const handleStatusFilter = async (value) => {
        console.log("asdasdasd")
        setStatusFilter(value);
        try {
            setLoading(true);
            const response = await axios.get('/get_triple_summary/' + value);
            const responseData = response.data;
            getSummary(responseData)
            getStatus(responseData.statusCount)
            sortStatusData(responseData.statusCount)
            getCategories(responseData.categoryCount)
            getTopic(responseData.topicCount)
            getFirstWords(responseData.firstWordCount)
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };
    const PIECOLORS = ['#DC4C64', '#3B71CA', '#14A44D'];
    const ANSWERCOLORS = ['#3DF805', '#F86205', '#F8A705', '#9BF805', '#F80505'];
    const PIESIZE = 250;
    let topic_sum = 0
    for (let i = 0; i < topics.length; i++) {
        topic_sum += topics[i].count
    }
    let categorical_sum = 0
    for (let i = 0; i < categories.length; i++) {
        categorical_sum += categories[i].count
    }
    let firstword_sum = 0
    for (let i = 0; i < firstWords.length; i++) {
        firstword_sum += firstWords[i].count
    }
    const generateColors = (baseColor, endColor,count) => {
        const colors = chroma.scale([endColor, baseColor]).colors(count);
        return colors;
    };
    const topicColors = generateColors('FF0000', '000000', topics.length);
    const firstWordColors = generateColors('85FFA9', 'F1601D', firstWords.length);

    return (
        <>
            {loading ? (
                <div class="container">
                    <div class="row mt-3">
                        <div class="col-4"></div>
                        <div class="col-4 text-center">
                            <ClipLoader
                                color="F87F05"
                                loading={loading}
                                size={80}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            />
                        </div>
                        <div class="col-4"></div>
                    </div>
                </div>
            ) : (
                <div class="container my-5">
                    <h1 class="text-center mb-5">Triple Analysis</h1>
                    <div class="row m-2 my-5">
                        <div class="col-6">
                            <h3 class="mx-5 text-info">Overall Statistics</h3>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Feature</th>
                                        <th scope="col">Value</th>
                                        <th scope="col">%</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td scope="col">1</td>
                                        <td scope="col">Number Total Triples</td>
                                        <td scope="col">104,964</td>
                                        <td scope="col"></td>
                                    </tr>
                                    <tr>
                                        <td scope="col">2</td>
                                        <td scope="col">Number Total Answers</td>
                                        <td scope="col">314,892</td>
                                        <td scope="col">100%</td>
                                    </tr>
                                    <tr class="text-warning">
                                        <td scope="col">3</td>
                                        <td scope="col">Received  Answers</td>
                                        <td scope="col">{(status[0].count + status[1].count + status[2].count).toLocaleString()}</td>
                                        <td scope="col">{Math.round(((status[0].count + status[1].count + summary.statusCount[2].count) / 314892) * 100)}%</td>
                                    </tr>
                                    <tr class="text-success">
                                        <td scope="col">4</td>
                                        <td scope="col">Approved Answers</td>
                                        <td scope="col">{status[0].count.toLocaleString()}</td>
                                        <td scope="col">{Math.round((status[0].count / 314892) * 100)}%</td>
                                    </tr>
                                    <tr class="text-danger">
                                        <td scope="col">5</td>
                                        <td scope="col">Rejected Answers</td>
                                        <td scope="col">{status[2].count.toLocaleString()}</td>
                                        <td scope="col">{Math.round((status[2].count / 314892) * 100)}%</td>
                                    </tr>
                                    <tr class="text-primary">
                                        <td scope="col">6</td>
                                        <td scope="col">Revewing Answers</td>
                                        <td scope="col">{status[1].count.toLocaleString()}</td>
                                        <td scope="col">{Math.round((status[1].count / 314892) * 100)}%</td>
                                    </tr>
                                    <tr>
                                        <td scope="col">7</td>
                                        <td scope="col">Remaining Answers</td>
                                        <td scope="col">{(314892 - (status[0].count + status[1].count)).toLocaleString()}</td>
                                        <td scope="col">{Math.round(((314892 - (status[0].count + status[1].count)) / 314892) * 100)}%</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div>
                                <select class="form-control text-center" value={statusFilter} onChange={(e) => handleStatusFilter(e.target.value)} >
                                <option value="All">All</option>
                                <option class="text-primary" value="Submitted">Reviewing</option>
                                <option class="text-success" value="Approved">Approved</option>
                                <option class="text-danger" value="Rejected">Rejected</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-6" style={{ "display": "flex", "justify-content": "center" }}>
                            <PieChart width={450} height={300}>
                                <Pie
                                    data={summary.statusCount}
                                    dataKey="count"
                                    nameKey="status"
                                    outerRadius={100}
                                    fill="#f50c2f"
                                    label
                                >
                                    {summary.statusCount.map((entry, index) => (
                                        <Cell key={index} fill={PIECOLORS[index % PIECOLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend />
                            </PieChart>
                        </div>
                    </div>
                    <div class="row m-2 my-5">
                        <h3 class="mx-5 text-info">Response Analysis 1</h3>
                        <div class="col-6 text-center" >
                            <div style={{ "display": "flex", "justify-content": "center" }}>
                                <PieChart width={450} height={300}>
                                    <Pie
                                        data={categories}
                                        dataKey="count"
                                        nameKey="category"
                                        outerRadius={100}
                                        fill="#f50c2f"
                                        label
                                    >
                                        {categories.map((entry, index) => (
                                            <Cell key={index} fill={ANSWERCOLORS[index % ANSWERCOLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend />
                                </PieChart>
                            </div>
                            <h7 class="text-center">Pie Chart of the Answers of MTURK Workers</h7>
                        </div>
                        <div class="col-6">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Response</th>
                                        <th scope="col">Count</th>
                                        <th scope="col">%</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {Object.entries(categories).map(([key, category]) => (
                                        <tr>
                                            <td>{key}</td>
                                            <td>{category.category}</td>
                                            <td>{category.count}</td>
                                            <td>{Math.round((category.count / categorical_sum) * 100)}%</td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                        </div>
                    </div>
                    <div class="row m-2 my-5">
                        <h3 class="mx-5 text-info">Response Analysis 2</h3>
                        <div >
                            <ResponsiveContainer height={600}>
                                <LineChart data={summary.cumulative_data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="Incorrect" stroke="#F80505" />
                                    <Line type="monotone" dataKey="Partially Incorrect" stroke="#F86205" />
                                    <Line type="monotone" dataKey="Ambiguous" stroke="#F8A705" />
                                    <Line type="monotone" dataKey="Partially Correct" stroke="#9BF805" />
                                    <Line type="monotone" dataKey="Correct" stroke="#3DF805" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div class="text-center">
                            <h7 >Cumulative Chart of The Number of Worker with The Same Answer.</h7>
                        </div>
                    </div>
                    <div class="row m-2 my-5">
                        <h3 class="mx-5 text-info">Question Analysis 1</h3>
                        <div class="col-6 ps-5">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Topic</th>
                                        <th scope="col">Count</th>
                                        <th scope="col">%</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {Object.entries(topics).map(([key, topic]) => (
                                        <tr>
                                            <td>{key}</td>
                                            <td>{topic.topic}</td>
                                            <td>{topic.count}</td>
                                            <td>{Math.round((topic.count / topic_sum) * 100)}%</td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div class=" col-6" style={{ "display": "flex", "justify-content": "center" }}>
                            <PieChart width={450} height={400}>
                                <Pie
                                    data={topics}
                                    dataKey="count"
                                    nameKey="topic"
                                    outerRadius={100}
                                    fill="F87F05"
                                    label
                                >
                                    {topics.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={topicColors[index]} />
                                    ))}
                                </Pie>

                                <Legend />
                            </PieChart>
                        </div>

                    </div>
                    <div class="row m-2 my-5">
                        <h3 class="mx-5 text-info">Question Analysis 2</h3>
                        <div class="col-6 mt-5" style={{ "display": "flex", "justify-content": "center" }}>
                            <div>
                            <PieChart width={450} height={400}>
                                <Pie
                                    data={firstWords}
                                    dataKey="count"
                                    nameKey="FirstWord"
                                    outerRadius={100}
                                    fill="F87F05"
                                    label
                                >
                                    {firstWords.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={firstWordColors[index]} />
                                    ))}
                                </Pie>

                                <Legend />
                            </PieChart>
                            </div>
                        </div>
                        <div class="col-6 ps-5">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">First Word</th>
                                        <th scope="col">Count</th>
                                        <th scope="col">%</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {Object.entries(firstWords).map(([key, word]) => (
                                        <tr>
                                            <td>{key}</td>
                                            <td>{word.FirstWord}</td>
                                            <td>{word.count}</td>
                                            <td>{Math.round((word.count/firstword_sum)*100)}%</td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        

                    </div>
                    <div class="row m-2 my-5">
                    <h3 class="mx-5 text-info">Answer Analysis</h3>
                    <ResponsiveContainer width="95%" height={400}>
                    <BarChart data={summary.answerList}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="Answer" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="Count" fill="#3B71CA"/>
                    </BarChart>
                  </ResponsiveContainer>
                    </div>
                    <h5 class="text-center">Top 50 Answers</h5>
                </div>
            )}
        </>
    );
}

export default ImageGrid;