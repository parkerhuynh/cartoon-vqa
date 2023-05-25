import * as React from "react";

const IFrame = ({ url }) => {
    const [iFrameLoaded, setIFrameLoaded] = React.useState(false);
    const divBoxRef = React.useRef(null);
    const resizeIframe = (iframe) => {
        const { documentElement } = iframe.contentWindow.document;
        const height = documentElement.scrollHeight;
        iframe.style.height = '5000px';
        iframe.style.width = '100%';
        
    };
    return (
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
                src={"./Prompt.html"}
                ></iframe>
            </div>
            <div class="col-1"></div>
        </div>
        
      </div>
    );
  };
  export default IFrame;