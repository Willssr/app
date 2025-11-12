import React, { useState, useCallback, useMemo } from 'react';
import { User, Post, Comment, FriendRequest, Message, Notification, Story } from './types';
import { MOCK_POSTS, MOCK_USERS, MOCK_FRIEND_REQUESTS, MOCK_MESSAGES, MOCK_NOTIFICATIONS, MOCK_STORIES } from './constants';
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
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(MOCK_FRIEND_REQUESTS);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  const [view, setView] = useState<View>({ type: 'tab', tab: 'feed' });
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isCreateStoryModalOpen, setCreateStoryModalOpen] = useState(false);
  const [viewingStoriesForUser, setViewingStoriesForUser] = useState<User | null>(null);

  
  const currentUser = useMemo(() => users.find(u => u.id === 'u1')!, [users]);
  const isAdmin = currentUser.id === 'u1';
  const hasUnreadNotifications = useMemo(() => notifications.some(n => !n.read), [notifications]);

  const handleLikeToggle = useCallback((postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          const isLiked = post.likes.includes(currentUser.id);
          const newLikes = isLiked
            ? post.likes.filter(id => id !== currentUser.id)
            : [...post.likes, currentUser.id];
          
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
          
          setUsers(prevUsers => prevUsers.map(user => {
            if (user.id === post.user.id) {
              return { ...user, points: user.points + (isLiked ? -1 : 1) };
            }
            return user;
          }));

          return { ...post, likes: newLikes };
        }
        return post;
      })
    );
  }, [currentUser]);

  const handleAddComment = useCallback((postId: string, text: string) => {
    if (!text.trim()) return;

    const newComment: Comment = {
      id: `c${Date.now()}`,
      user: currentUser,
      text,
      timestamp: new Date(),
    };

    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          setUsers(prevUsers => prevUsers.map(user => {
            if (user.id === post.user.id) return { ...user, points: user.points + 2 };
            if (user.id === currentUser.id) return { ...user, points: user.points + 1 };
            return user;
          }));
          return { ...post, comments: [...post.comments, newComment] };
        }
        return post;
      })
    );
  }, [currentUser]);

  const handleCreatePost = useCallback((caption: string, file: File) => {
      const newPost: Post = {
        id: `p${Date.now()}`,
        type: file.type.startsWith('video/') ? 'video' : 'image',
        url: URL.createObjectURL(file),
        caption,
        user: currentUser,
        likes: [],
        comments: [],
        timestamp: new Date(),
        status: currentUser.id === 'u1' ? 'approved' : 'pending',
      };
      setPosts(prevPosts => [newPost, ...prevPosts]);
      setIsCreateModalOpen(false);
  }, [currentUser]);

  const handleCreateStory = useCallback((file: File) => {
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
    setUsers(prevUsers => prevUsers.map(user => {
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
    }));
    setIsEditProfileModalOpen(false);
  }, [currentUser.id]);

  const handleApprovePost = useCallback((postId: string) => {
      setPosts(prevPosts => prevPosts.map(post => 
        post.id === postId ? { ...post, status: 'approved' } : post
      ));
  }, []);

  const handleRejectPost = useCallback((postId: string) => {
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  }, []);

  const handleSendFriendRequest = useCallback((toId: string) => {
    const existingRequest = friendRequests.find(r => r.from.id === currentUser.id && r.to.id === toId);
    if (existingRequest) return;

    const toUser = users.find(u => u.id === toId);
    if (!toUser) return;

    const newRequest: FriendRequest = {
        id: `fr${Date.now()}`,
        from: currentUser,
        to: toUser,
        status: 'pending',
    };
    setFriendRequests(prev => [...prev, newRequest]);
    
    const newNotification: Notification = {
      id: `n${Date.now()}`,
      type: 'friend_request',
      user: currentUser,
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);

  }, [currentUser, friendRequests, users]);
  
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
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        const newFriends = u.friends.filter(friendId => friendId !== userId);
        return { ...u, blockedUsers: [...u.blockedUsers, userId], friends: newFriends };
      }
      if (u.id === userId) {
         const newFriends = u.friends.filter(friendId => friendId !== currentUser.id);
         return { ...u, friends: newFriends };
      }
      return u;
    }));
  }, [currentUser.id]);

  const handleSendMessage = useCallback((toId: string, text: string) => {
    if (!text.trim()) return;
    const newMessage: Message = {
      id: `m${Date.now()}`,
      fromId: currentUser.id,
      toId: toId,
      text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  }, [currentUser.id]);
  
  const handleMarkNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const handleSetActiveTab = (tab: ActiveTab) => {
    if (tab === 'notifications') {
      handleMarkNotificationsAsRead();
    }
    setView({ type: 'tab', tab });
  };
  
  const handleViewStories = useCallback((userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setViewingStoriesForUser(user);
    }
  }, [users]);


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

    // Default to tab view
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
      case 'profile':
        return <Profile user={currentUser} posts={posts} stories={stories} currentUser={currentUser} onEditProfile={() => setIsEditProfileModalOpen(true)} onBack={() => {}} friendRequests={[]} onSendFriendRequest={()=>{}} onBlockUser={()=>{}} onViewStories={handleViewStories} onCreateStory={() => setCreateStoryModalOpen(true)} />;
      case 'review':
        if (!isAdmin) return null;
        return <Review pendingPosts={posts.filter(p => p.status === 'pending')} onApprove={handleApprovePost} onReject={handleRejectPost} />;
      default:
        return <Feed posts={posts} currentUser={currentUser} onLike={handleLikeToggle} onAddComment={handleAddComment} onCreatePost={() => setIsCreateModalOpen(true)} onViewProfile={(userId) => setView({ type: 'profile', userId })} />;
    }
  };
  
  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const activeTab = view.type === 'tab' ? view.tab : undefined;

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-4 mb-16">
        {renderContent()}
      </main>
      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={handleSetActiveTab} 
        isAdmin={isAdmin}
        hasUnreadNotifications={hasUnreadNotifications}
      />
      {isCreateModalOpen && <CreatePostModal onClose={() => setIsCreateModalOpen(false)} onCreate={handleCreatePost} />}
      {isEditProfileModalOpen && <EditProfileModal currentUser={currentUser} onClose={() => setIsEditProfileModalOpen(false)} onUpdate={handleUpdateProfile} />}
      {isCreateStoryModalOpen && <CreateStoryModal onClose={() => setCreateStoryModalOpen(false)} onCreate={handleCreateStory} />}
      {viewingStoriesForUser && <StoryViewer user={viewingStoriesForUser} allStories={stories} onClose={() => setViewingStoriesForUser(null)} />}
    </div>
  );
}