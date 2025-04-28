"use client"
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TwitterConnectButton from '@/components/TwitterConnectButton';

export default function Dashboard() {
  const router = useRouter();
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
  
  // ... rest of your component
  
  return (
    <div>
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
      
      {/* ... rest of your dashboard UI ... */}
    </div>
  );
}