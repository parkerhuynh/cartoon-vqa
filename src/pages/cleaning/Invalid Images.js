import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {FormControl, Form} from 'react-bootstrap';
import 'katex/dist/katex.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';

function ImageGrid() {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const imagesPerPage = 100;
  const totalPages = Math.ceil(images.length / imagesPerPage);

  useEffect(() => {
    axios.get('/harmful_images').then(res => {
      console.log(res)
      setImages(res.data);
    });
  }, []);

  const startIndex = (currentPage - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;

  const currentImages = images.slice(startIndex, endIndex);
  const handleRestore = id => {
    axios.post('/restore_image/' + id).then(() => {
      setImages(images.filter(image => image.id !== id));
    });
  };


  const pageButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    pageButtons.push(
      <button class="btn btn-success m-2" classkey={i} onClick={() => setCurrentPage(i)}>
        {i}
      </button>
    );
  }

  return (
    <>
      <h1 class="text-center m-4" style={{color: "red"}}>Identified Invalid Images</h1>
      <div className="image-grid">
        {currentImages.map(image => (
          <div key={image.id} className="image-container">
            <div class="card" style={{width: "620px", height:"450px"}}>
              <img key={image.id} class="m-2" src={image.img} alt={image.name}/>
              <div class="card-body text-justify">
                <h5 class="card-title text-center">
                <div class="btn-group">
                <button class="btn btn-success m-2" 
                onClick={() => handleRestore(image.id)}> Restore </button>
                </div>
                </h5>
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