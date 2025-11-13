import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, updateDoc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import { auth, db, getOrCreateUserProfile, isFirebaseConfigured } from './services/firebase';
import { User, Post, Comment, FriendRequest, Message, Notification, Story } from './types';
import { MOCK_USERS, MOCK_POSTS, MOCK_FRIEND_REQUESTS, MOCK_MESSAGES, MOCK_NOTIFICATIONS, MOCK_STORIES } from './constants';
import { uploadFile } from './services/storage';

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
import LimitedModeBanner from './components/LimitedModeBanner';

type ActiveTab = 'feed' | 'ranking' | 'analytics' | 'friends' | 'notifications' | 'profile' | 'review' | 'download';
type View = 
  | { type: 'tab'; tab: ActiveTab }
  | { type: 'profile'; userId: string }
  | { type: 'chat'; userId: string };

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isLimitedMode, setIsLimitedMode] = useState(false);

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
    const unsubscribe = onAuthStateChanged(auth!, async (firebaseUser) => {
      if (firebaseUser) {
        try {
            const userProfile = await getOrCreateUserProfile(firebaseUser);
            setCurrentUser(userProfile);
            setIsLimitedMode(false); // Successfully connected, ensure limited mode is off
            setUsers(prevUsers => {
                const userExists = prevUsers.some(u => u.id === userProfile.id);
                if (userExists) {
                    return prevUsers.map(u => u.id === userProfile.id ? userProfile : u);
                }
                return [userProfile, ...prevUsers];
            });
        } catch (error: any) {
            console.error("Failed to create or retrieve user profile:", error);
            if (error.code === 'permission-denied' || (error.message && error.message.toLowerCase().includes('permission'))) {
                console.warn("Firestore permission error. Running in limited mode.");
                setIsLimitedMode(true);
                // Create a temporary user profile from auth data to allow app usage
                const { uid, displayName, photoURL, email } = firebaseUser;
                let profileName = displayName || (email ? email.split('@')[0] : 'New User');
                const mockUserProfile: User = {
                    id: uid,
                    name: profileName,
                    email: email || undefined,
                    avatar: photoURL || `https://picsum.photos/seed/${uid}/100/100`,
                    points: 0,
                    bio: 'Welcome to NinoVisk! (Limited Mode)',
                    coverPhoto: `https://picsum.photos/seed/${uid}/1200/400`,
                    profileMusicUrl: '',
                    friends: [],
                    blockedUsers: [],
                };
                setCurrentUser(mockUserProfile);
            } else {
                // For other critical errors, it's safer to sign out
                await signOut(auth!);
                setCurrentUser(null);
            }
        }
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
      await signOut(auth!);
    } catch (error) {
        console.error("Sign out error", error);
    }
  };

  const handleMockLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLikeToggle = useCallback((postId: string) => {
    if (!currentUser || isLimitedMode) return;
    
    // Optimistic UI update for likes and notifications
    setPosts(prevPosts =>
      prevPosts.map(p => {
        if (p.id === postId) {
          const isLiked = p.likes.includes(currentUser.id);
          const newLikes = isLiked
            ? p.likes.filter(id => id !== currentUser.id)
            : [...p.likes, currentUser.id];
          
          if (!isLiked && p.user.id !== currentUser.id) {
            const newNotification: Notification = {
              id: `n${Date.now()}`,
              type: 'like',
              user: currentUser,
              post: p,
              timestamp: new Date(),
              read: false,
            };
            setNotifications(prev => [newNotification, ...prev]);
          }

          return { ...p, likes: newLikes };
        }
        return p;
      })
    );
  }, [currentUser, isLimitedMode]);

  const handleAddComment = useCallback((postId: string, text: string) => {
    if (!text.trim() || !currentUser || isLimitedMode) return;
    
    // --- Start of Firestore update ---
    const commenterRef = doc(db, "users", currentUser.id);

    updateDoc(commenterRef, { points: increment(1) })
    .then(() => {
        // Success: Update local state for points
        setUsers(prevUsers => prevUsers.map(u => {
            if (u.id === currentUser.id) {
                const updatedUser = { ...u, points: u.points + 1 };
                setCurrentUser(updatedUser);
                return updatedUser;
            }
            return u;
        }));
    }).catch(error => {
        console.error("Failed to update points for comment:", error);
    });
    // --- End of Firestore update ---

    const newComment: Comment = {
      id: `c${Date.now()}`,
      user: currentUser,
      text,
      timestamp: new Date(),
    };

    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          return { ...post, comments: [...post.comments, newComment] };
        }
        return post;
      })
    );
  }, [currentUser, isLimitedMode]);

  const handleCreatePost = useCallback(async (caption: string, file: File) => {
      if (!currentUser || isLimitedMode) return;
      setIsCreateModalOpen(false);
      try {
        const filePath = `posts/${currentUser.id}/${Date.now()}_${file.name}`;
        const fileUrl = await uploadFile(file, filePath);
        const newPost: Post = {
          id: `p${Date.now()}`,
          type: file.type.startsWith('video/') ? 'video' : 'image',
          url: fileUrl,
          caption,
          user: currentUser,
          likes: [],
          comments: [],
          timestamp: new Date(),
          status: isAdmin ? 'approved' : 'pending',
        };
        setPosts(prev => [newPost, ...prev]);
      } catch (error) {
          console.error("Failed to create post:", error);
      }
  }, [currentUser, isAdmin, isLimitedMode]);

  const handleCreateStory = useCallback(async (file: File) => {
    if (!currentUser || isLimitedMode) return;
    setCreateStoryModalOpen(false);
    try {
      const filePath = `stories/${currentUser.id}/${Date.now()}_${file.name}`;
      const fileUrl = await uploadFile(file, filePath);
      const newStory: Story = {
        id: `s${Date.now()}`,
        userId: currentUser.id,
        type: file.type.startsWith('video/') ? 'video' : 'image',
        url: fileUrl,
        timestamp: new Date(),
      };
      setStories(prev => [newStory, ...prev]);
    } catch (error) {
        console.error("Failed to create story:", error);
    }
  }, [currentUser, isLimitedMode]);

 const handleUpdateProfile = useCallback(async (updatedData: { name: string; bio: string; musicUrl: string; avatarFile?: File; coverFile?: File }) => {
    if (!currentUser || isLimitedMode) return;
    setIsEditProfileModalOpen(false);
    try {
      let avatarUrl = currentUser.avatar;
      if (updatedData.avatarFile) {
        const filePath = `avatars/${currentUser.id}/${Date.now()}_${updatedData.avatarFile.name}`;
        avatarUrl = await uploadFile(updatedData.avatarFile, filePath);
      }

      let coverPhotoUrl = currentUser.coverPhoto;
      if (updatedData.coverFile) {
        const filePath = `covers/${currentUser.id}/${Date.now()}_${updatedData.coverFile.name}`;
        coverPhotoUrl = await uploadFile(updatedData.coverFile, filePath);
      }

      const userRef = doc(db, "users", currentUser.id);
      const updatedUserFields: Partial<User> = {
        name: updatedData.name,
        bio: updatedData.bio,
        profileMusicUrl: updatedData.musicUrl,
        avatar: avatarUrl,
        coverPhoto: coverPhotoUrl,
      };
      
      // Remove undefined values before sending to Firestore and updating state
      Object.keys(updatedUserFields).forEach(keyStr => {
        const key = keyStr as keyof typeof updatedUserFields;
        if (updatedUserFields[key] === undefined) {
            delete updatedUserFields[key];
        }
      });

      await setDoc(userRef, updatedUserFields, { merge: true });

      const updatedUser = {
        ...currentUser,
        ...updatedUserFields,
      };

      setCurrentUser(updatedUser);

      setUsers(prevUsers =>
        prevUsers.map(user => (user.id === currentUser.id ? updatedUser : user))
      );
      
      setPosts(prevPosts =>
        prevPosts.map(post => {
          const isUserAuthor = post.user.id === currentUser.id;
          const userInComments = post.comments.some(c => c.user.id === currentUser.id);
          
          if (!isUserAuthor && !userInComments) return post;

          return {
            ...post,
            user: isUserAuthor ? updatedUser : post.user,
            comments: post.comments.map(comment => 
                comment.user.id === currentUser.id ? { ...comment, user: updatedUser } : comment
            ),
          };
        })
      );

      setFriendRequests(prevRequests =>
        prevRequests.map(req => {
          if (req.from.id !== currentUser.id && req.to.id !== currentUser.id) return req;
          return {
              ...req,
              from: req.from.id === currentUser.id ? updatedUser : req.from,
              to: req.to.id === currentUser.id ? updatedUser : req.to,
          };
        })
      );

      setNotifications(prevNotifications =>
        prevNotifications.map(notif => {
          const isUserInNotif = notif.user.id === currentUser.id;
          const isUserInNotifPost = notif.post?.user.id === currentUser.id;

          if (!isUserInNotif && !isUserInNotifPost) return notif;
          
          return {
              ...notif,
              user: isUserInNotif ? updatedUser : notif.user,
              post: (isUserInNotifPost && notif.post) ? { ...notif.post, user: updatedUser } : notif.post
          };
        })
      );

    } catch (error) {
      console.error("Error updating profile", error);
    }
  }, [currentUser, isLimitedMode]);

  const handleApprovePost = useCallback((postId: string) => {
      setPosts(prev => prev.map(p => p.id === postId ? {...p, status: 'approved'} : p));
  }, []);

  const handleRejectPost = useCallback((postId: string) => {
      setPosts(prev => prev.filter(p => p.id !== postId));
  }, []);

  const handleSendFriendRequest = useCallback((toId: string) => {
    if (!currentUser || currentUser.id === toId || isLimitedMode) return;
    const toUser = users.find(u => u.id === toId);
    if (!toUser) return;
    
    const newRequest: FriendRequest = {
      id: `fr${Date.now()}`,
      from: currentUser,
      to: toUser,
      status: 'pending',
    };

    setFriendRequests(prev => [...prev, newRequest]);
  }, [currentUser, users, isLimitedMode]);
  
  const handleAcceptFriendRequest = useCallback(async (requestId: string) => {
    if (!currentUser || isLimitedMode) return;
    const request = friendRequests.find(r => r.id === requestId);
    if (!request || request.to.id !== currentUser.id) return;

    const currentUserRef = doc(db, "users", currentUser.id);

    try {
        await updateDoc(currentUserRef, { friends: arrayUnion(request.from.id) });
        
        const updatedCurrentUser = { ...currentUser, friends: [...currentUser.friends, request.from.id] };
        setCurrentUser(updatedCurrentUser);

        setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedCurrentUser : u));
        
        setFriendRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (error) {
        console.error("Error accepting friend request:", error);
    }
  }, [friendRequests, isLimitedMode, currentUser]);

  const handleDeclineFriendRequest = useCallback((requestId: string) => {
    if (isLimitedMode) return;
    setFriendRequests(prev => prev.filter(r => r.id !== requestId));
  }, [isLimitedMode]);

  const handleBlockUser = useCallback(async (userId: string) => {
    if (!currentUser || isLimitedMode) return;
    
    const currentUserRef = doc(db, "users", currentUser.id);

    try {
        await updateDoc(currentUserRef, { 
            blockedUsers: arrayUnion(userId),
            friends: arrayRemove(userId)
        });

        const updatedUser = {
            ...currentUser,
            blockedUsers: [...currentUser.blockedUsers, userId],
            friends: currentUser.friends.filter(id => id !== userId)
        };
        setCurrentUser(updatedUser);
        setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));

    } catch (error) {
        console.error("Error blocking user:", error);
    }
  }, [currentUser, isLimitedMode]);

  const handleSendMessage = useCallback((toId: string, text: string) => {
    if (!text.trim() || !currentUser || isLimitedMode) return;
    const newMessage: Message = {
      id: `m${Date.now()}`,
      fromId: currentUser.id,
      toId: toId,
      text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  }, [currentUser, isLimitedMode]);
  
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
      <div className="bg-background-primary min-h-screen flex items-center justify-center text-text-primary">
          <div className="text-center">
              <h1 className="text-4xl font-bold text-accent">
                  NinoVisk
              </h1>
              <p className="mt-2 text-text-secondary animate-pulse">Loading...</p>
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
        return <Feed posts={posts} currentUser={currentUser} onLike={handleLikeToggle} onAddComment={handleAddComment} onCreatePost={() => setIsCreateModalOpen(true)} onViewProfile={(userId) => setView({ type: 'profile', userId })} stories={stories} onViewStories={handleViewStories} />;
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
        return <Feed posts={posts} currentUser={currentUser} onLike={handleLikeToggle} onAddComment={handleAddComment} onCreatePost={() => setIsCreateModalOpen(true)} onViewProfile={(userId) => setView({ type: 'profile', userId })} stories={stories} onViewStories={handleViewStories} />;
    }
  };

  const activeTab = view.type === 'tab' ? view.tab : (view.type === 'profile' && view.userId === currentUser.id ? 'profile' : undefined);

  return (
    <div className="bg-background-primary text-text-primary min-h-screen font-sans flex flex-col">
      <Header user={currentUser} onSignOut={handleSignOut} />
      {isLimitedMode && <LimitedModeBanner />}
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