import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../context/AuthContext';
import ProfileSettings from '../components/ProfileSettings';
import {
    Users, Video, Pencil, Plus, ArrowRight, Clock, Trash2,
    LogOut, Sparkles, Layout, MessageSquare, Share2, Zap, Star,
    Palette, Rocket, Link2, Hand, FolderOpen, Settings
} from 'lucide-react';

// Helpers for localStorage-backed recent boards
const STORAGE_KEY = 'syncspace_recent_boards';

function getRecentBoards() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch { return []; }
}

function saveBoard(board) {
    const boards = getRecentBoards().filter(b => b.id !== board.id);
    boards.unshift(board);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(boards.slice(0, 12)));
}

function removeBoard(id) {
    const boards = getRecentBoards().filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
}

// Random pastel color for board cards
const CARD_COLORS = [
    'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-purple-200',
    'bg-pink-200', 'bg-orange-200', 'bg-cyan-200', 'bg-red-200'
];
const CARD_COLORS_DARK = [
    'dark:bg-blue-900/40', 'dark:bg-green-900/40', 'dark:bg-yellow-900/40', 'dark:bg-purple-900/40',
    'dark:bg-pink-900/40', 'dark:bg-orange-900/40', 'dark:bg-cyan-900/40', 'dark:bg-red-900/40'
];
function getCardColor(index) {
    return `${CARD_COLORS[index % CARD_COLORS.length]} ${CARD_COLORS_DARK[index % CARD_COLORS_DARK.length]}`;
}

// Time ago helper
function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

export default function Home() {
    const [roomName, setRoomName] = useState('');
    const [joinId, setJoinId] = useState('');
    const [recentBoards, setRecentBoards] = useState([]);
    const [greeting, setGreeting] = useState('');
    const [showProfile, setShowProfile] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        setRecentBoards(getRecentBoards());
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 17) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    const createRoom = () => {
        const newRoomId = uuidv4();
        const board = {
            id: newRoomId,
            name: roomName.trim() || 'Untitled Board',
            createdAt: new Date().toISOString(),
            starred: false
        };
        saveBoard(board);
        navigate(`/lobby/${newRoomId}`);
    };

    const joinRoom = (e) => {
        e.preventDefault();
        if (joinId.trim()) {
            const board = {
                id: joinId.trim(),
                name: `Joined Board`,
                createdAt: new Date().toISOString(),
                starred: false
            };
            saveBoard(board);
            navigate(`/lobby/${joinId.trim()}`);
        }
    };

    const openBoard = (board) => {
        // Move to top of recents
        saveBoard({ ...board, createdAt: new Date().toISOString() });
        navigate(`/lobby/${board.id}`);
    };

    const deleteBoard = (e, id) => {
        e.stopPropagation();
        removeBoard(id);
        setRecentBoards(getRecentBoards());
    };

    const toggleStar = (e, board) => {
        e.stopPropagation();
        const boards = getRecentBoards().map(b =>
            b.id === board.id ? { ...b, starred: !b.starred } : b
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
        setRecentBoards(boards);
    };

    const displayName = user?.name?.split(' ')[0] || 'Creator';

    return (
        <div className="min-h-screen bg-[#fdfdfd] dark:bg-[#0a0a0f] font-sans selection:bg-yellow-200 dark:selection:bg-yellow-800 overflow-auto transition-colors duration-300">

            {/* ─── Scattered Background Doodles ─── */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-16 left-8 -rotate-12 opacity-[0.07] dark:opacity-[0.15] dark:text-white"><Pencil size={64} strokeWidth={1.5} /></div>
                <div className="absolute top-40 right-12 rotate-12 opacity-[0.07] dark:opacity-[0.15] dark:text-white"><MessageSquare size={52} strokeWidth={1.5} /></div>
                <div className="absolute bottom-32 left-16 rotate-45 opacity-[0.07] dark:opacity-[0.15] dark:text-white"><Zap size={52} strokeWidth={1.5} /></div>
                <div className="absolute bottom-20 right-28 -rotate-6 opacity-[0.07] dark:opacity-[0.15] dark:text-white"><Palette size={64} strokeWidth={1.5} /></div>
                <div className="absolute top-1/2 left-1/3 rotate-12 opacity-[0.05] dark:opacity-[0.1] dark:text-white"><Star size={44} strokeWidth={1.5} /></div>
                <div className="absolute top-28 left-1/2 -rotate-45 opacity-[0.06] dark:opacity-[0.12] dark:text-white"><Rocket size={52} strokeWidth={1.5} /></div>
            </div>

            {/* ─── Top Navigation Bar ─── */}
            <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b-2 border-black dark:border-gray-700 shadow-[0_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[0_4px_0px_0px_rgba(55,65,81,1)] transition-colors">
                <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-yellow-300 dark:bg-yellow-500 border-2 border-black dark:border-gray-700 p-2 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -rotate-3 hover:rotate-0 transition-transform cursor-pointer">
                            <Pencil size={22} strokeWidth={2.5} color="black" />
                        </div>
                        <h1 className="text-2xl font-extrabold text-black dark:text-white tracking-tight">SyncSpace</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowProfile(true)}
                            className="bg-blue-200 dark:bg-blue-800 border-2 border-black dark:border-gray-600 px-4 py-2 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(55,65,81,1)] rotate-1 hidden sm:flex items-center gap-2 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all cursor-pointer"
                            title="Open Settings"
                        >
                            <span className="text-sm font-bold text-black dark:text-white flex items-center gap-1.5">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="" className="w-5 h-5 rounded-full border border-black dark:border-gray-500" />
                                ) : (
                                    <Hand size={14} strokeWidth={2.5} />
                                )}
                                {displayName}
                            </span>
                        </button>
                        <button
                            onClick={logout}
                            className="p-2 bg-red-200 dark:bg-red-900/60 border-2 border-black dark:border-gray-600 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(55,65,81,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all text-black dark:text-white"
                            title="Logout"
                        >
                            <LogOut size={18} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* ─── Main Content ─── */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">

                {/* Greeting Banner */}
                <div className="mb-10">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-black dark:text-white tracking-tight mb-2">
                        {greeting}, <span className="text-blue-500 dark:text-blue-400">{displayName}</span>! <Sparkles size={28} strokeWidth={2} className="inline ml-1 text-yellow-500" />
                    </h2>
                    <p className="text-lg text-gray-700 dark:text-gray-400 font-medium">
                        What will you create today? Start a new workspace or jump into a recent one.
                    </p>
                </div>

                {/* ─── Action Cards Row ─── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">

                    {/* Create New Workspace Card */}
                    <div className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(55,65,81,1)] p-6 -rotate-[0.5deg] hover:rotate-0 transition-transform duration-300 flex flex-col">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="bg-green-300 dark:bg-green-700 border-2 border-black dark:border-gray-600 p-2.5 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rotate-3">
                                <Plus size={22} strokeWidth={2.5} className="text-black dark:text-white" />
                            </div>
                            <h3 className="text-xl font-extrabold text-black dark:text-white tracking-tight">New Workspace</h3>
                        </div>
                        <div className="space-y-4 flex-1">
                            <div>
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 block">Room Name (optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Sprint Planning, Design Review..."
                                    value={roomName}
                                    onChange={(e) => setRoomName(e.target.value)}
                                    className="w-full bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-600 rounded-xl px-4 py-3 text-black dark:text-white font-medium text-base placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 transition-all"
                                />
                            </div>
                            <button
                                onClick={createRoom}
                                className="w-full bg-blue-400 dark:bg-blue-600 hover:bg-blue-500 dark:hover:bg-blue-700 text-black dark:text-white font-bold text-lg py-4 px-6 border-2 border-black dark:border-gray-600 rounded-xl flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(55,65,81,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
                            >
                                <Video size={22} strokeWidth={2.5} />
                                <Rocket size={18} strokeWidth={2.5} className="inline" /> Start Workspace
                            </button>
                        </div>
                    </div>

                    {/* Join Existing Workspace Card */}
                    <div className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(55,65,81,1)] p-6 rotate-[0.5deg] hover:rotate-0 transition-transform duration-300 flex flex-col">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="bg-purple-300 dark:bg-purple-700 border-2 border-black dark:border-gray-600 p-2.5 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -rotate-3">
                                <Users size={22} strokeWidth={2.5} className="text-black dark:text-white" />
                            </div>
                            <h3 className="text-xl font-extrabold text-black dark:text-white tracking-tight">Join Workspace</h3>
                        </div>
                        <form onSubmit={joinRoom} className="space-y-4 flex-1 flex flex-col">
                            <div className="flex-1">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 block">Room Code</label>
                                <input
                                    type="text"
                                    placeholder="Paste the workspace code here..."
                                    value={joinId}
                                    onChange={(e) => setJoinId(e.target.value)}
                                    required
                                    className="w-full bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-600 rounded-xl px-4 py-3 text-black dark:text-white font-medium text-base placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-green-300 dark:bg-green-700 hover:bg-green-400 dark:hover:bg-green-800 text-black dark:text-white font-bold text-lg py-4 px-6 border-2 border-black dark:border-gray-600 rounded-xl flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(55,65,81,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
                            >
                                <ArrowRight size={22} strokeWidth={2.5} />
                                <Link2 size={18} strokeWidth={2.5} className="inline" /> Join Workspace
                            </button>
                        </form>
                    </div>
                </div>

                {/* ─── Quick Features Strip ─── */}
                <div className="mb-12">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {[
                            { icon: <Layout size={16} strokeWidth={2.5} />, label: 'Whiteboard', color: 'bg-yellow-200 dark:bg-yellow-900/50' },
                            { icon: <Video size={16} strokeWidth={2.5} />, label: 'Video Call', color: 'bg-blue-200 dark:bg-blue-900/50' },
                            { icon: <MessageSquare size={16} strokeWidth={2.5} />, label: 'Live Chat', color: 'bg-green-200 dark:bg-green-900/50' },
                            { icon: <Share2 size={16} strokeWidth={2.5} />, label: 'Screen Share', color: 'bg-purple-200 dark:bg-purple-900/50' },
                            { icon: <Zap size={16} strokeWidth={2.5} />, label: 'Real-time Sync', color: 'bg-orange-200 dark:bg-orange-900/50' },
                            { icon: <Sparkles size={16} strokeWidth={2.5} />, label: 'Collaborative', color: 'bg-pink-200 dark:bg-pink-900/50' },
                        ].map((feat, i) => (
                            <div
                                key={i}
                                className={`${feat.color} border-2 border-black dark:border-gray-600 rounded-xl px-4 py-2 flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(55,65,81,1)] text-black dark:text-white font-bold text-sm hover:-translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-default`}
                                style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (1 + Math.random())}deg)` }}
                            >
                                {feat.icon}
                                {feat.label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ─── Dashed Divider ─── */}
                <div className="w-full relative flex items-center py-4 mb-8">
                    <div className="flex-grow border-t-2 border-black dark:border-gray-600 border-dashed"></div>
                    <span className="flex-shrink-0 mx-4 text-black dark:text-white font-extrabold px-5 py-2 bg-yellow-200 dark:bg-yellow-800/60 border-2 border-black dark:border-gray-600 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(55,65,81,1)] -rotate-1 text-base">
                        <FolderOpen size={18} strokeWidth={2.5} className="inline mr-1" /> Recent Boards
                    </span>
                    <div className="flex-grow border-t-2 border-black dark:border-gray-600 border-dashed"></div>
                </div>

                {/* ─── Recent Boards Grid ─── */}
                {recentBoards.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 border-dashed rounded-2xl p-12 flex flex-col items-center gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] rotate-[0.3deg]">
                        <Palette size={48} strokeWidth={1.5} className="text-black dark:text-gray-400" />
                        <h3 className="text-xl font-extrabold text-black dark:text-white">No boards yet!</h3>
                        <p className="text-gray-600 dark:text-gray-400 font-medium text-center max-w-md">
                            Create your first workspace above and it will appear here for quick access.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {recentBoards.map((board, index) => (
                            <div
                                key={board.id}
                                onClick={() => openBoard(board)}
                                className={`${getCardColor(index)} border-2 border-black dark:border-gray-600 rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(55,65,81,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group relative`}
                                style={{ transform: `rotate(${(index % 2 === 0 ? -0.5 : 0.5)}deg)` }}
                            >
                                {/* Star Button */}
                                <button
                                    onClick={(e) => toggleStar(e, board)}
                                    className="absolute top-3 right-3 p-1 opacity-60 group-hover:opacity-100 transition-opacity"
                                    title={board.starred ? 'Unstar' : 'Star'}
                                >
                                    <Star
                                        size={18}
                                        strokeWidth={2.5}
                                        className={board.starred ? 'fill-yellow-400 text-black dark:text-white' : 'text-black dark:text-white'}
                                    />
                                </button>

                                {/* Board Icon */}
                                <div className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 w-10 h-10 rounded-lg flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-3">
                                    <Pencil size={18} strokeWidth={2.5} className="text-black dark:text-white" />
                                </div>

                                {/* Board Name */}
                                <h4 className="font-extrabold text-black dark:text-white text-base mb-1 truncate pr-6">
                                    {board.name}
                                </h4>

                                {/* Board ID preview */}
                                <p className="text-xs font-mono text-black/50 dark:text-white/40 font-bold mb-3 truncate">
                                    {board.id.slice(0, 16)}...
                                </p>

                                {/* Footer */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-black/70 dark:text-white/60">
                                        <Clock size={12} strokeWidth={2.5} />
                                        {timeAgo(board.createdAt)}
                                    </div>
                                    <button
                                        onClick={(e) => deleteBoard(e, board.id)}
                                        className="p-1.5 bg-white dark:bg-gray-700 border-2 border-black dark:border-gray-600 rounded-lg shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] opacity-0 group-hover:opacity-100 transition-all hover:bg-red-200 dark:hover:bg-red-900/60 text-black dark:text-white"
                                        title="Remove from recents"
                                    >
                                        <Trash2 size={12} strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ─── Footer ─── */}
                <div className="mt-16 mb-8 text-center">
                    <div className="inline-block text-black dark:text-white font-extrabold -rotate-1 border-b-4 border-black dark:border-gray-500 pb-1 text-lg">
                        <Zap size={18} strokeWidth={2.5} className="inline mr-1" /> Experience the future of collaboration
                    </div>
                </div>
            </main>

            {/* Profile Settings Modal */}
            <ProfileSettings isOpen={showProfile} onClose={() => setShowProfile(false)} />
        </div>
    );
}