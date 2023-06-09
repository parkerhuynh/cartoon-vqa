import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'katex/dist/katex.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';
import '../../App.css';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';




function ImageGrid() {
  const [workers, setWorkers] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [numberWoker, SetNumberWoker] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [dimmed, setDimmed] = useState(false);
  const [dangerWorkers, setDangerWorkers] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/get_workers/');
      const responseData = response.data;
      setWorkers(responseData["data"]);
      setSummary(responseData["summary"]);
      setFilteredWorkers(responseData["data"])
      setDangerWorkers(responseData["danger_worker"])
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
    window.open(`/profile/${workerId}`, '_blank');
  };
  const handletableClick = (workerId) => {
    window.open(`/profile/${workerId}`, '_blank');
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    const filtered = workers.filter((worker) =>
      worker.WorkerId.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredWorkers(filtered);
  };
  console.log(workers)
  console.log(filteredWorkers)
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
  const handleRejectAll = (worker_id) => {
    setDimmed(true);
    axios.post('/reject_worker/'+ worker_id)
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
  };
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
  };


  return (
    <>

      <div class="container mt-2">
        <h1 class="text-center m-2"> Workers</h1>
        {loading ? (<p class="text-center"> Loading ...</p>) : (
          <div  className={dimmed ? 'dimmed-screen' : ''}> 
          <div class="container" >
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
              </div>
              <div class="col-6">
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
                  <BarChart data={workers.slice(0, numberWoker)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="WorkerId" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill={themeColor} onClick={handleBarClick} />
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
                  <BarChart data={workers.slice(0, numberWoker)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="WorkerId" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="WorkTimeInSeconds" fill={themeColor} onClick={handleBarClick} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>

            <div class="row">
            <h4 class="px-5">List of Dangerous Workers</h4>
            <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={dangerWorkers}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="WorkerId" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill={themeColor} onClick={handleBarClick} />
                  </BarChart>
                </ResponsiveContainer>
              <h6 class="px-5">People who pose a threat are those who possess the ability to deceive by consistently selecting a single option for all the answers in a series of exercises.</h6>
            </div>
            <div class="row my-5">
              <h2 class="text-info mt-3">List of Workers</h2>
              <input type="text" class="form-control" value={searchQuery} onChange={handleSearch} placeholder="Search worker..." />
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col" >#</th>
                    <th scope="col" onClick={() => handleSort('WorkerID')}>Worker ID  {sortColumn === 'WorkerID' && <span>{sortOrder === 'asc' ? '^' : 'v'}</span>}</th>
                    <th scope="col" onClick={() => handleSort('Count')}>Count  {sortColumn === 'Count' && <span>{sortOrder === 'asc' ? '^' : 'v'}</span>}</th>
                    <th scope="col">Reviewed</th>
                    <th scope="col">Approved</th>
                    <th scope="col">Rejected</th>
                    <th scope="col" onClick={() => handleSort('WorkTimeInSeconds')}>Avg. Time  {sortColumn === 'WorkTimeInSeconds' && <span>{sortOrder === 'asc' ? '^' : 'v'}</span>}</th>
                    
                    <th scope="col" onClick={() => handleSort('Approval Rate')}>Approval Rate {sortColumn === 'Approval Rate' && <span>{sortOrder === 'asc' ? '^' : 'v'}</span>}</th>
                    <th scope="col">Approve</th>
                    <th scope="col">Reject</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWorkers.map((row) => (
                    <tr key={row.id} style={{ color: getFontColor(row["Approval Rate"]) }}>
                      <td  onClick={() => handletableClick(row.WorkerId)}>{row.id}</td>
                      <td  onClick={() => handletableClick(row.WorkerId)}>{row.WorkerId}</td>
                      <td  onClick={() => handletableClick(row.WorkerId)}>{row.count}</td>
                      <td  onClick={() => handletableClick(row.WorkerId)}>{row["Approved"] + row["Rejected"] }</td>
                      <td  onClick={() => handletableClick(row.WorkerId)}>{row["Approved"] }</td>
                      <td  onClick={() => handletableClick(row.WorkerId)}>{row["Rejected"] }</td>
                      <td  onClick={() => handletableClick(row.WorkerId)}>{row.WorkTimeInSeconds}</td>
                      <td  onClick={() => handletableClick(row.WorkerId)}>{row["Approval Rate"]}</td>
                      <td>
                        {row.Approved === row.count ? (null) : (<button style={{ width: "70px", height: "15px" }}
                        type="button" class="btn btn-sm btn-success" onClick={() => handleApproveAll(row.WorkerId)}></button>)}
                      </td>
                      <td>
                        {row.Rejected === row.count  ? (null) : (<button style={{ width: "70px", height: "15px" }}
                        type="button" class="btn btn-sm btn-danger" onClick={() => handleRejectAll(row.WorkerId)}></button>)}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          </div>
          </div>

        )}

      </div>

    </>
  );
}

export default ImageGrid;