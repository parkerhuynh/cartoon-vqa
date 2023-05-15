import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {FormControl, Form} from 'react-bootstrap';
import 'katex/dist/katex.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';

function ImageGrid() {
  const [Subimages, setSubImages] = useState([]);
  const [CenterImage, setCenterImage] = useState([]);


  useEffect(() => {
    axios.get('/duplicate_images').then(res => {
      console.log(res.data)
      setSubImages(res.data.sub_imgs);
      setCenterImage(res.data.center_image);
    });
  }, []);

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
    console.log(sub_id)
    axios.post('/deleteSubDuplicateImages/' +center_id + "/"+ sub_id)
    };
  
  const handleDone = (center_id) => {
    axios.post('/doneduplicate/' + center_id)
    window.location.reload();
    };


  
  return (
    <>
      <h1 class="text-center m-4" style={{color: "red"}}>Remove Duplicate Images</h1>
      <div class="card" style={{width: "600px", height:"550px", margin: "0 auto", float: "none", "margin-bottom": "10px"}}>
          <img style={{width: "450x", height:"490px"}} key={CenterImage.id} class="m-2" src={CenterImage.img} alt={"sub_image"}/>.
          <div class="card-body text-center">
          {CenterImage.valid === 2 ? (
            <button class="btn btn-danger btn-lg m-2"
            onClick={() => handleCenterInvalidDelete()}> Delete! </button>
          ):(
            <button class="btn btn-success btn-lg m-2"
            onClick={() => handleCenterInvalidRestore()}> Restore! </button>
          )}
            <h3 class="card-title text-center" >Task</h3>
            <p class="card-text" style={{color: "red"}}>Double click to delete photos similar to the one above.</p>
        </div> 
      </div>
      <div className="image-grid">
        {Subimages.map(sub_image => (
          <div>
            <div key={sub_image.id} className="image-container">
              <div class="card" style={{width: "500px", height:"380px"}}>
              <img key={sub_image.id} class="m-2" src={sub_image.img} alt={"sub_image"} style={{width: "450px", height:"360px"}}
                onDoubleClick={() => handleSubImageDelete(CenterImage.id, sub_image.id)}/>
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
      <div class="text-center">
          <button class="btn btn-primary btn-lg m-2" 
            onClick={() => handleDone(CenterImage.id)}> Done! </button>
      </div>
    </>
  );
}

export default ImageGrid;