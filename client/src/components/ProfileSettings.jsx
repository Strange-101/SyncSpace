import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    X, User, Lock, Palette, Sun, Moon, Check, AlertTriangle,
    Loader2, Camera, KeyRound, PenLine, Sparkles, Shield
} from 'lucide-react';

// Avatar options — fun sketchy avatars using emoji-based initials or color blocks
const AVATAR_OPTIONS = [
    'https://api.dicebear.com/9.x/thumbs/svg?seed=Felix&backgroundColor=b6e3f4',
    'https://api.dicebear.com/9.x/thumbs/svg?seed=Aneka&backgroundColor=ffdfbf',
    'https://api.dicebear.com/9.x/thumbs/svg?seed=Mimi&backgroundColor=c0aede',
    'https://api.dicebear.com/9.x/thumbs/svg?seed=Patches&backgroundColor=d1d4f9',
    'https://api.dicebear.com/9.x/thumbs/svg?seed=Peanut&backgroundColor=ffd5dc',
    'https://api.dicebear.com/9.x/thumbs/svg?seed=Shadow&backgroundColor=b6e3f4',
    'https://api.dicebear.com/9.x/thumbs/svg?seed=Tiger&backgroundColor=ffdfbf',
    'https://api.dicebear.com/9.x/thumbs/svg?seed=Sophie&backgroundColor=c0aede',
    'https://api.dicebear.com/9.x/thumbs/svg?seed=Oscar&backgroundColor=d1d4f9',
    'https://api.dicebear.com/9.x/thumbs/svg?seed=Luna&backgroundColor=ffd5dc',
    'https://api.dicebear.com/9.x/thumbs/svg?seed=Max&backgroundColor=b6e3f4',
    'https://api.dicebear.com/9.x/thumbs/svg?seed=Bella&backgroundColor=ffdfbf',
];

export default function ProfileSettings({ isOpen, onClose }) {
    const { user, updateProfile, changePassword } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');

    // Profile state
    const [name, setName] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState('');
    const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
    const [profileLoading, setProfileLoading] = useState(false);

    // Password state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
    const [passwordLoading, setPasswordLoading] = useState(false);

    // Theme state
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('syncspace_theme') === 'dark';
    });

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen && user) {
            setName(user.name || '');
            setSelectedAvatar(user.avatar || '');
            setProfileMsg({ type: '', text: '' });
            setPasswordMsg({ type: '', text: '' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setActiveTab('profile');
        }
    }, [isOpen, user]);

    // Dark mode toggle
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('syncspace_theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('syncspace_theme', 'light');
        }
    }, [darkMode]);

    const handleProfileSave = async () => {
        setProfileMsg({ type: '', text: '' });
        if (!name.trim() || name.trim().length < 2) {
            setProfileMsg({ type: 'error', text: 'Name must be at least 2 characters' });
            return;
        }
        setProfileLoading(true);
        try {
            await updateProfile({ name: name.trim(), avatar: selectedAvatar });
            setProfileMsg({ type: 'success', text: 'Profile updated!' });
        } catch (err) {
            setProfileMsg({ type: 'error', text: err.message });
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        setPasswordMsg({ type: '', text: '' });
        if (newPassword.length < 6) {
            setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters' });
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordMsg({ type: 'error', text: 'Passwords do not match' });
            return;
        }
        setPasswordLoading(true);
        try {
            await changePassword(currentPassword, newPassword);
            setPasswordMsg({ type: 'success', text: 'Password changed!' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setPasswordMsg({ type: 'error', text: err.message });
        } finally {
            setPasswordLoading(false);
        }
    };

    if (!isOpen) return null;

    const tabs = [
        { id: 'profile', label: 'Profile', icon: <User size={16} strokeWidth={2.5} />, color: 'bg-blue-200' },
        { id: 'password', label: 'Password', icon: <Shield size={16} strokeWidth={2.5} />, color: 'bg-green-200' },
        { id: 'appearance', label: 'Theme', icon: <Palette size={16} strokeWidth={2.5} />, color: 'bg-purple-200' },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-[#fdfdfd] dark:bg-gray-900 border-2 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden max-h-[90vh] flex flex-col -rotate-[0.3deg] hover:rotate-0 transition-transform">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b-2 border-black bg-white dark:bg-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-300 border-2 border-black p-2 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rotate-3 hover:rotate-0 transition-transform">
                            <Sparkles size={20} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-xl font-extrabold text-black dark:text-white tracking-tight">Settings</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-red-200 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all"
                    >
                        <X size={18} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 px-6 pt-4 pb-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1.5 px-4 py-2 border-2 border-black rounded-xl font-bold text-sm transition-all ${activeTab === tab.id
                                    ? `${tab.color} shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5`
                                    : 'bg-white dark:bg-gray-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5'
                                } text-black dark:text-white`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">

                    {/* ═══ PROFILE TAB ═══ */}
                    {activeTab === 'profile' && (
                        <>
                            {/* Current user info */}
                            <div className="flex items-center gap-4 p-4 bg-blue-100 dark:bg-blue-900/30 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -rotate-[0.5deg]">
                                <div className="w-14 h-14 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex items-center justify-center">
                                    {selectedAvatar ? (
                                        <img src={selectedAvatar} alt="avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={28} strokeWidth={2} className="text-gray-400" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-extrabold text-black dark:text-white text-lg">{user?.name}</p>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{user?.email}</p>
                                </div>
                            </div>

                            {/* Name input */}
                            <div>
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 block flex items-center gap-1.5">
                                    <PenLine size={14} strokeWidth={2.5} /> Display Name
                                </label>
                                <div className="relative">
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2.5} />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your display name"
                                        className="w-full bg-white dark:bg-gray-800 border-2 border-black rounded-xl pl-11 pr-4 py-3 text-black dark:text-white font-medium placeholder-gray-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Avatar picker */}
                            <div>
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block flex items-center gap-1.5">
                                    <Camera size={14} strokeWidth={2.5} /> Choose Avatar
                                </label>
                                <div className="grid grid-cols-6 gap-2">
                                    {AVATAR_OPTIONS.map((url, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedAvatar(url)}
                                            className={`w-full aspect-square rounded-xl border-2 overflow-hidden transition-all ${selectedAvatar === url
                                                    ? 'border-blue-500 shadow-[3px_3px_0px_0px_rgba(59,130,246,1)] -translate-y-1 scale-105'
                                                    : 'border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5'
                                                }`}
                                        >
                                            <img src={url} alt={`Avatar ${i + 1}`} className="w-full h-full object-cover bg-white" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Profile message */}
                            {profileMsg.text && (
                                <div className={`px-4 py-2.5 border-2 rounded-xl font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] -rotate-[0.5deg] ${profileMsg.type === 'error'
                                        ? 'bg-red-100 border-red-400 text-red-800'
                                        : 'bg-green-100 border-green-400 text-green-800'
                                    }`}>
                                    {profileMsg.type === 'error'
                                        ? <AlertTriangle size={14} className="inline mr-1" />
                                        : <Check size={14} className="inline mr-1" />
                                    }
                                    {profileMsg.text}
                                </div>
                            )}

                            {/* Save button */}
                            <button
                                onClick={handleProfileSave}
                                disabled={profileLoading}
                                className="w-full bg-blue-400 hover:bg-blue-500 text-black font-bold text-base py-3.5 px-6 border-2 border-black rounded-xl flex items-center justify-center gap-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all disabled:opacity-60 disabled:pointer-events-none"
                            >
                                {profileLoading
                                    ? <><Loader2 size={18} className="animate-spin" /> Saving...</>
                                    : <><Check size={18} strokeWidth={2.5} /> Save Changes</>
                                }
                            </button>
                        </>
                    )}

                    {/* ═══ PASSWORD TAB ═══ */}
                    {activeTab === 'password' && (
                        <>
                            <div className="p-4 bg-green-100 dark:bg-green-900/30 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rotate-[0.3deg]">
                                <p className="font-bold text-sm text-black dark:text-white flex items-center gap-2">
                                    <KeyRound size={16} strokeWidth={2.5} /> Change your password
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1">
                                    Leave "Current password" empty if you signed up with Google and haven't set one yet.
                                </p>
                            </div>

                            {/* Current password */}
                            <div>
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 block">Current Password</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2.5} />
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Enter current password"
                                        className="w-full bg-white dark:bg-gray-800 border-2 border-black rounded-xl pl-11 pr-4 py-3 text-black dark:text-white font-medium placeholder-gray-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 transition-all"
                                    />
                                </div>
                            </div>

                            {/* New password */}
                            <div>
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 block">New Password</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2.5} />
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="At least 6 characters"
                                        className="w-full bg-white dark:bg-gray-800 border-2 border-black rounded-xl pl-11 pr-4 py-3 text-black dark:text-white font-medium placeholder-gray-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Confirm new password */}
                            <div>
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 block">Confirm New Password</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2.5} />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        className="w-full bg-white dark:bg-gray-800 border-2 border-black rounded-xl pl-11 pr-4 py-3 text-black dark:text-white font-medium placeholder-gray-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password message */}
                            {passwordMsg.text && (
                                <div className={`px-4 py-2.5 border-2 rounded-xl font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] rotate-[0.3deg] ${passwordMsg.type === 'error'
                                        ? 'bg-red-100 border-red-400 text-red-800'
                                        : 'bg-green-100 border-green-400 text-green-800'
                                    }`}>
                                    {passwordMsg.type === 'error'
                                        ? <AlertTriangle size={14} className="inline mr-1" />
                                        : <Check size={14} className="inline mr-1" />
                                    }
                                    {passwordMsg.text}
                                </div>
                            )}

                            {/* Save button */}
                            <button
                                onClick={handlePasswordChange}
                                disabled={passwordLoading}
                                className="w-full bg-green-300 hover:bg-green-400 text-black font-bold text-base py-3.5 px-6 border-2 border-black rounded-xl flex items-center justify-center gap-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all disabled:opacity-60 disabled:pointer-events-none"
                            >
                                {passwordLoading
                                    ? <><Loader2 size={18} className="animate-spin" /> Updating...</>
                                    : <><Shield size={18} strokeWidth={2.5} /> Update Password</>
                                }
                            </button>
                        </>
                    )}

                    {/* ═══ APPEARANCE TAB ═══ */}
                    {activeTab === 'appearance' && (
                        <>
                            <div className="p-4 bg-purple-100 dark:bg-purple-900/30 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -rotate-[0.3deg]">
                                <p className="font-bold text-sm text-black dark:text-white flex items-center gap-2">
                                    <Palette size={16} strokeWidth={2.5} /> Customize your experience
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1">
                                    Switch between light and dark mode.
                                </p>
                            </div>

                            {/* Theme toggle */}
                            <div className="flex gap-4">
                                {/* Light mode card */}
                                <button
                                    onClick={() => setDarkMode(false)}
                                    className={`flex-1 p-5 border-2 rounded-xl flex flex-col items-center gap-3 transition-all ${!darkMode
                                            ? 'border-yellow-500 bg-yellow-100 shadow-[4px_4px_0px_0px_rgba(234,179,8,1)] -translate-y-1'
                                            : 'border-black bg-white dark:bg-gray-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5'
                                        }`}
                                >
                                    <div className={`p-3 rounded-xl border-2 ${!darkMode ? 'bg-yellow-300 border-yellow-500' : 'bg-gray-100 dark:bg-gray-700 border-black'}`}>
                                        <Sun size={28} strokeWidth={2} className={!darkMode ? 'text-yellow-700' : 'text-gray-500'} />
                                    </div>
                                    <span className="font-extrabold text-black dark:text-white text-sm">Light</span>
                                    {!darkMode && <Check size={18} className="text-yellow-600" strokeWidth={3} />}
                                </button>

                                {/* Dark mode card */}
                                <button
                                    onClick={() => setDarkMode(true)}
                                    className={`flex-1 p-5 border-2 rounded-xl flex flex-col items-center gap-3 transition-all ${darkMode
                                            ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/50 shadow-[4px_4px_0px_0px_rgba(59,130,246,1)] -translate-y-1'
                                            : 'border-black bg-white dark:bg-gray-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5'
                                        }`}
                                >
                                    <div className={`p-3 rounded-xl border-2 ${darkMode ? 'bg-blue-300 dark:bg-blue-800 border-blue-500' : 'bg-gray-100 dark:bg-gray-700 border-black'}`}>
                                        <Moon size={28} strokeWidth={2} className={darkMode ? 'text-blue-700 dark:text-blue-300' : 'text-gray-500'} />
                                    </div>
                                    <span className="font-extrabold text-black dark:text-white text-sm">Dark</span>
                                    {darkMode && <Check size={18} className="text-blue-600" strokeWidth={3} />}
                                </button>
                            </div>

                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium text-center">
                                Your preference is saved automatically.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
