"use client";
import { useState, Dispatch, SetStateAction } from 'react';
import GenerateContent from '@/app/generate-form/page';

import { cn } from "@/app/lib/utils";
import ContentCard from './ContentCard';

interface DashboardTabsProps {
  contentList: any[];
  loadingContent: boolean;
  error: string;
  twitterConnected: boolean;
  autoPostToTwitter: boolean;
  setAutoPostToTwitter: Dispatch<SetStateAction<boolean>>;
  // onContentCreateButtonClick is handled internally now
}

export default function DashboardTabs({
  contentList,
  loadingContent,
  error,
  twitterConnected,
  autoPostToTwitter,
  setAutoPostToTwitter,
}: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState("content");

  return (
    <>
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
    </>
  );
}
