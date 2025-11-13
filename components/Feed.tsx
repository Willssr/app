import React from 'react';
import { Post, User, Story } from '../types';
import PostCard from './PostCard';
import { PlusCircleIcon } from '../constants';

interface FeedProps {
  posts: Post[];
  stories: Story[];
  currentUser: User;
  onLike: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onCreatePost: () => void;
  onViewProfile: (userId: string) => void;
  onViewStories: (userId: string) => void;
}

const StoryReel: React.FC<{ stories: Story[]; users: User[], onViewStories: (userId: string) => void }> = ({ stories, users, onViewStories }) => {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeUserIds = new Set(stories.filter(s => s.timestamp > twentyFourHoursAgo).map(s => s.userId));

    if (activeUserIds.size === 0) return null;

    const usersWithStories = users.filter(u => activeUserIds.has(u.id));

    return (
        <div className="mb-6">
            <div className="flex space-x-4 overflow-x-auto pb-2 -mx-4 px-4">
                {usersWithStories.map(user => (
                    <button key={user.id} onClick={() => onViewStories(user.id)} className="flex flex-col items-center space-y-1 flex-shrink-0">
                        <div className="p-1 bg-gradient-to-tr from-accent to-pink-500 rounded-full">
                            <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full border-2 border-background-primary object-cover" />
                        </div>
                        <p className="text-xs text-text-secondary">{user.name}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}


const Feed: React.FC<FeedProps> = ({ posts, stories, currentUser, onLike, onAddComment, onCreatePost, onViewProfile, onViewStories }) => {
  const approvedPosts = posts.filter(post => 
    post.status === 'approved' && !currentUser.blockedUsers.includes(post.user.id)
  );
  
  const usersInvolved = posts.reduce((acc, post) => {
    acc.add(post.user);
    return acc;
  }, new Set<User>());


  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <StoryReel stories={stories} users={Array.from(usersInvolved)} onViewStories={onViewStories} />
      {approvedPosts.length > 0 ? (
        approvedPosts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            currentUser={currentUser}
            onLike={onLike}
            onAddComment={onAddComment}
            onViewProfile={onViewProfile}
          />
        ))
      ) : (
        <div className="text-center py-10">
            <p className="text-text-secondary">The feed is empty. Be the first to post!</p>
        </div>
      )}
       <button 
        onClick={onCreatePost}
        className="fixed bottom-20 right-5 bg-gradient-to-br from-accent to-pink-500 text-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform duration-200 z-20"
        aria-label="Create new post"
      >
        <PlusCircleIcon className="w-12 h-12" />
      </button>
    </div>
  );
};

export default Feed;