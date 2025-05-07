import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "../index.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location.pathname]); // Re-check login status on route change

  const isActive = (path) =>
    location.pathname === path ? "text-blue-600 font-semibold" : "text-gray-700";

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center fixed top-0 w-full z-50">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <img src="/logo.png" alt="Logo" className="h-8 w-8" />
        <span className="text-xl font-bold text-gray-800 tracking-wide">AI DataForge</span>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex space-x-6 text-gray-700 font-medium">
        <Link to="/" className={`hover:text-blue-600 ${isActive("/")} p-2`}>Home</Link>
        <Link to="/about" className={`hover:text-blue-600 ${isActive("/about")} p-2`}>About Us</Link>
        {isLoggedIn && (
          <>
            <Link to="/ingest" className={`hover:text-blue-600 ${isActive("/upload")} p-2`}>Upload</Link>
            <Link to="/profile" className={`hover:text-blue-600 ${isActive("/profile")} p-2`}>Profile</Link>
          </>
        )}
        {!isLoggedIn && (
          <Link to="/login" className={`hover:bg-blue-100 px-4 py-2 rounded-full border border-blue-500 transition ${isActive("/login")}`}>
            Sign Up / Log In
          </Link>
        )}
      </nav>

      {/* Hamburger Icon for Mobile */}
      <div className="md:hidden">
        <button onClick={toggleMenu}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="absolute top-16 right-4 w-48 bg-white shadow-lg rounded-lg py-4 px-6 flex flex-col space-y-4 md:hidden z-50 border">
          <Link onClick={toggleMenu} to="/" className={isActive("/")}>Home</Link>
          <Link onClick={toggleMenu} to="/about" className={isActive("/about")}>About Us</Link>
          {isLoggedIn && (
            <>
              <Link onClick={toggleMenu} to="/ingest" className={isActive("/upload")}>Upload</Link>
              <Link onClick={toggleMenu} to="/profile" className={isActive("/profile")}>Profile</Link>
            </>
          )}
          {!isLoggedIn && (
            <Link
              onClick={toggleMenu}
              to="/login"
              className={`px-4 py-2 rounded-full border border-blue-500 text-center ${isActive("/login")}`}
            >
              Sign Up / Log In
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
