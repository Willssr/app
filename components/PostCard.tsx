import React, { useState } from 'react';
import { Post, User } from '../types';
import { HeartIcon, ChatBubbleIcon } from '../constants';

interface PostCardProps {
  post: Post;
  currentUser: User;
  onLike: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onViewProfile: (userId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUser, onLike, onAddComment, onViewProfile }) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  
  const isLiked = post.likes.includes(currentUser.id);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddComment(post.id, commentText);
    setCommentText('');
  };

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
  }

  return (
    <div className="bg-background-secondary rounded-xl shadow-lg overflow-hidden border border-border-color">
      <button 
        onClick={() => onViewProfile(post.user.id)}
        className="p-4 flex items-center space-x-3 text-left w-full hover:bg-background-tertiary/50 transition-colors"
      >
        <img src={post.user.avatar} alt={post.user.name} className="w-10 h-10 rounded-full" />
        <div>
          <p className="font-semibold text-text-primary">{post.user.name}</p>
          <p className="text-xs text-text-secondary">{timeSince(post.timestamp)} ago</p>
        </div>
      </button>
      
      {post.type === 'image' ? (
        <img src={post.url} alt={post.caption} className="w-full object-cover" />
      ) : (
        <video src={post.url} controls className="w-full" />
      )}
      
      <div className="p-4">
        <div className="flex items-center space-x-4">
          <button onClick={() => onLike(post.id)} className="flex items-center space-x-1 text-text-secondary hover:text-text-primary transition-colors">
            <HeartIcon className={`w-7 h-7 transition-colors ${isLiked ? 'text-red-500' : 'text-text-secondary'}`} />
            <span className="text-sm">{post.likes.length}</span>
          </button>
          <button onClick={() => setShowComments(!showComments)} className="flex items-center space-x-1 text-text-secondary hover:text-text-primary transition-colors">
            <ChatBubbleIcon className="w-6 h-6" />
            <span className="text-sm">{post.comments.length}</span>
          </button>
        </div>

        <p className="mt-3 text-text-primary">
           <button onClick={() => onViewProfile(post.user.id)} className="font-semibold text-text-primary mr-2 hover:underline">{post.user.name}</button>
          {post.caption}
        </p>

        {post.comments.length > 0 && (
          <button onClick={() => setShowComments(!showComments)} className="text-sm text-text-secondary mt-2 hover:underline">
            {showComments ? 'Hide comments' : `View all ${post.comments.length} comments`}
          </button>
        )}

        {showComments && (
          <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
            {post.comments.slice().sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime()).map(comment => (
              <div key={comment.id} className="text-sm">
                <p>
                  <button onClick={() => onViewProfile(comment.user.id)} className="font-semibold text-text-primary mr-2 hover:underline">{comment.user.name}</button>
                  <span className="text-text-primary">{comment.text}</span>
                </p>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleCommentSubmit} className="mt-4 flex space-x-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="w-full bg-background-tertiary border-border-color rounded-full px-4 py-2 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button type="submit" className="text-accent font-semibold hover:text-accent-hover disabled:opacity-50" disabled={!commentText.trim()}>Post</button>
        </form>
      </div>
    </div>
  );
};

export default PostCard;