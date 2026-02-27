import React from 'react';

export default function FeatureCard({ title, description, icon, color }) {
    // Randomize rotation slightly for a hand-drawn feel
    const rotations = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2', 'rotate-0'];
    const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];

    return (
        <div className={`p-6 border-2 border-black rounded-2xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4 ${color} ${randomRotation}`}>
            <div className="text-4xl">{icon}</div>
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h3>
            <p className="text-gray-800 font-medium leading-relaxed">{description}</p>
        </div>
    );
}