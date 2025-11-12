import React from 'react';
import { User, FriendRequest } from '../types';

interface FriendsProps {
    currentUser: User;
    users: User[];
    requests: FriendRequest[];
    onAccept: (requestId: string) => void;
    onDecline: (requestId: string) => void;
    onViewChat: (userId: string) => void;
}

const Friends: React.FC<FriendsProps> = ({ currentUser, users, requests, onAccept, onDecline, onViewChat }) => {
    const friends = users.filter(user => currentUser.friends.includes(user.id));

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Friend Requests</h2>
                <div className="space-y-3">
                    {requests.length > 0 ? requests.map(req => (
                        <div key={req.id} className="bg-gray-800 rounded-lg p-3 flex items-center justify-between shadow-lg">
                            <div className="flex items-center space-x-3">
                                <img src={req.from.avatar} alt={req.from.name} className="w-10 h-10 rounded-full" />
                                <p className="font-semibold">{req.from.name}</p>
                            </div>
                            <div className="space-x-2">
                                <button onClick={() => onAccept(req.id)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-md text-sm">Accept</button>
                                <button onClick={() => onDecline(req.id)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded-md text-sm">Decline</button>
                            </div>
                        </div>
                    )) : (
                        <p className="text-gray-500">No new friend requests.</p>
                    )}
                </div>
            </div>

            <div>
                 <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">My Friends ({friends.length})</h2>
                <div className="space-y-3">
                     {friends.length > 0 ? friends.map(friend => (
                        <button key={friend.id} onClick={() => onViewChat(friend.id)} className="w-full bg-gray-800 rounded-lg p-3 flex items-center justify-between shadow-lg hover:bg-gray-700/50 transition-colors">
                            <div className="flex items-center space-x-3">
                                <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full" />
                                <p className="font-semibold">{friend.name}</p>
                            </div>
                            <p className="text-sm text-gray-400">Message</p>
                        </button>
                    )) : (
                        <p className="text-gray-500">You haven't added any friends yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Friends;