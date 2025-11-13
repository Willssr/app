import React from 'react';
import { User, Post, FriendRequest, Story } from '../types';
import { PlusIcon } from '../constants';

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

const Profile: React.FC<ProfileProps> = ({ user, posts, stories, onEditProfile, currentUser, onBack, friendRequests, onSendFriendRequest, onBlockUser, onViewStories, onCreateStory }) => {
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
                    className="mt-4 bg-background-tertiary hover:bg-border-color text-text-primary font-semibold py-2 px-4 rounded-full transition-colors duration-200"
                >
                    Edit Profile
                </button>
            );
        }

        return (
            <div className="mt-4 flex items-center justify-center space-x-2">
                {status === 'none' && (
                    <button onClick={() => onSendFriendRequest(user.id)} className="bg-accent hover:bg-accent-hover text-white font-bold py-2 px-4 rounded-full">
                        Add Friend
                    </button>
                )}
                 {status === 'pending' && (
                    <button className="bg-background-tertiary text-text-primary font-bold py-2 px-4 rounded-full cursor-not-allowed">
                        Pending
                    </button>
                )}
                 {status === 'friends' && (
                    <button className="bg-green-600 text-white font-bold py-2 px-4 rounded-full">
                        Friends
                    </button>
                )}
                <button onClick={() => onBlockUser(user.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full">
                    Block
                </button>
            </div>
        );
    }


    return (
        <div className="max-w-4xl mx-auto">
             {!isOwnProfile && (
                <button onClick={onBack} className="mb-4 text-accent hover:text-accent-hover">
                    &larr; Back to Feed
                </button>
            )}
            {/* Header section */}
            <div className="relative">
                <div 
                    className="h-48 md:h-64 bg-background-tertiary rounded-t-xl bg-cover bg-center"
                    style={{ backgroundImage: `url(${user.coverPhoto || 'https://via.placeholder.com/1200x400'})` }}
                >
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                   <div className="relative">
                     <button 
                        onClick={() => hasActiveStories && onViewStories(user.id)} 
                        className={`rounded-full block transition-transform duration-200 ${hasActiveStories ? 'p-1 bg-gradient-to-tr from-accent to-pink-500 hover:scale-105' : ''}`}
                        disabled={!hasActiveStories}
                        aria-label="View stories"
                      >
                        <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-background-primary object-cover"
                        />
                     </button>
                     {isOwnProfile && (
                         <button 
                            onClick={onCreateStory}
                            className="absolute -bottom-1 -right-1 bg-blue-500 hover:bg-blue-600 rounded-full h-8 w-8 flex items-center justify-center border-2 border-background-primary"
                            aria-label="Add to your story"
                        >
                            <PlusIcon className="h-5 w-5 text-white" />
                         </button>
                     )}
                   </div>
                </div>
            </div>

            {/* User Info section */}
            <div className="bg-background-secondary rounded-b-xl pt-20 pb-6 px-6 text-center shadow-xl border border-t-0 border-border-color">
                <h1 className="text-3xl font-bold text-text-primary">{user.name}</h1>
                <p className="text-text-secondary mt-2 max-w-lg mx-auto">{user.bio || 'No bio yet.'}</p>
                {renderActionButtons()}
                
                {user.profileMusicUrl && (
                    <div className="mt-6">
                        <p className="text-sm text-text-secondary mb-2">Vibe</p>
                        <audio controls src={user.profileMusicUrl} className="w-full max-w-xs mx-auto h-10">
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                )}
            </div>

            {/* User Posts section */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold text-center text-accent">Posts</h2>
                {userPosts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2 mt-4">
                        {userPosts.map(post => (
                            <div key={post.id} className="aspect-square bg-background-secondary rounded-lg overflow-hidden group relative">
                                {post.type === 'image' ? (
                                    <img src={post.url} alt={post.caption} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                ) : (
                                    <video src={post.url} className="w-full h-full object-cover" />
                                )}
                                {isOwnProfile && post.status === 'pending' && (
                                    <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center p-2">
                                        <p className="text-white font-bold text-sm">Pending Review</p>
                                    </div>
                                )}
                                {post.status === 'approved' && (
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center p-2">
                                        <p className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm">{post.caption}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-text-secondary mt-4">No posts yet.</p>
                )}
            </div>
        </div>
    );
};

export default Profile;