import React, { useState } from 'react';
import { MOCK_USERS } from '../constants';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../services/firebase';
import { User } from '../types';

interface LoginProps {
  onMockLogin: (user: User) => void;
}

const InputField: React.FC<{ id: string; type: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = 
({ id, type, placeholder, value, onChange }) => (
    <div>
        <label htmlFor={id} className="sr-only">{placeholder}</label>
        <input
            id={id}
            name={id}
            type={type}
            autoComplete={id === 'password' ? 'current-password' : 'username'}
            required
            className="w-full bg-gray-700 border-gray-600 rounded-md p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    </div>
);

const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
  
const EyeSlashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228" />
    </svg>
);

const Login: React.FC<LoginProps> = ({ onMockLogin }) => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const id = identifier.trim();

        if (mode === 'register') {
            if (!/^[a-zA-Z0-9_]{3,15}$/.test(id)) {
                setError("ID must be 3-15 characters and can only contain letters, numbers, and underscores.");
                setIsLoading(false);
                return;
            }
            if (password !== confirmPassword) {
                setError("Passwords do not match.");
                setIsLoading(false);
                return;
            }
            if (password.length < 6) {
                setError("Password must be at least 6 characters long.");
                setIsLoading(false);
                return;
            }
            try {
                const emailForFirebase = `${id}@ninovisk.app`;
                const userCredential = await createUserWithEmailAndPassword(auth, emailForFirebase, password);
                await updateProfile(userCredential.user, { displayName: id });
            } catch (err: any) {
                setError(getFriendlyErrorMessage(err.code));
            } finally {
                setIsLoading(false);
            }
        } else { // Login mode
            try {
                const emailForFirebase = id.includes('@') ? id : `${id}@ninovisk.app`;
                await signInWithEmailAndPassword(auth, emailForFirebase, password);
            } catch (err: any) {
                setError(getFriendlyErrorMessage(err.code));
            } finally {
                setIsLoading(false);
            }
        }
    };

    const getFriendlyErrorMessage = (code: string) => {
        switch (code) {
            case 'auth/email-already-in-use': return 'This ID is already taken. Please choose another one.';
            case 'auth/invalid-email': return 'Please enter a valid email address.';
            case 'auth/weak-password': return 'Password is too weak (must be at least 6 characters).';
            case 'auth/invalid-credential': return 'Invalid ID/Email or password. Please try again.';
            default: return 'An unexpected error occurred. Please try again.';
        }
    };
    
    const handleModeChange = (newMode: 'login' | 'register') => {
        setMode(newMode);
        setError(null);
        setIdentifier('');
        setPassword('');
        setConfirmPassword('');
    }

    if (!isFirebaseConfigured) {
        return (
            <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4">
                <div className="text-center w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-xl">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
                        NinoVisk
                    </h1>
                    <p className="text-gray-400 mb-6">Firebase is not configured. Please select a mock user to continue.</p>
                    <div className="space-y-3">
                        {MOCK_USERS.map(user => (
                            <button key={user.id} onClick={() => onMockLogin(user)} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center transition-colors duration-200">
                                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full mr-4" />
                                <span>Log in as {user.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        NinoVisk
                    </h1>
                    <p className="text-gray-400 mt-2">Your new favorite social space.</p>
                </div>

                <div className="bg-gray-800 rounded-lg shadow-xl p-8">
                    <div className="flex border-b border-gray-700 mb-6">
                        <button onClick={() => handleModeChange('login')} className={`w-1/2 py-3 font-semibold transition-colors ${mode === 'login' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400'}`}>Sign In</button>
                        <button onClick={() => handleModeChange('register')} className={`w-1/2 py-3 font-semibold transition-colors ${mode === 'register' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400'}`}>Create Account</button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'register' ? (
                            <InputField id="id" type="text" placeholder="ID (Username)" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
                        ) : (
                            <InputField id="identifier" type="text" placeholder="ID or Email" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
                        )}

                        <div className="relative">
                            <InputField id="password" type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white" aria-label={showPassword ? "Hide password" : "Show password"}>
                                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                        </div>
                        
                        {mode === 'register' && (
                             <div className="relative">
                                <InputField id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white" aria-label={showConfirmPassword ? "Hide password" : "Show password"}>
                                    {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                </button>
                            </div>
                        )}
                        
                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                        <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
                            {isLoading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;