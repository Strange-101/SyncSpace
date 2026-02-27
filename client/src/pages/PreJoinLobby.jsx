import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import {
    Video, VideoOff, Mic, MicOff, ArrowRight, Pencil, Loader2,
    Copy, CheckCircle2, ShieldCheck, Clock, UserCheck, UserX,
    Zap, Sparkles, DoorOpen, Rocket, User
} from 'lucide-react';

export default function PreJoinLobby() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const userName = user?.name || 'Anonymous';

    // Camera/Mic state
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isAudioOn, setIsAudioOn] = useState(true);
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);

    // Lobby state
    const [lobbyStatus, setLobbyStatus] = useState('loading'); // 'loading' | 'ready' | 'waiting' | 'denied'
    const [hostName, setHostName] = useState(null);
    const socketRef = useRef(null);
    const [copied, setCopied] = useState(false);

    // Admission requests (host sees these)
    const [joinRequests, setJoinRequests] = useState([]);

    // ─── Get camera preview ───
    useEffect(() => {
        let localStream = null;
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((s) => {
                localStream = s;
                setStream(s);
                if (videoRef.current) {
                    videoRef.current.srcObject = s;
                }
            })
            .catch((err) => {
                console.error('Failed to get media devices:', err);
                setIsVideoOn(false);
                setIsAudioOn(false);
            });

        return () => {
            if (localStream) {
                localStream.getTracks().forEach(t => t.stop());
            }
        };
    }, []);

    // ─── Re-attach stream to video element when toggling camera back on ───
    useEffect(() => {
        if (isVideoOn && stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [isVideoOn, stream]);

    // ─── Socket connection for lobby ───
    useEffect(() => {
        const socket = io('http://localhost:5001', { forceNew: true });
        socketRef.current = socket;

        socket.on('connect', () => {
            socket.emit('check_room', { roomId });
        });

        socket.on('room_status', ({ hasHost, hostName: hn }) => {
            setHostName(hn);
            setLobbyStatus('ready');
        });

        socket.on('join_approved', () => {
            // Stop lobby stream — workspace will create its own
            if (stream) {
                stream.getTracks().forEach(t => t.stop());
            }
            navigate(`/workspace/${roomId}`, {
                state: { initialVideo: isVideoOn, initialAudio: isAudioOn }
            });
        });

        socket.on('join_waiting', () => {
            setLobbyStatus('waiting');
        });

        socket.on('join_denied', () => {
            setLobbyStatus('denied');
        });

        // Host receives join requests from lobby
        socket.on('join_request', ({ socketId, userName: reqName }) => {
            setJoinRequests(prev => {
                if (prev.find(r => r.socketId === socketId)) return prev;
                return [...prev, { socketId, userName: reqName }];
            });
        });

        return () => {
            socket.removeAllListeners();
            socket.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId]);

    // ─── Toggle camera ───
    const toggleVideo = () => {
        if (stream) {
            const track = stream.getVideoTracks()[0];
            if (track) {
                track.enabled = !track.enabled;
                setIsVideoOn(track.enabled);
            }
        }
    };

    // ─── Toggle mic ───
    const toggleAudio = () => {
        if (stream) {
            const track = stream.getAudioTracks()[0];
            if (track) {
                track.enabled = !track.enabled;
                setIsAudioOn(track.enabled);
            }
        }
    };

    // ─── Join room ───
    const handleJoin = () => {
        socketRef.current?.emit('request_join', { roomId, userName });
    };

    // ─── Host: admit ───
    const admitUser = (socketId) => {
        socketRef.current?.emit('admit_user', { roomId, targetSocketId: socketId });
        setJoinRequests(prev => prev.filter(r => r.socketId !== socketId));
    };

    // ─── Host: deny ───
    const denyUser = (socketId) => {
        socketRef.current?.emit('deny_user', { roomId, targetSocketId: socketId });
        setJoinRequests(prev => prev.filter(r => r.socketId !== socketId));
    };

    const copyRoomId = () => {
        navigator.clipboard.writeText(roomId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#fdfdfd] font-sans selection:bg-yellow-200 flex flex-col items-center justify-center p-6 overflow-hidden relative">

            {/* Background doodles */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-16 left-8 -rotate-12 opacity-[0.06]"><Video size={64} strokeWidth={1.5} /></div>
                <div className="absolute bottom-20 right-16 rotate-12 opacity-[0.06]"><Mic size={52} strokeWidth={1.5} /></div>
                <div className="absolute top-1/3 right-8 rotate-45 opacity-[0.05]"><Zap size={44} strokeWidth={1.5} /></div>
                <div className="absolute bottom-1/3 left-12 -rotate-6 opacity-[0.05]"><Sparkles size={52} strokeWidth={1.5} /></div>
            </div>

            {/* Main Lobby Card */}
            <div className="relative z-10 w-full max-w-2xl">

                {/* Header */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="bg-yellow-300 border-2 border-black p-2.5 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -rotate-3">
                        <Pencil size={24} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-black tracking-tight">SyncSpace</h1>
                </div>

                <div className="bg-white border-2 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 rotate-[0.3deg] hover:rotate-0 transition-transform">

                    {/* Room Info */}
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-extrabold text-black tracking-tight flex items-center gap-2"><DoorOpen size={22} strokeWidth={2.5} /> Joining Room</h2>
                        <button
                            onClick={copyRoomId}
                            className="flex items-center gap-2 px-3 py-1.5 bg-purple-200 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all text-sm font-bold"
                        >
                            {copied ? <CheckCircle2 size={14} strokeWidth={2.5} /> : <Copy size={14} strokeWidth={2.5} />}
                            {copied ? 'Copied!' : 'Copy ID'}
                        </button>
                    </div>

                    {/* Camera Preview — always mount video, hide with CSS */}
                    <div className="relative w-full aspect-video rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-gray-900 mb-5">
                        {/* Video element always in DOM, hidden when camera off */}
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className={`w-full h-full object-cover -scale-x-100 ${isVideoOn ? 'block' : 'hidden'}`}
                        />
                        {/* Camera-off placeholder */}
                        {!isVideoOn && (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                                <div className="w-20 h-20 rounded-2xl bg-blue-300 border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                    <span className="text-3xl font-extrabold text-black">{userName.charAt(0).toUpperCase()}</span>
                                </div>
                                <span className="text-white/60 font-bold text-sm">Camera is off</span>
                            </div>
                        )}
                        {/* Name badge */}
                        <div className="absolute bottom-3 left-3 bg-yellow-300 px-3 py-1 rounded-lg text-black font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm">
                            <Sparkles size={14} strokeWidth={2.5} className="inline" /> {userName}
                        </div>
                    </div>

                    {/* Media Controls */}
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <button
                            onClick={toggleAudio}
                            className={`flex items-center gap-2 px-5 py-3 border-2 border-black rounded-xl font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all ${isAudioOn ? 'bg-green-200' : 'bg-red-200'}`}
                        >
                            {isAudioOn ? <Mic size={20} strokeWidth={2.5} /> : <MicOff size={20} strokeWidth={2.5} />}
                            {isAudioOn ? 'Mic On' : 'Mic Off'}
                        </button>
                        <button
                            onClick={toggleVideo}
                            className={`flex items-center gap-2 px-5 py-3 border-2 border-black rounded-xl font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all ${isVideoOn ? 'bg-green-200' : 'bg-red-200'}`}
                        >
                            {isVideoOn ? <Video size={20} strokeWidth={2.5} /> : <VideoOff size={20} strokeWidth={2.5} />}
                            {isVideoOn ? 'Camera On' : 'Camera Off'}
                        </button>
                    </div>

                    {/* Dashed divider */}
                    <div className="w-full border-t-2 border-black border-dashed my-5"></div>

                    {/* Status-Dependent UI */}
                    {lobbyStatus === 'loading' && (
                        <div className="flex items-center justify-center gap-3 py-4">
                            <Loader2 size={20} className="animate-spin" strokeWidth={2.5} />
                            <span className="font-bold text-gray-600">Checking room...</span>
                        </div>
                    )}

                    {lobbyStatus === 'ready' && (
                        <button
                            onClick={handleJoin}
                            className="w-full bg-blue-400 hover:bg-blue-500 text-black font-bold text-lg py-4 px-6 border-2 border-black rounded-xl flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
                        >
                            <ArrowRight size={22} strokeWidth={2.5} />
                            <Rocket size={18} strokeWidth={2.5} /> Join Workspace
                        </button>
                    )}

                    {lobbyStatus === 'waiting' && (
                        <div className="flex flex-col items-center gap-4 py-4">
                            <div className="bg-yellow-200 border-2 border-black rounded-xl px-6 py-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3 -rotate-[0.5deg]">
                                <Clock size={22} strokeWidth={2.5} className="animate-pulse" />
                                <div>
                                    <p className="font-extrabold text-black text-base">Waiting for host to let you in...</p>
                                    {hostName && <p className="text-sm font-bold text-gray-700">Host: {hostName}</p>}
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 font-medium">You'll be redirected automatically once approved</p>
                        </div>
                    )}

                    {lobbyStatus === 'denied' && (
                        <div className="flex flex-col items-center gap-4 py-4">
                            <div className="bg-red-200 border-2 border-black rounded-xl px-6 py-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
                                <UserX size={22} strokeWidth={2.5} />
                                <p className="font-extrabold text-black">The host declined your request</p>
                            </div>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-6 py-3 bg-white border-2 border-black rounded-xl font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                            >
                                ← Back to Dashboard
                            </button>
                        </div>
                    )}
                </div>

                {/* Join Requests (visible to host who is still on this page) */}
                {joinRequests.length > 0 && (
                    <div className="mt-6 bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-5">
                        <h3 className="font-extrabold text-black mb-3 flex items-center gap-2">
                            <ShieldCheck size={18} strokeWidth={2.5} />
                            People waiting ({joinRequests.length})
                        </h3>
                        <div className="space-y-3">
                            {joinRequests.map((req) => (
                                <div key={req.socketId} className="flex items-center justify-between p-3 bg-yellow-100 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                    <span className="font-bold text-black flex items-center gap-1.5"><User size={14} strokeWidth={2.5} /> {req.userName}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => admitUser(req.socketId)}
                                            className="px-3 py-1.5 bg-green-300 border-2 border-black rounded-lg font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1"
                                        >
                                            <UserCheck size={14} strokeWidth={2.5} /> Admit
                                        </button>
                                        <button
                                            onClick={() => denyUser(req.socketId)}
                                            className="px-3 py-1.5 bg-red-200 border-2 border-black rounded-lg font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1"
                                        >
                                            <UserX size={14} strokeWidth={2.5} /> Deny
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
