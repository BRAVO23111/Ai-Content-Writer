"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import TwitterConnectButton from '@/components/TwitterConnectButton';
import GenerateContent from '../generate-form/page';
import { cn } from "@/lib/utils";
import axios from 'axios';
import { Navbar, NavBody, NavItems, NavbarLogo, MobileNav, MobileNavHeader, MobileNavToggle, MobileNavMenu } from "@/components/ui/resizable-navbar";

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
    <div className="w-full group/card transform transition-all duration-300 hover:translate-y-1 hover:scale-[1.01]">
      <div className={cn(
        "relative h-full rounded-xl overflow-hidden backdrop-blur-sm",
        "bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 shadow-lg shadow-blue-900/10"
      )}>
        <div className="flex flex-col h-full p-5">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-xs font-bold">
              {item.title.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <h3 className="font-bold text-lg text-white mb-2 line-clamp-2">
              {item.title}
            </h3>
            <p className="text-gray-300 text-sm line-clamp-6 mb-4">
              {item.body}
            </p>
          </div>
          
          {/* Twitter Button */}
          <div className="mt-auto">
            <button
              onClick={handlePostToTwitter}
              disabled={isPosting}
              className={cn(
                "w-full py-2.5 px-4 rounded-lg flex items-center justify-center transition-all",
                "text-sm font-medium text-white",
                isPosting 
                  ? "bg-gray-700 cursor-not-allowed" 
                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg shadow-blue-500/20"
              )}
            >
              {isPosting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Posting...</span>
                </div>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  Post to Twitter
                </>
              )}
            </button>
            
            {/* Result message */}
            {postResult && (
              <div className={cn(
                "mt-2 text-xs font-medium text-center",
                postResult.success ? "text-green-400" : "text-red-400"
              )}>
                {postResult.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardContent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchParams = useSearchParams();
  const [twitterConnected, setTwitterConnected] = useState(false);
  const [autoPostToTwitter, setAutoPostToTwitter] = useState(false);
  const [contentList, setContentList] = useState([]);
  const [loadingContent, setLoadingContent] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("content");

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
      {/* Navbar */}
      <Navbar className="fixed top-0 bg-black/80 backdrop-blur-lg border-b border-gray-800/50 z-50">
        <NavBody>
          <NavbarLogo />
          <NavItems items={[
            { name: "Home", link: "/" },
            { name: "Dashboard", link: "/dashboard" },
            { name: "Generate", link: "/generate-form" },
          ]} />
          <div className="relative z-20 flex items-center gap-3">
            <TwitterConnectButton onStatusChange={handleTwitterStatusChange} />
          </div>
        </NavBody>
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle 
              isOpen={isMobileMenuOpen} 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            />
          </MobileNavHeader>
          <MobileNavMenu 
            isOpen={isMobileMenuOpen} 
            onClose={() => setIsMobileMenuOpen(false)}
            className="bg-black/95 border-gray-800"
          >
            <a href="/" className="w-full px-4 py-3 text-gray-300 hover:bg-gray-800/50 rounded-md transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
            <a href="/dashboard" className="w-full px-4 py-3 text-gray-300 hover:bg-gray-800/50 rounded-md transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</a>
            <a href="/generate-form" className="w-full px-4 py-3 text-gray-300 hover:bg-gray-800/50 rounded-md transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Generate</a>
            <div className="mt-4 flex w-full px-4">
              <TwitterConnectButton onStatusChange={handleTwitterStatusChange} />
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-7xl">
        {/* Header with stats */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Content Dashboard</h1>
          <p className="text-gray-400 mt-2">Manage and distribute your generated content</p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800/50 p-4 rounded-xl shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Content</p>
                  <h3 className="text-2xl font-bold text-white">{contentList.length}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800/50 p-4 rounded-xl shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Twitter Status</p>
                  <h3 className="text-2xl font-bold text-white">{twitterConnected ? "Connected" : "Disconnected"}</h3>
                </div>
                <div className={`h-10 w-10 rounded-full ${twitterConnected ? 'bg-green-500/10' : 'bg-red-500/10'} flex items-center justify-center`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${twitterConnected ? 'text-green-400' : 'text-red-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800/50 p-4 rounded-xl shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Auto-Post</p>
                  <h3 className="text-2xl font-bold text-white">{autoPostToTwitter && twitterConnected ? "Enabled" : "Disabled"}</h3>
                </div>
                <div className={`h-10 w-10 rounded-full ${autoPostToTwitter && twitterConnected ? 'bg-purple-500/10' : 'bg-gray-500/10'} flex items-center justify-center`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${autoPostToTwitter && twitterConnected ? 'text-purple-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-800">
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveTab("content")}
                className={`py-3 px-1 -mb-px font-medium text-sm transition-colors ${
                  activeTab === "content"
                    ? "border-b-2 border-blue-500 text-blue-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Your Content
              </button>
              <button
                onClick={() => setActiveTab("generate")}
                className={`py-3 px-1 -mb-px font-medium text-sm transition-colors ${
                  activeTab === "generate"
                    ? "border-b-2 border-blue-500 text-blue-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Generate New
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`py-3 px-1 -mb-px font-medium text-sm transition-colors ${
                  activeTab === "settings"
                    ? "border-b-2 border-blue-500 text-blue-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Settings
              </button>
            </div>
          </div>
        </div>
        
        {/* Auto-post setting */}
        {activeTab === "settings" && (
          <div className="mb-8 p-6 bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800/50 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Twitter Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    id="autopost"
                    checked={twitterConnected && autoPostToTwitter}
                    onChange={(e) => setAutoPostToTwitter(e.target.checked)}
                    disabled={!twitterConnected}
                    className="w-10 h-5 appearance-none bg-gray-700 rounded-full checked:bg-blue-500 transition duration-200 relative cursor-pointer"
                  />
                  <div className={`dot absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition ${(twitterConnected && autoPostToTwitter) ? 'transform translate-x-5' : ''}`}></div>
                </div>
                <label htmlFor="autopost" className={`text-sm font-medium ${!twitterConnected ? 'text-gray-500' : 'text-gray-300'}`}>
                  Auto-post to Twitter {!twitterConnected && "(Connect Twitter first)"}
                </label>
              </div>
              
              {!twitterConnected && (
                <div className="mt-4 bg-gray-800/40 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 text-yellow-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-300">Connect your Twitter account to enable auto-posting and sharing content directly to your feed.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Generate Content Section */}
        {activeTab === "generate" && (
          <div className="mb-8">
            <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800/50 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Generate New Content</h2>
              <GenerateContent />
            </div>
          </div>
        )}

        {/* Content List Section */}
        {activeTab === "content" && (
          <div>
            {loadingContent ? (
              <div className="flex flex-col items-center justify-center p-12">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-400">Loading your content...</p>
              </div>
            ) : error ? (
              <div className="p-6 bg-red-900/20 border border-red-800/50 rounded-xl text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-300 font-medium">{error}</p>
                <button className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm">Retry</button>
              </div>
            ) : contentList.length === 0 ? (
              <div className="p-12 bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800/50 rounded-xl text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="text-lg font-medium text-gray-300 mb-2">No content yet</h3>
                <p className="text-gray-400 mb-6">Start by generating your first piece of content</p>
                <button 
                  onClick={() => setActiveTab("generate")}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md transition-all text-sm font-medium"
                >
                  Create Content
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contentList.map((item: any) => (
                  <ContentCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardFallback() {
  return (
    <div className="container mx-auto px-4 pt-24 pb-16">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-800 rounded-md w-48 mb-4"></div>
        <div className="h-4 bg-gray-800 rounded-md w-64 mb-8"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="h-24 bg-gray-900 rounded-xl border border-gray-800"></div>
          <div className="h-24 bg-gray-900 rounded-xl border border-gray-800"></div>
          <div className="h-24 bg-gray-900 rounded-xl border border-gray-800"></div>
        </div>
        
        <div className="h-12 bg-gray-900 rounded-md w-full mb-8"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-900 rounded-xl border border-gray-800"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="bg-black min-h-screen">
      <Suspense fallback={<DashboardFallback />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}