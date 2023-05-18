import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {FormControl, Form} from 'react-bootstrap';
import 'katex/dist/katex.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';

function App() {
  const [images, setImages] = useState([]);
  const [process, setProcess] = useState(true);
  
  useEffect(() => {
    axios.get('/image_captioning').then(res => {
      setImages(res.data);
    });
  }, []);
  
  const processButton = () => {
    setProcess(true)
    window.location.reload();
  }
  const viewButtom = () => {
    setProcess(false)
    axios.get('/view_caption').then(res => {
      setImages(res.data);
    });
  }
  const handleCaptionChange = (img_id, text) => {
    if (text == "") {
      axios.post('/changeCaption/'+ img_id + "/" + "none")
    } else {
    axios.post('/changeCaption/'+ img_id + "/" + text)
  }};
  const handleRefresh = () => {
    window.location.reload();
  };
  return (
    <>
    <div class="container-fluid">
      <div class='row'>
        <div class='col-1'></div>
        <div class='col-10'><h1 class="text-center m-2" style={{color: "red"}}>Image Caption Processing</h1></div>
        <div class='col-1' >
          <div class="btn-group btn-group-sm mt-4 " role="group" aria-label="Basic example">
            <button type="button" class="btn btn-dark"
            onClick={() => processButton()}>Process</button>
            <button type="button" class="btn btn-dark"
            onClick={() => viewButtom()}>View</button>
          </div>
        </div>
      </div>
    </div>
    
    {process ? (
      <div class="container-fluid">
      <div className='image-grid'>
      {images.map(image => (
        <div class='col-4 p-2'>
          <div class='card'>
          <img class="card-img-top" src={image.img} alt="Image 2"/>
          <p class='text-center'>ID: {image.id}</p>
          <div class="card-body">
            <h5 class="card-title">Captions</h5>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">{image.caption_1}</li>
              <li class="list-group-item">{image.caption_2}</li>
              <li class="list-group-item">
                <div class="form-group">
                    <label for="exampleFormControlTextarea1">Fix Caption</label>
                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="7"
                    value ={image.caption}
                    onChange={(event) => handleCaptionChange(image.id, event.target.value)}></textarea>
                  </div>
                </li>
            </ul>
          </div>
        </div>  
        </div>
      ))}
      </div>
      <div >
        <div class="text-center mt-5  ">
          <button class="btn btn-primary btn-sm m-2" 
            onClick={() => handleRefresh()}> Done! </button>
        </div>
      </div>
    </div>
    ): (
      <div class="container-fluid">
        <div className='image-grid'>
        {images.map(image => (
          <div class='col-4 p-2'>
            <div class='card'>
            <img class="card-img-top" src={image.img} alt="Image 2"/>
            <p class='text-center'>ID: {image.id}</p>
            <div class="card-body">
              <h5 class="card-title">Captions</h5>
              <ul class="list-group list-group-flush">
                <li class="list-group-item">{image.caption_1}</li>
                <li class="list-group-item">{image.caption_2}</li>
                <li class="list-group-item">{image.caption}</li>
              </ul>
            </div>
          </div>  
          </div>
        ))}
        </div>
      </div>
    )}
    </>
  );
}

export default App;

