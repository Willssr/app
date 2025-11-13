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
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
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
  { id: 's2', userId: 'u1', type: 'video', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', timestamp: new Date(Date.now() - 1 * 3600000) },
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

// ICONS (Outline style for a modern look)
export const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
);

export const TrophyIcon = (props: React.SVGProps<SVGSVGElement>) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 0 1 9 0Zm0 0c0 .531-.224 1.01-.584 1.353l-1.933 1.932a.875.875 0 0 1-1.238 0l-1.933-1.932A1.875 1.875 0 0 1 9 18.75h7.5ZM16.5 18.75h2.625A2.625 2.625 0 0 0 21.75 16.5v-2.625a2.625 2.625 0 0 0-2.625-2.625H19.5V8.25c0-1.036-.84-1.875-1.875-1.875H6.375A1.875 1.875 0 0 0 4.5 8.25v2.625H2.25A2.625 2.625 0 0 0 0 13.875v2.625A2.625 2.625 0 0 0 2.25 19.5h2.625" /></svg>
);

export const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.962c.57-1.036 1.146-2.096 1.762-3.162A9.083 9.083 0 0 1 12 8.411a9.083 9.083 0 0 1 3.682 1.459c.616 1.066 1.192 2.126 1.762 3.162M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 0 1 3-3h.008a3 3 0 0 1 3 3v8.25a3 3 0 0 1-3 3h-.008Zm-3.75 4.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM15.75 20.25a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z" /></svg>
);

export const BellIcon = (props: React.SVGProps<SVGSVGElement>) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>
);

export const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
);

export const CogIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.11-1.226.55-.22 1.156-.22 1.706 0 .55.219 1.02.684 1.11 1.226.09.542-.056 1.12-.436 1.508l-.28.285c-.37.37.237 1.036.706 1.268.47.232 1.02.232 1.49 0 .47-.232.826-.898.456-1.268l-.28-.285a.835.835 0 0 1-.436-1.508c.09-.542.56-1.007 1.11-1.226.55-.22 1.156-.22 1.706 0 .55.219 1.02.684 1.11 1.226.09.542-.056 1.12-.436 1.508l-.28.285c-.37.37.237 1.036.706 1.268.47.232 1.02.232 1.49 0 .47-.232.826-.898.456-1.268l-.28-.285a.835.835 0 0 1-.436-1.508c.09-.542.56-1.007 1.11-1.226.55-.22 1.156-.22 1.706 0 .55.219 1.02.684 1.11 1.226.09.542-.056 1.12-.436 1.508l-5.38 5.38c-.37.37-1.036.237-1.268-.706-.232-.47-.232-1.02 0-1.49.232-.47.898-.826 1.268-.456l5.38-5.38c.37-.37.324-.966-.056-1.508-.38-.542-1.007-.826-1.508-.456l-5.38 5.38c-.37.37-.966.324-1.508-.056-.542-.38-.826-1.007-.456-1.508l.28-.28c.37-.37.237-1.036-.706-1.268-.47-.232-1.02-.232-1.49 0-.47.232-.826.898-.456 1.268l.28.28c.37.37.324.966-.056-1.508-.38.542-1.007-.826-1.508-.456l-2.85-.28c-.37-.37-.966-.324-1.508.056-.542.38-1.12.056-1.508-.436l-2.85-.28c-.37-.37-.966-.324-1.508.056-.542.38-1.12.056-1.508-.436l-5.38 5.38c-.37.37-.324.966.056 1.508.38.542 1.007.826 1.508.456l5.38-5.38c.37.37.966-.324 1.508.056.542.38.826 1.007.456 1.508l-.28.28c-.37.37-.237 1.036.706 1.268.47.232 1.02.232 1.49 0 .47-.232.826-.898.456-1.268l-.28-.28c-.37-.37-.324-.966.056-1.508.38-.542 1.007-.826 1.508-.456l2.85.28c.37.37.966.324 1.508-.056.542.38 1.12.056 1.508-.436l2.85.28c.37.37.966.324 1.508-.056.542.38 1.12.056 1.508-.436l2.85-.28c-.37-.37-.966-.324-1.508-.056a.835.835 0 0 1-1.508.436l-2.85-.28c-.37-.37-.966-.324-1.508.056-.542.38-1.12.056-1.508-.436Z" /></svg>
);

export const HeartIcon = (props: React.SVGProps<SVGSVGElement>) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
);

export const HeartIconSolid = (props: React.SVGProps<SVGSVGElement>) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M11.645 20.91a.75.75 0 0 1-1.29 0C8.632 17.824 3.632 14.468 3.43 9.941c-.2-4.523 2.582-7.868 6.07-7.868 2.545 0 4.232 1.362 5.062 2.924.83-1.562 2.517-2.924 5.062-2.924 3.488 0 6.27 3.345 6.07 7.868-.201 4.527-5.203 7.883-7.185 10.969Z" /></svg>
);

export const ChatBubbleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72 3.72a.75.75 0 0 1-1.06 0l-3.72-3.72h-3.72c-1.136 0-2.1-.847-2.193-1.98v-3.72a.75.75 0 0 1 1.06 0l3.72 3.72 3.72-3.72a.75.75 0 0 1 1.06 0l3.12 3.12a.75.75 0 0 0 1.06 0Z" /></svg>
);

export const ShareIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Zm0 0v2.25m0-2.25h1.5m-1.5 0h-1.5m-1.5 0v2.25m0 0h1.5m-1.5 0h-1.5m16.5-7.5h-1.5m-1.5 0v-1.5m0 1.5v1.5m0 0h1.5m-1.5 0h-1.5m-1.5 0v-1.5m0 0h-1.5m-1.5 0h-1.5m1.5 0v-1.5m0 0h-1.5m-1.5 0h-1.5m1.5 0v-1.5m0 0h-1.5M12 15v-1.5m0 1.5v1.5m0 0h1.5m-1.5 0h-1.5m-1.5 0v1.5m0 0h1.5m-1.5 0h-1.5m1.5 0v1.5m0 0h-1.5m16.5-7.5h-1.5m-1.5 0v-1.5m0 1.5v1.5m0 0h1.5m-1.5 0h-1.5M12 9.75v-1.5m0 1.5v1.5m0 0h1.5m-1.5 0h-1.5m-1.5 0v1.5m0 0h1.5m-1.5 0h-1.5m1.5 0v1.5m0 0h-1.5m1.5-1.5v-1.5m0 0h-1.5m9.75 4.5h1.5m-1.5 0v1.5m0 0h-1.5m1.5 0h1.5m0 0h-1.5m-1.5 0v1.5m0 0h-1.5m1.5 0h-1.5m-1.5 0v-1.5m0 0h1.5m0 0h-1.5" /></svg>
);

export const EllipsisHorizontalIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>
);

export const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
);

export const ArrowDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" /></svg>
);

export const RefreshIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.664 0l3.181-3.183m-11.664 0-3.181 3.183m0 0-3.181-3.183m3.181 3.183 3.181-3.183" /></svg>
);

export const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
);

export const XMarkIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
);

export const PhotoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
);

export const PaperAirplaneIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>
);

export const FaceSmileIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4.5 4.5 0 0 1-6.364 0M9 10.5h.008v.008H9v-.008Zm6 0h.008v.008H15v-.008Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
);

export const ExclamationTriangleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
);

export const ShieldCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.6-3.751A11.959 11.959 0 0 1 12 2.714Z" /></svg>
);

export const ArrowRightOnRectangleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>
);

export const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
);

export const ChartBarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>
);

export const DocumentMagnifyingGlassIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.5h3.832a1.125 1.125 0 0 0 1.125-1.125V6.108m-4.956 12.448-4.357-4.357a1.125 1.125 0 0 1 0-1.591l4.357-4.357a1.125 1.125 0 0 1 1.591 0l4.357 4.357a1.125 1.125 0 0 1 0 1.591l-4.357 4.357a1.125 1.125 0 0 1-1.591 0ZM8.25 9.75h4.5v-.75a.375.375 0 0 0-.375-.375h-3.75a.375.375 0 0 0-.375.375v.75Z" />
    </svg>
);
