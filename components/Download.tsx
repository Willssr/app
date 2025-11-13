import React, { useState, useEffect } from 'react';
import { ShareIOSIcon, MenuAndroidIcon, DownloadIcon } from '../constants';

// Define the event type for BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const InstructionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
        <h3 className="text-xl font-bold mb-4 text-purple-400">{title}</h3>
        <div className="space-y-3 text-gray-300">{children}</div>
    </div>
);

const InstructionStep: React.FC<{ icon: React.ReactNode; text: string; }> = ({ icon, text }) => (
    <div className="flex items-center space-x-4">
        <div className="bg-gray-700 p-2 rounded-md">{icon}</div>
        <span>{text}</span>
    </div>
);

const Download: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isAppInstalled, setIsAppInstalled] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };
        
        // Check if the app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsAppInstalled(true);
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
            setIsAppInstalled(true);
        } else {
            console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Install NinoVisk</h2>
                <p className="mt-2 text-gray-400">
                    Add NinoVisk to your home screen for a faster, app-like experience.
                </p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-center">
                {isAppInstalled ? (
                     <p className="text-green-400 font-semibold">NinoVisk is already installed on your device!</p>
                ) : deferredPrompt ? (
                    <button 
                        onClick={handleInstallClick}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-full hover:scale-105 transition-transform duration-200 flex items-center justify-center w-full"
                    >
                        <DownloadIcon className="w-6 h-6 mr-2" />
                        Install NinoVisk App
                    </button>
                ) : (
                    <p className="text-gray-400">Installation is not currently available on your browser, but you can follow the manual steps below.</p>
                )}
            </div>

            <InstructionCard title="For iOS / Safari">
                <InstructionStep
                    icon={<ShareIOSIcon className="w-6 h-6 text-white" />}
                    text="Tap the 'Share' button in the bottom menu."
                />
                 <InstructionStep
                    icon={<span className="text-xl">⊕</span>}
                    text="Scroll down and tap on 'Add to Home Screen'."
                />
                 <InstructionStep
                    icon={<span className="font-bold">✓</span>}
                    text="Confirm by tapping 'Add' in the top right."
                />
            </InstructionCard>

            <InstructionCard title="For Android / Chrome">
                <InstructionStep
                    icon={<MenuAndroidIcon className="w-6 h-6 text-white" />}
                    text="Tap the three-dot menu icon in the top right corner."
                />
                 <InstructionStep
                    icon={<span className="text-xl">↓</span>}
                    text="Tap on 'Install app' or 'Add to Home screen'."
                />
                 <InstructionStep
                    icon={<span className="font-bold">✓</span>}
                    text="Follow the on-screen prompts to confirm."
                />
            </InstructionCard>
        </div>
    );
};

export default Download;