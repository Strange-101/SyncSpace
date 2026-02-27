import { useNavigate } from 'react-router-dom';
import { Palette } from 'lucide-react';

export default function Navbar() {
    const navigate = useNavigate();
    return (
        <nav className="flex items-center justify-between p-6 max-w-6xl mx-auto">
            <div className="flex items-center gap-2">
                {/* Sketchy Logo */}
                <div className="w-10 h-10 border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-yellow-300 flex items-center justify-center -rotate-3 hover:rotate-0 transition-transform">
                    <Palette size={22} strokeWidth={2} />
                </div>
                <span className="text-2xl font-bold tracking-tight">CollabBoard</span>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={() => navigate('/login')}
                    className="px-5 py-2 font-medium hover:underline decoration-2 underline-offset-4">
                    Login
                </button>
                <button
                    onClick={() => navigate('/signup')}
                    className="px-5 py-2 border-2 border-black rounded-xl bg-purple-300 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                    Sign Up
                </button>
            </div>
        </nav>
    );
}