"use client";
import { useState } from 'react';
import { cn } from "@/app/lib/utils";
import axios from 'axios';

interface ContentCardProps {
  item: {
    id: string;
    title: string;
    body: string;
    createdAt: string;
  };
}

export default function ContentCard({ item }: ContentCardProps) {
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
