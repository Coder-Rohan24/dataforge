import React from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
const featureData = [
  {
    title: "1. Data Acquisition & Preprocessing",
    points: [
      "Multi-source ingestion: CSV, JSON, SQL, APIs",
      "Automated data cleaning & EDA",
      "Large-scale processing with Spark",
    ],
  },
  {
    title: "2. Model Development & Experimentation",
    points: [
      "Custom & pre-built ML models",
      "Hyperparameter tuning with Optuna",
      "AutoML support with H2O.ai & AutoKeras",
    ],
  },
  {
    title: "3. Model Training & Evaluation",
    points: [
      "Distributed GPU/TPU training",
      "Cross-validation, SHAP, and LIME support",
      "Integrated with MLflow for tracking",
    ],
  },
  {
    title: "4. Deep Learning & AI Capabilities",
    points: [
      "Computer Vision, NLP, and Time-Series forecasting",
      "Transformer models and CNNs",
      "Text summarization and sentiment analysis",
    ],
  },
  {
    title: "5. Deployment & MLOps",
    points: [
      "Deploy via Flask, FastAPI, or TensorFlow Serving",
      "CI/CD with Kubeflow",
      "Docker & Kubernetes support",
    ],
  },
  {
    title: "6. Real-Time Predictions",
    points: [
      "Kafka & Spark streaming integration",
      "Drift detection with RiverML",
      "AI-based recommendations using RL",
    ],
  },
  {
    title: "7. Security & Privacy",
    points: [
      "AES-256 and TLS 1.3 encryption",
      "RBAC with Keycloak",
      "Federated Learning with TensorFlow Federated",
    ],
  },
  {
    title: "8. Scalability & Optimization",
    points: [
      "Auto-scaling with Kubernetes",
      "Parallel computation using Ray & Dask",
      "Load balancing with Nginx & AWS ALB",
    ],
  },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 text-gray-800 pt-24 overflow-x-hidden">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="px-6 md:px-16 py-12"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-blue-700 mb-4 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            About AI DataForge
          </motion.h1>
          <motion.p
            className="text-lg text-center mb-10 text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Empowering Data Scientists & ML Engineers with End-to-End Automation
          </motion.p>

          {/* Project Overview */}
          <motion.section
            className="grid md:grid-cols-2 gap-10 items-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.2 }}
            variants={{
              visible: { transition: { staggerChildren: 0.2 } },
              hidden: {},
            }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0 },
              }}
            >
              <h2 className="text-2xl font-semibold text-blue-600 mb-3">
                Project Overview
              </h2>
              <p className="text-gray-700 leading-relaxed">
                <strong>AI DataForge</strong> is an AI-powered platform designed to streamline the
                entire ML lifecycle — from ingestion and preprocessing to model
                deployment and monitoring.
              </p>
            </motion.div>
            <motion.img
              variants={{
                hidden: { opacity: 0, x: 50 },
                visible: { opacity: 1, x: 0 },
              }}
              src="https://cdn-icons-png.flaticon.com/512/553/553416.png"
              alt="AI DataForge Icon"
              className="w-48 h-48 mx-auto"
            />
          </motion.section>

          {/* Core Features */}
          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-blue-600 mb-5 text-center">
              Core Features
            </h2>
            <motion.div
              className="grid md:grid-cols-2 gap-8 text-sm"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
                hidden: {},
              }}
            >
              {featureData.map((feature, idx) => (
                <motion.div
                  key={idx}
                  className="bg-white shadow-md rounded-xl p-6 border-t-4 border-blue-400 hover:scale-[1.02] transition-all duration-300"
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <h3 className="font-bold text-blue-700 mb-2">{feature.title}</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {feature.points.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* System Architecture */}
          <div className="mt-20 text-center">
            <motion.h2
              className="text-2xl font-semibold text-blue-600 mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              System Architecture
            </motion.h2>
            <motion.p
              className="text-gray-700 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              AI DataForge connects the entire ML lifecycle:
            </motion.p>
            <motion.div
              className="bg-white rounded-xl shadow-md p-6 max-w-2xl mx-auto border-l-4 border-blue-400 text-left text-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>User creates & manages ML experiments</li>
                <li>Uploads data to preprocessing engine</li>
                <li>Trains models through a modular pipeline</li>
                <li>Deploys models via API endpoints</li>
                <li>Monitors model performance and retrains as needed</li>
              </ul>
            </motion.div>
          </div>

          {/* Footer */}
          
        </div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default AboutUs;
