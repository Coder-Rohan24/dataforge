import React from "react";

const statusColor = {
  Deployed: "text-green-600 bg-green-100",
  Trained: "text-yellow-600 bg-yellow-100",
};

const ModelCard = ({ model }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold">{model.name}</h3>
        <span className={`text-sm px-3 py-1 rounded-full ${statusColor[model.status] || ""}`}>
          {model.status}
        </span>
      </div>

      <p className="text-gray-600">Accuracy: {(model.accuracy).toFixed(2)}%</p>
      {/* <p className="text-gray-500 text-sm">Trained on: {new Date(model.trained_at).toLocaleDateString()}</p> */}
      <p className="text-gray-500 text-sm">
        Trained on: {new Date(model.trained_at).toLocaleString("en-IN", { hour12: true })}
      </p>

      {model.linked_dataset && (
        <div className="mt-4">
          <p className="text-gray-700 text-sm">
            <span className="font-medium">Linked Dataset:</span> {model.linked_dataset.original_name}
          </p>
          <p className="text-gray-600 text-sm">Uploaded: {new Date(model.linked_dataset.upload_time).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
};


export default ModelCard;
