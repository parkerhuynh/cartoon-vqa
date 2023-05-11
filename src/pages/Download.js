import React from 'react';
import axios from 'axios';

function DownloadButton() {
  const handleDownload = () => {
    axios.get('/download-data').then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'data.csv');
      document.body.appendChild(link);
      link.click();
    });
  };

  return (
    <div className='container'>
      <button type="button" class="btn btn-success" onClick={handleDownload}>Download Data</button>
    </div>
    
  );
}

export default DownloadButton;