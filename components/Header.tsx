import React from 'react';
import { CogIcon } from '../constants';

interface HeaderProps {
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => {
  return (
    <header className="bg-background-primary/80 backdrop-blur-sm sticky top-0 z-30 border-b border-border-color">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="w-1/3"></div>
        <div className="w-1/3 text-center">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              NinoVisk
            </h1>
        </div>
        <div className="w-1/3 flex justify-end items-center">
            <button
                onClick={onSettingsClick}
                className="text-text-secondary hover:text-text-primary transition-colors duration-200 p-2 rounded-full hover:bg-background-secondary"
                aria-label="Settings"
            >
                <CogIcon className="h-6 w-6" />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;