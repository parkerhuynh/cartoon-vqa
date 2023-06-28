import React, { useState } from 'react';
import axios from 'axios';
const FileUploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [fileName, setFileName] = useState(null);

  const handleFileChange = (filename, event) => {
    setSelectedFile(event.target.files[0]);
    setFileName(filename);
  };

  const handleBatchDownload = () => {
    axios.get('/download-data/mturk_batch').then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'mturk_batch.csv');
      document.body.appendChild(link);
      link.click();
    });
  };
  const handleDecisionDownload = () => {
    axios.get('/download-data/mturk_decision').then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'mturk_Decision.csv');
      document.body.appendChild(link);
      link.click();
    });
  };

  const handleResultDownload = () => {
    axios.get('/download-data/mturk_result').then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'mturk_result.csv');
      document.body.appendChild(link);
      link.click();
    });
  }; 
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      setLoading(true);
      setUploadStatus(null);
      
      try {
        const response = await fetch('/upload/' + fileName, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          setUploadStatus('success');
        } else {
          setUploadStatus('error');
        }

      } catch (error) {
        setUploadStatus('error');
      }

      setLoading(false);
    }
  };
  const handleBannedWorkerDownload = () => {
    axios.get('/download-data/banned_workers').then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'banned_workers.csv');
      document.body.appendChild(link);
      link.click();
    });
  }; 
  

  return (
    <div class="container">
          <div class="row mt-5">
            <div class="col-4"></div>
            <div class="col-4">
              <h3 class="mb-4">Upload Base Dataset</h3>
                <form onSubmit={handleSubmit}>
                    <input type="file" onChange={e => handleFileChange("data_final.csv", e)}  />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Uploading...' : 'Upload'}
                    </button>
                    {uploadStatus === 'success' && <p>File uploaded successfully!</p>}
                    {uploadStatus === 'error' && <p>Error uploading file.</p>}
                </form>
            </div>
            <div class="col-4"></div>
        </div>
        <div class="row mt-5">
            <div class="col-4"></div>
            <div class="col-4">
              <h3 class="mb-4">Upload MTURK result</h3>
                <form onSubmit={handleSubmit}>
                    <input type="file" onChange={e => handleFileChange("mturk_result.csv", e)}  />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Uploading...' : 'Upload'}
                    </button>
                    {uploadStatus === 'success' && <p>File uploaded successfully!</p>}
                    {uploadStatus === 'error' && <p>Error uploading file.</p>}
                </form>
            </div>
            <div class="col-4"></div>
        </div>
        <div class="row mt-5">
            <div class="col-4"></div>
            <div class="col-4">
              <h3 class="mb-4">Upload MTURK Worker</h3>
                <form onSubmit={handleSubmit}>
                    <input type="file" onChange={e => handleFileChange("mturk_worker.csv", e)}  />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Uploading...' : 'Upload'}
                    </button>
                    {uploadStatus === 'success' && <p>File uploaded successfully!</p>}
                    {uploadStatus === 'error' && <p>Error uploading file.</p>}
                </form>
            </div>
            <div class="col-4"></div>
        </div>
        {/*
        <div class="row mt-5">
            <div class="col-4"></div>
            <div class="col-4">
              <h3 class="mb-4">Download MTURK batch</h3>
              <button type="button" class="btn btn-success" onClick={handleBatchDownload}>Download Mturk Batch</button>
            </div>
            <div class="col-4"></div>
        </div>
        

        <div class="row mt-5">
            <div class="col-4"></div>
            <div class="col-4">
              <h3 class="mb-4">Download MTURK Result</h3>
              <button type="button" class="btn btn-success" onClick={handleResultDownload}>Download Mturk Result</button>
            </div>
            <div class="col-4"></div>
        </div>
        <div class="row mt-5">
            <div class="col-4"></div>
            <div class="col-4">
              <h3 class="mb-4">Download MTURK Decision</h3>
              <button type="button" class="btn btn-success" onClick={handleDecisionDownload}>Download MTURK Decision</button>
            </div>
            <div class="col-4"></div>
        </div>
        <div class="row mt-5">
            <div class="col-4"></div>
            <div class="col-4">
              <h3 class="mb-4">Download Banned Workers</h3>
              <button type="button" class="btn btn-success" onClick={handleBannedWorkerDownload}>Download Banned Workers</button>
            </div>
            <div class="col-4"></div>
        </div>
        */}
    </div>
    
  );
};

export default FileUploadForm;