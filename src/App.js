import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Download from "./pages/Download";
import CleanProcess from"./pages/cleaning/Cleaning Process";
import InvalidImages from"./pages/cleaning/Invalid Images";
import ValidImages from"./pages/cleaning/Valid Images";
import DupImages from"./pages/cleaning/Duplicate Images";
import Status from"./pages/cleaning/Status";
import Captioning from"./pages/cleaning/Captioning";
import Data from"./pages/data/Data";
import Analysis1 from"./pages/data/Analysis1";
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/js/dist/dropdown';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="download" element={<Download />} />
          <Route path="cleaningprocess" element={<CleanProcess />} />
          <Route path="invalidimages" element={<InvalidImages />} />
          <Route path="validimages" element={<ValidImages />} />
          <Route path="dupimages" element={<DupImages />} />
          <Route path="status" element={<Status />} />
          <Route path="captioning" element={<Captioning />} />
          <Route path="data" element={<Data />} />
          <Route path="analysis1" element={<Analysis1 />} />
          {/*
          <Route path="qa" element={<QA />} />
          */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
