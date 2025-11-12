import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/80 backdrop-blur-sm sticky top-0 z-10 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <h1 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          NinoVisk
        </h1>
      </div>
    </header>
  );
};

export default Header;