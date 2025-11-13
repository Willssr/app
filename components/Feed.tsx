import React, { useState, useCallback, useRef } from 'react';
import { Post, User, Story } from '../types';
import PostCard from './PostCard';
import { PlusIcon, ArrowDownIcon, RefreshIcon } from '../constants';

interface FeedProps {
  posts: Post[];
  stories: Story[];
  currentUser: User;
  onLike: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onCreatePost: () => void;
  onViewProfile: (userId: string) => void;
  onViewStories: (userId: string) => void;
  onRefresh: () => Promise<void>;
}

const StoryReel: React.FC<{ stories: Story[]; users: User[], onViewStories: (userId: string) => void }> = ({ stories, users, onViewStories }) => {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeUserIds = new Set(stories.filter(s => s.timestamp > twentyFourHoursAgo).map(s => s.userId));

    if (activeUserIds.size === 0) return null;

    const usersWithStories = users.filter(u => activeUserIds.has(u.id));

    return (
        <div className="mb-4">
            <div className="flex space-x-4 overflow-x-auto pb-3 -mx-2 px-2">
                {usersWithStories.map(user => (
                    <button key={user.id} onClick={() => onViewStories(user.id)} className="flex flex-col items-center space-y-1 flex-shrink-0 focus:outline-none focus-visible:ring-2 ring-accent rounded-full">
                        <div className="p-1 bg-gradient-to-tr from-blue-400 via-purple-500 to-pink-500 rounded-full">
                            <div className="p-0.5 bg-background-primary rounded-full">
                                <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
                            </div>
                        </div>
                        <p className="text-xs text-text-secondary">{user.name}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}


const Feed: React.FC<FeedProps> = ({ posts, stories, currentUser, onLike, onAddComment, onCreatePost, onViewProfile, onViewStories, onRefresh }) => {
  const approvedPosts = posts.filter(post => 
    post.status === 'approved' && !currentUser.blockedUsers.includes(post.user.id)
  );
  
  const usersWithStories = posts.reduce((acc, post) => {
    if (!acc.some(u => u.id === post.user.id)) {
        acc.push(post.user);
    }
    return acc;
  }, [] as User[]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const touchStartRef = useRef<number | null>(null);
  const [pullDistance, setPullDistance] = useState(0);

  const PULL_THRESHOLD = 80; // The distance in px the user must pull to trigger a refresh.
  const PULL_RESISTANCE = 0.6; // Makes the pull feel heavier.

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  }, [isRefreshing, onRefresh]);

  const handleTouchStart = (e: React.TouchEvent) => {
    // Only engage pull-to-refresh if we're at the very top of the page.
    if (window.scrollY === 0) {
      touchStartRef.current = e.touches[0].clientY;
    } else {
      touchStartRef.current = null;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touchY = e.touches[0].clientY;
    const distance = touchY - touchStartRef.current;

    if (distance > 0) {
      // If we are pulling down, prevent the default browser action to
      // stop scrolling and allow our animation to take over.
      e.preventDefault();
      setPullDistance(distance * PULL_RESISTANCE);
    }
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current) return;

    if (pullDistance > PULL_THRESHOLD) {
      handleRefresh();
    }
    
    // Reset state regardless of whether a refresh was triggered.
    touchStartRef.current = null;
    setPullDistance(0);
  };

  // Dynamically calculate styles for the animation
  const feedStyle: React.CSSProperties = {
    transform: `translateY(${isRefreshing ? PULL_THRESHOLD : pullDistance}px)`,
    // Use a smooth transition when resetting or when the refresh is complete.
    transition: touchStartRef.current === null ? 'transform 0.3s' : 'none',
  };

  const indicatorOpacity = Math.min(pullDistance / PULL_THRESHOLD, 1);
  const indicatorRotation = pullDistance > PULL_THRESHOLD ? 180 : 0;

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'pan-y' }} // Helps hint to the browser about our intentions
    >
      {/* Refresh Indicator */}
      <div 
        className="absolute top-0 left-0 right-0 flex justify-center items-center text-accent"
        style={{ height: `${PULL_THRESHOLD}px`, marginTop: `-${PULL_THRESHOLD}px` }}
        aria-hidden="true"
      >
        <div
          className="transition-all duration-300"
          style={{ transform: `translateY(${isRefreshing ? PULL_THRESHOLD : pullDistance}px)` }}
        >
          {isRefreshing ? (
            <RefreshIcon className="w-7 h-7 animate-spin" />
          ) : (
            <ArrowDownIcon 
              className="w-7 h-7 transition-transform duration-200"
              style={{ opacity: indicatorOpacity, transform: `rotate(${indicatorRotation}deg)` }} 
            />
          )}
        </div>
      </div>

      <div style={feedStyle}>
        <div className="space-y-4 max-w-lg mx-auto">
            <StoryReel stories={stories} users={usersWithStories} onViewStories={onViewStories} />
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
        </div>
       </div>

       <button 
        onClick={onCreatePost}
        className="fixed bottom-24 right-5 bg-accent hover:bg-accent-hover text-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform duration-200 z-20"
        aria-label="Create new post"
      >
        <PlusIcon className="w-7 h-7" />
      </button>
    </div>
  );
};

export default Feed;