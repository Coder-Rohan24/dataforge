import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ModelCard from "../components/ModelCard";
import { fetchUserModels } from "../api";

const Models = () => {
  const [models, setModels] = useState([]);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const data = await fetchUserModels();
        setModels(data);
      } catch (err) {
        console.error("Failed to load models", err);
      }
    };
    loadModels();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 p-10 bg-gray-50 min-h-screen w-full">
        <h2 className="text-3xl font-semibold mb-6">Your Models</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {models.map((model) => (
            <ModelCard key={model.model_path} model={model} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Models;
