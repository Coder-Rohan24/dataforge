import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { preprocessData } from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ClipLoader } from 'react-spinners';

const PreprocessPage = () => {
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [targetColumn, setTargetColumn] = useState(''); // <--- NEW
  const location = useLocation();
  const navigate = useNavigate();
  const uploadId = new URLSearchParams(location.search).get('upload_id');

  const handlePreprocess = async () => {
    if (!targetColumn) {
      alert("Please enter the target column before preprocessing.");
      return;
    }
    setLoading(true);
    try {
      const result = await preprocessData({
        upload_id: uploadId,
        scaling_method: "standard",
        target_column: targetColumn, // <--- pass target column to backend
      });
      setOutput(result.data);
    } catch (error) {
      alert("Preprocessing failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderHistograms = (histograms) => {
    return Object.entries(histograms).map(([key, values]) => {
      const chartData = values.map((val, i) => ({ name: `${i}`, value: val }));
      return (
        <div key={key} className="mb-8">
          <h4 className="text-xl font-semibold text-gray-900">{key}</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    });
  };

  const getColor = (correlation) => {
    if (correlation > 0.5) return "#82ca9d";
    if (correlation < -0.5) return "#ff6347";
    return "#d3d3d3";
  };

  const renderCorrelationHeatmap = (correlation) => {
    const keys = Object.keys(correlation);
    const data = [];

    keys.forEach((xKey) => {
      keys.forEach((yKey) => {
        data.push({
          x: xKey,
          y: yKey,
          value: correlation[xKey][yKey],
          color: getColor(correlation[xKey][yKey]),
        });
      });
    });

    return (
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900">Correlation Heatmap</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis dataKey="y" />
            <Tooltip />
            <Bar dataKey="value" fill={({ payload }) => payload.color} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderKeyDifferences = () => {
    if (!output || !output.preprocessed || !output.original) return null;

    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-900">Key Differences (Before & After Preprocessing)</h3>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800">Columns Before Preprocessing:</h4>
          <pre className="text-gray-700">{JSON.stringify(output.original.columns, null, 2)}</pre>
          <h4 className="font-semibold text-gray-800 mt-4">Columns After Preprocessing:</h4>
          <pre className="text-gray-700">{JSON.stringify(output.preprocessed.columns, null, 2)}</pre>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full">
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">Preprocess Your Data</h2>

        {!output && !loading && (
          <div className="flex flex-col gap-4 items-center">
            {/* Input Field for Target Column */}
            <input
              type="text"
              placeholder="Enter Target Column"
              value={targetColumn}
              onChange={(e) => setTargetColumn(e.target.value)}
              className="border border-gray-400 rounded px-4 py-2 w-full max-w-md"
            />

            <button
              onClick={handlePreprocess}
              disabled={!uploadId || !targetColumn}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded disabled:opacity-50"
            >
              Start Processing
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center">
            <ClipLoader size={50} color="#00BFFF" loading={loading} />
            <p className="text-gray-600 mt-4">Processing your data...</p>
          </div>
        ) : (
          output && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900">Preprocessing Complete</h3>
              <p className="text-gray-700">Shape: {output.shape.join(' x ')}</p>
              <h4 className="text-lg font-semibold text-gray-900 mt-4">Columns:</h4>
              <pre className="bg-gray-100 p-4 rounded-lg">{JSON.stringify(output.columns, null, 2)}</pre>

              <div className="mt-8">
                {renderHistograms(output.eda.histograms)}
                {renderCorrelationHeatmap(output.eda.correlation)}
                {renderKeyDifferences()}
              </div>

              {/* Proceed to Training Button */}
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => navigate(`/train?upload_id=${uploadId}`)}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
                >
                  Proceed to Training
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default PreprocessPage;
