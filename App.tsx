import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, getOrCreateUserProfile, isFirebaseConfigured } from './services/firebase';
import { User, Post, Comment, FriendRequest, Message, Notification, Story } from './types';
import { MOCK_USERS, MOCK_POSTS, MOCK_FRIEND_REQUESTS, MOCK_MESSAGES, MOCK_NOTIFICATIONS, MOCK_STORIES } from './constants';

import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Feed from './components/Feed';
import Ranking from './components/Ranking';
import Analytics from './components/Analytics';
import Profile from './components/Profile';
import CreatePostModal from './components/CreatePostModal';
import EditProfileModal from './components/EditProfileModal';
import Review from './components/Review';
import Friends from './components/Friends';
import Chat from './components/Chat';
import Notifications from './components/Notifications';
import StoryViewer from './components/StoryViewer';
import CreateStoryModal from './components/CreateStoryModal';
import Login from './components/Login';
import Download from './components/Download';

type ActiveTab = 'feed' | 'ranking' | 'analytics' | 'friends' | 'notifications' | 'profile' | 'review' | 'download';
type View = 
  | { type: 'tab'; tab: ActiveTab }
  | { type: 'profile'; userId: string }
  | { type: 'chat'; userId: string };

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(MOCK_FRIEND_REQUESTS);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);
  
  const [view, setView] = useState<View>({ type: 'tab', tab: 'feed' });
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isCreateStoryModalOpen, setCreateStoryModalOpen] = useState(false);
  const [viewingStoriesForUser, setViewingStoriesForUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) {
        setAuthLoading(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            const userProfile = await getOrCreateUserProfile(firebaseUser);
            setCurrentUser(userProfile);
            setUsers(prevUsers => {
                const userExists = prevUsers.some(u => u.id === userProfile.id);
                if (userExists) {
                    return prevUsers.map(u => u.id === userProfile.id ? userProfile : u);
                }
                return [userProfile, ...prevUsers];
            });
        } else {
            setCurrentUser(null);
        }
        setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = currentUser?.id === 'u1'; 
  const hasUnreadNotifications = useMemo(() => notifications.some(n => !n.read), [notifications]);
  
  const handleSignOut = async () => {
    if (!isFirebaseConfigured) {
        setCurrentUser(null);
        return;
    }
    try {
      await signOut(auth);
    } catch (error) {
        console.error("Sign out error", error);
    }
  };

  const handleMockLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLikeToggle = useCallback((postId: string) => {
    if (!currentUser) return;
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          const isLiked = post.likes.includes(currentUser.id);
          const newLikes = isLiked
            ? post.likes.filter(id => id !== currentUser.id)
            : [...post.likes, currentUser.id];
          
          // Update points
          setUsers(prevUsers => prevUsers.map(u => {
            if (u.id === post.user.id) return { ...u, points: u.points + (isLiked ? -1 : 1) };
            return u;
          }));

          // Add notification
          if (!isLiked && post.user.id !== currentUser.id) {
            const newNotification: Notification = {
              id: `n${Date.now()}`,
              type: 'like',
              user: currentUser,
              post: post,
              timestamp: new Date(),
              read: false,
            };
            setNotifications(prev => [newNotification, ...prev]);
          }

          return { ...post, likes: newLikes };
        }
        return post;
      })
    );
  }, [currentUser]);

  const handleAddComment = useCallback((postId: string, text: string) => {
    if (!text.trim() || !currentUser) return;

    const newComment: Comment = {
      id: `c${Date.now()}`,
      user: currentUser,
      text,
      timestamp: new Date(),
    };

    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
           // Update points
          setUsers(prevUsers => prevUsers.map(u => {
            if (u.id === post.user.id) return { ...u, points: u.points + 2 };
            if (u.id === currentUser.id) return { ...u, points: u.points + 1 };
            return u;
          }));
          return { ...post, comments: [...post.comments, newComment] };
        }
        return post;
      })
    );
  }, [currentUser]);

  const handleCreatePost = useCallback((caption: string, file: File) => {
      if (!currentUser) return;
      const newPost: Post = {
        id: `p${Date.now()}`,
        type: file.type.startsWith('video/') ? 'video' : 'image',
        url: URL.createObjectURL(file),
        caption,
        user: currentUser,
        likes: [],
        comments: [],
        timestamp: new Date(),
        status: isAdmin ? 'approved' : 'pending',
      };
      setPosts(prev => [newPost, ...prev]);
      setIsCreateModalOpen(false);
  }, [currentUser, isAdmin]);

  const handleCreateStory = useCallback((file: File) => {
    if (!currentUser) return;
    const newStory: Story = {
      id: `s${Date.now()}`,
      userId: currentUser.id,
      type: file.type.startsWith('video/') ? 'video' : 'image',
      url: URL.createObjectURL(file),
      timestamp: new Date(),
    };
    setStories(prev => [newStory, ...prev]);
    setCreateStoryModalOpen(false);
  }, [currentUser]);

  const handleUpdateProfile = useCallback((updatedData: { name: string; bio: string; musicUrl: string; avatarFile?: File; coverFile?: File }) => {
    if (!currentUser) return;
    setUsers(prevUsers =>
      prevUsers.map(user => {
        if (user.id === currentUser.id) {
          return {
            ...user,
            name: updatedData.name,
            bio: updatedData.bio,
            profileMusicUrl: updatedData.musicUrl,
            avatar: updatedData.avatarFile ? URL.createObjectURL(updatedData.avatarFile) : user.avatar,
            coverPhoto: updatedData.coverFile ? URL.createObjectURL(updatedData.coverFile) : user.coverPhoto,
          };
        }
        return user;
      })
    );
    setIsEditProfileModalOpen(false);
  }, [currentUser]);

  const handleApprovePost = useCallback((postId: string) => {
      setPosts(prev => prev.map(p => p.id === postId ? {...p, status: 'approved'} : p));
  }, []);

  const handleRejectPost = useCallback((postId: string) => {
      setPosts(prev => prev.filter(p => p.id !== postId));
  }, []);

  const handleSendFriendRequest = useCallback((toId: string) => {
    if (!currentUser || currentUser.id === toId) return;
    const toUser = users.find(u => u.id === toId);
    if (!toUser) return;
    
    const newRequest: FriendRequest = {
      id: `fr${Date.now()}`,
      from: currentUser,
      to: toUser,
      status: 'pending',
    };

    setFriendRequests(prev => [...prev, newRequest]);
  }, [currentUser, users]);
  
  const handleAcceptFriendRequest = useCallback((requestId: string) => {
    const request = friendRequests.find(r => r.id === requestId);
    if (!request) return;

    setUsers(prev => prev.map(u => {
        if (u.id === request.from.id) return { ...u, friends: [...u.friends, request.to.id] };
        if (u.id === request.to.id) return { ...u, friends: [...u.friends, request.from.id] };
        return u;
    }));
    
    setFriendRequests(prev => prev.filter(r => r.id !== requestId));
  }, [friendRequests]);

  const handleDeclineFriendRequest = useCallback((requestId: string) => {
    setFriendRequests(prev => prev.filter(r => r.id !== requestId));
  }, []);

  const handleBlockUser = useCallback((userId: string) => {
    if (!currentUser) return;
    setUsers(prev => prev.map(u => {
        if (u.id === currentUser.id) {
            return {
                ...u,
                blockedUsers: [...u.blockedUsers, userId],
                friends: u.friends.filter(id => id !== userId)
            };
        }
        if (u.id === userId) {
            return {
                ...u,
                friends: u.friends.filter(id => id !== currentUser.id)
            };
        }
        return u;
    }));
  }, [currentUser]);

  const handleSendMessage = useCallback((toId: string, text: string) => {
    if (!text.trim() || !currentUser) return;
    const newMessage: Message = {
      id: `m${Date.now()}`,
      fromId: currentUser.id,
      toId: toId,
      text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  }, [currentUser]);
  
  const handleMarkNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({...n, read: true})));
  }, []);

  const handleSetActiveTab = (tab: ActiveTab) => {
    if (!currentUser) return;
    if (tab === 'notifications') {
      handleMarkNotificationsAsRead();
    }
     if (tab === 'profile') {
      setView({ type: 'profile', userId: currentUser.id });
    } else {
      setView({ type: 'tab', tab });
    }
  };
  
  const handleViewStories = useCallback((userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setViewingStoriesForUser(user);
    }
  }, [users]);

  if (authLoading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">
          <div className="text-center">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  NinoVisk
              </h1>
              <p className="mt-2 text-gray-400">Loading...</p>
          </div>
      </div>
    );
  }
  
  if (!currentUser) {
    return <Login onMockLogin={handleMockLogin} />;
  }

  const renderContent = () => {
    if (view.type === 'profile') {
        const userToShow = users.find(u => u.id === view.userId);
        if (!userToShow) return <div>User not found</div>;
        return <Profile 
            user={userToShow} 
            posts={posts} 
            stories={stories}
            currentUser={currentUser}
            onEditProfile={() => setIsEditProfileModalOpen(true)}
            onBack={() => setView({type: 'tab', tab: 'feed'})}
            friendRequests={friendRequests}
            onSendFriendRequest={handleSendFriendRequest}
            onBlockUser={handleBlockUser}
            onViewStories={handleViewStories}
            onCreateStory={() => setCreateStoryModalOpen(true)}
        />
    }

    if (view.type === 'chat') {
        const chatPartner = users.find(u => u.id === view.userId);
        if (!chatPartner) return <div>User not found</div>;
        const chatMessages = messages.filter(
            m => (m.fromId === currentUser.id && m.toId === view.userId) || (m.fromId === view.userId && m.toId === currentUser.id)
        );
        return <Chat 
            partner={chatPartner}
            messages={chatMessages}
            currentUser={currentUser}
            onBack={() => setView({type: 'tab', tab: 'friends'})}
            onSendMessage={handleSendMessage}
        />
    }
    
    switch (view.tab) {
      case 'feed':
        return <Feed posts={posts} currentUser={currentUser} onLike={handleLikeToggle} onAddComment={handleAddComment} onCreatePost={() => setIsCreateModalOpen(true)} onViewProfile={(userId) => setView({ type: 'profile', userId })} />;
      case 'ranking':
        return <Ranking users={users} />;
      case 'analytics':
        return <Analytics posts={posts} />;
      case 'friends':
        return <Friends 
            currentUser={currentUser}
            users={users}
            requests={friendRequests.filter(r => r.to.id === currentUser.id)}
            onAccept={handleAcceptFriendRequest}
            onDecline={handleDeclineFriendRequest}
            onViewChat={(userId) => setView({ type: 'chat', userId })}
        />
      case 'notifications':
        return <Notifications notifications={notifications} />;
       case 'download':
        return <Download />;
      case 'profile': // This case is handled by handleSetActiveTab
         return null;
      case 'review':
        if (!isAdmin) return null;
        return <Review pendingPosts={posts.filter(p => p.status === 'pending')} onApprove={handleApprovePost} onReject={handleRejectPost} />;
      default:
        return <Feed posts={posts} currentUser={currentUser} onLike={handleLikeToggle} onAddComment={handleAddComment} onCreatePost={() => setIsCreateModalOpen(true)} onViewProfile={(userId) => setView({ type: 'profile', userId })} />;
    }
  };

  const activeTab = view.type === 'tab' ? view.tab : (view.type === 'profile' && view.userId === currentUser.id ? 'profile' : undefined);

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans flex flex-col">
      <Header user={currentUser} onSignOut={handleSignOut} />
      <main className="flex-grow container mx-auto px-4 py-4 mb-16">
        {renderContent()}
      </main>
      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={handleSetActiveTab} 
        isAdmin={!!isAdmin}
        hasUnreadNotifications={hasUnreadNotifications}
      />
      {isCreateModalOpen && <CreatePostModal onClose={() => setIsCreateModalOpen(false)} onCreate={handleCreatePost} />}
      {isEditProfileModalOpen && <EditProfileModal currentUser={currentUser} onClose={() => setIsEditProfileModalOpen(false)} onUpdate={handleUpdateProfile} />}
      {isCreateStoryModalOpen && <CreateStoryModal onClose={() => setCreateStoryModalOpen(false)} onCreate={handleCreateStory} />}
      {viewingStoriesForUser && <StoryViewer user={viewingStoriesForUser} allStories={stories} onClose={() => setViewingStoriesForUser(null)} />}
    </div>
  );
}