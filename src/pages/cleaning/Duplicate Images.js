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
  
  const handleDone = async (center_id) => {
    await axios.post('/doneduplicate/' + center_id);
    await axios.get('/duplicate_images/' + inputValue).then(res => {
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
    <div >
      <h5 class="text-center m-2" style={{color: "red"}}>Remove Duplicate Images</h5>
      <div class="container-fluid">
        <div class='row border border-dark border-3' style={{height: "750px"}}>
          <div class='col-4 border-end border-dark border-5' >
            <div>
              <form class="text-center m-2" onSubmit={handleSubmit}>
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => InputChange(e.target.value)}
                />
                <button type="submit" >Submit</button>
              </form>
            </div>
            <div class="m-0" >
              {invalidInput ? (
                <p class="text-center" style={{color: "red"}}>You have entered an invalid value.</p>
              ):(null)}
              {inputGuide ? (
                <div class='text-center'> 
                  <p class="m-0">Please enter a number from 1 to 40 to load the image.</p>
                  <p class="m-0">Eg: if you enter the number 1, you will process the first 1000 images.</p>
                  <p class="m-0">Eg: if you enter the number 2, you will process images from the 1000th to the 2000th.</p>
                </div>
              ):(null)}
              {showParagraphs ? (
                <>
                  {status && CenterImage == 0 ? (
                    <div class="text-center m-1">
                      <p class='m-0'>You have processed all images from {(inputValue -1)*1000}th to {inputValue*1000}th </p>
                      <p class='m-0'>Please enter  a LARGER number.</p>
                    </div>
                  ):(
                    <div>
                      <div class="card text-center mt-5" style={{width: "350px", height:"300px", margin: "0 auto", float: "none"}}>
                        <img class='m-1' key={CenterImage.id} src={CenterImage.img} alt={"image"} style={{width: "480px", height:"360px"}}/>
                        <p class=" m-0">Image ID: {CenterImage.id}</p>
                        <div class="card-body mb-1 p-0">
                          {CenterImage.valid === 2 ? (
                            <button class="btn btn-danger btn-sm"
                            onClick={() => handleCenterInvalidDelete()}> Delete! </button>
                            ):(
                            <button class="btn btn-success btn-sm"
                          onClick={() => handleCenterInvalidRestore()}> Restore! </button>
                          )}
                        </div>
                      </div>
                      <div class='mt-5 mx-3'>
                        <h5>Requirements:</h5>
                        <ul>
                          <li>Double click to delete duplicate Images</li>
                          <li>Click <span style={{color: "red"}}>Delete</span> to delete pictures that are harmful to children such as:</li>
                          <ul>
                            <li>Sexual</li>
                            <li>Violence</li>
                            <li>Guilty</li>
                            <li>Weapons</li>
                          </ul>
                          <li> Click <span style={{color: "Blue"}}>Done! </span> if all the above problem has been solved. Note that you only need to <span style={{color: "red"}}>click once</span> and wait a few seconds for the next image to appear.</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </>
              ):(null)}
            </div>
          </div>
          <div class='col-8'>
            {showParagraphs ? (
              <>
                {status && CenterImage == 0 ? (null
                ):(
                  <div>
                    <div className='image-grid'>
                    {Subimages.map(sub_image => (
                      <div>
                        <div key={sub_image.id}>
                          <div class="card mx-2" style={{width: "350px", height:"300px"}}>
                          <img key={sub_image.id} class="m-1" src={sub_image.img} alt={"sub_image"} style={{width: "480px", height:"360px"}}
                            onDoubleClick={() => handleSubImageDelete(CenterImage.id, sub_image.id)}/>
                          <p class="text-center mb-1 p-0">Image ID: {sub_image.id}</p>
                          <div class="card-body text-center mb-1 p-0">
                          {sub_image.valid === 2 ? (
                            <button class="btn btn-danger btn-sm m-0"
                            onClick={() => handleSubInvalidDelete(sub_image)}> Delete! </button>
                          ):(
                            <button class="btn btn-success btn-sm m-0"
                            onClick={() => handleSubValidRestore(sub_image)}> Restore! </button>
                          )}
                          </div>
                          </div>
                          
                        </div>
                      </div>
                    ))}
                    </div>
                  </div>
                )}
                <div >
                        <div class="text-center mt-5  ">
                            <button class="btn btn-primary btn-sm m-2" 
                              onClick={() => handleDone(CenterImage.id)}> Done! </button>
                        </div>
                      </div>
              </>
                  
                ):(null)
            }
          </div>

        </div>

      </div>
    </div>
    
  );
}

export default App;
