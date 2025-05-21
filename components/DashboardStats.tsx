"use client";

interface DashboardStatsProps {
  totalContent: number;
  twitterConnected: boolean;
  autoPostToTwitter: boolean;
}

export default function DashboardStats({ totalContent, twitterConnected, autoPostToTwitter }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800/50 p-4 rounded-xl shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Total Content</p>
            <h3 className="text-2xl font-bold text-white">{totalContent}</h3>
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
  );
}
