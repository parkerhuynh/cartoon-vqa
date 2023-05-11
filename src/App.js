import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {FormControl, Form} from 'react-bootstrap';
import 'katex/dist/katex.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

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
  const handleDone = id => {
    axios.post('/imageDone/' + id).then(() => {
      setImages(images.filter(image => image.id !== id));
    });
  };

  const handleSubmit = images => {
    const ids = images.map(image => image.id);
    const joinedIds = ids.join('-');
    axios.post('/handleSubmit/' + joinedIds)
    window.location.reload();
    
  };

  const handleCaptionChange = (id, newCaption) => {
    const updatedImages = images.map((image) => {
      if (image.id === id) {
        return {
          ...image,
          caption: newCaption,
        };
      }
      return image;
    });
    setImages(updatedImages);

    // update caption in database
    axios.post('/changeCaption/' + id + '/' + newCaption)
  };
  const firstImageId = images.length > 0 ? images[0].id : null;

  return (
    <>
      <div class="header p-5">
        <h1>CARTOON-VQA</h1>
      </div>
      <div class="text-center">
      
        <h3> You  have already cleaned up {firstImageId} images</h3>
      </div>
      <div className="image-grid">
        {images.map(image => (
          <div key={image.id} className="image-container">
            <div class="card" style={{width: "620px", height:"550px"}}>
              <img key={image.id} class="m-2" src={image.img} alt={image.name}
              onDoubleClick={() => handleDelete(image.id)}/>
              <div class="card-body text-justify">
                <h5 class="card-title text-center">
                <div class="btn-group">
                <button class="btn btn-danger btn-lg m-2" 
                onClick={() => handleDelete(image.id)}> Bad! </button>

                </div>
                </h5>
                <p>{image.caption}</p>
                {/*
                  <Form.Control
                    as="textarea"
                    value={image.caption}
                    onChange={(e) => handleCaptionChange(image.id, e.target.value)}
                    rows="11"
                  />
                */}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div class="text-center">
        <button class="btn btn-primary btn-lg m-2" 
        onClick={() => handleSubmit(images)}> Submit! </button>
      </div>
      
    </>
  );
}

export default ImageGrid;