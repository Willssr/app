import React from 'react';
import { HomeIcon, TrophyIcon, UsersIcon, BellIcon, UserIcon, ChartBarIcon, DocumentMagnifyingGlassIcon } from '../constants';

type ActiveTab = 'feed' | 'ranking' | 'friends' | 'notifications' | 'profile' | 'analytics' | 'review';

interface BottomNavProps {
  activeTab?: ActiveTab | 'download';
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
      isActive ? 'text-accent' : 'text-text-secondary hover:text-text-primary'
    }`}
    aria-label={label}
  >
    <div className="relative">
      {icon}
      {hasNotification && (
        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
      )}
    </div>
    <span className={`text-xs mt-1 transition-all ${isActive ? 'font-bold' : ''}`}>{label}</span>
  </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, isAdmin, hasUnreadNotifications }) => {
  let navItems: { label: ActiveTab; icon: React.ReactNode; notification?: boolean }[] = [
    { label: 'feed', icon: <HomeIcon className="h-7 w-7" /> },
    { label: 'ranking', icon: <TrophyIcon className="h-7 w-7" /> },
    { label: 'friends', icon: <UsersIcon className="h-7 w-7" /> },
    { label: 'notifications', icon: <BellIcon className="h-7 w-7" />, notification: hasUnreadNotifications },
    { label: 'profile', icon: <UserIcon className="h-7 w-7" /> },
  ];

  if (isAdmin) {
      navItems = [
        { label: 'feed', icon: <HomeIcon className="h-7 w-7" /> },
        { label: 'analytics', icon: <ChartBarIcon className="h-7 w-7" /> },
        { label: 'review', icon: <DocumentMagnifyingGlassIcon className="h-7 w-7" /> },
        { label: 'ranking', icon: <TrophyIcon className="h-7 w-7" /> },
        { label: 'profile', icon: <UserIcon className="h-7 w-7" /> },
      ];
  }


  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background-primary/80 backdrop-blur-sm border-t border-border-color shadow-lg z-30">
      <div className="container mx-auto flex justify-around">
        {navItems.map(item => (
          <NavButton
            key={item.label}
            label={item.label.charAt(0).toUpperCase() + item.label.slice(1)}
            icon={item.icon}
            isActive={activeTab === item.label}
            onClick={() => setActiveTab(item.label)}
            hasNotification={item.notification}
          />
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;