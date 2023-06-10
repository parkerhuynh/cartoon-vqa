import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'katex/dist/katex.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';
import '../../App.css';


function WorkerProfile() {
    const { assignment_id } = useParams();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dimmed, setDimmed] = useState(false);
    useEffect(() => {
        fetchData();
    }, []);
    
    const fetchData = async () => {
        try {
            const response = await axios.get('/get_assignment/' + assignment_id);
            const responseData = response.data;
            console.log(responseData)
            setImages(responseData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };
    const handleTripleClick = (tripleId) => {
        window.open(`/triple/${tripleId}`, '_blank')
      };
    
      const handleRejectClick  = (assignemtId, worker_id) => {
        setDimmed(true);
        axios.post('/reject_assignment/' + assignemtId)
        .then(() => {
            console.log("Done!")
        })
        .finally(() => {
            window.location.href = `/profile/${worker_id}`
        })

    };
    const handleApproveClick  = (assignemtId, worker_id) => {
        setDimmed(true);
        axios.post('/approve_assignment/' + assignemtId)
        .then(() => {
            console.log("Done!")
        })
        .finally(() => {
            window.location.href = `/profile/${worker_id}`
        })
    };
    return (
        <>
        <h3 class="text-center text-danger mt-3">Assignment Review</h3>
        {loading ? (<p class="text-center"> Loading ...</p>) : (
            
            <div class="container" className={dimmed ? 'dimmed-screen' : ''}>
                <h1 class="text-center text-info mt-3">{assignment_id}</h1>
                <div class="row mt-5">
                    <div class="col-4"></div>
                    <div class="col-2">
                        <button style={{width: "130px", height:"35px"}} type="button" 
                        class="btn btn-sm btn-success" onClick={() => handleApproveClick(assignment_id, images[0].worker_id)}>Approve</button>
                    </div>
                    <div class="col-2">
                        <button style={{width: "130px", height:"35px"}} type="button" 
                        class="btn btn-sm btn-danger" onClick={() => handleRejectClick(assignment_id, images[0].worker_id)} >Reject</button>
                    </div>
                    <div class="col-4"></div>
                </div>
                
                <div class="row mt-3">
                    <div className='image-grid'>
                    {images.map(image => (
                        <div class = "col-3 p-2">
                            <div class="card h-100"  onClick={() => handleTripleClick(image.id)}>
                            <img key={image.id} class="m-1" src={image["Img path"]} alt={"sub_image"}  style={{height:"250px", "border-radius": "6px"}}/>
                            <h6 class='text-center'>ID: {image.id}</h6>
                            {/*
                            <h6 class='text-center'>ID: {image.id}</h6>
                            <h6 class='text-center'>Worker ID:</h6>
                            <h6 class='text-center text-danger'>{image.worker_id}</h6>
                            <h6 class='text-center'>Assignment ID:</h6>
                            <h6 class='text-center text-danger'>{image.assignment_id}</h6>
                            <h6 class='text-center'>Image:</h6>
                            <h6 class='text-center text-danger'>{image["Img path"]}</h6>
                            */}
                            <div class="card-body">
                                <p>Question: {image.Question}</p>
                                <p>Answer: {image.Answer}</p>
                                {image.incorrect==1 ? (<div class="text-center text-danger"><b>Incorrect</b></div>):(null)}
                                {image.partially_incorrect==1 ? (<div class="text-center text-danger"><b>Partially Incorrect</b></div>):(null)}
                                {image.ambiguous==1 ? (<div class="text-center text-danger"><b>Ambiguous</b></div>):(null)}
                                {image.partially_correct==1 ? (<div class="text-center text-success"><b>Partially Correct</b></div>):(null)}
                                {image.correct==1 ? (<div class="text-center text-success"><b>Correct</b></div>):(null)}
                            </div>
                            </div>
                        </div>
                        )) }
                    </div>

                </div>
                <div class="row mt-5">
                    <div class="col-4"></div>
                    <div class="col-2">
                        <button style={{width: "130px", height:"35px"}} type="button" 
                        class="btn btn-sm btn-success" onClick={() => handleApproveClick(assignment_id, images[0].worker_id)}>Approve</button>
                    </div>
                    <div class="col-2">
                        <button style={{width: "130px", height:"35px"}} type="button" 
                        class="btn btn-sm btn-danger" onClick={() => handleRejectClick(assignment_id, images[0].worker_id)} >Reject</button>
                    </div>
                    <div class="col-4"></div>
                </div>
            
            </div>
        )}
        </>
        
        
    );
};
export default WorkerProfile;