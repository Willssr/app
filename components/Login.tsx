import React, { useState } from 'react';
import { MOCK_USERS } from '../constants';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithGoogle,
    auth,
    isFirebaseConfigured
} from '../services/firebase';
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
            autoComplete={id === 'password' ? 'current-password' : 'email'}
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

const WarningIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}>
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
        <path fill="#FF3D00" d="M6.306 14.691c-1.222 2.364-1.954 5.031-1.954 7.842s.732 5.478 1.954 7.842l-5.657 5.657C.623 33.567 0 28.937 0 24s.623-9.567 2.649-13.809l4.331 4.331z"/>
        <path fill="#4CAF50" d="M24 48c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 40.791 26.715 42 24 42c-4.819 0-8.93-2.655-10.74-6.392l-6.364 5.253C10.187 43.181 16.57 48 24 48z"/>
        <path fill="#1976D2" d="M43.611 20.083L48 16V8h-8v8h-3.99c-1.071 4.29-4.223 7.88-8.214 9.923l6.012 5.012C42.844 32.531 46 26.73 46 20c0-1.341-.138-2.65-.389-3.917z"/>
    </svg>
);

const Login: React.FC<LoginProps> = ({ onMockLogin }) => {
    const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isConfigError, setIsConfigError] = useState(false);
    const [isDomainError, setIsDomainError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resetEmailSent, setResetEmailSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setIsConfigError(false);
        setIsDomainError(false);

        const userEmail = email.trim();

        if (mode === 'register') {
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
                // The onAuthStateChanged listener will now handle all profile creation.
                await createUserWithEmailAndPassword(auth!, userEmail, password);
            } catch (err: any) {
                if (err.code === 'auth/configuration-not-found') {
                    setIsConfigError(true);
                } else {
                    setError(getFriendlyErrorMessage(err.code));
                }
            } finally {
                setIsLoading(false);
            }
        } else { // Login mode
            try {
                await signInWithEmailAndPassword(auth!, userEmail, password);
            } catch (err: any) {
                if (err.code === 'auth/configuration-not-found') {
                    setIsConfigError(true);
                } else {
                    setError(getFriendlyErrorMessage(err.code));
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError(null);
        setIsConfigError(false);
        setIsDomainError(false);
    
        try {
            await signInWithGoogle();
            // onAuthStateChanged will handle the rest
        } catch (err: any) {
            if (err.code === 'auth/unauthorized-domain') {
                setIsDomainError(true);
            } else if (err.code === 'auth/popup-closed-by-user') {
                setError("Sign-in process was cancelled.");
            } else if (err.code === 'auth/account-exists-with-different-credential') {
                setError("An account already exists with the same email address but different sign-in credentials.");
            } else {
                setError("Could not sign in with Google. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setResetEmailSent(false);

        try {
            await sendPasswordResetEmail(auth!, email.trim());
            setResetEmailSent(true);
        } catch (err: any) {
            setError(getFriendlyErrorMessage(err.code));
        } finally {
            setIsLoading(false);
        }
    };

    const getFriendlyErrorMessage = (code: string) => {
        console.error("Firebase Auth Error:", code);
        switch (code) {
            case 'auth/user-not-found': return 'No account found with this email.';
            case 'auth/email-already-in-use': return 'An account with this email already exists.';
            case 'auth/weak-password': return 'Password is too weak (must be at least 6 characters).';
            case 'auth/invalid-credential': return 'Invalid email or password. Please try again.';
            case 'auth/invalid-email': return 'The email address is not valid.';
            case 'auth/operation-not-allowed': return 'This operation is not enabled. Please contact support.';
            default: return 'An unexpected error occurred. Please try again.';
        }
    };
    
    const handleModeChange = (newMode: 'login' | 'register' | 'reset') => {
        setMode(newMode);
        setError(null);
        setIsConfigError(false);
        setIsDomainError(false);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setResetEmailSent(false);
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
    
    if (isConfigError) {
        return (
            <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4 font-sans">
                <div className="w-full max-w-lg text-center bg-gray-800 p-8 rounded-lg shadow-xl border-2 border-red-500">
                    <WarningIcon className="h-16 w-16 mx-auto text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold text-red-400 mb-3">Action Required: Project Configuration</h2>
                    <p className="text-gray-300 mb-6">
                        The app cannot connect to the login service because a required feature ("Email/Password" sign-in) is disabled in your Firebase project.
                    </p>
                    <div className="text-left bg-gray-900 p-4 rounded-md">
                        <p className="font-semibold text-white">To fix this, you MUST follow these steps:</p>
                        <ol className="list-decimal list-inside ml-2 mt-2 space-y-2 text-gray-300">
                            <li>
                                Click the button below to open your Firebase project settings.
                                <a 
                                    href={`https://console.firebase.google.com/project/ninoviskapp/authentication/providers`}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block w-full text-center mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                >
                                    Open Firebase Sign-in Methods
                                </a>
                            </li>
                            <li>
                                In the list of sign-in providers, find <strong>"Email/Password"</strong>.
                            </li>
                            <li>
                                Click to edit it, toggle the switch to <strong className="text-green-400">Enabled</strong>, and click Save.
                            </li>
                        </ol>
                    </div>
                    <p className="mt-6 text-sm text-gray-400">
                        After completing these steps, please <button onClick={() => window.location.reload()} className="text-purple-400 underline hover:text-purple-300">refresh this page</button>.
                    </p>
                </div>
            </div>
        );
    }

    if (isDomainError) {
        return (
            <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4 font-sans">
                <div className="w-full max-w-lg text-center bg-gray-800 p-8 rounded-lg shadow-xl border-2 border-red-500">
                    <WarningIcon className="h-16 w-16 mx-auto text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold text-red-400 mb-3">Action Required: Authorize Domain</h2>
                    <p className="text-gray-300 mb-6">
                        The app cannot use Google Sign-In because its domain is not authorized by your Firebase project.
                    </p>
                    <div className="text-left bg-gray-900 p-4 rounded-md">
                        <p className="font-semibold text-white">To fix this, you MUST follow these steps:</p>
                        <ol className="list-decimal list-inside ml-2 mt-2 space-y-2 text-gray-300">
                            <li>
                                Click the button below to open your Firebase project settings.
                                <a 
                                    href={`https://console.firebase.google.com/project/ninoviskapp/authentication/settings`}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block w-full text-center mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                >
                                    Open Firebase Auth Settings
                                </a>
                            </li>
                            <li>
                                Under the <strong>"Authorized domains"</strong> section, click <strong>"Add domain"</strong>.
                            </li>
                            <li>
                                Enter the following domain and click Add:
                                <div className="mt-2 p-2 bg-gray-700 rounded-md text-center font-mono text-purple-300">
                                    {typeof window !== 'undefined' ? window.location.hostname : 'your-domain.com'}
                                </div>
                            </li>
                        </ol>
                    </div>
                    <p className="mt-6 text-sm text-gray-400">
                        After adding the domain, please <button onClick={() => window.location.reload()} className="text-purple-400 underline hover:text-purple-300">refresh this page</button>.
                    </p>
                </div>
            </div>
        );
    }


    const renderMainContent = () => {
        if (mode === 'reset') {
            return (
                 <div className="bg-gray-800 rounded-lg shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-center text-white mb-2">Forgot Password?</h2>
                    <p className="text-center text-gray-400 mb-6">Enter your email and we'll send you a link to reset your password.</p>
                    {resetEmailSent ? (
                         <div className="text-center py-4">
                            <p className="text-green-400 font-semibold">✅ Reset link sent!</p>
                            <p className="text-gray-300 mt-1">Please check your inbox.</p>
                            <button onClick={() => handleModeChange('login')} className="mt-6 text-sm font-semibold text-purple-400 hover:text-purple-300">
                                &larr; Back to Sign In
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <InputField id="email" type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
                            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                            <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
                                {isLoading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                             <div className="text-center pt-2">
                                <button type="button" onClick={() => handleModeChange('login')} className="text-sm font-semibold text-gray-400 hover:text-white">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )
        }
        return (
            <div className="bg-gray-800 rounded-lg shadow-xl p-8">
                <div className="flex border-b border-gray-700 mb-6">
                    <button onClick={() => handleModeChange('login')} className={`w-1/2 py-3 font-semibold transition-colors ${mode === 'login' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400'}`}>Sign In</button>
                    <button onClick={() => handleModeChange('register')} className={`w-1/2 py-3 font-semibold transition-colors ${mode === 'register' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400'}`}>Create Account</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField id="email" type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />

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
                    
                    {mode === 'login' && (
                        <div className="text-right -mt-2">
                           <button type="button" onClick={() => handleModeChange('reset')} className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors">
                                Forgot Password?
                           </button>
                        </div>
                    )}

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
                        {isLoading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <div className="relative flex items-center justify-center my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-800 text-gray-400">OR</span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center bg-white text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                    <GoogleIcon className="w-6 h-6 mr-3" />
                    Sign in with Google
                </button>
            </div>
        );
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        NinoVisk
                    </h1>
                    <p className="text-gray-400 mt-2">Your new favorite social space.</p>
                </div>
                {renderMainContent()}
            </div>
        </div>
    );
};

export default Login;