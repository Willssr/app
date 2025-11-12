import React, { useState, useEffect, useRef } from 'react';
import { User, Message } from '../types';

interface ChatProps {
    partner: User;
    messages: Message[];
    currentUser: User;
    onBack: () => void;
    onSendMessage: (toId: string, text: string) => void;
}

const Chat: React.FC<ChatProps> = ({ partner, messages, currentUser, onBack, onSendMessage }) => {
    const [text, setText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        onSendMessage(partner.id, text);
        setText('');
    };
    
    const sortedMessages = messages.slice().sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime());

    return (
        <div className="flex flex-col h-full max-w-2xl mx-auto" style={{height: 'calc(100vh - 120px)'}}>
            {/* Header */}
            <div className="flex items-center p-3 border-b border-gray-700 bg-gray-800 rounded-t-lg">
                <button onClick={onBack} className="text-purple-400 hover:text-purple-300 mr-3">
                    &larr;
                </button>
                <img src={partner.avatar} alt={partner.name} className="w-10 h-10 rounded-full" />
                <h2 className="text-lg font-bold ml-3">{partner.name}</h2>
            </div>

            {/* Messages */}
            <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-gray-800/50">
                {sortedMessages.map(msg => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.fromId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                       {msg.fromId !== currentUser.id && <img src={partner.avatar} className="w-6 h-6 rounded-full" />}
                       <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.fromId === currentUser.id ? 'bg-purple-600 text-white rounded-br-lg' : 'bg-gray-700 text-gray-200 rounded-bl-lg'}`}>
                            <p>{msg.text}</p>
                       </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 border-t border-gray-700 bg-gray-800 rounded-b-lg">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full bg-gray-700 border-gray-600 rounded-full px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full disabled:opacity-50" disabled={!text.trim()}>
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chat;