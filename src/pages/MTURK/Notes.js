import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
const InputForm = () => {
  const [inputGood, setInputGood] = useState('');
  const [inputBad, setInputBad] = useState('');
  const [dimmed, setDimmed] = useState(false);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setDimmed(true)
      const response = await axios.get('/save_notes/load/none/none');
      const responseData = response.data;
      setWorkers(responseData);
      console.log(workers)
      setLoading(false);
      setDimmed(false)
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
      setDimmed(false)
      
    }
  };
  const handleadd = async  (worker_id, status) => {
    setDimmed(true)
    const response = await axios.post('/save_notes/add/' + worker_id + "/" + status );
    setDimmed(false)

  };
  const handleremove = async  (worker_id, status) => {
    setDimmed(true)
    const response = await axios.post('/save_notes/remove/' + worker_id + "/none"  );
    const updatedData = workers.map(item => {
      if (item.worker_id === worker_id) {
          return {
              ...item,
              status: 'remove',
          };
      }
      return item;
    
    });
    setWorkers(updatedData)
    setDimmed(false)
  };

  const handleGoodSubmit = (event) => {
    setDimmed(true)
    event.preventDefault();

    // Send the inputValue to the backend and save it to the database
    // You'll need to implement the backend integration separately
    handleadd(inputGood, "good")
    console.log(workers)
    
    const newItem = {status: 'good', worker_id: inputGood}
    const isExisting = Object.values(workers).some(item => (
      item.status === newItem.status && item.worker_id === newItem.worker_id
    ));
    if (isExisting) {
      console.log("existing")
    } else {
      const updatedata = workers.push(newItem)
      setInputGood(''); // Clear the input field after submitting
      setDimmed(false)
    }
    
  };

  const handleGoodChange = (event) => {
    setInputGood(event.target.value);
  };
  const handleBadSubmit = (event) => {
    setDimmed(true)
    event.preventDefault();
    handleadd(inputBad, "bad")
    const item = {status: 'bad', worker_id: inputBad}
    const updatedata = workers.push(item)
    

    // Send the inputValue to the backend and save it to the database
    // You'll need to implement the backend integration separately
    setInputBad(''); // Clear the input field after submitting
    setDimmed(false)
  };

  const handleBadChange = (event) => {
    setInputBad(event.target.value);
  };

  const filteredGoodWorker = workers.filter(item => item.status === 'good');
  const filteredBadWorker = workers.filter(item => item.status === 'bad');

  return (
    <div class="container">
      <div class="row mt-2 ">
        <div class="col-1"></div>
        <div class="col-5 px-5">
          <div class="row">
            <form onSubmit={handleGoodSubmit}>
              <div class="row">
                <input type="text" class="form-control mb-2 is-valid" value={inputGood} onChange={handleGoodChange} placeholder="enter GOOD worker..." />
                <button type="submit" class="btn-sm btn btn-success mb-2">Submit</button>
              </div>
            </form>
          </div>
          {loading ? (null) : (
            <div class="row" className={dimmed ? 'dimmed-screen' : ''}>
              <table className="table">
                <thead>
                  <tr>
                    <th>id</th>
                    <th>Worker ID</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(filteredGoodWorker).map(([key, row]) => (
                    <tr key={key}>
                      <td>{parseInt(key) +1}</td>
                      <td ><Link to={`/profile/${row.worker_id}`} style={{ textDecoration: 'inherit' }} >{row.worker_id}</Link></td>
                      <td style={{width:"20px"}}><button class="close-button" onClick={() => handleremove(row.worker_id)}> &times; </button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>


          )}


        </div>

        <div class="col-5 px-5">
          <div class="row">
            <form onSubmit={handleBadSubmit}>
              <div class="row">
                <input type="text" class="form-control mb-2 is-invalid" value={inputBad} onChange={handleBadChange} placeholder="Enter BAD worker..." />
                <button type="submit" class="btn-sm btn btn-danger mb-2">Submit</button>
              </div>
            </form>
          </div>
          {loading ? (null) : (

            <div class="row" className={dimmed ? 'dimmed-screen' : ''}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Worker ID</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(filteredBadWorker).map(([key, row]) => (
                    <tr key={key}>
                      <td>{parseInt(key) +1}</td>
                      
                      <td ><Link to={`/profile/${row.worker_id}`} style={{ textDecoration: 'inherit' }} >{row.worker_id}</Link></td>
                      <td style={{width:"20px"}}><button class="close-button" onClick={() => handleremove(row.worker_id)} > &times; </button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          )}


        </div>
        <div class="col-1"></div>
      </div>


    </div>

  );
};

export default InputForm;