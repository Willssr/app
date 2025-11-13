import React from 'react';
import { User } from '../types';

interface RankingProps {
  users: User[];
}

const Ranking: React.FC<RankingProps> = ({ users }) => {
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);

  const getRankIndicator = (rank: number) => {
    if (rank === 0) return '🥇';
    if (rank === 1) return '🥈';
    if (rank === 2) return '🥉';
    return `#${rank + 1}`;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6 text-text-primary">Leaderboard</h2>
      <div className="space-y-3">
        {sortedUsers.map((user, index) => (
          <div key={user.id} className="bg-background-secondary border border-border-color rounded-xl p-4 flex items-center justify-between shadow-lg transition-transform hover:scale-[1.02] hover:border-accent/50 duration-200">
            <div className="flex items-center space-x-4">
              <span className={`font-bold w-10 text-center text-xl ${index < 3 ? '' : 'text-text-secondary'}`}>{getRankIndicator(index)}</span>
              <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full border-2 border-background-tertiary" />
              <p className="font-semibold text-lg text-text-primary">{user.name}</p>
            </div>
            <p className="font-bold text-lg text-accent">{user.points.toLocaleString()} pts</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ranking;