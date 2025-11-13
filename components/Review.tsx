import React from 'react';
import { Post } from '../types';

interface ReviewProps {
    pendingPosts: Post[];
    onApprove: (postId: string) => void;
    onReject: (postId: string) => void;
}

const Review: React.FC<ReviewProps> = ({ pendingPosts, onApprove, onReject }) => {

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
        <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-accent">Posts for Review</h2>
            <div className="space-y-4">
                {pendingPosts.length > 0 ? (
                    pendingPosts.map(post => (
                        <div key={post.id} className="bg-background-secondary rounded-xl shadow-xl overflow-hidden border border-border-color">
                            <div className="p-4 flex items-center space-x-3">
                                <img src={post.user.avatar} alt={post.user.name} className="w-10 h-10 rounded-full" />
                                <div>
                                    <p className="font-semibold text-text-primary">{post.user.name}</p>
                                    <p className="text-xs text-text-secondary">{timeSince(post.timestamp)} ago</p>
                                </div>
                            </div>

                             {post.type === 'image' ? (
                                <img src={post.url} alt={post.caption} className="w-full object-cover max-h-96" />
                            ) : (
                                <video src={post.url} controls className="w-full max-h-96" />
                            )}

                            <div className="p-4">
                               <p className="text-text-primary">{post.caption}</p>
                            </div>

                            <div className="p-4 bg-background-primary/50 flex justify-end space-x-3">
                                <button onClick={() => onReject(post.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                    Reject
                                </button>
                                <button onClick={() => onApprove(post.id)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                    Approve
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-text-secondary mt-8">No posts are currently pending review.</p>
                )}
            </div>
        </div>
    );
};

export default Review;