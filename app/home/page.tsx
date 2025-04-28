
'use client';

import Footer from "@/components/Footer";
import Link from "next/link";
import { 
  Navbar, 
  NavBody, 
  NavItems, 
  MobileNav, 
  MobileNavHeader, 
  MobileNavMenu, 
  MobileNavToggle, 
  NavbarLogo, 
  NavbarButton 
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Features", link: "#features" },
    { name: "Pricing", link: "#pricing" },
    { name: "About", link: "#about" },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-black text-white">
      {/* Navbar Integration */}
      <Navbar className="fixed top-0 bg-black/80 backdrop-blur-md border-b border-gray-800 z-50">
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="relative z-20 flex flex-row items-center justify-end gap-2">
            <NavbarButton href="/auth/login" variant="outline">
              Login
            </NavbarButton>
            <NavbarButton href="/auth/signup" variant="default">
              Sign Up
            </NavbarButton>
          </div>
        </NavBody>
        
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle 
              isOpen={isMenuOpen} 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
            />
          </MobileNavHeader>
          
          <MobileNavMenu 
            isOpen={isMenuOpen} 
            onClose={() => setIsMenuOpen(false)}
            className="bg-black/95 border-gray-800"
          >
            {navItems.map((item, idx) => (
              <a 
                key={`mobile-link-${idx}`}
                href={item.link}
                className="w-full px-4 py-2 text-gray-300 hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="mt-4 flex w-full flex-col gap-2 px-4">
              <NavbarButton href="/auth/login" variant="outline" className="w-full">
                Login
              </NavbarButton>
              <NavbarButton href="/auth/signup" variant="default" className="w-full">
                Sign Up
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Hero Section with HeroHighlight */}
      <HeroHighlight containerClassName="h-screen">
        <div className="flex flex-col items-center justify-center text-center max-w-4xl px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            AI-Powered <Highlight>Content Writer</Highlight> for Social Media
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl">
            Instantly generate high-quality social media posts for Instagram, LinkedIn, and Twitter using advanced AI. Boost your content game effortlessly!
          </p>
          
          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 rounded-md text-lg">
              Get Started for Free
            </Button>
            <Button size="lg" variant="outline" className="border-indigo-500 text-indigo-400 hover:bg-indigo-950/30 px-8 py-6 rounded-md text-lg">
              View Demo
            </Button>
          </div>
        </div>
      </HeroHighlight>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <Highlight className="px-3 py-1">Powerful Features</Highlight>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Our AI-powered platform offers everything you need to create engaging social media content
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10">
              <div className="w-14 h-14 bg-indigo-900/30 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">AI-Powered Generation</h3>
              <p className="text-gray-400">Smart content generation tailored to your audience and platform requirements.</p>
            </div>
            
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10">
              <div className="w-14 h-14 bg-indigo-900/30 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">SEO Optimized</h3>
              <p className="text-gray-400">Built-in SEO enhancements for better reach, engagement, and visibility.</p>
            </div>
            
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10">
              <div className="w-14 h-14 bg-indigo-900/30 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Direct Publishing</h3>
              <p className="text-gray-400">Seamlessly publish your content to Twitter and other platforms with one click.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with dark theme */}
      <Footer />
    </main>
  );
}
