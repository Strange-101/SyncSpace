import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWebRTC } from '../hooks/useWebRTC';
import Whiteboard from '../components/Whiteboard';
import { VideoGrid } from '../components/VideoGrid';
import { BottomBar } from '../components/BottomBar';
import { SidebarPanel } from '../components/SidebarPanel';
import { ArrowLeft, Users, Copy, CheckCircle2, Pencil, UserCheck, UserX, Bell } from 'lucide-react';

export default function Workspace() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const userName = user?.name || 'Anonymous';

    // Read initial media preferences from lobby (defaults to on)
    const initialVideo = location.state?.initialVideo ?? true;
    const initialAudio = location.state?.initialAudio ?? true;

    const {
        peers,
        userVideo,
        socket,
        toggleVideo,
        toggleAudio,
        isVideoOn,
        isAudioOn,
        toggleScreenShare,
        isScreenSharing,
        peerMediaStates,
        peerNames,
        joinRequests,
        admitUser,
        denyUser
    } = useWebRTC(roomId, userName, initialVideo, initialAudio);

    const [copied, setCopied] = useState(false);
    const [viewMode, setViewMode] = useState('whiteboard'); // 'whiteboard' | 'gallery'

    // Sidebar State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sidebarTab, setSidebarTab] = useState('chat'); // 'chat' | 'participants'

    const copyRoomId = () => {
        navigator.clipboard.writeText(roomId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLeave = () => {
        navigate('/dashboard');
    };

    const toggleSidebar = (tab) => {
        if (isSidebarOpen && sidebarTab === tab) {
            setIsSidebarOpen(false);
        } else {
            setSidebarTab(tab);
            setIsSidebarOpen(true);
        }
    };

    return (
        <div className="flex w-screen h-screen overflow-hidden bg-[#fdfdfd] dark:bg-[#0a0a0f] font-sans selection:bg-yellow-200 dark:selection:bg-yellow-800 transition-colors">
            {/* Top Navigation Bar */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b-2 border-black dark:border-gray-700 flex items-center justify-between px-5 z-40 shadow-[0_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[0_4px_0px_0px_rgba(55,65,81,1)] pointer-events-auto transition-colors">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleLeave}
                        className="p-2 bg-red-100 dark:bg-red-900/50 border-2 border-black dark:border-gray-600 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all text-black dark:text-white"
                    >
                        <ArrowLeft size={18} strokeWidth={2.5} />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="bg-yellow-300 dark:bg-yellow-500 border-2 border-black dark:border-gray-700 p-1.5 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-3">
                            <Pencil size={16} strokeWidth={2.5} color="black" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-sm font-extrabold text-black dark:text-white tracking-tight">SyncSpace</h1>
                            <span className="text-[10px] text-gray-700 dark:text-gray-400 font-bold font-mono">
                                Room: {roomId.slice(0, 8)}...
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={copyRoomId}
                        className="flex items-center gap-2 px-3 py-1.5 bg-purple-200 dark:bg-purple-800 border-2 border-black dark:border-gray-600 text-black dark:text-white text-sm font-bold rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all rotate-1"
                    >
                        {copied ? <CheckCircle2 size={16} strokeWidth={2.5} /> : <Copy size={16} strokeWidth={2.5} />}
                        {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                    <div
                        className="flex items-center justify-center bg-blue-300 dark:bg-blue-800 text-black dark:text-white px-3 py-1.5 rounded-lg border-2 border-black dark:border-gray-600 text-sm font-bold gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:bg-blue-400 dark:hover:bg-blue-700 transition-colors -rotate-1"
                        onClick={() => toggleSidebar('participants')}
                    >
                        <Users size={16} strokeWidth={2.5} />
                        <span>{peers.length + 1}</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area (Conditional on ViewMode) */}
            <div className={`flex-1 w-full h-full relative z-10 pt-[68px] transition-all duration-500 ${viewMode === 'whiteboard' ? 'opacity-100' : 'opacity-0 pointer-events-none absolute'} ${isSidebarOpen ? 'pr-80' : ''}`}>
                <Whiteboard socket={socket} roomId={roomId} />
            </div>

            {/* Video Grid Layer - Adapts based on viewMode */}
            <div className={`absolute inset-0 pt-[68px] pb-28 px-4 transition-all duration-500 z-20 pointer-events-none flex ${viewMode === 'gallery' ? 'items-center justify-center bg-[#fdfdfd] dark:bg-[#0a0a0f]' : ''} ${isSidebarOpen ? 'pr-84' : ''}`}>
                <VideoGrid
                    userVideo={userVideo}
                    peers={peers}
                    viewMode={viewMode}
                    peerNames={peerNames}
                    userName={userName}
                />
            </div>

            {/* Chat & Participants Sidebar Panel */}
            <SidebarPanel
                isOpen={isSidebarOpen}
                tab={sidebarTab}
                onClose={() => setIsSidebarOpen(false)}
                peers={peers}
                socket={socket}
                roomId={roomId}
                peerMediaStates={peerMediaStates}
                localMedia={{ video: isVideoOn, audio: isAudioOn }}
                peerNames={peerNames}
                userName={userName}
            />

            {/* Unified Bottom Control Bar */}
            <BottomBar
                isVideoOn={isVideoOn}
                isAudioOn={isAudioOn}
                toggleVideo={toggleVideo}
                toggleAudio={toggleAudio}
                viewMode={viewMode}
                setViewMode={setViewMode}
                toggleScreenShare={toggleScreenShare}
                isScreenSharing={isScreenSharing}
                onToggleSidebar={toggleSidebar}
                activeSidebarTab={sidebarTab}
                isSidebarOpen={isSidebarOpen}
                onLeave={handleLeave}
            />

            {/* Admission Popup — Host sees join requests */}
            {joinRequests.length > 0 && (
                <div className="fixed top-20 right-5 z-50 space-y-3 max-w-sm">
                    {joinRequests.map((req) => (
                        <div key={req.socketId} className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(55,65,81,1)] p-4 animate-in slide-in-from-right">
                            <p className="font-extrabold text-black dark:text-white text-sm mb-3 flex items-center gap-2">
                                <Bell size={16} strokeWidth={2.5} className="inline" /> <span className="text-blue-600 dark:text-blue-400">{req.userName}</span> wants to join
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => admitUser(req.socketId)}
                                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-green-300 dark:bg-green-700 border-2 border-black dark:border-gray-600 rounded-lg font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all text-black dark:text-white"
                                >
                                    <UserCheck size={14} strokeWidth={2.5} /> Admit
                                </button>
                                <button
                                    onClick={() => denyUser(req.socketId)}
                                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-200 dark:bg-red-900 border-2 border-black dark:border-gray-600 rounded-lg font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all text-black dark:text-white"
                                >
                                    <UserX size={14} strokeWidth={2.5} /> Deny
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
