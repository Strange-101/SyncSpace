import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { LogIn, Mail, Lock, KeyRound, Palette, Sparkles, AlertTriangle, Loader2, Rocket, PenLine } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                setError('');
                setIsLoading(true);
                await googleLogin(tokenResponse.access_token);
                navigate('/dashboard');
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => setError('Google sign-in failed'),
    });

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
        <div className="min-h-screen bg-[#fdfdfd] dark:bg-[#0a0a0f] relative flex flex-col items-center justify-center p-6 font-sans selection:bg-yellow-200 dark:selection:bg-yellow-800 overflow-hidden transition-colors">
            {/* Sketchy background decorative elements */}
            <div className="absolute top-20 left-10 md:left-32 -rotate-12 opacity-20 dark:opacity-[0.15] hidden sm:block dark:text-white"><KeyRound size={52} strokeWidth={1.5} /></div>
            <div className="absolute bottom-20 right-10 md:right-32 rotate-12 opacity-20 dark:opacity-[0.15] hidden sm:block dark:text-white"><Palette size={52} strokeWidth={1.5} /></div>
            <div className="absolute top-32 right-20 rotate-45 opacity-20 dark:opacity-[0.15] hidden md:block dark:text-white"><Sparkles size={52} strokeWidth={1.5} /></div>

            {/* Main Card */}
            <div className="w-full max-w-md bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(55,65,81,1)] p-8 relative z-10 flex flex-col items-center -rotate-1 hover:rotate-0 transition-transform duration-300">

                {/* Icon Header */}
                <div className="bg-blue-300 dark:bg-blue-700 border-2 border-black dark:border-gray-600 p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-6 mb-6 hover:rotate-0 transition-transform">
                    <LogIn size={36} strokeWidth={2.5} className="text-black dark:text-white" />
                </div>

                <h1 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-1 tracking-tight">
                    Welcome Back!
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-base text-center mb-6 font-medium">
                    Log in to your CollabBoard account
                </p>

                {/* Error Message */}
                {error && (
                    <div className="w-full bg-red-100 dark:bg-red-900/50 border-2 border-red-400 dark:border-red-600 rounded-xl px-4 py-3 mb-4 text-red-800 dark:text-red-200 font-bold text-sm shadow-[2px_2px_0px_0px_rgba(220,38,38,0.5)] -rotate-1">
                        <AlertTriangle size={16} strokeWidth={2.5} className="inline mr-1" /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="w-full space-y-5">
                    {/* Email */}
                    <div className="relative">
                        <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" strokeWidth={2.5} />
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-600 rounded-xl pl-12 pr-4 py-4 text-gray-900 dark:text-white font-medium text-lg placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 transition-all"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" strokeWidth={2.5} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-600 rounded-xl pl-12 pr-4 py-4 text-gray-900 dark:text-white font-medium text-lg placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 transition-all"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-400 dark:bg-blue-600 hover:bg-blue-500 dark:hover:bg-blue-700 text-black dark:text-white font-bold text-lg py-4 px-6 border-2 border-black dark:border-gray-600 rounded-xl flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(55,65,81,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all disabled:opacity-60 disabled:pointer-events-none"
                    >
                        {isLoading ? <><Loader2 size={18} className="animate-spin" /> Logging in...</> : <><Rocket size={18} strokeWidth={2.5} /> Log In</>}
                    </button>
                </form>

                {/* Google Divider */}
                <div className="w-full relative flex items-center py-4 my-1">
                    <div className="flex-grow border-t-2 border-black dark:border-gray-600 border-dashed"></div>
                    <span className="flex-shrink-0 mx-4 text-black dark:text-white font-bold px-4 py-1 bg-orange-200 dark:bg-orange-800/60 border-2 border-black dark:border-gray-600 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-1 text-sm">or</span>
                    <div className="flex-grow border-t-2 border-black dark:border-gray-600 border-dashed"></div>
                </div>

                {/* Google Sign-In Button */}
                <button
                    type="button"
                    onClick={() => handleGoogleLogin()}
                    disabled={isLoading}
                    className="w-full bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-black dark:text-white font-bold text-lg py-4 px-6 border-2 border-black dark:border-gray-600 rounded-xl flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(55,65,81,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all disabled:opacity-60 disabled:pointer-events-none -rotate-[0.5deg]"
                >
                    <svg width="22" height="22" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" /><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" /><path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.01 24.01 0 0 0 0 21.56l7.98-6.19z" /><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" /></svg>
                    Sign in with Google
                </button>

                {/* Sketchy Divider */}
                <div className="w-full relative flex items-center py-4 my-1">
                    <div className="flex-grow border-t-2 border-black dark:border-gray-600 border-dashed"></div>
                    <span className="flex-shrink-0 mx-4 text-black dark:text-white font-bold px-4 py-1 bg-yellow-200 dark:bg-yellow-800/60 border-2 border-black dark:border-gray-600 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-2 text-sm">
                        New here?
                    </span>
                    <div className="flex-grow border-t-2 border-black dark:border-gray-600 border-dashed"></div>
                </div>

                {/* Sign Up Link */}
                <Link
                    to="/signup"
                    className="w-full bg-green-300 dark:bg-green-700 hover:bg-green-400 dark:hover:bg-green-800 text-black dark:text-white font-bold text-lg py-4 px-6 border-2 border-black dark:border-gray-600 rounded-xl flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(55,65,81,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all rotate-1 text-center no-underline"
                >
                    <PenLine size={18} strokeWidth={2.5} className="inline" /> Create an Account
                </Link>
            </div>

            {/* Footer */}
            <div className="mt-10 text-center">
                <Link to="/" className="text-gray-600 dark:text-gray-400 font-bold hover:text-black dark:hover:text-white text-sm hover:underline decoration-2 underline-offset-4 transition-colors">
                    ← Back to Home
                </Link>
            </div>
        </div>
    );
}
