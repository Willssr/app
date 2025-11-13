import React from 'react';
import { Notification } from '../types';

interface NotificationsProps {
    notifications: Notification[];
    onViewProfile: (userId: string) => void;
}

const timeSince = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    return Math.floor(seconds) + "s";
};

const NotificationItem: React.FC<{ notification: Notification; onViewProfile: (userId: string) => void }> = ({ notification, onViewProfile }) => {
    const { user, type, timestamp, read, post } = notification;

    const notificationText = () => {
        switch (type) {
            case 'like':
                return <><button onClick={(e) => { e.stopPropagation(); onViewProfile(user.id);}} className="font-semibold hover:underline">{user.name}</button> liked your post.</>;
            case 'friend_request':
                return <><button onClick={(e) => { e.stopPropagation(); onViewProfile(user.id);}} className="font-semibold hover:underline">{user.name}</button> sent you a friend request.</>;
            default:
                return 'New notification';
        }
    };

    return (
        <div className={`p-4 flex items-center space-x-4 rounded-lg transition-colors duration-300 border ${!read ? 'bg-background-tertiary border-accent/30' : 'bg-background-secondary border-border-color'}`}>
            <button onClick={() => onViewProfile(user.id)} className="flex-shrink-0">
                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
            </button>
            <div className="flex-grow">
                <p className="text-text-primary">{notificationText()}</p>
                <p className="text-xs text-text-secondary mt-1">{timeSince(timestamp)} ago</p>
            </div>
            {type === 'like' && post && (
                <img src={post.url} alt="post preview" className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
            )}
        </div>
    );
};

const Notifications: React.FC<NotificationsProps> = ({ notifications, onViewProfile }) => {
    const sortedNotifications = [...notifications].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-text-primary">Notifications</h2>
            <div className="space-y-3">
                {sortedNotifications.length > 0 ? (
                    sortedNotifications.map(notification => (
                        <NotificationItem key={notification.id} notification={notification} onViewProfile={onViewProfile} />
                    ))
                ) : (
                    <div className="text-center text-text-secondary mt-8 bg-background-secondary py-10 rounded-lg">
                        <p>You have no new notifications.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;