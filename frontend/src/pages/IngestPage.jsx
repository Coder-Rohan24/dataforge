// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { uploadFile } from '../api';
// import FileUpload from '../components/FileUpload';
// import "../index.css"; // you can add Tailwind loader keyframes here if needed

// const IngestPage = () => {
//   const [uploadId, setUploadId] = useState('');
//   const [columns, setColumns] = useState([]);
//   const [preview, setPreview] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);

//   const navigate = useNavigate();

//   const handleUpload = async (file) => {
//     const formData = new FormData();
//     formData.append('file', file);

//     setIsLoading(true);
//     try {
//       const res = await uploadFile(formData);
//       console.log(res.data);
//       setUploadId(res.data.upload_id);
//       setColumns(res.data.columns);
//       setPreview(res.data.preview);
//     } catch (err) {
//       alert("Upload failed: " + (err.response?.data?.detail || err.message));
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   const formatPreview = (previewObj) => {
//     if (!previewObj) return [];
    
//     const columns = Object.keys(previewObj);
//     const numRows = Object.keys(previewObj[columns[0]] || {}).length;
  
//     const rows = [];
//     for (let i = 0; i < numRows; i++) {
//       const row = columns.map(col => {
//         const value = previewObj[col][i];
//         // Safely handle undefined, null, NaN
//         if (value === null || value === undefined || (typeof value === 'number' && isNaN(value))) {
//           return 'N/A';
//         }
//         return String(value);
//       });
//       rows.push(row);
//     }
//     return rows;
//   };
  
//   return (
//     <div className="relative min-h-screen bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
//       {/* Loading overlay */}
//       {isLoading && (
//         <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
//           <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-20 w-20"></div>
//         </div>
//       )}

//       <div className="bg-white rounded-lg shadow-xl p-10 max-w-4xl z-10">
//         <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Upload Your Dataset</h2>
//         <p className="text-gray-600 text-center mb-4">Upload a CSV or JSON file. We'll display a quick preview of your data.</p>
//         <div 
//           className={`flex justify-center mb-6 transition-transform duration-300 ${isDragging ? 'scale-105 bg-teal-50' : ''}`}
//           onDragOver={(e) => {
//             e.preventDefault();
//             setIsDragging(true);
//           }}
//           onDragLeave={(e) => {
//             e.preventDefault();
//             setIsDragging(false);
//           }}
//           onDrop={(e) => {
//             e.preventDefault();
//             setIsDragging(false);
//             if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//               handleUpload(e.dataTransfer.files[0]);
//               e.dataTransfer.clearData();
//             }
//           }}
//         >
//           <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-teal-400 rounded-lg cursor-pointer hover:bg-teal-50 transition duration-200">
//             <input 
//               type="file" 
//               className="hidden" 
//               onChange={(e) => handleUpload(e.target.files[0])} 
//             />
//             <svg className="w-12 h-12 text-teal-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4-4m0 0l4 4m-4-4v12" />
//             </svg>
//             <span className="text-teal-600 font-medium">Click or Drag a file here</span>
//             <span className="text-xs text-gray-500 mt-1">Only CSV or JSON files supported</span>
//           </label>
//         </div>

//         {uploadId && (
//           <div className="mt-4 p-4 bg-gray-100 rounded-lg">
//             <p className="text-gray-800 font-medium">Upload ID:</p>
//             <p className="text-gray-600 mb-2">{uploadId}</p>

//             <p className="text-gray-800 font-medium">Columns: {columns.length}</p>
//             <p className="text-gray-600 mb-2 break-words">{columns.join(', ')}</p>

//             {preview && (
//               <>
//                 <p className="text-gray-800 font-medium mt-4 mb-2">Preview (first 5 rows):</p>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full text-sm text-left border border-gray-300 rounded">
//                     <thead className="bg-gray-200">
//                       <tr>
//                         {columns.map((col, idx) => (
//                           <th key={idx} className="py-2 px-4 border-b border-gray-300 font-semibold">{col}</th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {formatPreview(preview).map((row, rowIdx) => (
//                         <tr key={rowIdx} className="border-b border-gray-200 hover:bg-gray-50">
//                           {row.map((cell, colIdx) => (
//                             <td key={colIdx} className="py-2 px-4">
//                               {cell === null || cell === 'NaN' ? 'N/A' : String(cell)}
//                             </td>
//                           ))}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </>
//             )}
//           </div>
//         )}

//         {uploadId && (
//           <div className="mt-6 text-center">
//             <button
//               onClick={() => navigate(`/preprocess?upload_id=${uploadId}`)}
//               className="w-full py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition duration-200"
//             >
//               Proceed to Preprocessing
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default IngestPage;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadFile, uploadSQL, uploadMongo, uploadAPI } from '../api'; // define these in your api.js
import "../index.css";
// import { FaDatabase, FaFileCsv, FaCode, FaCloudUploadAlt, FaStream } from 'react-icons/fa';

const IngestPage = () => {
  const [source, setSource] = useState('csv');
  const [uploadId, setUploadId] = useState('');
  const [columns, setColumns] = useState([]);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const navigate = useNavigate();

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    setIsLoading(true);
    try {
      const res = await uploadFile(formData);
      setUploadId(res.data.upload_id);
      setColumns(res.data.columns);
      setPreview(res.data.preview);
    } catch (err) {
      alert("Upload failed: " + (err.response?.data?.detail || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtherUpload = async (formFields, uploadFunc) => {
    setIsLoading(true);
    try {
      const res = await uploadFunc(formFields);
      setUploadId(res.data.upload_id);
      setColumns(res.data.columns);
      setPreview(res.data.preview);
    } catch (err) {
      alert("Upload failed: " + (err.response?.data?.detail || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const formatPreview = (previewObj) => {
    if (!previewObj) return [];
    const cols = Object.keys(previewObj);
    const rows = Object.keys(previewObj[cols[0]] || {}).length;
    return Array.from({ length: rows }, (_, i) =>
      cols.map((col) => previewObj[col]?.[i] ?? 'N/A')
    );
  };

  const [formData, setFormData] = useState({
    connStr: '',
    query: '',
    mongoUri: '',
    mongoDb: '',
    mongoColl: '',
    apiUrl: ''
  });

  const handleInput = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const renderDynamicForm = () => {
    switch (source) {
      case 'csv':
      case 'json':
        return (
          <div
            className={`flex justify-center mb-6 transition-transform duration-300 ${isDragging ? 'scale-105 bg-blue-100' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
            onDrop={(e) => {
              e.preventDefault(); setIsDragging(false);
              if (e.dataTransfer.files.length > 0) {
                handleUpload(e.dataTransfer.files[0]);
                e.dataTransfer.clearData();
              }
            }}
          >
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-blue-400 rounded-lg cursor-pointer hover:bg-blue-100 transition duration-200">
              <input type="file" className="hidden" onChange={(e) => handleUpload(e.target.files[0])} />
              <svg className="w-10 h-10 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4-4m0 0l4 4m-4-4v12" />
              </svg>
              <span className="text-blue-600 font-medium">Click or drag your {source.toUpperCase()} file here</span>
            </label>
          </div>
        );
      case 'sql':
        return (
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg border">
            <h3 className="text-lg font-semibold text-blue-700 mb-3">SQL Database Upload</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">🔗 Connection String</label>
              <input
                type="text"
                name="connStr"
                className="input-box"
                placeholder="e.g., postgresql://user:pass@host:port/dbname"
                onChange={handleInput}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">📄 SQL Query</label>
              <textarea
                name="query"
                rows={4}
                className="input-box"
                placeholder="e.g., SELECT * FROM your_table"
                onChange={handleInput}
              />
            </div>
            <button className="btn-primary w-full" onClick={() => handleOtherUpload(formData, uploadSQL)}>🚀 Upload SQL Data</button>
          </div>
        );
        
      
      case 'mongo':
        return (
          <div className="space-y-4 bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-blue-700 mb-3">MongoDB Database Upload</h3>
            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">🧪 Mongo URI</label>
              <input
                type="text"
                name="mongoUri"
                className="input-box"
                placeholder="e.g., mongodb+srv://user:pass@cluster.mongodb.net"
                onChange={handleInput}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">📁 Database Name</label>
              <input
                type="text"
                name="mongoDb"
                className="input-box"
                placeholder="e.g., myDatabase"
                onChange={handleInput}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">📄 Collection Name</label>
              <input
                type="text"
                name="mongoColl"
                className="input-box"
                placeholder="e.g., myCollection"
                onChange={handleInput}
              />
            </div>
            <button className="btn-primary w-full" onClick={() => handleOtherUpload(formData, uploadMongo)}>🚀 Upload Mongo Data</button>
          </div>
        );
        
      
      case 'api':
        return (
          <div className="space-y-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div>
              <label className="block text-sm font-medium text-yellow-700 mb-1">🌍 API URL</label>
              <input
                type="text"
                name="apiUrl"
                className="input-box"
                placeholder="e.g., https://api.example.com/data"
                onChange={handleInput}
              />
            </div>
            <button className="btn-primary w-full" onClick={() => handleOtherUpload(formData, uploadAPI)}>🚀 Upload API Data</button>
          </div>
        );
        
        
      case 'stream':
        return (
          <div className="bg-blue-100 text-blue-900 p-4 rounded-lg">
            Real-time streaming via WebSocket coming soon...
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <div className="loader"></div>
        </div>
      )}
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl z-10">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-4">Multi-Source Data Ingestion</h2>
        <p className="text-center text-gray-600 mb-6">Choose your source and upload your data securely.</p>

        <select
          className="input-box mb-6 px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        >
          <option value="csv">📄 CSV File Upload</option>
          <option value="json">📄 JSON File Upload</option>
          <option value="sql">🗃️ SQL Database</option>
          <option value="mongo">🍃 MongoDB</option>
          <option value="api">🔗 External API</option>
          <option value="stream">📡 Real-Time Stream</option>
        </select>

        {renderDynamicForm()}

        {uploadId && (
          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <p className="font-semibold text-blue-800">Upload ID:</p>
            <p className="text-sm text-gray-700">{uploadId}</p>
            <p className="mt-2 font-semibold text-blue-800">Columns:</p>
            <p className="text-sm text-gray-700">{columns.join(', ')}</p>
            {preview && (
              <>
                <p className="mt-4 font-semibold text-blue-800">Preview (first 5 rows):</p>
                <div className="overflow-x-auto mt-2">
                  <table className="min-w-full text-sm border border-blue-300">
                    <thead className="bg-blue-100">
                      <tr>{columns.map((col, idx) => <th key={idx} className="px-3 py-2">{col}</th>)}</tr>
                    </thead>
                    <tbody>
                      {formatPreview(preview).map((row, i) => (
                        <tr key={i} className="hover:bg-blue-50">
                          {row.map((cell, j) => <td key={j} className="px-3 py-2">{cell}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {uploadId && (
          <>
            <button
              onClick={() => navigate(`/preprocess?upload_id=${uploadId}`)}
              className="mt-6 w-full btn-primary"
            >
              Proceed to Preprocessing
            </button>
            <button
              onClick={() => navigate(`/dashboard`)}
              className="mt-6 w-full btn-primary"
            >
              Go to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default IngestPage;
