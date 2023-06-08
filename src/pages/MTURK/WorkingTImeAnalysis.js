import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'katex/dist/katex.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';
import '../../App.css';
import Plot from 'react-plotly.js';


function ImageGrid() {
    const [working_time, setWorking_time] = useState([]);
    const [WorkerWorkingTime, SetWorkerWorkingTime] = useState([]);
    const [peopleToShow, setPeopleToShow] = useState(10);
    useEffect(() => {
        axios.get('/working_time/').then(res => {
            setWorking_time(res.data);
        });
    }, []);

    useEffect(() => {
        axios.get('/worker_working_time/10').then(res => {
            SetWorkerWorkingTime(res.data);
        });
    }, []);
    const testColor = "#be10e6"
    const themeColor = "#0a87f5"
    const numBins = 30
    const binSize = Math.ceil((Math.max(...working_time) - Math.min(...working_time)) / numBins);
    const histogramData = [];
    let minValue = Math.min(...working_time);
    console.log(WorkerWorkingTime)

    const handleNumberWorker = (event) => {
        const value = event.target.value
        axios.get('/worker_working_time/' + value).then(res => {
            SetWorkerWorkingTime(res.data);
        });
        setPeopleToShow(value);
      };

    for (let i = 0; i < numBins; i++) {
        const binStart = minValue + i * binSize;
        const binEnd = Math.min(minValue + (i + 1) * binSize, Math.max(...working_time));
        const binRange = `${binStart}-${binEnd}`;
        
        const bin = {
          binRange,
          frequency: 0
        };
        histogramData.push(bin);
      }

    working_time.forEach(value => {
        for (let i = 0; i < numBins; i++) {
            const bin = histogramData[i];
            const [binStart, binEnd] = bin.binRange.split('-').map(Number);
            if (value >= binStart && value <= binEnd) {
            bin.frequency++;
            break;
            }
        }
    });
    const handleBarClick = (data) => {
        const workerId = data["Worker Id"];
        window.location.href = `/profile/${workerId}`;
      };
    const HistogramChart = () => (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={histogramData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="binRange" />
            <YAxis label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="frequency" fill = {themeColor}  />
          </BarChart>
        </ResponsiveContainer>
      );
    return (
        <>
            <div class="container mb-5">
                <div class="row mb-5">
                    <div class="col-1"></div>
                    <div class="col-10 mx-5 mt-4 mb-4">
                        <h1 class="text-success">Working Time Analysis</h1>

                    </div>
                    <div class="col-1"></div>
                </div>
                <div class="row">
                    <div class="col-1"></div>

                    <div class="col-10">
                        <h3 class="text-center" style={{color:testColor}}>Histogram Plot of Working Time on Assignments</h3>
                        <HistogramChart />
                        <h6 class="text-center">Working Time of Assignments</h6>
                    </div>
                    <div class="col-1"></div>
                </div>
        </div>
        <div class="container">
                <div class="row">
                    <div class="col-1"></div>
                    <div class="col-10 text-center">
                    <h3 class="text-center" style={{color:testColor}}>Box Plot on Working Time on Assignments</h3>
                        <Plot
                        data={[
                            {
                            y: working_time,
                            type: 'box',
                            name: 'Working Time',
                            boxmean: true, // Display mean line inside the box
                            marker: {color: themeColor, // Set the color of the box
                            }
                        }
                        ]}
                        layout={{
                            width: 800,
                            height: 600,
                        }}
                        />
                </div>
                <div class="col-1"></div>
            </div>
        </div>
        <div class="container" style={{ marginBottom: '50px' }}>
            <div class="row">
                <div class="col-1"></div>
                <div class="col-10">
                <div>
                    <div class="row">
                        <div class="col-2"></div>
                        <div class="col-8"><h3 class="text-center" style={{color:testColor}}>{peopleToShow} People Have The Shortest Amount of Time to Do An Assignment.</h3></div>
                        <div class="col-2">
                        <div className="form-group">
                            <select
                            className="form-control"
                            id="people-select"
                            value={peopleToShow}
                            onChange={handleNumberWorker}
                            >
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                                <option value="40">40</option>
                                <option value="50">50</option>
                                <option value="60">60</option>
                                <option value="70">70</option>
                                <option value="80">80</option>
                                <option value="90">90</option>
                                <option value="100">100</option>
                            </select>
                        </div>
                        </div>
                    </div>
                    <div class="row">
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart  data={WorkerWorkingTime}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="Worker Id"/>
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="Work Time In Second" fill={themeColor}  onClick={handleBarClick}/>
                                </BarChart>
                            </ResponsiveContainer>
                    </div>
                    
                </div>
                </div>
                <div class="col-1"></div>
            </div>
            </div>
      </>
    );
}

export default ImageGrid;