import React from "react";
import { useNavigate } from "react-router-dom";

const DatasetCard = ({ dataset, onDelete, onDownload }) => {
  const navigate = useNavigate();

  const handlePreprocessClick = () => {
    navigate(`/preprocess?upload_id=${dataset.upload_id}`);
  };

  const handleTrainClick = () => {
    navigate(`/train?upload_id=${dataset.upload_id}`);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-2">{dataset.name}</h3>
      <p className="text-gray-600">Uploaded on: {dataset.uploaded}</p>
      {/* <p className="text-gray-600">Columns: {dataset.columns.length}</p> */}
      {/* <p classname="text-gray-600">Rows: {dataset.rows}</p> */}
      <p className="text-gray-600">Size: {dataset.size}</p>

      {dataset.linked_models?.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-gray-800">Linked Models:</h4>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {dataset.linked_models.map((model, index) => (
              <li key={index}>
                {model.model_type} — trained at {new Date(model.trained_at).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-4 mt-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => onDownload(dataset.filename)}>
          Download
        </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => onDelete(dataset.filename)}>
          Delete
        </button>
        {!dataset.is_preprocessed && (
          <button className="bg-purple-500 text-white px-4 py-2 rounded" onClick={handlePreprocessClick}>
            Preprocess
          </button>
        )}
        {dataset.is_preprocessed && !dataset.is_trained && (
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleTrainClick}>
            Train
          </button>
        )}
      </div>
    </div>
  );
};

export default DatasetCard;

