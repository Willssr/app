import React, { useState, useMemo, useCallback } from 'react';
import { Post, LocationData } from '../types';
import { MOCK_LOCATIONS } from '../constants';
import { analyzeLocationData } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface AnalyticsProps {
  posts: Post[];
}

const Analytics: React.FC<AnalyticsProps> = ({ posts }) => {
  const [locationAnalysis, setLocationAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const engagementData = useMemo(() => 
    posts.map(post => ({
      name: `Post #${post.id}`,
      likes: post.likes.length,
      comments: post.comments.length,
    })).slice(0, 10).reverse(), // show latest 10 posts
  [posts]);

  const locationData = useMemo(() => MOCK_LOCATIONS, []);
  
  const handleAnalyzeClick = useCallback(async () => {
    setIsLoading(true);
    setLocationAnalysis('');
    const result = await analyzeLocationData(locationData);
    setLocationAnalysis(result);
    setIsLoading(false);
  }, [locationData]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Analytics</h2>
      
      {/* Engagement Analytics */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
        <h3 className="text-xl font-semibold mb-4 text-white">Post Engagement</h3>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                    <XAxis dataKey="name" stroke="#A0AEC0" />
                    <YAxis stroke="#A0AEC0" />
                    <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: 'none', color: '#E2E8F0' }} />
                    <Legend wrapperStyle={{ color: '#E2E8F0' }} />
                    <Bar dataKey="likes" fill="#8B5CF6" />
                    <Bar dataKey="comments" fill="#EC4899" />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Location Analytics */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
        <h3 className="text-xl font-semibold mb-4 text-white">Audience Location</h3>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                 <BarChart data={locationData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                    <XAxis type="number" stroke="#A0AEC0" />
                    <YAxis type="category" dataKey="city" stroke="#A0AEC0" width={100} />
                    <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: 'none' }} />
                    <Legend wrapperStyle={{ color: '#E2E8F0' }} />
                    <Bar dataKey="count" name="Users" fill="#8884d8">
                       {locationData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
        
        <div className="mt-6 text-center">
          <button 
            onClick={handleAnalyzeClick} 
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-6 rounded-full hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Analyzing...' : 'Get AI Insights'}
          </button>
        </div>
        
        {locationAnalysis && (
          <div className="mt-6 p-4 bg-gray-700/50 rounded-lg border border-purple-500">
            <p className="text-gray-200 italic">{locationAnalysis}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;