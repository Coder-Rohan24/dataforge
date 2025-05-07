import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchUserDatasets, downloadDataset, deleteDataset } from "../api";
import Sidebar from "../components/Sidebar";
import DatasetCard from "../components/DatasetCard";

const Datasets = () => {
  const [datasets, setDatasets] = useState([]);
  const location = useLocation();

  const loadDatasets = async () => {
    try {
      const data = await fetchUserDatasets();
      console.log("Fetched datasets:", data); // ✅ Debug log
      setDatasets(data);
    } catch (err) {
      console.error("Failed to load datasets", err);
    }
  };

  useEffect(() => {
    console.log("Datasets page mounted or refreshed");
    loadDatasets();
  }, []);

  useEffect(() => {
    if (location.state?.refresh) {
      console.log("Triggered refresh from preprocess page");
      loadDatasets();
    }
  }, [location.state]);

  const handleDelete = async (filename) => {
    try {
      await deleteDataset(filename);
      setDatasets((prev) => prev.filter((d) => d.filename !== filename));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleDownload = (filename) => {
    downloadDataset(filename);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 p-10 bg-gray-50 min-h-screen w-full">
        <h2 className="text-3xl font-semibold mb-6">Your Datasets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {datasets.map((data) => (
            <DatasetCard
              key={data.upload_id}
              dataset={data}
              onDelete={handleDelete}
              onDownload={handleDownload}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Datasets;
