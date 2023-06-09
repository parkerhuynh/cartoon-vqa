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
import Prompt from "./pages/data/Prompt"
import Preprocess from "./pages/data/Preprocessing"
import Workers from "./pages/MTURK/Workers"
import Upload from "./pages/MTURK/Upload"
import WorkingAnalysis from "./pages/MTURK/WorkingTImeAnalysis"
import WorkerProfile from "./pages/MTURK/WorkerProfile"
import Assignment from "./pages/MTURK/Assignment"
import Searching from "./pages/MTURK/Searching"
import Triple from "./pages/MTURK/Triple"
import Assigments from "./pages/MTURK/Assignments"
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/js/dist/dropdown';


function App() {
  return (
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
          <Route path="prompt" element={<Prompt />} />
          <Route path="preprocess" element={<Preprocess />} />
          <Route path="workers" element={<Workers />} />
          <Route path="mturk_uploading" element={<Upload  />} />
          <Route path="working_analysis" element={<WorkingAnalysis  />} />
          <Route path="profile/:worker_id" element={<WorkerProfile />} />
          <Route path="assignment/:assignment_id" element={<Assignment />} />
          <Route path="triple/:triple_id" element={<Triple />} />
          <Route path="searching" element={<Searching />} />
          <Route path="assignments" element={<Assigments />} />
          
          {/*
          <Route path="qa" element={<QA />} />
          */}
        </Route>
      </Routes>
  );
}
export default App;
