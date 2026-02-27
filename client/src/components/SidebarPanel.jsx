import React, { useState, useEffect, useRef } from 'react';
import { X, Send, User, Mic, MicOff, Video, VideoOff, MessageSquare, Users, Sparkles } from 'lucide-react';

export const SidebarPanel = ({ isOpen, tab, onClose, peers, socket, roomId, peerMediaStates = {}, localMedia = { video: true, audio: true }, peerNames = {}, userName = 'You' }) => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    // Auto-scroll chat to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (tab === 'chat') {
            scrollToBottom();
        }
    }, [messages, tab, isOpen]);

    // Setup Chat Socket listeners
    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (msg) => {
            setMessages((prev) => [...prev, msg]);
        };

        socket.on('receive_message', handleReceiveMessage);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
        };
    }, [socket]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim() || !socket) return;

        const msgData = {
            roomId,
            sender: socket.id,
            senderName: userName,
            text: inputValue,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        socket.emit('send_message', msgData);
        setMessages((prev) => [...prev, { ...msgData, isLocal: true }]);
        setInputValue('');
    };

    if (!isOpen) return null;

    return (
        <div className="absolute top-[68px] right-0 bottom-0 w-80 bg-white border-l-2 border-black shadow-[-4px_0px_0px_0px_rgba(0,0,0,1)] flex flex-col z-40 transition-transform duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b-2 border-black bg-yellow-200">
                <h2 className="font-extrabold text-black tracking-tight text-lg">
                    {tab === 'chat' ? <><MessageSquare size={16} strokeWidth={2.5} className="inline" /> Chat</> : <><Users size={16} strokeWidth={2.5} className="inline" /> Participants</>}
                </h2>
                <button
                    onClick={onClose}
                    className="p-1.5 bg-red-200 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all text-black"
                >
                    <X size={14} strokeWidth={3} />
                </button>
            </div>

            {/* Chat Content */}
            {tab === 'chat' && (
                <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#fdfdfd]">
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm gap-2">
                                <span className="text-3xl">💭</span>
                                <span className="font-bold">No messages yet. Say hello!</span>
                            </div>
                        ) : (
                            messages.map((msg, idx) => (
                                <div key={idx} className={`flex flex-col ${msg.isLocal ? 'items-end' : 'items-start'}`}>
                                    <span className="text-[10px] text-gray-600 mb-1 ml-1 font-bold">
                                        {msg.isLocal ? <><Sparkles size={12} strokeWidth={2.5} className="inline" /> {userName}</> : <><User size={12} strokeWidth={2.5} className="inline" /> {msg.senderName || peerNames[msg.sender] || 'User ' + msg.sender.slice(0, 4)}</>} • {msg.time}
                                    </span>
                                    <div className={`px-3 py-2 rounded-xl max-w-[85%] text-sm font-medium border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${msg.isLocal
                                        ? 'bg-blue-300 text-black'
                                        : 'bg-white text-black'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={sendMessage} className="p-3 bg-white border-t-2 border-black">
                        <div className="relative flex items-center gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 bg-white border-2 border-black rounded-xl py-2.5 pl-4 pr-4 text-sm font-medium focus:outline-none focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-0.5 transition-all text-black placeholder-gray-400"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim()}
                                className="p-2.5 bg-green-300 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all disabled:opacity-40 disabled:pointer-events-none text-black"
                            >
                                <Send size={16} strokeWidth={2.5} />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Participants Content */}
            {tab === 'participants' && (
                <div className="flex-1 overflow-y-auto bg-[#fdfdfd] p-3 space-y-2">
                    {/* Local User */}
                    <div className="flex items-center justify-between p-3 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -rotate-[0.5deg]">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-yellow-300 border-2 border-black flex items-center justify-center font-extrabold text-xs text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <Sparkles size={16} strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-extrabold text-black">{userName} (You)</span>
                                <span className="text-[10px] font-bold text-gray-500">Connected</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className={`p-1 rounded-md border-2 border-black ${localMedia.audio ? 'bg-green-200' : 'bg-red-200'}`}>
                                {localMedia.audio ? <Mic size={12} strokeWidth={2.5} /> : <MicOff size={12} strokeWidth={2.5} />}
                            </div>
                            <div className={`p-1 rounded-md border-2 border-black ${localMedia.video ? 'bg-green-200' : 'bg-red-200'}`}>
                                {localMedia.video ? <Video size={12} strokeWidth={2.5} /> : <VideoOff size={12} strokeWidth={2.5} />}
                            </div>
                        </div>
                    </div>

                    {/* Remote Users */}
                    {peers.map((peerObj) => {
                        const media = peerMediaStates[peerObj.peerID] || { video: true, audio: true };
                        return (
                            <div key={peerObj.peerID} className="flex items-center justify-between p-3 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rotate-[0.3deg]">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-blue-300 border-2 border-black flex items-center justify-center font-extrabold text-xs text-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                        {(peerNames[peerObj.peerID] || peerObj.peerID).slice(0, 2)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-black">{peerNames[peerObj.peerID] || `User ${peerObj.peerID.slice(0, 4)}`}</span>
                                        <span className="text-[10px] font-bold text-gray-500">Connected</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className={`p-1 rounded-md border-2 border-black ${media.audio ? 'bg-green-200' : 'bg-red-200'}`}>
                                        {media.audio ? <Mic size={12} strokeWidth={2.5} /> : <MicOff size={12} strokeWidth={2.5} />}
                                    </div>
                                    <div className={`p-1 rounded-md border-2 border-black ${media.video ? 'bg-green-200' : 'bg-red-200'}`}>
                                        {media.video ? <Video size={12} strokeWidth={2.5} /> : <VideoOff size={12} strokeWidth={2.5} />}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
