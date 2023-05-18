import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {FormControl, Form} from 'react-bootstrap';
import 'katex/dist/katex.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [showParagraphs, setShowParagraphs] = useState(false);
  const [Subimages, setSubImages] = useState([]);
  const [CenterImage, setCenterImage] = useState([]);
  const [status, setStatus] = useState(true);
  const [inputGuide, setInputGuide] = useState(true);
  const [invalidInput, setInvalidInput] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus(true)
    setInputGuide(false)
    const number = parseInt(inputValue, 10);
    
    if (number >= 1 && number <= 40) {
      
      axios.get('/duplicate_images/' + number).then(res => {
        setShowParagraphs(true)
        if ( res.data != "None" ) {
          setSubImages(res.data.sub_imgs);
          setCenterImage(res.data.center_image);
          
          
        } else {
          setSubImages([]);
          setCenterImage([]);
        }
        
      })

    } else {
      setInvalidInput(true)
      setInputGuide(true)
      setShowParagraphs(false);
    }
  };

  const handleCenterInvalidDelete = () => {
    const updatedImage = { ...CenterImage, valid: 0 };
    axios.post('/detele_image/' + CenterImage.id)
    setCenterImage(updatedImage);
  }
  const handleCenterInvalidRestore = () => {
    axios.post('/restore_image/' + CenterImage.id)
    const updatedImage = { ...CenterImage, valid: 2 };
    setCenterImage(updatedImage);
  }

  const handleSubInvalidDelete = sub_image => {
    axios.post('/detele_image/' + sub_image.id).then(() => {
      setSubImages(prevSubImages => prevSubImages.map(image => {
        if (image.id === sub_image.id) {
          return {
            ...image,
            valid: 0
          };
        }
        return image;
      }));
    });
  };
  const handleSubValidRestore = sub_image => {
    axios.post('/restore_image/' + sub_image.id).then(() => {
      setSubImages(prevSubImages => prevSubImages.map(image => {
        if (image.id === sub_image.id) {
          return {
            ...image,
            valid: 2
          };
        }
        return image;
      }));
    });
  };
  

  const handleSubImageDelete = (center_id, sub_id) => {
    setSubImages(Subimages.filter(sub_image => sub_image.id !== sub_id))
    axios.post('/deleteSubDuplicateImages/' +center_id + "/"+ sub_id)
    };
  
  const handleDone = (center_id) => {
    axios.post('/doneduplicate/' + center_id);
    axios.get('/duplicate_images/' + inputValue).then(res => {
      console.log(res.data)
      setSubImages(res.data.sub_imgs);
      setCenterImage(res.data.center_image);
    })
    };
  const InputChange = (value) => {
      setInputValue(value)
      setStatus(false)
      setShowParagraphs(false)
      setInputGuide(true)
      setInvalidInput(false)
    };
  return (
    <div>
      <div>
      <h1 class="text-center m-4" style={{color: "red"}}>Remove Duplicate Images</h1>
      <form class="text-center m-4" onSubmit={handleSubmit}>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => InputChange(e.target.value)}
        />
        <button type="submit" >Submit</button>
      </form>
      </div>
  

      <div>
        {showParagraphs ? (
          <>

          {status && CenterImage == 0 ? (
            // Render the image gallery when there are images
            <div class="text-center m-4">
              <h5 style={{color: "red"}}>You have processed all images from {(inputValue -1)*1000}th to {inputValue*1000}th </h5>
              <h5 style={{color: "red"}}>Please enter  a LARGER number.</h5>
            </div>
          ) : (
            // Render a message when there are no images
            <div class="container-fluid">
              <div class="card" style={{width: "500px", height:"410px", margin: "0 auto", float: "none"}}>
                <img class='m-1' key={CenterImage.id} src={CenterImage.img} alt={"image"} style={{width: "480px", height:"360px"}}/>.
                <p class="text-center">Image ID: {CenterImage.id}</p>
                <div class="card-body text-center">
                  {CenterImage.valid === 2 ? (
                    <button class="btn btn-danger"
                    onClick={() => handleCenterInvalidDelete()}> Delete! </button>
                    ):(
                    <button class="btn btn-success"
                  onClick={() => handleCenterInvalidRestore()}> Restore! </button>
                )}
                </div> 
              </div>
              <div class="container-fluid mt-3">
                <div class="row">
                  <div class="col-sm-1"></div>
                  <div class="col-sm-10">
                    <div className='image-grid'>
                    {Subimages.map(sub_image => (
                      <div>
                        <div key={sub_image.id}>
                          <div class="card mx-2" style={{width: "500px", height:"380px"}}>
                          <img key={sub_image.id} class="m-1" src={sub_image.img} alt={"sub_image"} style={{width: "480px", height:"360px"}}
                            onDoubleClick={() => handleSubImageDelete(CenterImage.id, sub_image.id)}/>
                          <p class="text-center">Image ID: {sub_image.id}</p>
                          </div>
                          <div class="card-body text-center">
                          {sub_image.valid === 2 ? (
                            <button class="btn btn-danger btn-lg m-2"
                            onClick={() => handleSubInvalidDelete(sub_image)}> Delete! </button>
                          ):(
                            <button class="btn btn-success btn-lg m-2"
                            onClick={() => handleSubValidRestore(sub_image)}> Restore! </button>
                          )}
                          </div>
                        </div>
                      </div>
                    ))}
                    </div>
                  </div>
                <div class="col-sm-1"></div>
              </div>
              </div>
            <div >
              <div class="text-center mt-5  ">
                  <button class="btn btn-primary btn-lg m-2" 
                    onClick={() => handleDone(CenterImage.id)}> Done! </button>
              </div>
            </div>
          </div>
        )} 
          </>
        ) : (null)}
        
      </div>
      {invalidInput ? (
          <div class="text-center m-4" style={{color: "red"}}> 
            <h5>You have entered an invalid value.</h5>
          </div>
        ):(null)}
        {inputGuide ? (
          <div class="text-center m-4" style={{color: "red"}}> 
            <h5>Please enter a number from 1 to 40 to load the image.</h5>
            <h5>Eg: if you enter the number 1, you will process the first 1000 images.</h5>
            <h5>Eg: if you enter the number 2, you will process images from the 1000th to the 2000th.</h5>
          </div>
        ):(null)}
    </div>
    
  );
}

export default App;
