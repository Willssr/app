import React from 'react';
import { User } from '../types';

interface RankingProps {
  users: User[];
}

const Ranking: React.FC<RankingProps> = ({ users }) => {
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);

  const getRankColor = (rank: number) => {
    if (rank === 0) return 'text-yellow-400 text-2xl';
    if (rank === 1) return 'text-gray-300 text-xl';
    if (rank === 2) return 'text-yellow-600 text-lg';
    return 'text-gray-400';
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Leaderboard</h2>
      <div className="space-y-3">
        {sortedUsers.map((user, index) => (
          <div key={user.id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between shadow-lg transition-transform hover:scale-105 duration-200">
            <div className="flex items-center space-x-4">
              <span className={`font-bold w-8 text-center ${getRankColor(index)}`}>#{index + 1}</span>
              <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full border-2 border-purple-500" />
              <p className="font-semibold text-lg text-white">{user.name}</p>
            </div>
            <p className="font-bold text-lg text-purple-400">{user.points} pts</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ranking;