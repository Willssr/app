import React, { useState, useEffect, useRef } from 'react';
import { User, Message } from '../types';
import { ArrowLeftIcon, PaperAirplaneIcon, PhotoIcon, FaceSmileIcon } from '../constants';

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
        <div className="flex flex-col h-full bg-background-secondary border border-border-color rounded-xl overflow-hidden" style={{height: 'calc(100vh - 100px)'}}>
            {/* Header */}
            <div className="flex items-center p-3 border-b border-border-color flex-shrink-0 bg-background-secondary/80 backdrop-blur-sm">
                <button onClick={onBack} className="text-text-secondary hover:text-text-primary mr-3 p-2 rounded-full">
                    <ArrowLeftIcon className="w-6 h-6"/>
                </button>
                <img src={partner.avatar} alt={partner.name} className="w-10 h-10 rounded-full" />
                <h2 className="text-lg font-semibold ml-3 text-text-primary">{partner.name}</h2>
            </div>

            {/* Messages */}
            <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-background-primary">
                {sortedMessages.map(msg => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.fromId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                       <div className={`max-w-xs md:max-w-lg p-3 rounded-2xl ${msg.fromId === currentUser.id ? 'bg-accent text-white rounded-br-lg' : 'bg-background-tertiary text-text-primary rounded-bl-lg'}`}>
                            <p className="break-words">{msg.text}</p>
                       </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 border-t border-border-color flex-shrink-0 bg-background-secondary">
                <div className="flex items-center space-x-2 bg-background-tertiary rounded-full border border-border-color focus-within:ring-2 focus-within:ring-accent pr-2">
                     <button type="button" className="p-2 text-text-secondary hover:text-accent"><PhotoIcon className="w-6 h-6" /></button>
                     <button type="button" className="p-2 text-text-secondary hover:text-accent"><FaceSmileIcon className="w-6 h-6" /></button>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full bg-transparent py-2 text-sm text-text-primary placeholder-text-secondary focus:outline-none"
                    />
                    <button type="submit" className="bg-accent text-white rounded-full p-2 disabled:opacity-50 disabled:bg-gray-500" disabled={!text.trim()}>
                        <PaperAirplaneIcon className="w-5 h-5"/>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chat;