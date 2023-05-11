import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {FormControl, Form} from 'react-bootstrap';
import 'katex/dist/katex.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';

function ImageGrid() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    axios.get('/get_images').then(res => {
      setImages(res.data);
    });
  }, []);


  const handleDelete = id => {
    axios.post('/detele_image/' + id).then(() => {
      setImages(images.filter(image => image.id !== id));
    });
  };

  const handleSubmit = images => {
    const ids = images.map(image => image.id);
    const joinedIds = ids.join('-');
    axios.post('/handleSubmit/' + joinedIds)
    window.location.reload();
    
  };


  const firstImageId = images.length > 0 ? images[0].id : null;

  return (
    <>
      <h1 class="text-center m-4" style={{color: "red"}}>Cleaning Harmful images for Children</h1>
      {images.length === 0 ? (
        <div class="text-center">
          <h3 style={{color: "red"}}>All images were cleaned up!</h3>
          
        </div>
      ):(
        <div>
          <div class="text-center">
          <h3 style={{color: "red"}}> You  have already cleaned up {firstImageId} images</h3>
          </div>
          <div className="image-grid">
          {images.map(image => (
              <div key={image.id} className="image-container">
                <div class="card" style={{width: "620px", height:"380px"}}>
                  <img key={image.id} class="m-2" src={image.img} alt={image.name}
                  onDoubleClick={() => handleDelete(image.id)}/>
                </div>
              </div>
            ))}
          </div>
          <div class="text-center">
            <button class="btn btn-primary btn-lg m-2" 
              onClick={() => handleSubmit(images)}> Submit! </button>
            </div>
          
        </div>
      )}
      
    </>
  );
}

export default ImageGrid;



