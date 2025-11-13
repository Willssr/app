import React from 'react';
import { User, Post, FriendRequest, Story } from '../types';
import { PlusIcon, ArrowLeftIcon } from '../constants';

interface ProfileProps {
    user: User;
    posts: Post[];
    stories: Story[];
    currentUser: User;
    onEditProfile: () => void;
    onBack: () => void;
    friendRequests: FriendRequest[];
    onSendFriendRequest: (toId: string) => void;
    onBlockUser: (userId: string) => void;
    onViewStories: (userId:string) => void;
    onCreateStory: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, posts, onEditProfile, currentUser, onBack, friendRequests, onSendFriendRequest, onBlockUser, onViewStories, onCreateStory, stories }) => {
    const isOwnProfile = user.id === currentUser.id;

    const userPosts = posts.filter(post => {
        if (post.user.id !== user.id) return false;
        if (isOwnProfile) {
            return post.status === 'approved' || post.status === 'pending';
        }
        return post.status === 'approved';
    });
    
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeStories = stories.filter(story => story.userId === user.id && story.timestamp > twentyFourHoursAgo);
    const hasActiveStories = activeStories.length > 0;

    const friendshipStatus = () => {
        if (currentUser.friends.includes(user.id)) return 'friends';
        if (friendRequests.some(r => r.from.id === currentUser.id && r.to.id === user.id)) return 'pending';
        return 'none';
    };
    
    const status = friendshipStatus();

    const renderActionButtons = () => {
        if (isOwnProfile) {
            return (
                <button
                    onClick={onEditProfile}
                    className="mt-4 bg-background-tertiary hover:bg-border-color text-text-primary font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
                >
                    Edit Profile
                </button>
            );
        }

        return (
            <div className="mt-4 flex items-center justify-center space-x-2">
                {status === 'none' && (
                    <button onClick={() => onSendFriendRequest(user.id)} className="bg-accent hover:bg-accent-hover text-white font-bold py-2 px-6 rounded-lg">
                        Add Friend
                    </button>
                )}
                 {status === 'pending' && (
                    <button className="bg-background-tertiary text-text-primary font-bold py-2 px-6 rounded-lg cursor-not-allowed">
                        Request Sent
                    </button>
                )}
                 {status === 'friends' && (
                    <button className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg">
                        Friends
                    </button>
                )}
                <button onClick={() => onBlockUser(user.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                    Block
                </button>
            </div>
        );
    }


    return (
        <div className="max-w-4xl mx-auto">
             {!isOwnProfile && (
                <button onClick={onBack} className="mb-4 text-accent hover:underline flex items-center space-x-2">
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Back</span>
                </button>
            )}
            {/* Header section */}
            <div className="relative">
                <div 
                    className="h-48 md:h-64 bg-background-tertiary rounded-t-xl bg-cover bg-center"
                    style={{ backgroundImage: `url(${user.coverPhoto || 'https://via.placeholder.com/1200x400'})` }}
                >
                </div>
                <div className="absolute -bottom-16 left-6">
                   <div className="relative">
                     <button 
                        onClick={() => hasActiveStories && onViewStories(user.id)} 
                        className={`rounded-full block transition-transform duration-200 ${hasActiveStories ? 'p-1 bg-gradient-to-tr from-blue-400 via-purple-500 to-pink-500 hover:scale-105' : ''}`}
                        disabled={!hasActiveStories}
                        aria-label="View stories"
                      >
                        <div className="p-1 bg-background-primary rounded-full">
                            <img 
                                src={user.avatar} 
                                alt={user.name} 
                                className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover"
                            />
                        </div>
                     </button>
                     {isOwnProfile && (
                         <button 
                            onClick={onCreateStory}
                            className="absolute bottom-1 right-1 bg-accent hover:bg-accent-hover rounded-full h-9 w-9 flex items-center justify-center border-4 border-background-primary"
                            aria-label="Add to your story"
                        >
                            <PlusIcon className="h-5 w-5 text-white" />
                         </button>
                     )}
                   </div>
                </div>
            </div>

            {/* User Info section */}
            <div className="bg-background-secondary rounded-b-xl pt-20 pb-6 px-6 shadow-md border border-t-0 border-border-color">
                <div className="flex justify-end">
                     {renderActionButtons()}
                </div>
                <h1 className="text-3xl font-bold text-text-primary mt-2">{user.name}</h1>
                <p className="text-text-secondary mt-2">{user.bio || 'No bio yet.'}</p>
                
                <div className="flex items-center space-x-6 mt-4 text-text-secondary">
                    <span><strong className="text-text-primary">{userPosts.length}</strong> Posts</span>
                    <span><strong className="text-text-primary">{user.friends.length}</strong> Friends</span>
                    <span><strong className="text-text-primary">{user.points}</strong> Points</span>
                </div>
                
                {user.profileMusicUrl && (
                    <div className="mt-6">
                        <audio controls src={user.profileMusicUrl} className="w-full max-w-xs h-10">
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                )}
            </div>

            {/* User Posts section */}
            <div className="mt-8">
                <h2 className="text-xl font-bold text-center text-text-primary border-b-2 border-accent inline-block">Posts</h2>
                {userPosts.length > 0 ? (
                    <div className="grid grid-cols-3 gap-1 mt-4">
                        {userPosts.map(post => (
                            <div key={post.id} className="aspect-square bg-background-secondary overflow-hidden group relative">
                                {post.type === 'image' ? (
                                    <img src={post.url} alt={post.caption} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                ) : (
                                    <video src={post.url} className="w-full h-full object-cover" />
                                )}
                                {isOwnProfile && post.status === 'pending' && (
                                    <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center p-2">
                                        <p className="text-white font-bold text-sm">Pending</p>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center p-2">
                                    <p className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm line-clamp-3">{post.caption}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-text-secondary mt-8 bg-background-secondary py-10 rounded-lg">
                        <p>No posts yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;