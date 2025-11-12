import React from 'react';
import { User, Post, LocationData, FriendRequest, Message, Notification, Story } from './types';

// MOCK DATA
export const MOCK_USERS: User[] = [
  { 
    id: 'u1', 
    name: 'Nino', 
    avatar: 'https://picsum.photos/seed/nino/100/100', 
    points: 1520,
    bio: 'Just a dude chilling and posting vibes. 🤙 Living one post at a time.',
    coverPhoto: 'https://picsum.photos/seed/cover1/1200/400',
    profileMusicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    friends: ['u2'],
    blockedUsers: [],
  },
  { 
    id: 'u2', 
    name: 'Bella', 
    avatar: 'https://picsum.photos/seed/bella/100/100', 
    points: 1250,
    friends: ['u1'],
    blockedUsers: [],
  },
  { 
    id: 'u3', 
    name: 'Charlie', 
    avatar: 'https://picsum.photos/seed/charlie/100/100', 
    points: 980,
    friends: [],
    blockedUsers: [],
  },
  { 
    id: 'u4', 
    name: 'Daisy', 
    avatar: 'https://picsum.photos/seed/daisy/100/100', 
    points: 730,
    friends: [],
    blockedUsers: [],
  },
  { 
    id: 'u5', 
    name: 'Leo', 
    avatar: 'https://picsum.photos/seed/leo/100/100', 
    points: 450,
    friends: [],
    blockedUsers: [],
  },
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    type: 'image',
    url: 'https://picsum.photos/seed/post1/600/800',
    caption: 'Chilling by the beach! 🌊☀️',
    user: MOCK_USERS[1],
    likes: ['u1', 'u3', 'u4'],
    comments: [
      { id: 'c1', user: MOCK_USERS[0], text: 'Looks amazing!', timestamp: new Date(Date.now() - 3600000) },
      { id: 'c2', user: MOCK_USERS[2], text: 'So jealous!', timestamp: new Date(Date.now() - 1800000) },
    ],
    timestamp: new Date(Date.now() - 86400000),
    status: 'approved',
  },
  {
    id: 'p2',
    type: 'video',
    url: 'https://videos.pexels.com/video-files/2022395/2022395-hd_1280_720_30fps.mp4',
    caption: 'City lights at night. What a view!',
    user: MOCK_USERS[0],
    likes: ['u2', 'u3', 'u4', 'u5'],
    comments: [
      { id: 'c3', user: MOCK_USERS[1], text: 'Wow!', timestamp: new Date(Date.now() - 7200000) },
    ],
    timestamp: new Date(Date.now() - 172800000),
     status: 'approved',
  },
  {
    id: 'p3',
    type: 'image',
    url: 'https://picsum.photos/seed/post3/600/600',
    caption: 'My new puppy!',
    user: MOCK_USERS[3],
    likes: ['u1', 'u2', 'u5'],
    comments: [
         { id: 'c4', user: MOCK_USERS[0], text: 'So cute!', timestamp: new Date(Date.now() - 900000) },
         { id: 'c5', user: MOCK_USERS[2], text: 'OMG I want one!', timestamp: new Date(Date.now() - 600000) },
         { id: 'c6', user: MOCK_USERS[1], text: 'What breed is it?', timestamp: new Date(Date.now() - 300000) },
    ],
    timestamp: new Date(Date.now() - 259200000),
     status: 'approved',
  },
   {
    id: 'p4',
    type: 'image',
    url: 'https://picsum.photos/seed/mypost1/600/600',
    caption: 'Another great day!',
    user: MOCK_USERS[0],
    likes: ['u2', 'u3'],
    comments: [],
    timestamp: new Date(Date.now() - 3*86400000),
     status: 'approved',
  },
  {
    id: 'p5',
    type: 'image',
    url: 'https://picsum.photos/seed/pendingpost/600/600',
    caption: 'Exploring the forest trails.',
    user: MOCK_USERS[2],
    likes: [],
    comments: [],
    timestamp: new Date(Date.now() - 100000),
     status: 'pending',
  },
];

export const MOCK_STORIES: Story[] = [
  { id: 's1', userId: 'u1', type: 'image', url: 'https://picsum.photos/seed/story1/1080/1920', timestamp: new Date(Date.now() - 2 * 3600000) },
  { id: 's2', userId: 'u1', type: 'video', url: 'https://videos.pexels.com/video-files/857041/857041-hd_720_1366_30fps.mp4', timestamp: new Date(Date.now() - 1 * 3600000) },
  { id: 's3', userId: 'u2', type: 'image', url: 'https://picsum.photos/seed/story2/1080/1920', timestamp: new Date(Date.now() - 5 * 3600000) },
  // This one is old and shouldn't appear
  { id: 's4', userId: 'u3', type: 'image', url: 'https://picsum.photos/seed/story3/1080/1920', timestamp: new Date(Date.now() - 48 * 3600000) },
];


export const MOCK_LOCATIONS: LocationData[] = [
    { city: 'São Paulo', country: 'Brazil', count: 125 },
    { city: 'Rio de Janeiro', country: 'Brazil', count: 88 },
    { city: 'Lisbon', country: 'Portugal', count: 72 },
    { city: 'New York', country: 'USA', count: 54 },
    { city: 'Tokyo', country: 'Japan', count: 41 },
    { city: 'London', country: 'UK', count: 32 },
];

export const MOCK_FRIEND_REQUESTS: FriendRequest[] = [
    { id: 'fr1', from: MOCK_USERS[2], to: MOCK_USERS[0], status: 'pending' },
    { id: 'fr2', from: MOCK_USERS[3], to: MOCK_USERS[0], status: 'pending' },
];

export const MOCK_MESSAGES: Message[] = [
    { id: 'm1', fromId: 'u2', toId: 'u1', text: 'Hey! Loved your last post.', timestamp: new Date(Date.now() - 5 * 60000) },
    { id: 'm2', fromId: 'u1', toId: 'u2', text: 'Thanks Bella! The city was beautiful.', timestamp: new Date(Date.now() - 4 * 60000) },
    { id: 'm3', fromId: 'u2', toId: 'u1', text: 'We should go on a photo walk sometime.', timestamp: new Date(Date.now() - 3 * 60000) },
    { id: 'm4', fromId: 'u1', toId: 'u2', text: 'For sure! Let me know when you\'re free.', timestamp: new Date(Date.now() - 2 * 60000) },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'like', user: MOCK_USERS[1], post: MOCK_POSTS[1], timestamp: new Date(Date.now() - 10 * 60000), read: false },
  { id: 'n2', type: 'friend_request', user: MOCK_USERS[4], timestamp: new Date(Date.now() - 30 * 60000), read: false },
  { id: 'n3', type: 'like', user: MOCK_USERS[2], post: MOCK_POSTS[3], timestamp: new Date(Date.now() - 2 * 3600000), read: true },
];

// ICONS
export const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

export const TrophyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l1.293-1.293a1 1 0 011.414 0L15 8V5a2 2 0 012-2h1a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h1a2 2 0 012 2v3l3.293-3.293a1 1 0 011.414 0L15 6v13h-6z" />
  </svg>
);

export const ChartBarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

export const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a3.001 3.001 0 015.652 0M9.5 12a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0z" />
    </svg>
);

export const BellIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

export const ClipboardCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const HeartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export const ChatBubbleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

export const PlusCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
  </svg>
);


export const XMarkIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);