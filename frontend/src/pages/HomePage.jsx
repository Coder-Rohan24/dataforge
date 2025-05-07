import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
const HomePage = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white font-montserrat">
      <Navbar />

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-28 pb-16">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-6 leading-tight" data-aos="fade-down">
          Empowering AI-Driven Insights
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mb-8" data-aos="fade-up">
          DataForge is an end-to-end machine learning platform that helps you ingest, preprocess, visualize, train,
          evaluate and deploy models effortlessly. Built for data scientists, ML engineers, and researchers.
        </p>
        <a
          href="/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-full text-md font-semibold shadow-lg hover:bg-blue-700 transition duration-300"
          data-aos="zoom-in"
        >
          Get Started
        </a>
      </section>

      {/* Feature Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-12 py-16 bg-white text-center">
        <div className="p-6 shadow-md rounded-lg hover:shadow-xl transition" data-aos="fade-up">
          <div className="text-blue-500 text-4xl mb-3">
            <i className="fas fa-sliders-h"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Smart Preprocessing</h3>
          <p className="text-gray-600 text-sm">Automate data cleaning, normalization, feature engineering and more with minimal effort.</p>
        </div>
        <div className="p-6 shadow-md rounded-lg hover:shadow-xl transition" data-aos="fade-up" data-aos-delay="200">
          <div className="text-purple-500 text-4xl mb-3">
            <i className="fas fa-robot"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Model Training</h3>
          <p className="text-gray-600 text-sm">Experiment with multiple algorithms, track metrics, and visualize performance instantly.</p>
        </div>
        <div className="p-6 shadow-md rounded-lg hover:shadow-xl transition" data-aos="fade-up" data-aos-delay="400">
          <div className="text-green-500 text-4xl mb-3">
            <i className="fas fa-rocket"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">1-Click Deployment</h3>
          <p className="text-gray-600 text-sm">Deploy your trained models to production in seconds with scalable APIs and monitoring.</p>
        </div>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default HomePage;
