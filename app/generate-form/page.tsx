'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  platform: 'instagram' | 'linkedin' | 'twitter';
  topic: string;
  keywords: string;
  tone: string;
  autoPost: boolean;
}

export default function GenerateForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    platform: 'twitter',
    topic: '',
    keywords: '',
    tone: 'professional',
    autoPost: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Convert comma-separated keywords to array
      const keywordsArray = formData.keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          keywords: keywordsArray,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      // Handle successful generation - you might want to redirect to a results page
      alert("created")
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Generate AI Content</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Platform Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Select Platform
          </label>
          <select
            value={formData.platform}
            onChange={(e) => setFormData({ ...formData, platform: e.target.value as FormData['platform'] })}
            className="w-full p-2 rounded border border-gray-700 bg-gray-800 text-white"
            required
          >
            <option value="twitter">Twitter</option>
            <option value="linkedin">LinkedIn</option>
            <option value="instagram">Instagram</option>
          </select>
        </div>

        {/* Topic Input */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Topic
          </label>
          <input
            type="text"
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            placeholder="Enter your content topic"
            className="w-full p-2 rounded border border-gray-700 bg-gray-800 text-white"
            required
          />
        </div>

        {/* Keywords Input */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Keywords (comma-separated)
          </label>
          <input
            type="text"
            value={formData.keywords}
            onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
            placeholder="Enter keywords separated by commas"
            className="w-full p-2 rounded border border-gray-700 bg-gray-800 text-white"
            required
          />
        </div>

        {/* Tone Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Content Tone
          </label>
          <select
            value={formData.tone}
            onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
            className="w-full p-2 rounded border border-gray-700 bg-gray-800 text-white"
            required
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
            <option value="humorous">Humorous</option>
          </select>
        </div>

        {/* Auto-post Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="autoPost"
            checked={formData.autoPost}
            onChange={(e) => setFormData({ ...formData, autoPost: e.target.checked })}
            className="rounded border-gray-700 bg-gray-800"
          />
          <label htmlFor="autoPost" className="text-sm font-medium">
            Auto-post to selected platform
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded font-medium ${
            isLoading
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Generating...' : 'Generate Content'}
        </button>
      </form>
    </div>
  );
}