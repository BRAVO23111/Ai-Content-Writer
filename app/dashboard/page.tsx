"use client"
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import TwitterConnectButton from '@/components/TwitterConnectButton';

// Create a separate component that uses useSearchParams
function DashboardContent() {
  const searchParams = useSearchParams();
  const [twitterConnected, setTwitterConnected] = useState(false);
  const [autoPostToTwitter, setAutoPostToTwitter] = useState(false);
  
  // Handle Twitter connection status changes
  const handleTwitterStatusChange = (connected: boolean) => {
    setTwitterConnected(connected);
    // If disconnected, disable auto-post
    if (!connected) {
      setAutoPostToTwitter(false);
    }
  };
  
  // Check for Twitter connection status in URL parameters
  useEffect(() => {
    // Check for successful Twitter connection
    const twitterConnectedParam = searchParams.get('twitter_connected');
    if (twitterConnectedParam === 'true') {
      // Show success message
      alert('Twitter connected successfully!');
      setTwitterConnected(true);
      
      // Optionally clear the URL parameter
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
    
    // Check for Twitter error
    const twitterError = searchParams.get('twitter_error');
    if (twitterError) {
      // Show error message
      alert(`Failed to connect Twitter: ${twitterError}. Please try again.`);
      
      // Optionally clear the URL parameter
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams]);
  
  return (
    <>
      {/* Add the Twitter Connect Button to your dashboard */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Content Dashboard</h1>
        <TwitterConnectButton onStatusChange={handleTwitterStatusChange} />
      </div>
      
      {/* When generating content, show Twitter posting option only if connected */}
      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={twitterConnected && autoPostToTwitter}
            onChange={(e) => setAutoPostToTwitter(e.target.checked)}
            disabled={!twitterConnected}
            className="rounded"
          />
          <span>Auto-post to Twitter {!twitterConnected && "(Connect Twitter first)"}</span>
        </label>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Generate New Content</h2>
        {/* Add your content generation form here */}
        <div className="p-6 border border-gray-800 rounded-lg bg-gray-900">
          <p className="text-gray-400">Content generation form will go here</p>
        </div>
      </div>
    </>
  );
}

// Fallback component to display while the content is loading
function DashboardFallback() {
  return (
    <div className="container mx-auto p-6">
      <div className="animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-gray-700 rounded w-48"></div>
          <div className="h-10 bg-gray-700 rounded w-36"></div>
        </div>
        <div className="mb-4 h-6 bg-gray-700 rounded w-64"></div>
        <div className="mt-8">
          <div className="h-7 bg-gray-700 rounded w-48 mb-4"></div>
          <div className="p-6 border border-gray-800 rounded-lg bg-gray-900 h-40"></div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="container mx-auto p-6">
      <Suspense fallback={<DashboardFallback />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}