import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Pencil, LogIn, UserPlus, Mail, Lock, User, ChevronRight,
    Zap, MessageSquare, Brush, Monitor, Save, Crown,
    Star, Palette, Rocket, PenLine, Video, AlertTriangle,
    Loader2, PartyPopper, Wrench, KeyRound, Heart
} from 'lucide-react';

const features = [
    { title: "Real-time Sync", description: "Draw simultaneously with multiple users using WebSockets.", icon: <Zap size={28} strokeWidth={2} />, color: "bg-yellow-200" },
    { title: "In-Room Chat", description: "Communicate seamlessly with your team using built-in chat.", icon: <MessageSquare size={28} strokeWidth={2} />, color: "bg-green-200" },
    { title: "Canvas Tools", description: "Pencil, eraser, color picker, brush size, and more.", icon: <Brush size={28} strokeWidth={2} />, color: "bg-pink-200" },
    { title: "Screen Sharing", description: "Share your screen in real-time with WebRTC.", icon: <Monitor size={28} strokeWidth={2} />, color: "bg-purple-200" },
    { title: "Saved Sessions", description: "Your recent boards are saved for quick re-access.", icon: <Save size={28} strokeWidth={2} />, color: "bg-blue-200" },
    { title: "Host Controls", description: "Manage rooms with role-based permissions.", icon: <Crown size={28} strokeWidth={2} />, color: "bg-orange-200" }
];

const rotations = ['rotate-1', '-rotate-1', 'rotate-[0.5deg]', '-rotate-[0.5deg]', 'rotate-0'];

export default function Landing() {
    const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (authMode === 'signup') {
            if (password !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }
            if (password.length < 6) {
                setError('Password must be at least 6 characters');
                return;
            }
        }

        setIsLoading(true);
        try {
            if (authMode === 'login') {
                await login(email, password);
            } else {
                await register(name, email, password);
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const switchMode = () => {
        setAuthMode(authMode === 'login' ? 'signup' : 'login');
        setError('');
        setName('');
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="min-h-screen bg-[#fdfdfd] font-sans selection:bg-yellow-200 overflow-auto">

            {/* ─── Scattered Background Doodles ─── */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-16 left-8 -rotate-12 opacity-[0.06]"><Pencil size={64} strokeWidth={1.5} /></div>
                <div className="absolute top-40 right-12 rotate-12 opacity-[0.06]"><MessageSquare size={52} strokeWidth={1.5} /></div>
                <div className="absolute bottom-32 left-16 rotate-45 opacity-[0.06]"><Zap size={52} strokeWidth={1.5} /></div>
                <div className="absolute bottom-20 right-28 -rotate-6 opacity-[0.06]"><Palette size={64} strokeWidth={1.5} /></div>
                <div className="absolute top-1/2 left-1/4 rotate-12 opacity-[0.04]"><Star size={44} strokeWidth={1.5} /></div>
                <div className="absolute top-28 right-1/3 -rotate-45 opacity-[0.05]"><Rocket size={52} strokeWidth={1.5} /></div>
            </div>

            {/* ─── Sticky Nav Bar ─── */}
            <nav className="sticky top-0 z-50 bg-white border-b-2 border-black shadow-[0_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="bg-yellow-300 border-2 border-black p-2 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -rotate-3 hover:rotate-0 transition-transform">
                            <Pencil size={22} strokeWidth={2.5} color="black" />
                        </div>
                        <span className="text-2xl font-extrabold tracking-tight text-black">SyncSpace</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { setAuthMode('login'); document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                            className="px-5 py-2 font-bold text-black hover:underline decoration-2 underline-offset-4 hidden sm:block"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => { setAuthMode('signup'); document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                            className="px-5 py-2 border-2 border-black rounded-xl bg-purple-300 font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-black"
                        >
                            Sign Up Free
                        </button>
                    </div>
                </div>
            </nav>

            <main className="relative z-10">

                {/* ═══════════════════════════════════ */}
                {/* ─── HERO + AUTH SECTION ─── */}
                {/* ═══════════════════════════════════ */}
                <section className="max-w-7xl mx-auto px-6 pt-16 pb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        {/* Left — Hero Text */}
                        <div className="flex flex-col gap-6">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] text-black tracking-tight">
                                Sketch, Chat & Share in{' '}
                                <span className="relative inline-block">
                                    Real-Time
                                    <svg className="absolute w-full h-4 -bottom-1 left-0 text-blue-500" viewBox="0 0 100 20" preserveAspectRatio="none">
                                        <path d="M0 10 Q 50 20 100 10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    </svg>
                                </span>
                            </h1>
                            <p className="text-xl text-gray-700 font-medium max-w-lg leading-relaxed">
                                Your ultimate collaborative workspace. Draw together, chat instantly, and share your screen — all in one infinite canvas.
                            </p>

                            {/* Quick Feature Pills */}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {[
                                    { icon: <PenLine size={14} strokeWidth={2.5} />, label: 'Whiteboard' },
                                    { icon: <Video size={14} strokeWidth={2.5} />, label: 'Video Call' },
                                    { icon: <MessageSquare size={14} strokeWidth={2.5} />, label: 'Live Chat' },
                                    { icon: <Monitor size={14} strokeWidth={2.5} />, label: 'Screen Share' }
                                ].map((f, i) => (
                                    <span
                                        key={i}
                                        className="bg-white border-2 border-black rounded-lg px-3 py-1.5 text-sm font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                        style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (0.5 + i * 0.3)}deg)` }}
                                    >
                                        <span className="flex items-center gap-1.5">{f.icon} {f.label}</span>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Right — Auth Card */}
                        <div id="auth-section" className="flex justify-center lg:justify-end">
                            <div className={`w-full max-w-md bg-white border-2 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-7 relative flex flex-col items-center ${authMode === 'login' ? '-rotate-1' : 'rotate-1'} hover:rotate-0 transition-transform duration-300`}>
                                {/* Icon Header */}
                                <div className={`${authMode === 'login' ? 'bg-blue-300' : 'bg-green-300'} border-2 border-black p-3.5 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${authMode === 'login' ? 'rotate-6' : '-rotate-6'} mb-5 hover:rotate-0 transition-transform`}>
                                    {authMode === 'login'
                                        ? <LogIn size={28} strokeWidth={2.5} color="black" />
                                        : <UserPlus size={28} strokeWidth={2.5} color="black" />
                                    }
                                </div>

                                <h2 className="text-2xl font-extrabold text-center text-black mb-1 tracking-tight">
                                    {authMode === 'login' ? 'Welcome Back!' : 'Join SyncSpace!'}
                                </h2>
                                <p className="text-gray-600 text-sm text-center mb-5 font-medium">
                                    {authMode === 'login' ? 'Log in to your account' : 'Create a free account to start'}
                                </p>

                                {/* Error */}
                                {error && (
                                    <div className="w-full bg-red-100 border-2 border-red-400 rounded-xl px-4 py-2.5 mb-4 text-red-800 font-bold text-sm shadow-[2px_2px_0px_0px_rgba(220,38,38,0.5)] -rotate-[0.5deg]">
                                        <AlertTriangle size={16} strokeWidth={2.5} className="inline mr-1" /> {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="w-full space-y-4">
                                    {/* Name — signup only */}
                                    {authMode === 'signup' && (
                                        <div className="relative">
                                            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2.5} />
                                            <input
                                                type="text"
                                                placeholder="Full name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full bg-white border-2 border-black rounded-xl pl-11 pr-4 py-3.5 text-black font-medium placeholder-gray-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 transition-all"
                                                required
                                            />
                                        </div>
                                    )}

                                    {/* Email */}
                                    <div className="relative">
                                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2.5} />
                                        <input
                                            type="email"
                                            placeholder="Email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-white border-2 border-black rounded-xl pl-11 pr-4 py-3.5 text-black font-medium placeholder-gray-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 transition-all"
                                            required
                                        />
                                    </div>

                                    {/* Password */}
                                    <div className="relative">
                                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2.5} />
                                        <input
                                            type="password"
                                            placeholder={authMode === 'signup' ? 'Password (min 6 chars)' : 'Password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-white border-2 border-black rounded-xl pl-11 pr-4 py-3.5 text-black font-medium placeholder-gray-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 transition-all"
                                            required
                                        />
                                    </div>

                                    {/* Confirm password — signup only */}
                                    {authMode === 'signup' && (
                                        <div className="relative">
                                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2.5} />
                                            <input
                                                type="password"
                                                placeholder="Confirm password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full bg-white border-2 border-black rounded-xl pl-11 pr-4 py-3.5 text-black font-medium placeholder-gray-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 transition-all"
                                                required
                                            />
                                        </div>
                                    )}

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full ${authMode === 'login' ? 'bg-blue-400 hover:bg-blue-500' : 'bg-green-300 hover:bg-green-400'} text-black font-bold text-lg py-3.5 px-6 border-2 border-black rounded-xl flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all disabled:opacity-60 disabled:pointer-events-none`}
                                    >
                                        {isLoading
                                            ? <><Loader2 size={18} className="animate-spin" /> {authMode === 'login' ? 'Logging in...' : 'Creating account...'}</>
                                            : <>{authMode === 'login' ? <><Rocket size={18} strokeWidth={2.5} /> Log In</> : <><PartyPopper size={18} strokeWidth={2.5} /> Sign Up</>}</>
                                        }
                                    </button>
                                </form>

                                {/* Dashed Divider */}
                                <div className="w-full relative flex items-center py-4 my-1">
                                    <div className="flex-grow border-t-2 border-black border-dashed"></div>
                                    <span className={`flex-shrink-0 mx-3 text-black font-bold px-3 py-1 ${authMode === 'login' ? 'bg-yellow-200' : 'bg-blue-200'} border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${authMode === 'login' ? '-rotate-2' : 'rotate-2'} text-sm`}>
                                        {authMode === 'login' ? 'New here?' : 'Have an account?'}
                                    </span>
                                    <div className="flex-grow border-t-2 border-black border-dashed"></div>
                                </div>

                                {/* Switch Auth Mode */}
                                <button
                                    onClick={switchMode}
                                    className={`w-full ${authMode === 'login' ? 'bg-green-300 hover:bg-green-400' : 'bg-blue-400 hover:bg-blue-500'} text-black font-bold text-base py-3.5 px-6 border-2 border-black rounded-xl flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${authMode === 'login' ? 'rotate-[0.5deg]' : '-rotate-[0.5deg]'}`}
                                >
                                    {authMode === 'login' ? <><PenLine size={16} strokeWidth={2.5} /> Create an Account</> : <><KeyRound size={16} strokeWidth={2.5} /> Log In Instead</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════ */}
                {/* ─── FEATURES SECTION ─── */}
                {/* ═══════════════════════════════════ */}
                <section className="bg-white border-y-2 border-black py-20">
                    <div className="max-w-7xl mx-auto px-6">
                        {/* Section Header */}
                        <div className="text-center mb-14">
                            <span className="inline-block bg-yellow-200 border-2 border-black rounded-xl px-5 py-2 font-extrabold text-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -rotate-1 mb-4">
                                <Wrench size={18} strokeWidth={2.5} className="inline mr-1" /> Features
                            </span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-black tracking-tight">
                                Everything you need,{' '}
                                <span className="relative inline-block">
                                    built in
                                    <svg className="absolute w-full h-3 -bottom-1 left-0 text-green-500" viewBox="0 0 100 20" preserveAspectRatio="none">
                                        <path d="M0 10 Q 50 20 100 10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    </svg>
                                </span>
                            </h2>
                        </div>

                        {/* Feature Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((feat, i) => (
                                <div
                                    key={i}
                                    className={`${feat.color} p-6 border-2 border-black rounded-2xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-3 ${rotations[i % rotations.length]}`}
                                >
                                    <div className="text-4xl">{feat.icon}</div>
                                    <h3 className="text-xl font-extrabold text-black tracking-tight">{feat.title}</h3>
                                    <p className="text-gray-800 font-medium leading-relaxed text-sm">{feat.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════ */}
                {/* ─── CTA SECTION ─── */}
                {/* ═══════════════════════════════════ */}
                <section className="max-w-7xl mx-auto px-6 py-20 text-center">
                    <div className="bg-blue-100 border-2 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-12 rotate-[0.3deg] hover:rotate-0 transition-transform">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-4 tracking-tight">
                            Ready to collaborate? <Rocket size={28} strokeWidth={2} className="inline ml-1" />
                        </h2>
                        <p className="text-lg text-gray-700 font-medium mb-8 max-w-xl mx-auto">
                            Sign up for free and start sketching with your team in seconds.
                        </p>
                        <button
                            onClick={() => { setAuthMode('signup'); document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                            className="px-10 py-4 bg-purple-300 hover:bg-purple-400 border-2 border-black rounded-xl font-bold text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all text-black inline-flex items-center gap-2 -rotate-1"
                        >
                            Get Started Free <ChevronRight size={20} strokeWidth={2.5} />
                        </button>
                    </div>
                </section>

                {/* ═══════════════════════════════════ */}
                {/* ─── FOOTER ─── */}
                {/* ═══════════════════════════════════ */}
                <footer className="border-t-2 border-black border-dashed py-10">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="bg-yellow-300 border-2 border-black p-1.5 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-3">
                                <Pencil size={14} strokeWidth={2.5} />
                            </div>
                            <span className="text-lg font-extrabold text-black rotate-[0.5deg]">SyncSpace © 2026</span>
                        </div>
                        <div className="flex gap-6 text-sm font-bold text-gray-600">
                            <a href="#" className="hover:text-black hover:underline decoration-2 underline-offset-4 transition-colors">Documentation</a>
                            <a href="#" className="hover:text-black hover:underline decoration-2 underline-offset-4 transition-colors">GitHub</a>
                            <a href="#" className="hover:text-black hover:underline decoration-2 underline-offset-4 transition-colors">About</a>
                        </div>
                        <p className="text-xs text-gray-500 font-medium">
                            Built with React, Tailwind, Socket.io & <Heart size={14} strokeWidth={2.5} className="inline text-red-500 fill-red-500" />
                        </p>
                    </div>
                </footer>
            </main>
        </div>
    );
}