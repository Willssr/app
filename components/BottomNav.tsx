import React from 'react';
import { HomeIcon, TrophyIcon, ChartBarIcon, UserIcon, ClipboardCheckIcon, UsersIcon, BellIcon, DownloadIcon } from '../constants';

type ActiveTab = 'feed' | 'ranking' | 'analytics' | 'friends' | 'notifications' | 'profile' | 'review' | 'download';

interface BottomNavProps {
  activeTab?: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isAdmin: boolean;
  hasUnreadNotifications: boolean;
}

const NavButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  hasNotification?: boolean;
}> = ({ label, icon, isActive, onClick, hasNotification }) => (
  <button
    onClick={onClick}
    className={`relative flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
      isActive ? 'text-purple-400' : 'text-gray-400 hover:text-white'
    }`}
  >
    {icon}
     {hasNotification && (
        <span className="absolute top-1 right-1/2 -mr-4 h-2 w-2 rounded-full bg-red-500"></span>
      )}
    <span className="text-xs mt-1">{label}</span>
  </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, isAdmin, hasUnreadNotifications }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800/80 backdrop-blur-sm border-t border-gray-700 shadow-lg z-10">
      <div className="container mx-auto flex justify-around">
        <NavButton
          label="Feed"
          icon={<HomeIcon />}
          isActive={activeTab === 'feed'}
          onClick={() => setActiveTab('feed')}
        />
        <NavButton
          label="Ranking"
          icon={<TrophyIcon />}
          isActive={activeTab === 'ranking'}
          onClick={() => setActiveTab('ranking')}
        />
         <NavButton
          label="Friends"
          icon={<UsersIcon />}
          isActive={activeTab === 'friends'}
          onClick={() => setActiveTab('friends')}
        />
        <NavButton
          label="Notifications"
          icon={<BellIcon />}
          isActive={activeTab === 'notifications'}
          onClick={() => setActiveTab('notifications')}
          hasNotification={hasUnreadNotifications}
        />
         <NavButton
          label="Install"
          icon={<DownloadIcon className="h-6 w-6" />}
          isActive={activeTab === 'download'}
          onClick={() => setActiveTab('download')}
        />
         {isAdmin && (
            <NavButton
            label="Review"
            icon={<ClipboardCheckIcon className="h-6 w-6" />}
            isActive={activeTab === 'review'}
            onClick={() => setActiveTab('review')}
            />
        )}
        <NavButton
          label="Profile"
          icon={<UserIcon />}
          isActive={activeTab === 'profile'}
          onClick={() => setActiveTab('profile')}
        />
      </div>
    </nav>
  );
};

export default BottomNav;