"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import DashboardNav from '@/components/DashboardNav';
import DashboardStats from '@/components/DashboardStats';
import DashboardTabs from '@/components/DashboardTabs';

export default function DashboardContent() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchParams = useSearchParams();
  const [twitterConnected, setTwitterConnected] = useState(false);
  const [autoPostToTwitter, setAutoPostToTwitter] = useState(false);
  const [contentList, setContentList] = useState([]);
  const [loadingContent, setLoadingContent] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchContent() {
      setLoadingContent(true);
      setError("");
      try {
        const res = await axios.get("/api/generate"); 
        const data = res.data;
        
        if (data.success) {
          setContentList(data.data);
        } else {
          setError(data.error || "Failed to fetch content");
        }
      } catch (err: any) {
        setError(err?.response?.data?.error || "Failed to fetch content");
      } finally {
        setLoadingContent(false);
      }
    }
    fetchContent();
  }, []);
  
  const handleTwitterStatusChange = (connected: boolean) => {
    setTwitterConnected(connected);
    if (!connected) setAutoPostToTwitter(false);
  };

  useEffect(() => {
    const twitterConnectedParam = searchParams.get('twitter_connected');
    if (twitterConnectedParam === 'true') {
      alert('Twitter connected successfully!');
      setTwitterConnected(true);
      window.history.replaceState({}, '', window.location.pathname);
    }

    const twitterError = searchParams.get('twitter_error');
    if (twitterError) {
      alert(`Failed to connect Twitter: ${twitterError}. Please try again.`);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <DashboardNav
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onTwitterStatusChange={handleTwitterStatusChange}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-7xl">
        {/* Header with stats */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Content Dashboard</h1>
          <p className="text-gray-400 mt-2">Manage and distribute your generated content</p>
          
          <DashboardStats 
            totalContent={contentList.length}
            twitterConnected={twitterConnected}
            autoPostToTwitter={autoPostToTwitter}
          />
        </div>
        
        <DashboardTabs
          contentList={contentList}
          loadingContent={loadingContent}
          error={error}
          twitterConnected={twitterConnected}
          autoPostToTwitter={autoPostToTwitter}
          setAutoPostToTwitter={setAutoPostToTwitter}
        />
      </div>
    </div>
  );
}
  // ... existing code from DashboardContent ...