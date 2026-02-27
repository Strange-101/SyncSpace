import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PenLine, MessageSquare, Rocket } from 'lucide-react';

export default function Hero() {
    const navigate = useNavigate();

    return (
        <section className="flex flex-col items-center text-center mt-12 gap-8 relative">
            <div className="absolute top-10 left-10 -rotate-12 opacity-20"><PenLine size={36} strokeWidth={1.5} /></div>
            <div className="absolute bottom-10 right-10 rotate-12 opacity-20"><MessageSquare size={36} strokeWidth={1.5} /></div>

            <h1 className="text-5xl md:text-7xl font-extrabold max-w-4xl leading-tight text-gray-900">
                Sketch, Chat, and Share in <span className="relative inline-block">
                    Real-Time
                    {/* Sketchy underline */}
                    <svg className="absolute w-full h-4 -bottom-2 left-0 text-blue-500" viewBox="0 0 100 20" preserveAspectRatio="none">
                        <path d="M0 10 Q 50 20 100 10" stroke="currentColor" strokeWidth="4" fill="none" />
                    </svg>
                </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mt-4">
                Your ultimate collaborative workspace. Draw together, chat instantly, and share your screen in a single, infinite canvas.
            </p>

            <div className="flex gap-6 mt-8">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="px-8 py-4 border-2 border-black rounded-2xl bg-blue-400 text-white font-bold text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2 -rotate-2"
                >
                    <Rocket size={20} strokeWidth={2.5} /> Create a Room
                </button>
                <button
                    onClick={() => navigate('/login')}
                    className="px-8 py-4 border-2 border-black rounded-2xl bg-white font-bold text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all rotate-1"
                >
                    Join Session
                </button>
            </div>
        </section>
    );
}