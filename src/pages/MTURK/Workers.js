import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'katex/dist/katex.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';
import '../../App.css';
import Plot from 'react-plotly.js';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';




function ImageGrid() {
  const [workers, setWorkers] = useState([]);
  const [summary, setSummary] = useState([]);
  const [dangerWorkers, setDangerWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [pieChart, setPieChart] = useState([]);

  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [numberWoker, SetNumberWoker] = useState(50);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [dimmed, setDimmed] = useState(false);
  const [analysis, SetAnalysis] = useState(true);

  const handlePie = (workers) => {
    const data = [
      { workerStatus: 'Reviewing', count: 0 },
      { workerStatus: 'Approved', count: 0 },
      { workerStatus: 'Rejected', count: 0 },
    ];
    workers.forEach((worker) => {

      switch (true) {
        case (worker.Approved + worker.Rejected) !== worker.count:
          data[0].count++;
          break;
        case worker.Approved === worker.count:
          data[1].count++;
          break;
        case worker.Rejected === worker.count:
          data[2].count++;
          break;
        default:
          break;
      }
    })
    console.log(data)
    setPieChart(data)
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/get_workers/');
      const responseData = response.data;
      setWorkers(responseData.data);
      setSummary(responseData.summary);
      setFilteredWorkers(responseData.data)
      setDangerWorkers(responseData.danger_worker)
      handlePie(responseData.data)
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const testColor = "#be10e6"
  const themeColor = "#0a87f5"
  const handleNumberWorker = (event) => {
    const value = event.target.value
    SetNumberWoker(value);
  };
  const handleBarClick = (data) => {
    const workerId = data["WorkerId"];
    window.location.href = `/profile/${workerId}`;
  };
  const handletableClick = (workerId) => {
    window.location.href = `/profile/${workerId}`;
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    const filtered = workers.filter((worker) =>
      worker.WorkerId.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredWorkers(filtered);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
  };
  const filteredWorker = filteredWorkers.filter((worker) => {
    if (statusFilter === 'All') {
      return true; // Show all workers if 'All' is selected
    } else if (statusFilter === "Approved") {
      return worker.Approved === worker.count;
    } else if (statusFilter === "Rejected") {
      return worker.Rejected === worker.count;
    } else {
      return (worker.Rejected + worker.Approved) !== worker.count;
    }
  });


  const handleApproveAll = (worker_id) => {
    setDimmed(true);
    axios.post('/approve_worker/' + worker_id)
      .then(() => {
        console.log("Done!")
      })
      .finally(() => {
        setDimmed(false)
      })
    const updatedData = filteredWorkers.map(item => {
      if (item.WorkerId === worker_id) {
        item.Approved = item.count;
        item.Reviewed = item.count;
        item.Rejected = 0;
        item["Approval Rate"] = 100;
        return item
      }
      return item;
    });
    setFilteredWorkers(updatedData)
    setWorkers(updatedData)
    handlePie(updatedData)
  };
  const handleRejectAll = (worker_id) => {
    setDimmed(true);
    axios.post('/reject_worker/' + worker_id)
      .then(() => {
        console.log("Done!")
      })
      .finally(() => {
        setDimmed(false)
      });
    const updatedData = filteredWorkers.map(item => {
      if (item.WorkerId === worker_id) {
        item.Approved = 0;
        item.Reviewed = item.count;
        item.Rejected = item.count;
        item["Approval Rate"] = 0;
        return item
      }
      return item;
    });
    setFilteredWorkers(updatedData)
    setWorkers(updatedData)
    handlePie(updatedData)
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      // Reverse the sort order if the same column is clicked again
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set the new sort column and default sort order to ascending
      setSortColumn(column);
      setSortOrder('asc');
    }

    const sorted = [...filteredWorkers].sort((a, b) => {
      if (column === 'WorkerId') {
        // Sort by WorkerID alphabetically
        return a.WorkerId.localeCompare(b.WorkerId);
      } else if (column === 'Count') {
        // Sort by Count numerically
        return a.Count - b.Count;

      } else if (column === 'Approval Rate') {
        if (a["Approval Rate"] === 'Not Review' && b["Approval Rate"] !== 'Not Review') {
          return 1; // Place "not review" at the end
        }
        if (a["Approval Rate"] !== 'Not Review' && b["Approval Rate"] === 'Not Review') {
          return -1; // Place "not review" at the end
        }

        return a["Approval Rate"] - b["Approval Rate"];
      } else if (column === 'WorkTimeInSeconds') {
        // Sort by Working time
        return new Date(a.WorkTimeInSeconds) - new Date(b.WorkTimeInSeconds);
      } else if (column === 'value') {
        return a.value - b.value;
      }
    })


    // Reverse the sorted array if the sort order is descending
    if (sortOrder === 'desc') {
      sorted.reverse();
    }

    setFilteredWorkers(sorted);
  };
  
  const getFontColor = (rate) => {
    if (rate === 'Not Review') {
      return 'black';
    } else if (rate < 75) {
      return 'red';
    } else {
      return 'green';
    }
  };

  const getBarColor = (data) => {
    if (data.Approved === data.count) {
      return "#14A44D"
    } else if (data.Rejected === data.count) {
      return "#DC4C64"
    } else {
      return "#3B71CA"
    }
  };

  const formattedCountData = filteredWorker.map((item) => ({
    ...item,
    fill: getBarColor(item),
  }));
  const formattedTimeData = filteredWorker.map((item) => ({
    ...item,
    fill: getBarColor(item),
  }));

  const workerIdsList = [];
  const color_worker = {}

  for (let i = 0; i < formattedCountData.length; i++) {
    workerIdsList.push(formattedCountData[i].WorkerId);
    color_worker[formattedCountData[i].WorkerId] = formattedCountData[i].fill
  }
  const filtereddangerWorkers = dangerWorkers.filter(worker => workerIdsList.includes(worker.WorkerId));
  const filteredcoloreddangerWorkers = []
  for (let i = 0; i < dangerWorkers.length; i++) {
    if (workerIdsList.includes(dangerWorkers[i].WorkerId)) {
      const item = dangerWorkers[i]
      item.fill = color_worker[dangerWorkers[i].WorkerId]
      filteredcoloreddangerWorkers.push(item)
    }
  }
  const PIECOLORS = ['#3B71CA', '#14A44D', '#DC4C64'];
  const PIESIZE = 250;

  const handleToggleVisibility = () => {
    SetAnalysis(!analysis);
  };

  const box_data = []
  for (let i = 0; i < filteredWorker.length; i++) {
    box_data.push(filteredWorker[i].value.toFixed(2))
  }
  return (
    <>
      <div class="container mt-2">
        <div class="row">
          <div class="col-4"></div>
          <div class="col-4"><h1 class="text-center"> Workers</h1></div>
          <div class="col-4 text-right">
              <div>
              {analysis ? (
                <button class="btn btn-outline-primary" onClick={handleToggleVisibility}>Workers</button>
              ):(
                <button class="btn btn-outline-info" onClick={handleToggleVisibility}>Analysis</button>
              )}
              
            </div>
          </div>
        </div>
        
        
        {loading ? (<p class="text-center"> Loading ...</p>) : (

          <div className={dimmed ? 'dimmed-screen' : ''}> 
            {analysis ? (
            <div class="container">
              <div class="row">
                <div class="col-6">
                  <h2 class="text-info mt-3">Summary Information</h2>
                  <table class="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Feature</th>
                        <th scope="col">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.map((row) => (
                        <tr key={row.id}>
                          <td>{row.id}</td>
                          <td>{row.name}</td>
                          <td>{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div>
                    <select class="form-control text-center btn btn-outline-info" value={statusFilter} onChange={(e) => handleStatusFilter(e.target.value)}>
                      <option value="All">All</option>
                      <option class="text-primary" value="Submitted">Reviewing</option>
                      <option class="text-success" value="Approved">Approved</option>
                      <option class="text-danger" value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>
                <div class="col-6 text-center" >
                  <h7 ><b>Review Processing</b></h7>
                  <div style={{ "display": "flex", "justify-content": "center" }}>

                    <PieChart width={450} height={350}>
                      <Pie
                        data={pieChart}
                        dataKey="count"
                        nameKey="workerStatus"
                        outerRadius={120}
                        fill="#f50c2f"
                        label
                      >
                        {pieChart.map((entry, index) => (
                          <Cell key={index} fill={PIECOLORS[index % PIECOLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </div>
                </div>
              </div>
              <div class="row my-3">
                <div>
                  <div class="row">
                    <div class="col-11 px-5">
                      <h4>Top {numberWoker} Hardest Workers</h4>
                    </div>
                    <div class="col-1 px-4">
                      <div className="form-group">
                        <select
                          className="form-control"
                          id="people-select"
                          value={numberWoker}
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

                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={formattedCountData.slice(0, numberWoker)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="WorkerId" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count"
                        onClick={handleBarClick} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div class="row">
                <div>
                  <div class="row my-3">
                    <div class="col-11 px-5">
                      <h4>Avg. Working time per Asgmt Top {numberWoker} Hardest Workers</h4>
                    </div>
                    <div class="col-1 ps-4">
                      <div className="form-group">
                        <select
                          className="form-control"
                          id="people-select"
                          value={numberWoker}
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
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={formattedTimeData.slice(0, numberWoker)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="WorkerId" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="WorkTimeInSeconds"
                        onClick={handleBarClick} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

              </div>
              <div class="row">
                <h4 class="px-5">List of {filteredcoloreddangerWorkers.length} Dangerous Workers</h4>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={filteredcoloreddangerWorkers}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="WorkerId" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="fill" onClick={handleBarClick} />
                  </BarChart>
                </ResponsiveContainer>
                <h6 class="px-5">People who pose a threat are those who possess the ability to deceive by consistently selecting a single option for all the answers in a series of exercises.</h6>
              </div>
              <div class="row">
              <Plot
                        data={[
                            {
                            y: box_data,
                            type: 'box',
                            name: 'value',
                            boxmean: true, // Display mean line inside the box
                            marker: {color: "#14A44D"
                            }
                        }
                        ]}
                        layout={{
                            width: 800,
                            height: 600,
                        }}
                        />

              </div>
                
            </div>
            ): (
            <div class="container">
              <div class="row">
                <h2 class="text-info mt-3">List of {filteredWorker.length} Workers</h2>
                <div class="row">
                  <div class="col-10">
                    <input type="text" class="form-control" value={searchQuery} onChange={handleSearch} placeholder="Search worker..." />
                  </div>
                  <div class="col-2">
                    <div>
                      <select class="form-control text-center btn btn-outline-info" value={statusFilter} onChange={(e) => handleStatusFilter(e.target.value)}>
                        <option value="All">All</option>
                        <option value="Submitted">Reviewing</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>

                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col" >#</th>
                      <th scope="col" onClick={() => handleSort('WorkerID')}>Worker ID  {sortColumn === 'WorkerID' && <span>{sortOrder === 'asc' ? '^' : 'v'}</span>}</th>
                      <th scope="col" onClick={() => handleSort('Count')}>Count  {sortColumn === 'Count' && <span>{sortOrder === 'asc' ? '^' : 'v'}</span>}</th>
                      <th scope="col" onClick={() => handleSort('WorkTimeInSeconds')}>Avg. Time  {sortColumn === 'WorkTimeInSeconds' && <span>{sortOrder === 'asc' ? '^' : 'v'}</span>}</th>
                      <th scope="col" onClick={() => handleSort('value')}>Avg. Value  {sortColumn === 'value' && <span>{sortOrder === 'asc' ? '^' : 'v'}</span>}</th>
                      <th scope="col" onClick={() => handleSort('Approval Rate')}>Approval Rate {sortColumn === 'Approval Rate' && <span>{sortOrder === 'asc' ? '^' : 'v'}</span>}</th>
                      <th scope="col">Approve</th>
                      <th scope="col">Reject</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWorker.map((row) => (
                      <tr key={row.id} style={{ color: getFontColor(row["Approval Rate"]) }}>
                        <td onClick={() => handletableClick(row.WorkerId)}>{row.id}</td>
                        <td onClick={() => handletableClick(row.WorkerId)}>{row.WorkerId}</td>
                        <td onClick={() => handletableClick(row.WorkerId)}>{row.count}</td>
                        <td onClick={() => handletableClick(row.WorkerId)}>{row.WorkTimeInSeconds}</td>
                        <td onClick={() => handletableClick(row.WorkerId)}>{row.value.toFixed(2)}</td>
                        <td onClick={() => handletableClick(row.WorkerId)}>{Math.floor((row["Approved"]/(row["Approved"] + row["Rejected"])*100))} [{row["Approved"]}/{row["Approved"] + row["Rejected"]}]</td>
                        <td>
                          {row.Approved === row.count ? (null) : (<button style={{ width: "70px", height: "15px" }}
                            type="button" class="btn btn-sm btn-success" onClick={() => handleApproveAll(row.WorkerId)}></button>)}
                        </td>
                        <td>
                          {row.Rejected === row.count ? (null) : (<button style={{ width: "70px", height: "15px" }}
                            type="button" class="btn btn-sm btn-danger" onClick={() => handleRejectAll(row.WorkerId)}></button>)}
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
            </div>)}
          </div>
        )}

      </div>

    </>
  );
}

export default ImageGrid;