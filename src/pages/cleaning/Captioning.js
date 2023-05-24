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
  const [editedCaptions1, setEditedCaptions1] = useState({});
  const [editedCaptions2, setEditedCaptions2] = useState({});
  const [inputValue, setInputValue] = useState('');


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
  const handleCaptionChange1 = async (event, id) => {
    const { value } = event.target;
    await setEditedCaptions1((prevCaptions) => ({
      ...prevCaptions,
      [id]: value,
    }));
    await axios.post('/changeCaption/1/' + id + '/' + event.target.value);
  };
  const handleCaptionChange2 = (event, id) => {
    const { value } = event.target;
    setEditedCaptions2((prevCaptions) => ({
      ...prevCaptions,
      [id]: value,
    }));
  };

  const handleChange = (event) => {
    if (event.target.value != '') {
      const value = event.target.value;
    const intValue = parseInt(value, 10);
    if ((intValue => 1) && (intValue <= totalPages)) {
      console.log(intValue)
      setInputValue(intValue);
    }
    }
    
    
  };

  const handleSubmit = (event) => {
      event.preventDefault();
      handlePageButton(inputValue);
      setInputValue(inputValue)
  };


  const pageButtons = [];
  

  if (currentPage < 7) {
    for (let i = 1; i <= 7; i++) {
      pageButtons.push(
        <button class="btn btn-primary m-2" classkey={i} onClick={() => handlePageButton(i)}>
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
        <button class="btn btn-primary m-2" classkey={i} onClick={() => handlePageButton(i)}>
          {i}
        </button>
      );
    }
  } else if ((currentPage => 7) && (currentPage < totalPages-3)) {
    for (let i = 1; i <= 3; i++) {
      pageButtons.push(
        <button class="btn btn-primary m-2" classkey={i} onClick={() => handlePageButton(i)}>
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
        <button class="btn btn-primary m-2" classkey={i} onClick={() => handlePageButton(i)}>
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
        <button class="btn btn-primary m-2" classkey={i} onClick={() => handlePageButton(i)}>
          {i}
        </button>
      );
    }
  } else {
    for (let i = 1; i <= 3; i++) {
      pageButtons.push(
        <button class="btn btn-primary m-2" classkey={i} onClick={() => handlePageButton(i)}>
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
        <button class="btn btn-primary m-2" classkey={i} onClick={() => handlePageButton(i)}>
          {i}
        </button>
      );
    }

  }
  
  return (
    <>
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
    <div class="container mb-4 text-center">
      <div class="form-group row">
        <div class="col-5"></div>
        <div class="col-2 align-items-center">
        <form onSubmit={handleSubmit}>
          <input class="form-control form-control-sm" type="number" placeholder="Go to Page" onChange={handleChange} />
          <button class="btn btn-primary m-1" type="submit">Submit</button>
        </form>
        </div>
        <div class="col-5"></div>
      </div>
    </div>
    <div class="container">
      <div class="row mt-3">
      <div class="col-sm-1 mt-3">
      </div>
      <div  class="col-sm-10 pt-3">
        <div className='image-grid'>
          {images.map(image =>(
            <div class="card m-2" style={{width: "450px", height:"900px"}}>
              <img key={image.id} class="m-1" src={image.img} alt={"sub_image"}  style={{height:"250px", "border-radius": "6px"}}/>
              <h6 class='text-center'>ID: {image.img_id}</h6>
              <div class="card-body">
                <h5 class="card-title text-center">Captions</h5>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">
                    <textarea 
                    class="form-control"
                    value={editedCaptions1[image.img_id] || image.caption_1}
                    rows="10"
                    onChange={(event) => handleCaptionChange1(event, image.img_id)}
                    ></textarea>
                  </li>
                  <li class="list-group-item">
                    <textarea 
                    class="form-control"
                    value={editedCaptions2[image.img_id] || image.caption_2}
                    rows="10"
                    onChange={(event) => handleCaptionChange2(event, image.img_id)}
                    ></textarea>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
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
    <div class="container mb-4 text-center">
      <div class="form-group row">
        <div class="col-5"></div>
        <div class="col-2 align-items-center">
        <form onSubmit={handleSubmit}>
          <input class="form-control form-control-sm" type="number" placeholder="Go to Page" onChange={handleChange} />
          <button class="btn btn-primary m-1" type="submit">Submit</button>
        </form>
        </div>
        <div class="col-5"></div>
      </div>
    </div>
    </>
  );
}

export default ImageGrid;