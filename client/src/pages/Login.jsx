import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, KeyRound, Palette, Sparkles, AlertTriangle, Loader2, Rocket, PenLine } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fdfdfd] relative flex flex-col items-center justify-center p-6 font-sans selection:bg-yellow-200 overflow-hidden">
            {/* Sketchy background decorative elements */}
            <div className="absolute top-20 left-10 md:left-32 -rotate-12 opacity-20 hidden sm:block"><KeyRound size={52} strokeWidth={1.5} /></div>
            <div className="absolute bottom-20 right-10 md:right-32 rotate-12 opacity-20 hidden sm:block"><Palette size={52} strokeWidth={1.5} /></div>
            <div className="absolute top-32 right-20 rotate-45 opacity-20 hidden md:block"><Sparkles size={52} strokeWidth={1.5} /></div>

            {/* Main Card */}
            <div className="w-full max-w-md bg-white border-2 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 relative z-10 flex flex-col items-center -rotate-1 hover:rotate-0 transition-transform duration-300">

                {/* Icon Header */}
                <div className="bg-blue-300 border-2 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-6 mb-6 hover:rotate-0 transition-transform">
                    <LogIn size={36} strokeWidth={2.5} color="black" />
                </div>

                <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-1 tracking-tight">
                    Welcome Back!
                </h1>
                <p className="text-gray-600 text-base text-center mb-6 font-medium">
                    Log in to your CollabBoard account
                </p>

                {/* Error Message */}
                {error && (
                    <div className="w-full bg-red-100 border-2 border-red-400 rounded-xl px-4 py-3 mb-4 text-red-800 font-bold text-sm shadow-[2px_2px_0px_0px_rgba(220,38,38,0.5)] -rotate-1">
                        <AlertTriangle size={16} strokeWidth={2.5} className="inline mr-1" /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="w-full space-y-5">
                    {/* Email */}
                    <div className="relative">
                        <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" strokeWidth={2.5} />
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white border-2 border-black rounded-xl pl-12 pr-4 py-4 text-gray-900 font-medium text-lg placeholder-gray-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 transition-all"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" strokeWidth={2.5} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white border-2 border-black rounded-xl pl-12 pr-4 py-4 text-gray-900 font-medium text-lg placeholder-gray-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 transition-all"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-400 hover:bg-blue-500 text-black font-bold text-lg py-4 px-6 border-2 border-black rounded-xl flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all disabled:opacity-60 disabled:pointer-events-none"
                    >
                        {isLoading ? <><Loader2 size={18} className="animate-spin" /> Logging in...</> : <><Rocket size={18} strokeWidth={2.5} /> Log In</>}
                    </button>
                </form>

                {/* Sketchy Divider */}
                <div className="w-full relative flex items-center py-5 my-2">
                    <div className="flex-grow border-t-2 border-black border-dashed"></div>
                    <span className="flex-shrink-0 mx-4 text-black font-bold px-4 py-1 bg-yellow-200 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-2 text-sm">
                        New here?
                    </span>
                    <div className="flex-grow border-t-2 border-black border-dashed"></div>
                </div>

                {/* Sign Up Link */}
                <Link
                    to="/signup"
                    className="w-full bg-green-300 hover:bg-green-400 text-black font-bold text-lg py-4 px-6 border-2 border-black rounded-xl flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all rotate-1 text-center no-underline"
                >
                    <PenLine size={18} strokeWidth={2.5} className="inline" /> Create an Account
                </Link>
            </div>

            {/* Footer */}
            <div className="mt-10 text-center">
                <Link to="/" className="text-gray-600 font-bold hover:text-black text-sm hover:underline decoration-2 underline-offset-4 transition-colors">
                    ← Back to Home
                </Link>
            </div>
        </div>
    );
}
