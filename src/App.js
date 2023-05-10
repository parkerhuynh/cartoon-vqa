import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {FormControl, Form} from 'react-bootstrap';
import 'katex/dist/katex.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function ImageGrid() {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const imagesPerPage = 80;
  const totalPages = Math.ceil(images.length / imagesPerPage);

  useEffect(() => {
    axios.get('/get_images').then(res => {
      console.log(res)
      setImages(res.data);
    });
  }, []);

  const startIndex = (currentPage - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;

  const currentImages = images.slice(startIndex, endIndex);
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

  const pageButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    pageButtons.push(
      <button class="btn btn-danger m-2" classkey={i} onClick={() => setCurrentPage(i)}>
        {i}
      </button>
    );
  }

  return (
    <>
      <div class="header">
        <h1>Header</h1>
        <p>My supercool header</p>
      </div>

      <div className="image-grid">
        {currentImages.map(image => (
          <div key={image.id} className="image-container">
            <div class="card" style={{width: "620px", height:"450px"}}>
              <img key={image.id} class="m-2" src={image.img} alt={image.name}/>
              <div class="card-body text-justify">
                <h5 class="card-title text-center">
                <div class="btn-group">
                <button class="btn btn-danger m-2" 
                onClick={() => handleDelete(image.id)}> Bad! </button>
                <button class="btn btn-primary m-2"
                onClick={() => handleDone(image.id)}> Good! </button>
                </div>
                </h5>
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
      <div className="pagination justify-content-center mt-4 mb-4">
        {pageButtons}
      </div>
    </>
  );
}

export default ImageGrid;