// // import { useState } from 'react'
// // import reactLogo from './assets/react.svg'
// // import viteLogo from '/vite.svg'
// // import './App.css'

// // function App() {
// //   const [count, setCount] = useState(0)

// //   return (
// //     <>
// //       <div>
// //         <a href="https://vite.dev" target="_blank">
// //           <img src={viteLogo} className="logo" alt="Vite logo" />
// //         </a>
// //         <a href="https://react.dev" target="_blank">
// //           <img src={reactLogo} className="logo react" alt="React logo" />
// //         </a>
// //       </div>
// //       <h1>Vite + React</h1>
// //       <div className="card">
// //         <button onClick={() => setCount((count) => count + 1)}>
// //           count is {count}
// //         </button>
// //         <p>
// //           Edit <code>src/App.jsx</code> and save to test HMR
// //         </p>
// //       </div>
// //       <p className="read-the-docs">
// //         Click on the Vite and React logos to learn more
// //       </p>
// //     </>
// //   )
// // }

// // export default App
// // src/App.jsx
// import React, { useState } from "react";
// import DataUpload from "./components/DataUpload";
// import TaskSelection from "./components/TaskSelection";
// import ModelTraining from "./components/ModelTraining";
// import PerformanceMetrics from "./components/PerformanceMetrics";
// import Explainability from "./components/Explainability";

// const App = () => {
//   const [data, setData] = useState(null);
//   const [task, setTask] = useState("classification");
//   const [modelInfo, setModelInfo] = useState(null);

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-4xl text-center mb-6">AI DataForge</h1>
//       <DataUpload onFileUpload={setData} />
//       {data && (
//         <>
//           <TaskSelection onTaskSelect={setTask} />
//           <ModelTraining data={data} task={task} />
//           {modelInfo && (
//             <>
//               <PerformanceMetrics score={modelInfo.score} />
//               <Explainability modelPath={modelInfo.saved_path} task={task} data={data} />
//             </>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default App;
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import IngestPage from './pages/IngestPage';
import PreprocessPage from './pages/PreprocessPage';
import TrainPage from './pages/TrainPage';
import EvaluatePage from './pages/EvaluatePage';
// import DeployPage from './pages/DeployPage';
import LoginSignupPage from './pages/Login_SignupPage';
import HomePage from './pages/HomePage';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./index.css";
import './App.css';
import AboutUs from './pages/AboutPage';
import Profile from './pages/Profile';
import Datasets from './pages/Datasets';
import Dashboard from './pages/Dashboard';
import Models from './pages/Models';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginSignupPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/datasets" element={<Datasets />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/models" element={<Models />} />
            <Route path="/about" element={<AboutUs/>} />
            <Route path="/ingest" element={<IngestPage />} />
            <Route path="/preprocess" element={<PreprocessPage />} />
            <Route path="/train" element={<TrainPage />} />
            <Route path="/evaluate" element={<EvaluatePage />} />
            {/* <Route path="/deploy" element={<DeployPage />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
