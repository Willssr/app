export interface User {
  id: string;
  name: string;
  avatar: string;
  points: number;
  bio?: string;
  coverPhoto?: string;
  profileMusicUrl?: string;
  friends: string[]; // Array of user IDs
  blockedUsers: string[]; // Array of user IDs
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: Date;
}

export interface Post {
  id: string;
  type: 'image' | 'video';
  url: string;
  caption: string;
  user: User;
  likes: string[]; // Array of user IDs who liked the post
  comments: Comment[];
  timestamp: Date;
  status: 'pending' | 'approved' | 'rejected';
}

export interface LocationData {
    city: string;
    country: string;
    count: number;
}

export interface FriendRequest {
  id: string;
  from: User;
  to: User;
  status: 'pending';
}

export interface Message {
  id: string;
  fromId: string;
  toId: string;
  text: string;
  timestamp: Date;
}

export interface Notification {
  id: string;
  type: 'like' | 'friend_request';
  user: User; // The user who triggered the notification
  post?: Post; // Optional post for 'like' notifications
  timestamp: Date;
  read: boolean;
}

export interface Story {
  id: string;
  userId: string;
  type: 'image' | 'video';
  url: string;
  timestamp: Date;
}