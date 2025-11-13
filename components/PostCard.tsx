import React, { useState, useEffect } from 'react';
import { Post, User } from '../types';
import { HeartIcon, HeartIconSolid, ChatBubbleIcon, ShareIcon, EllipsisHorizontalIcon } from '../constants';

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
  const [justLiked, setJustLiked] = useState(false);
  
  const isLiked = post.likes.includes(currentUser.id);

  useEffect(() => {
    if (!justLiked) return;
    const timer = setTimeout(() => {
      setJustLiked(false);
    }, 400); // Duration matches the animation
    return () => clearTimeout(timer);
  }, [justLiked]);

  const handleLikeClick = () => {
    if (!isLiked) {
      setJustLiked(true);
    }
    onLike(post.id);
  };

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
    <div className="bg-background-primary pt-3 border-b border-border-color">
      {/* Post Header */}
      <div className="px-3 flex justify-between items-center">
        <button 
          onClick={() => onViewProfile(post.user.id)}
          className="flex items-center space-x-3 text-left group"
        >
          <img src={post.user.avatar} alt={post.user.name} className="w-10 h-10 rounded-full" />
          <p className="font-semibold text-text-primary group-hover:underline">{post.user.name}</p>
        </button>
        <div className="flex items-center space-x-2">
            <p className="text-xs text-text-secondary">{timeSince(post.timestamp)}</p>
            <button className="text-text-secondary hover:text-text-primary p-1">
                <EllipsisHorizontalIcon className="w-6 h-6"/>
            </button>
        </div>
      </div>
      
      {/* Post Caption */}
      {post.caption && <p className="my-3 px-3 text-text-primary text-sm">{post.caption}</p>}

      {/* Post Media */}
      <div className="mt-3 rounded-lg overflow-hidden border border-border-color/50">
        {post.type === 'image' ? (
            <img src={post.url} alt={post.caption} className="w-full object-cover" />
        ) : (
            <video src={post.url} controls autoPlay loop muted playsInline className="w-full bg-black" />
        )}
      </div>
      
      <div className="px-3 pt-3 pb-2">
        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <button onClick={handleLikeClick} className="flex items-center space-x-2 text-text-secondary hover:text-red-500 transition-colors group">
            { isLiked ? <HeartIconSolid className="w-7 h-7 text-red-500"/> : <HeartIcon className={`w-7 h-7 group-hover:text-red-500 ${justLiked ? 'animate-like-pop' : ''}`} /> }
          </button>
          <button onClick={() => setShowComments(!showComments)} className="flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-colors">
            <ChatBubbleIcon className="w-7 h-7" />
          </button>
           <button className="flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-colors">
            <ShareIcon className="w-7 h-7" />
          </button>
        </div>

        {/* Likes and Comments Info */}
        <div className="mt-3 flex items-center space-x-4 text-sm text-text-secondary">
            {post.likes.length > 0 && <span>{post.likes.length} likes</span>}
             {post.comments.length > 0 && (
                <button onClick={() => setShowComments(!showComments)} className="hover:underline">
                    {post.comments.length} comments
                </button>
            )}
        </div>
        
        {/* Comment Section */}
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

        {/* Comment Input */}
        <form onSubmit={handleCommentSubmit} className="mt-3 flex items-center space-x-2">
            <img src={currentUser.avatar} alt="Your avatar" className="w-8 h-8 rounded-full" />
            <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="w-full bg-transparent text-sm text-text-primary placeholder-text-secondary focus:outline-none"
            />
            {commentText.trim() && (
                 <button type="submit" className="text-accent font-semibold hover:text-accent-hover disabled:opacity-50 text-sm">Post</button>
            )}
        </form>
      </div>
    </div>
  );
};

export default PostCard;