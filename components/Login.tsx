import React from 'react';
import { GoogleIcon } from '../constants';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
          NinoVisk
        </h1>
        <p className="text-gray-400 mb-12">Your new favorite social space.</p>
        
        <button
          onClick={onLoginSuccess}
          className="bg-white text-gray-800 font-semibold py-3 px-6 rounded-lg flex items-center justify-center shadow-lg hover:bg-gray-200 transition-colors duration-300"
        >
          <GoogleIcon className="w-6 h-6 mr-3" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
