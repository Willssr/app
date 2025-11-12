import React from 'react';
import { ShareIOSIcon, MenuAndroidIcon } from '../constants';

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
    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Install NinoVisk</h2>
                <p className="mt-2 text-gray-400">
                    Add NinoVisk to your home screen for a faster, app-like experience.
                </p>
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
