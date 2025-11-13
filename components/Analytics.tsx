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

  const COLORS = ['#A855F7', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6 text-accent">Analytics</h2>
      
      {/* Engagement Analytics */}
      <div className="bg-background-secondary border border-border-color rounded-xl p-6 shadow-xl">
        <h3 className="text-xl font-semibold mb-4 text-text-primary">Post Engagement</h3>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #374151', color: '#F9FAFB' }} />
                    <Legend wrapperStyle={{ color: '#F9FAFB' }} />
                    <Bar dataKey="likes" fill="#A855F7" />
                    <Bar dataKey="comments" fill="#EC4899" />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Location Analytics */}
      <div className="bg-background-secondary border border-border-color rounded-xl p-6 shadow-xl">
        <h3 className="text-xl font-semibold mb-4 text-text-primary">Audience Location</h3>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                 <BarChart data={locationData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9CA3AF" />
                    <YAxis type="category" dataKey="city" stroke="#9CA3AF" width={100} />
                    <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #374151' }} />
                    <Legend wrapperStyle={{ color: '#F9FAFB' }} />
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
            className="bg-gradient-to-r from-accent to-pink-500 text-white font-bold py-2 px-6 rounded-full hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Analyzing...' : 'Get AI Insights'}
          </button>
        </div>
        
        {locationAnalysis && (
          <div className="mt-6 p-4 bg-background-tertiary rounded-lg border border-accent">
            <p className="text-text-primary italic">{locationAnalysis}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;