// import React, { useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { trainModel } from '../api'; // You'll add this API call
// import { ClipLoader } from 'react-spinners';

// const modelOptions = {
//   supervised: [
//     { value: 'logistic_regression', label: 'Logistic Regression' },
//     { value: 'decision_tree', label: 'Decision Tree' },
//     { value: 'random_forest_classifier', label: 'Random Forest Classifier'},
//     { value: 'random_forest_regressor', label: 'Random Forest Regressor' },
//     { value: 'linear_regression', label: 'Linear Regression' },
//   ],
//   semi_supervised: [
//     { value: 'kmeans', label: 'K-Means Clustering' },
//   ],
// };

// const TrainPage = () => {
//   const [loading, setLoading] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState('supervised');
//   const [selectedModel, setSelectedModel] = useState('');
//   const [targetColumn, setTargetColumn] = useState('');
//   const [trainingResult, setTrainingResult] = useState(null);

//   const location = useLocation();
//   const uploadId = new URLSearchParams(location.search).get('upload_id');

//   const handleTraining = async () => {
//     setLoading(true);
//     try {
//       const payload = {
//         upload_id: uploadId,
//         model_type: selectedModel,
//         target_column: selectedCategory === 'supervised' ? targetColumn : undefined,
//       };
//       const result = await trainModel(payload);
//       setTrainingResult(result.data);
//     } catch (error) {
//       alert("Training failed: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
//       <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full">
//         <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">Train Your Model</h2>

//         <div className="mb-4">
//           <label className="block mb-2 font-semibold text-gray-800">Select Category:</label>
//           <select
//             className="border rounded w-full p-2"
//             value={selectedCategory}
//             onChange={(e) => {
//               setSelectedCategory(e.target.value);
//               setSelectedModel('');
//             }}
//           >
//             <option value="supervised">Supervised</option>
//             <option value="semi_supervised">Semi-Supervised / Unsupervised</option>
//           </select>
//         </div>

//         <div className="mb-4">
//           <label className="block mb-2 font-semibold text-gray-800">Select Model:</label>
//           <select
//             className="border rounded w-full p-2"
//             value={selectedModel}
//             onChange={(e) => setSelectedModel(e.target.value)}
//           >
//             <option value="">--Select Model--</option>
//             {modelOptions[selectedCategory].map((model) => (
//               <option key={model.value} value={model.value}>
//                 {model.label}
//               </option>
//             ))}
//           </select>
//         </div>

//         {selectedCategory === "supervised" && (
//           <div className="mb-4">
//             <label className="block mb-2 font-semibold text-gray-800">Enter Target Column:</label>
//             <input
//               type="text"
//               className="border rounded w-full p-2"
//               value={targetColumn}
//               onChange={(e) => setTargetColumn(e.target.value)}
//               placeholder="e.g., target"
//             />
//           </div>
//         )}

//         <div className="flex justify-center mt-6">
//           <button
//             onClick={handleTraining}
//             disabled={!uploadId || !selectedModel}
//             className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded disabled:opacity-50"
//           >
//             Start Training
//           </button>
//         </div>

//         {loading && (
//           <div className="flex flex-col items-center mt-6">
//             <ClipLoader size={50} color="#6b5b95" loading={loading} />
//             <p className="text-gray-600 mt-4">Training in progress...</p>
//           </div>
//         )}

//       {trainingResult && (
//         <div className="mt-8 bg-gray-100 p-6 rounded-lg">
//           <h3 className="text-2xl font-semibold text-gray-900 mb-4">Training Results</h3>
//           {trainingResult.accuracy !== undefined && (
//             <p className="text-gray-800 mb-2">Accuracy: {trainingResult.accuracy.toFixed(4)}</p>
//           )}
//           {trainingResult.f1_score !== undefined && (
//             <p className="text-gray-800 mb-2">F1 Score: {trainingResult.f1_score.toFixed(4)}</p>
//           )}
//           {trainingResult.r2 !== undefined && (
//             <p className="text-gray-800 mb-2">R² Score: {trainingResult.r2.toFixed(4)}</p>
//           )}
//           {trainingResult.mse !== undefined && (
//             <p className="text-gray-800 mb-2">Mean Squared Error (MSE): {trainingResult.mse.toFixed(4)}</p>
//           )}
//           <p className="text-gray-800">Model saved at: <span className="font-mono">{trainingResult.model_path}</span></p>
//         </div>
//       )}
//       </div>
//     </div>
//   );
// };

// export default TrainPage;
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { trainModel } from '../api';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom'; 

const modelOptions = {
  supervised: [
    { value: 'logistic_regression', label: 'Logistic Regression' },
    { value: 'decision_tree', label: 'Decision Tree' },
    { value: 'random_forest_classifier', label: 'Random Forest Classifier' },
    { value: 'random_forest_regressor', label: 'Random Forest Regressor' },
    { value: 'linear_regression', label: 'Linear Regression' },
  ],
  semi_supervised: [
    { value: 'kmeans', label: 'K-Means Clustering' },
  ],
};

const tunerOptions = [
  { value: 'none', label: 'None' },
  { value: 'grid_search', label: 'Grid Search' },
  { value: 'random_search', label: 'Random Search' },
  { value: 'bayesian_optimization', label: 'Bayesian Optimization' },
];

const TrainPage = () => {
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('supervised');
  const [selectedModel, setSelectedModel] = useState('');
  const [targetColumn, setTargetColumn] = useState('');
  const [tunerType, setTunerType] = useState('none');
  const [automl, setAutoml] = useState(false);
  const [customHyperparams, setCustomHyperparams] = useState('');
  const [trainingResult, setTrainingResult] = useState(null);
  const navigate = useNavigate();

  const location = useLocation();
  const uploadId = new URLSearchParams(location.search).get('upload_id');

  const handleTraining = async () => {
    setLoading(true);
    try {
      const payload = {
        upload_id: uploadId,
        model_type: selectedModel,
        target_column: selectedCategory === 'supervised' ? targetColumn : undefined,
        tuner_type: tunerType,
        automl: automl,
        custom_hyperparams: customHyperparams ? JSON.parse(customHyperparams) : undefined,
      };
      const result = await trainModel(payload);
      setTrainingResult(result.data);
      console.log("Training Result:", result);
    } catch (error) {
      alert("Training failed: " + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };
  // console.log("Training Result:", trainingResult.metrics);
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 flex items-center justify-center">
  <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-3xl w-full">
    <h2 className="text-4xl font-bold text-center text-blue-900 mb-8">Train Your Model</h2>

    {/* AutoML Option */}
    {/* <div className="mb-6 flex items-center">
      <input
        type="checkbox"
        id="automl"
        checked={automl}
        onChange={() => setAutoml(!automl)}
        className="mr-3 w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <label htmlFor="automl" className="text-gray-800 font-medium">
        Enable AutoML
      </label>
    </div> */}

    {/* Category Selection */}
    {!automl && (
      <div className="mb-6">
        <label className="block mb-2 font-semibold text-gray-700">Select Category:</label>
        <select
          className="border-2 border-blue-400 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedModel('');
          }}
        >
          <option value="supervised">Supervised</option>
          <option value="semi_supervised">Semi-Supervised / Unsupervised</option>
        </select>
      </div>
    )}

    {/* Model Selection */}
    {!automl && (
      <div className="mb-6">
        <label className="block mb-2 font-semibold text-gray-700">Select Model:</label>
        <select
          className="border-2 border-blue-400 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          <option value="">--Select Model--</option>
          {modelOptions[selectedCategory].map((model) => (
            <option key={model.value} value={model.value}>
              {model.label}
            </option>
          ))}
        </select>
      </div>
    )}

    {/* Target Column */}
    {selectedCategory === "supervised" && (
      <div className="mb-6">
        <label className="block mb-2 font-semibold text-gray-700">Enter Target Column:</label>
        <input
          type="text"
          className="border-2 border-blue-400 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={targetColumn}
          onChange={(e) => setTargetColumn(e.target.value)}
          placeholder="e.g., target"
        />
      </div>
    )}

    {/* Tuner Type */}
    {!automl && (
      <div className="mb-6">
        <label className="block mb-2 font-semibold text-gray-700">Select Tuner Type:</label>
        <select
          className="border-2 border-blue-400 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={tunerType}
          onChange={(e) => setTunerType(e.target.value)}
        >
          {tunerOptions.map((tuner) => (
            <option key={tuner.value} value={tuner.value}>
              {tuner.label}
            </option>
          ))}
        </select>
      </div>
    )}

    {/* Start Training Button */}
    <div className="flex justify-center mt-8">
      <button
        onClick={handleTraining}
        disabled={!uploadId || !selectedModel || (!automl && !targetColumn)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-lg disabled:opacity-50 transition duration-300"
      >
        Start Training
      </button>
    </div>

    {/* Loading Spinner */}
    {loading && (
      <div className="flex flex-col items-center mt-6">
        <ClipLoader size={50} color="#2563eb" loading={loading} />
        <p className="text-gray-600 mt-4">Training in progress...</p>
      </div>
    )}

    {/* Training Results */}
    {trainingResult && (
      <div className="mt-10 bg-blue-50 border border-blue-200 p-6 rounded-xl">
        <h3 className="text-2xl font-semibold text-blue-800 mb-4">Training Results</h3>
        {trainingResult.metrics.accuracy !== 0 && (
          <p className="text-gray-800 mb-2">Accuracy: {trainingResult.metrics.accuracy.toFixed(4)}</p>
        )}
        {trainingResult.metrics.f1_score !== 0 && (
          <p className="text-gray-800 mb-2">F1 Score: {trainingResult.metrics.f1_score.toFixed(4)}</p>
        )}
        {trainingResult.metrics.r2_score !== 0 && (
          <p className="text-gray-800 mb-2">R² Score: {trainingResult.metrics.r2_score.toFixed(4)}</p>
        )}
        {trainingResult.metrics.mse !== 0 && (
          <p className="text-gray-800 mb-2">Mean Squared Error (MSE): {trainingResult.metrics.mse.toFixed(4)}</p>
        )}
        <p className="text-gray-800">Model saved at: <span className="font-mono">{trainingResult.model_path}</span></p>
      </div>
    )}

    {/* Back Button */}
    <div className="flex justify-center mt-6">
      <button
        onClick={() => navigate('/dashboard')}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
      >
        Back to Dashboard
      </button>
    </div>
  </div>
</div>

  );
};

export default TrainPage;
