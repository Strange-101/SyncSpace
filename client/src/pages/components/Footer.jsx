import React from 'react';

export default function Footer() {
    return (
        <footer className="border-t-2 border-black border-dashed mt-24 py-12 text-center text-gray-600 font-medium max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <span className="text-xl font-bold text-black rotate-1 inline-block">CollabBoard © 2026</span>
                <div className="flex gap-4">
                    <a href="#" className="hover:underline hover:text-blue-600">Documentation</a>
                    <a href="#" className="hover:underline hover:text-blue-600">GitHub Repo</a>
                    <a href="#" className="hover:underline hover:text-blue-600">Live App URL</a>
                </div>
            </div>
            <div className="mt-6 text-sm">
                Kunal's MERN Stack Project | Designed with React, Tailwind CSS, & Socket.io
            </div>
        </footer>
    );
}