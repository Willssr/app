import React, { useState, useEffect } from 'react';
import { DownloadIcon } from '../constants';

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
    <div className="bg-background-secondary p-6 rounded-xl shadow-xl border border-border-color">
        <h3 className="text-xl font-bold mb-4 text-accent">{title}</h3>
        <div className="space-y-3 text-text-secondary">{children}</div>
    </div>
);

const InstructionStep: React.FC<{ icon: React.ReactNode; text: string; }> = ({ icon, text }) => (
    <div className="flex items-center space-x-4">
        <div className="bg-background-tertiary p-2 rounded-md">{icon}</div>
        <span>{text}</span>
    </div>
);

const ShareIOSIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
);

const MenuAndroidIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /></svg>
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
                <h2 className="text-3xl font-bold text-text-primary">Install NinoVisk</h2>
                <p className="mt-2 text-text-secondary">
                    Add NinoVisk to your home screen for a faster, app-like experience.
                </p>
            </div>
            
            <div className="bg-background-secondary p-6 rounded-xl shadow-xl text-center border border-border-color">
                {isAppInstalled ? (
                     <p className="text-green-400 font-semibold">NinoVisk is already installed on your device!</p>
                ) : deferredPrompt ? (
                    <button 
                        onClick={handleInstallClick}
                        className="bg-accent hover:bg-accent-hover text-white font-bold py-3 px-6 rounded-full hover:scale-105 transition-transform duration-200 flex items-center justify-center w-full"
                    >
                        <DownloadIcon className="w-6 h-6 mr-2" />
                        Install NinoVisk App
                    </button>
                ) : (
                    <p className="text-text-secondary">Installation is not currently available on your browser, but you can follow the manual steps below.</p>
                )}
            </div>

            <InstructionCard title="For iOS / Safari">
                <InstructionStep
                    icon={<ShareIOSIcon />}
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
                    icon={<MenuAndroidIcon />}
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