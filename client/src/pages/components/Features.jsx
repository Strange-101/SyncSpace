import React from 'react';
import FeatureCard from './FeatureCard';
import { Zap, MessageSquare, Brush, Monitor, Save, Crown } from 'lucide-react';

export default function Features() {
    const features = [
        {
            title: "Real-time Synchronization",
            description: "Draw simultaneously with multiple users using WebSockets (Socket.io).",
            icon: <Zap size={28} strokeWidth={2} />,
            color: "bg-yellow-200"
        },
        {
            title: "In-Room Chat",
            description: "Communicate seamlessly with your team using the built-in chat feature.",
            icon: <MessageSquare size={28} strokeWidth={2} />,
            color: "bg-green-200"
        },
        {
            title: "Canvas Tools",
            description: "Equipped with pencil, eraser, color picker, brush size, and clear board options.",
            icon: <Brush size={28} strokeWidth={2} />,
            color: "bg-pink-200"
        },
        {
            title: "Screen & File Sharing",
            description: "Advanced collaboration with WebRTC screen sharing and file sharing inside the room.",
            icon: <Monitor size={28} strokeWidth={2} />,
            color: "bg-purple-200"
        },
        {
            title: "Persistent Sessions",
            description: "Save snapshots and store whiteboard sessions permanently in MongoDB.",
            icon: <Save size={28} strokeWidth={2} />,
            color: "bg-blue-200"
        },
        {
            title: "Host Controls",
            description: "Manage your rooms effectively with role-based permissions and protected routes.",
            icon: <Crown size={28} strokeWidth={2} />,
            color: "bg-orange-200"
        }
    ];

    return (
        <section className="mt-16 w-full">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold inline-block border-b-4 border-black pb-1">Built for Teams</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <FeatureCard key={index} {...feature} />
                ))}
            </div>
        </section>
    );
}