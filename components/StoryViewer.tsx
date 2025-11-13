import React, { useState, useEffect, useCallback, useRef } from 'react';
import { User, Story } from '../types';
import { XMarkIcon } from '../constants';

const IMAGE_DURATION = 5000; // 5 seconds

interface StoryViewerProps {
  user: User;
  allStories: Story[];
  onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ user, allStories, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const userStories = allStories
    .filter(story => story.userId === user.id && story.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000))
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  const currentStory = userStories[currentIndex];

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev >= userStories.length - 1) {
        onClose();
        return prev;
      }
      return prev + 1;
    });
  }, [userStories.length, onClose]);

  const goToPrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };
  
  useEffect(() => {
    if (!currentStory) return;

    setProgress(0);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (currentStory.type === 'image') {
      let startTime: number | null = null;
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const newProgress = Math.min((elapsed / IMAGE_DURATION) * 100, 100);
        setProgress(newProgress);

        if (elapsed < IMAGE_DURATION) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          goToNext();
        }
      };
      animationFrameRef.current = requestAnimationFrame(animate);
    } else if (currentStory.type === 'video' && videoRef.current) {
        const video = videoRef.current;
        const handleTimeUpdate = () => {
            if (video.duration) {
                setProgress((video.currentTime / video.duration) * 100);
            }
        };
        video.addEventListener('timeupdate', handleTimeUpdate);
        video.currentTime = 0;
        video.play().catch(err => console.error("Video play failed:", err));
        
        return () => {
            if (video) video.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentIndex, currentStory, goToNext]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') goToNext();
        if (e.key === 'ArrowLeft') goToPrev();
        if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, onClose]);

  if (!currentStory) {
    onClose();
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
      <div className="relative w-full max-w-sm h-full max-h-[90vh] bg-background-secondary rounded-lg overflow-hidden flex flex-col shadow-2xl">
        {/* Progress Bars */}
        <div className="absolute top-3 left-2 right-2 flex space-x-1 z-20">
          {userStories.map((_, index) => (
            <div key={index} className="flex-1 h-1 bg-white/30 rounded-full">
              <div 
                className="h-full bg-white rounded-full transition-all duration-100 linear"
                style={{ width: index < currentIndex ? '100%' : index === currentIndex ? `${progress}%` : '0%' }}
              />
            </div>
          ))}
        </div>
        
        {/* Header */}
        <div className="absolute top-6 left-4 flex items-center space-x-2 z-20">
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
            <span className="text-white font-semibold text-sm drop-shadow-md">{user.name}</span>
        </div>

        {/* Close Button */}
        <button onClick={onClose} className="absolute top-5 right-3 text-white z-20 p-1">
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="flex-grow flex items-center justify-center bg-black">
            {currentStory.type === 'image' && (
                <img src={currentStory.url} alt="Story" className="max-h-full max-w-full object-contain" />
            )}
            {currentStory.type === 'video' && (
                <video 
                    ref={videoRef}
                    src={currentStory.url} 
                    className="max-h-full max-w-full object-contain" 
                    onEnded={goToNext}
                    playsInline
                    autoPlay
                    muted
                />
            )}
        </div>
        
        {/* Navigation Overlays */}
        <div className="absolute inset-0 flex">
            <div className="w-1/3 h-full" onClick={goToPrev}></div>
            <div className="w-2/3 h-full" onClick={goToNext}></div>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;