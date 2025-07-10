import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { preprocessData } from '../api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ClipLoader } from 'react-spinners';

const PreprocessPage = () => {
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [targetColumn, setTargetColumn] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const uploadId = new URLSearchParams(location.search).get('upload_id');

  const handlePreprocess = async () => {
    if (!targetColumn) {
      alert('Please enter the target column before preprocessing.');
      return;
    }
    setLoading(true);
    try {
      const result = await preprocessData({
        upload_id: uploadId,
        scaling_method: 'standard',
        target_column: targetColumn,
      });
      setOutput(result.data);
    } catch (error) {
      alert('Preprocessing failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderHistograms = (histograms) => {
    return Object.entries(histograms).map(([key, values]) => {
      const chartData = values.map((val, i) => ({ name: `${i}`, value: val }));
      return (
        <div key={key} className="mb-8">
          <h4 className="text-xl font-semibold text-gray-900 mb-2">{key}</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    });
  };

  const getColor = (correlation) => {
    if (correlation > 0.5) return '#34D399';
    if (correlation < -0.5) return '#F87171';
    return '#CBD5E1';
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
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Correlation Heatmap</h3>
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
    if (!output?.preprocessed || !output?.original) return null;

    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Key Differences (Before & After Preprocessing)</h3>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800">Columns Before:</h4>
          <pre className="text-blue-700">{JSON.stringify(output.original.columns, null, 2)}</pre>
          <h4 className="font-semibold text-blue-800 mt-4">Columns After:</h4>
          <pre className="text-blue-700">{JSON.stringify(output.preprocessed.columns, null, 2)}</pre>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-2xl rounded-xl p-10 w-full max-w-5xl">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">
          📊 Data Preprocessing Dashboard
        </h2>

        {!output && !loading && (
          <div className="flex flex-col items-center gap-4">
            <input
              type="text"
              placeholder="🎯 Enter Target Column (e.g., disease, price)"
              value={targetColumn}
              onChange={(e) => setTargetColumn(e.target.value)}
              className="border border-blue-300 focus:ring-2 focus:ring-blue-500 rounded-lg px-4 py-2 w-full max-w-md text-blue-800 shadow-sm"
            />

            <button
              onClick={handlePreprocess}
              disabled={!uploadId || !targetColumn}
              className="bg-blue-600 hover:bg-blue-700 transition text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50 shadow-md"
            >
              🚀 Start Preprocessing
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center mt-12">
            <ClipLoader size={50} color="#3B82F6" loading={loading} />
            <p className="text-blue-800 mt-4 font-medium">Processing your data...</p>
          </div>
        ) : (
          output && (
            <div className="mt-8">
              <h3 className="text-2xl font-semibold text-blue-900 mb-2">✅ Preprocessing Complete</h3>
              <p className="text-blue-700">📐 Shape: {output.shape.join(' x ')}</p>

              <div className="mt-4">
                <h4 className="text-lg font-semibold text-blue-800">📁 Columns:</h4>
                <pre className="bg-blue-50 p-4 rounded-md border border-blue-200 text-blue-700">
                  {JSON.stringify(output.columns, null, 2)}
                </pre>
              </div>

              <div className="mt-8 space-y-10">
                {renderHistograms(output.eda.histograms)}
                {renderCorrelationHeatmap(output.eda.correlation)}
                {renderKeyDifferences()}
              </div>

              <div className="flex justify-center mt-10">
                <button
                  onClick={() => navigate(`/train?upload_id=${uploadId}`)}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md"
                >
                  🎯 Proceed to Training
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
