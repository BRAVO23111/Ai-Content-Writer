
'use client';

import Footer from "@/components/Footer";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-blue-50 p-6">
      

      <h1 className="text-4xl md:text-5xl font-bold mt-8 text-blue-800">
        AI Content Writer
      </h1>

    
      <p className="text-lg md:text-xl text-gray-700 mb-8 text-center max-w-2xl">
        Instantly generate high-quality social media posts for Instagram, LinkedIn, and Twitter using AI. Boost your content game effortlessly!
      </p>

      {/* Call to Action Button */}
      <Link href="/auth/login">
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-lg font-semibold transition">
          Get Started for Free
        </button>
      </Link>

      {/* Features Section */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h3 className="text-2xl font-semibold text-blue-700 mb-2">AI-Powered</h3>
          <p className="text-gray-600">Smart content generation tailored to your audience.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h3 className="text-2xl font-semibold text-blue-700 mb-2">SEO Optimized</h3>
          <p className="text-gray-600">Built-in SEO enhancements for better reach and engagement.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h3 className="text-2xl font-semibold text-blue-700 mb-2">Post Directly</h3>
          <p className="text-gray-600">Seamlessly publish your content to Twitter with one click.</p>
        </div>
      </section>

      {/* Footer */}
      <Footer/>
    </main>
  );
}
