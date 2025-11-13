import React from 'react';
import { UserIcon, ShieldCheckIcon, ArrowRightOnRectangleIcon, DownloadIcon } from '../constants';

interface SettingsProps {
    onSignOut: () => void;
    onEditProfile: () => void;
    onNavigateToDownload: () => void;
    onNavigateToPrivacy: () => void;
}

const SettingsRow: React.FC<{ icon: React.ReactNode, label: string, onClick: () => void }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center justify-between p-4 bg-background-secondary hover:bg-background-tertiary rounded-lg transition-colors duration-200">
        <div className="flex items-center space-x-4">
            <div className="text-accent">{icon}</div>
            <span className="text-text-primary font-medium">{label}</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
    </button>
)

const Settings: React.FC<SettingsProps> = ({ onSignOut, onEditProfile, onNavigateToDownload, onNavigateToPrivacy }) => {
    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-text-primary">Settings</h2>

            <div className="space-y-4">
                 <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-text-secondary px-2">ACCOUNT</h3>
                    <SettingsRow icon={<UserIcon className="w-6 h-6" />} label="Edit Profile" onClick={onEditProfile} />
                    <SettingsRow icon={<ShieldCheckIcon className="w-6 h-6" />} label="Privacy & Security" onClick={onNavigateToPrivacy} />
                </div>
                
                 <div className="space-y-2">
                     <h3 className="text-sm font-semibold text-text-secondary px-2">APP</h3>
                    <SettingsRow icon={<DownloadIcon className="w-6 h-6" />} label="Install App" onClick={onNavigateToDownload} />
                </div>

                <div className="pt-4">
                     <button
                        onClick={onSignOut}
                        className="w-full flex items-center justify-center space-x-3 p-4 bg-red-800/20 text-red-400 hover:bg-red-800/40 rounded-lg transition-colors duration-200"
                    >
                        <ArrowRightOnRectangleIcon className="w-6 h-6"/>
                        <span className="font-medium">Sign Out</span>
                     </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;