// // src/api.js
// import axios from "axios";

// // Backend URL for API requests
// const BASE_URL = "http://localhost:8000/api";  // Update with your backend URL

// // Function to upload dataset
// export const uploadData = async (data) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/upload`, { data });
//     return response.data;
//   } catch (error) {
//     console.error("Error uploading data:", error);
//     throw error;
//   }
// };

// // Function to start AutoML training
// export const startAutoML = async (data, task) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/automl/train`, { data, task });
//     return response.data;
//   } catch (error) {
//     console.error("Error starting AutoML training:", error);
//     throw error;
//   }
// };

// // Function to get model explainability (SHAP)
// export const getShapExplanation = async (data, modelPath, task) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/explain/shap`, { data, model_path: modelPath, task });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching SHAP explanation:", error);
//     throw error;
//   }
// };

// // Function to get LIME explanation
// export const getLimeExplanation = async (data, modelPath, task) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/explain/lime`, { data, model_path: modelPath, task });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching LIME explanation:", error);
//     throw error;
//   }
// };
// src/api.js
import axios from "axios";

const API_BASE = "http://localhost:8000/api";

// export const uploadFile = async (formData) =>
//   await axios.post(`${API_BASE}/ingest/upload`, formData);
export const uploadFile = async (formData) => {
  const token = localStorage.getItem("token");
  return await axios.post(`${API_BASE}/ingest/upload`, formData, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    }
  });
};
export const uploadSQL = async (payload) =>
  await axios.post(`${API_BASE}/ingest/upload-sql`, payload);

export const uploadMongo = async (payload) =>
  await axios.post(`${API_BASE}/ingest/upload-mongo`, payload);

export const uploadAPI = async (payload) =>
  await axios.post(`${API_BASE}/ingest/upload-api`, payload);

// export const preprocessData = async (payload) =>
//   await axios.post(`${API_BASE}/preprocess`, payload);

export const preprocessData = async (payload) => {
  const token = localStorage.getItem('token');
  return await axios.post(`${API_BASE}/preprocess`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// export const trainModel = async (payload) =>
//   await axios.post(`${API_BASE}/train`, payload);
export const trainModel = async (payload) => {
  const token = localStorage.getItem("token"); // or sessionStorage
  return await axios.post(`${API_BASE}/train`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const evaluateModel = async (payload) =>
  await axios.post(`${API_BASE}/evaluate`, payload);

export const deployModel = async (payload) =>
  await axios.post(`${API_BASE}/deploy`, payload);

export const signupUser = async (userData) =>
  await axios.post(`${API_BASE}/auth/signup`, userData);

export const loginUser = async (data) => {
  console.log("Sending login request with data:", data);
  return await axios.post(`${API_BASE}/auth/login`, data);
};

export const fetchUserDatasets = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_BASE}/dataset/datasets`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};


export const downloadDataset = async (filename) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_BASE}/dataset/download/${filename}`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: "blob", // Required for file downloads
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const deleteDataset = async (filename) => {
  const token = localStorage.getItem("token");
  return await axios.delete(`${API_BASE}/dataset/delete/${filename}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchUserModels = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_BASE}/model/models`,{
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data; // Each model includes dataset details
}

export const fetchUserProfile = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_BASE}/auth/user/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateUserProfile = async (userData) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(
    `${API_BASE}/auth/user/profile`,
    { name: userData.name },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
