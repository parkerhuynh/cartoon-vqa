import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {FormControl, Form} from 'react-bootstrap';
import 'katex/dist/katex.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';

function ImageGrid() {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalImages, setTotalImages] = useState();

  useEffect(() => {
    axios.get('/get_no_images/clean_data').then(res => {
      setTotalImages(res.data)
    });
  }, []);
  
  const imagesPerPage = 20;
  const totalPages = Math.ceil(totalImages/ imagesPerPage);

  useEffect(() => {
    axios.get('/get_clean_images/' + imagesPerPage + "/" + "1").then(res => {
      setImages(res.data);
    });
  }, []);
  
  const handlePageButton = (i) => {
    setCurrentPage(i)
    axios.get('/get_clean_images/' + imagesPerPage + "/" + i).then(res => {
      setImages(res.data)
    })
  }
  const pageButtons = [];
  if (currentPage < 7) {
    for (let i = 1; i <= 7; i++) {
      pageButtons.push(
        <button class="btn btn-danger m-2" classkey={i} onClick={() => handlePageButton(i)}>
          {i}
        </button>
      );
    }
    pageButtons.push(
      <button class="btn  m-2" classkey={totalPages}>
        ...
      </button>)

    for (let i = totalPages-2; i <= totalPages; i++) {
      pageButtons.push(
        <button class="btn btn-danger m-2" classkey={i} onClick={() => handlePageButton(i)}>
          {i}
        </button>
      );
    }
  } else if ((currentPage => 7) && (currentPage < totalPages-3)) {
    for (let i = 1; i <= 3; i++) {
      pageButtons.push(
        <button class="btn btn-danger m-2" classkey={i} onClick={() => handlePageButton(i)}>
          {i}
        </button>
      );
    }
    pageButtons.push(
      <button class="btn  m-2" classkey={totalPages}>
        ...
      </button>)
    
    for (let i = currentPage - 2; i <= currentPage + 2; i++) {
      pageButtons.push(
        <button class="btn btn-danger m-2" classkey={i} onClick={() => handlePageButton(i)}>
          {i}
        </button>
      );
    }
    pageButtons.push(
      <button class="btn  m-2" classkey={totalPages}>
        ...
      </button>)
    for (let i = totalPages-1; i <= totalPages; i++) {
      pageButtons.push(
        <button class="btn btn-danger m-2" classkey={i} onClick={() => handlePageButton(i)}>
          {i}
        </button>
      );
    }
  } else {
    for (let i = 1; i <= 3; i++) {
      pageButtons.push(
        <button class="btn btn-danger m-2" classkey={i} onClick={() => handlePageButton(i)}>
          {i}
        </button>
      );
    }
    pageButtons.push(
      <button class="btn  m-2" classkey={totalPages}>
        ...
      </button>)
    for (let i = totalPages-4; i <= totalPages; i++) {
      pageButtons.push(
        <button class="btn btn-danger m-2" classkey={i} onClick={() => handlePageButton(i)}>
          {i}
        </button>
      );
    }

  } 

  return (
    <>
    <div class="container">
      <div class="row mt-3">
      <div class="col-sm-1 mt-3">
      </div>
      <div  class="col-sm-10 pt-3">
        <div className='image-grid'>
          {images.map(image =>(
            <div class="card m-2" style={{width: "450px", height:"900px"}}>
              <img key={image.id} class="m-1" src={image.img} alt={"sub_image"}  style={{height:"250px", "border-radius": "6px"}}/>
              <h6 class='text-center'>ID: {image.id}</h6>
              <div class="card-body">
                <h5 class="card-title text-center">Captions</h5>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">{image.caption_1}</li>
                  <li class="list-group-item">{image.caption_2}</li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div class="col-sm-1 mt-3"></div>
      </div>
    </div>
    <div class="container mt-3 text-center">
      <div class="row">
        <div class="col-2"></div>
        <div class="col-8">
        <div className="pagination justify-content-center mt-4 mb-4">
        {pageButtons}
      </div>
        </div>
        <div class="col-2"></div>
      </div>
    </div>
    </>
  );
}

export default ImageGrid;