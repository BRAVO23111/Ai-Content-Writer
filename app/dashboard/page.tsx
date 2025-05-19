"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import TwitterConnectButton from '@/components/TwitterConnectButton';
import GenerateContent from '../generate-form/page';
import { cn } from "@/lib/utils";
import axios from 'axios';

function ContentCard({ item }: { item: any }) {
  const [isPosting, setIsPosting] = useState(false);
  const [postResult, setPostResult] = useState<{ success: boolean; message: string } | null>(null);

  const handlePostToTwitter = async () => {
    setIsPosting(true);
    setPostResult(null);
    
    try {
      const response = await axios.post('/api/auth/twitter/postContent', {
        content: item.body
      });
      
      setPostResult({
        success: true,
        message: 'Successfully posted to Twitter!'
      });
    } catch (error: any) {
      console.error('Error posting to Twitter:', error);
      
      // Check if we need to authenticate
      if (error.response?.data?.requiresAuth) {
        window.location.href = error.response.data.authUrl;
        return;
      }
      
      setPostResult({
        success: false,
        message: error.response?.data?.message || 'Failed to post to Twitter'
      });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="max-w-xs w-full group/card">
      <div
        className={cn(
          "cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl max-w-sm mx-auto flex flex-col justify-between p-4",
          "bg-gray-900 border border-gray-800"
        )}>
        <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
        <div className="flex flex-row items-center space-x-4 z-10">
          <div className="h-10 w-10 rounded-full border-2 bg-gray-800"></div>
          <div className="flex flex-col">
            <p className="text-sm text-gray-400">{new Date(item.createdAt).toLocaleString()}</p>
          </div>
        </div>
        <div className="text content">
          <h1 className="font-bold text-xl md:text-2xl text-gray-50 relative z-10">
            {item.title}
          </h1>
          <p className="font-normal text-sm text-gray-50 relative z-10 my-4">
            {item.body}
          </p>
        </div>
        
        {/* Twitter Post Button */}
        <div className="mt-auto relative z-10">
          <button
            onClick={handlePostToTwitter}
            disabled={isPosting}
            className={`w-full py-2 px-4 rounded-md flex items-center justify-center ${isPosting ? 'bg-gray-700' : 'bg-blue-500 hover:bg-blue-600'} transition-colors`}
          >
            {isPosting ? (
              <span>Posting...</span>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                Post to Twitter
              </>
            )}
          </button>
          
          {/* Result message */}
          {postResult && (
            <div className={`mt-2 text-sm ${postResult.success ? 'text-green-500' : 'text-red-500'}`}>
              {postResult.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardContent() {
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
        console.log(data);
        
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
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Content Dashboard</h1>
        <TwitterConnectButton onStatusChange={handleTwitterStatusChange} />
      </div>

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
        <div className="p-6 border border-gray-800 rounded-lg bg-gray-900">
          <GenerateContent />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Your Generated Content</h2>
        {loadingContent ? (
          <div>Loading content...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : contentList.length === 0 ? (
          <div>No content found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentList.map((item: any) => (
      
                  <ContentCard key={item.id} item={item} />
              
            ))}
          </div>
        )}
      </div>
    </>
  );
}

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
