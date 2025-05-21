export default function DashboardFallback() {
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