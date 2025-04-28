'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full mt-auto py-8 bg-black border-t border-gray-800 text-center">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left mb-8">
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">AI Content Writer</h3>
            <p className="text-gray-400 text-sm">
              Revolutionizing social media content creation with advanced AI technology.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 text-sm transition">Home</a></li>
              <li><a href="#features" className="text-gray-400 hover:text-indigo-400 text-sm transition">Features</a></li>
              <li><a href="#pricing" className="text-gray-400 hover:text-indigo-400 text-sm transition">Pricing</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-indigo-400 text-sm transition">About</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact</h3>
            <p className="text-gray-400 text-sm">
              Have questions? Reach out to us at <a href="mailto:support@aicontentwriter.com" className="text-indigo-400 hover:underline">support@aicontentwriter.com</a>
            </p>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm">&copy; 2025 AI Content Writer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
