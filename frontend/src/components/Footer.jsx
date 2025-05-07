import React from 'react';

const Footer =() => {
    return (
        <footer className="bg-gray-100 py-8 text-center mt-auto">
        <div className="text-sm text-gray-500">
          © {new Date().getFullYear()} DataForge AI. All rights reserved.
        </div>
        <div className="mt-2 space-x-4">
          <a href="/privacy" className="text-gray-500 hover:text-gray-700 text-sm">Privacy Policy</a>
          <a href="/terms" className="text-gray-500 hover:text-gray-700 text-sm">Terms of Service</a>
          <a href="/contact" className="text-gray-500 hover:text-gray-700 text-sm">Contact</a>
        </div>
      </footer>
    )
}

export default Footer;