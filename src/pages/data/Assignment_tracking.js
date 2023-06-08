import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'katex/dist/katex.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';
import '../../App.css';

function ImageGrid() {
  const [banAssgnments, setBanAssgnmentList] = useState([]);
  const [approvalAssgnments, setApprovalAssgnmentList] = useState([]);
  

  useEffect(() => {
    axios.get('/ban_list_assignments/').then(res => {
      setBanAssgnmentList(res.data);
    });
  }, []);
  useEffect(() => {
    axios.get('/approval_list_assignments/').then(res => {
      setApprovalAssgnmentList(res.data);
    });
  }, []);
  return (
    <>
      <div class="container mt-2">
        <div class="row">
          <div class="col-1"></div>
          <div class="col-4">
          <div class="card">
            <div class="card-header text-danger text-center"><h4>Ban list</h4></div>
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Worker ID</th>
                    <th scope="col">Assignment ID</th>
                  </tr>
                </thead>
                <tbody>
                    {banAssgnments.map(
                      banAssgnment => (
                        <tr>
                          <th scope="row">{banAssgnment.id}</th>
                          <td>{banAssgnment.worker_id}</td>
                          <td>{banAssgnment.count}</td>
                        </tr>

                      )
                    )}
                </tbody>
              </table>
            </div>
          </div>
          <div class="col-1"></div>
          <div class="col-1"></div>
          <div class="col-4">
            <div class="card">
              <div class="card-header text-success text-center"><h4>Approval list</h4></div>
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Worker ID</th>
                    <th scope="col">Assignment ID</th>
                  </tr>
                </thead>
                <tbody>
                    {approvalAssgnments.map(
                      banAssgnment => (
                        <tr>
                          <th scope="row">{banAssgnment.id}</th>
                          <td>{banAssgnment.worker_id}</td>
                          <td>{banAssgnment.count}</td>
                        </tr>

                      )
                    )}
                </tbody>
              </table>

              </div>
            </div>
          <div class="col-1"></div>
        </div>
      </div>
      
    </>
  );
}

export default ImageGrid;