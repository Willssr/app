import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onSignOut }) => {
  return (
    <header className="bg-gray-800/80 backdrop-blur-sm sticky top-0 z-10 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="w-1/3"></div>
        <div className="w-1/3 text-center">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            NinoVisk
            </h1>
        </div>
        <div className="w-1/3 flex justify-end items-center space-x-3">
          {user && (
            <>
              <span className="text-sm text-gray-300 hidden sm:block">
                Welcome, {user.name}
              </span>
              <button
                onClick={onSignOut}
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-1 px-3 rounded-full transition-colors duration-200"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;