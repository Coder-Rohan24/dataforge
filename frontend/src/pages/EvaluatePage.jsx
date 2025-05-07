import React, { useState } from 'react';
import { evaluateModel } from '../api';

const EvaluatePage = () => {
  const [filePath, setFilePath] = useState('');
  const [metrics, setMetrics] = useState(null);

  const handleEvaluate = async () => {
    const res = await evaluateModel(filePath);
    setMetrics(res.data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full">
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">Evaluate Your Model</h2>
        <p className="text-gray-600 text-center mb-6">Provide the path to your model and dataset to get evaluation metrics.</p>

        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Enter file path"
            value={filePath}
            onChange={(e) => setFilePath(e.target.value)}
            className="p-3 w-3/4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex justify-center mb-6">
          <button
            onClick={handleEvaluate}
            className="w-3/4 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition duration-200"
          >
            Evaluate Model
          </button>
        </div>

        {metrics && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900">Evaluation Metrics</h3>
            <pre className="bg-gray-100 p-4 mt-2 rounded-lg">{JSON.stringify(metrics, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluatePage;
