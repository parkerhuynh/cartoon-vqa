import * as React from "react";
import axios from 'axios';
import {FormControl, Form} from 'react-bootstrap';
import 'katex/dist/katex.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';

const IFrame = ({ url }) => {
    const [iFrameLoaded, setIFrameLoaded] = React.useState(false);
    const divBoxRef = React.useRef(null);
    const resizeIframe = (iframe) => {
        const { documentElement } = iframe.contentWindow.document;
        const height = documentElement.scrollHeight;
        iframe.style.height = '2500px';
        iframe.style.width = '100%';
        
    };
    const JupyterNotebookDownload = () => {

      fetch('/download-data/jn-preprocessing', { method: 'GET' })
        .then(response => response.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'preprocessing.ipynb');
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    };

    const dataframeDownload = () => {
      fetch('/download-data/raw_data', { method: 'GET' })
        .then(response => response.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'raw_data.csv');
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    };
    
    return (
      <>
      <div class='container'>
        <div class="row">
          <div class='col-4'></div>
          <div class='col-2 mt-2'>
            <button type="button" class="btn btn-sm btn-success" onClick={JupyterNotebookDownload}>Download Jupyter Notebook</button>
            </div>
          <div class='col-2 mt-2'>
          <button type="button" class="btn btn-sm btn-success" onClick={dataframeDownload}>Download Raw Data</button>
          </div>
          <div class='col-4'></div>
        </div>
      </div>
      <div ref={divBoxRef} class="container">
        <div class="row">
            <div class="col-1"></div>
            <div class="col-10">
            {!iFrameLoaded && (
                <span className="inline-block">loading notebook ...</span>
                )}
                <iframe
                onLoad={(e) => {
                    setIFrameLoaded(true);
                    resizeIframe(e.target);
                }}
                title="static_html"
                src={"./Raw_Data_Preprocessing.html"}
                ></iframe>
            </div>
            <div class="col-1"></div>
        </div>
        
      </div>
      </>
      
    );
  };
  export default IFrame;