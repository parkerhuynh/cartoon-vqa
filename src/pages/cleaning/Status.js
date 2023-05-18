import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {FormControl, Form} from 'react-bootstrap';
import 'katex/dist/katex.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';

function App() {
  const [status, setStatus] = useState({});
  
  useEffect(() => {
    axios.get('/status').then(res => {
      setStatus(res.data);
    });
  }, []);



  return (
    <>
    <h1 class="text-center m-4" style={{color: "red"}}>Data Analysis</h1>
    <div className='container'>
    
    <div class="p-5">
    <h2>There are totally {status.Total} images</h2>
    <ul>
        <li>{status.valid} valid images.</li>
        <li>{status.invalid} invalid images.</li>
        <li>{status.duplicate} duplicate images.</li>
        <li>{status.rest} images left to be processed.</li>
      </ul>
    </div>
    </div>
    </>
  );
}

export default App;