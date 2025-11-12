import React from 'react';
import { Post, User } from '../types';
import PostCard from './PostCard';
import { PlusCircleIcon } from '../constants';

interface FeedProps {
  posts: Post[];
  currentUser: User;
  onLike: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onCreatePost: () => void;
  onViewProfile: (userId: string) => void;
}

const Feed: React.FC<FeedProps> = ({ posts, currentUser, onLike, onAddComment, onCreatePost, onViewProfile }) => {
  const approvedPosts = posts.filter(post => 
    post.status === 'approved' && !currentUser.blockedUsers.includes(post.user.id)
  );

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
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
            <p className="text-gray-400">The feed is empty. Be the first to post!</p>
        </div>
      )}
       <button 
        onClick={onCreatePost}
        className="fixed bottom-20 right-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform duration-200 z-20"
        aria-label="Create new post"
      >
        <PlusCircleIcon className="w-12 h-12" />
      </button>
    </div>
  );
};

export default Feed;