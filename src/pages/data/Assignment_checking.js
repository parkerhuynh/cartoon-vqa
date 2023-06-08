import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'katex/dist/katex.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';
import '../../App.css';

function ImageGrid() {
  const [images, setImages] = useState([]);
  

  useEffect(() => {
    axios.get('/get_assigment/').then(res => {
      setImages(res.data);
      console.log(res.data)
    });
  }, []);
  


  const handlRejecteChange = (worker_id, assignment_id) => {
    axios.get('/delete_assigment/' + worker_id + '/' + assignment_id).then(res => {
      setImages(res.data);})
  };

  const handlApprovelChange = (worker_id, assignment_id) => {
    axios.get('/approve_assigment/' + worker_id + '/' + assignment_id).then(res => {
      setImages(res.data);})
  };


  return (
    <>
      <div class="container">
        <div class="row">
          <div class="col-5"></div>
          <div class="col-1">
          <button class="btn btn-danger mt-3 text-center"
          onClick={() => handlRejecteChange(images[0].worker_id, images[0].assignment_id)}>Reject!   </button>
          </div>
          <div class="col-1">
          <button class="btn btn-success mt-3 text-center"
          onClick={() => handlApprovelChange(images[0].worker_id, images[0].assignment_id)}>Approve!</button>
          </div>
          <div class="col-5"></div>
        
      </div>
      </div>
      <div class="container">
        <div class="row mt-3">
          <div className='image-grid'>
            {images.map(image => (
              <div class = "col-3 p-2">
                <div class="card h-100">
                  <img key={image.id} class="m-1" src={image.img_path} alt={"sub_image"}  style={{height:"250px", "border-radius": "6px"}}/>
                  <h6 class='text-center'>ID: {image.id}</h6>
                  <h6 class='text-center'>Worker ID:</h6>
                  <h6 class='text-center text-danger'>{image.worker_id}</h6>
                  <h6 class='text-center'>Assignment ID:</h6>
                  <h6 class='text-center text-danger'>{image.assignment_id}</h6>
                  <h6 class='text-center'>Image:</h6>
                  <h6 class='text-center text-danger'>{image.img_path}</h6>
                  <div class="card-body">
                    <p>Question: {image.question}</p>
                    <p>Answer: {image.answer}</p>
                    {image.incorrect==1 ? (<div class="text-center text-danger"><b>Incorrect</b></div>):(null)}
                    {image.partially_incorrect==1 ? (<div class="text-center text-danger"><b>Partially Incorrect</b></div>):(null)}
                    {image.ambiguous==1 ? (<div class="text-center text-danger"><b>Ambiguous</b></div>):(null)}
                    {image.partially_correct==1 ? (<div class="text-center text-success"><b>Partially Correct</b></div>):(null)}
                    {image.correct==1 ? (<div class="text-center text-success"><b>Correct</b></div>):(null)}
                  </div>
                </div>
              </div>
            )) }
          </div>
        </div>
      </div>
    </>
  );
}

export default ImageGrid;