import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, User } from 'lucide-react';

const VideoRemote = ({ peer }) => {
    const ref = useRef();

    useEffect(() => {
        const handleStream = (stream) => {
            if (ref.current) {
                ref.current.srcObject = stream;
            }
        };

        peer.on('stream', handleStream);

        // Fallback for already existing streams
        if (peer.stream && ref.current && !ref.current.srcObject) {
            ref.current.srcObject = peer.stream;
        } else if (peer._remoteStreams && peer._remoteStreams[0] && ref.current && !ref.current.srcObject) {
            ref.current.srcObject = peer._remoteStreams[0];
        }

        return () => {
            peer.removeListener('stream', handleStream);
        };
    }, [peer]);

    return (
        <video
            playsInline
            autoPlay
            ref={ref}
            className="w-full h-full object-cover"
        />
    );
};

export const VideoGrid = ({ userVideo, peers, viewMode, peerNames = {}, userName = 'You' }) => {
    const totalUsers = peers.length + 1;
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Dynamic grid layout for gallery mode based on user count
    const getGridClasses = () => {
        if (totalUsers === 1) return 'grid-cols-1 max-w-4xl mx-auto h-[80vh]';
        if (totalUsers === 2) return 'grid-cols-1 md:grid-cols-2 max-w-6xl mx-auto h-[70vh] items-center';
        if (totalUsers <= 4) return 'grid-cols-2 max-w-5xl mx-auto h-[80vh]';
        if (totalUsers <= 6) return 'grid-cols-3 max-w-6xl mx-auto h-[80vh]';
        return 'grid-cols-4 max-w-7xl mx-auto h-[80vh]';
    };

    const isGallery = viewMode === 'gallery';

    const containerClasses = isGallery
        ? `w-full grid gap-5 pointer-events-auto ${getGridClasses()}`
        : 'absolute top-20 right-4 flex flex-col gap-4 w-64 pointer-events-none z-50';

    const videoBoxClasses = isGallery
        ? 'relative w-full h-full rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-gray-900 pointer-events-auto'
        : 'relative aspect-video w-full rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-gray-900 pointer-events-auto shrink-0 transition-all duration-300';

    // In gallery mode, we ignore the collapsed state
    const shouldCollapse = !isGallery && isCollapsed;

    return (
        <div className={containerClasses}>
            {/* Collapse Toggle for Whiteboard Mode */}
            {!isGallery && (
                <div className="flex justify-end pointer-events-auto mb-[-8px]">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="bg-white border-2 border-black text-black p-1.5 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1 transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] z-10"
                        title={isCollapsed ? "Expand Videos" : "Collapse Videos"}
                    >
                        {isCollapsed ? <ChevronDown size={16} strokeWidth={2.5} /> : <ChevronUp size={16} strokeWidth={2.5} />}
                        <span className="text-xs font-bold pr-1">Videos ({totalUsers})</span>
                    </button>
                </div>
            )}

            {/* Video List */}
            <div className={`flex flex-col gap-4 transition-all duration-300 origin-top overflow-hidden ${shouldCollapse ? 'max-h-0 opacity-0 scale-y-0' : 'max-h-[80vh] opacity-100 scale-y-100'}`}>
                {/* Local Video */}
                <div className={videoBoxClasses}>
                    <video
                        playsInline
                        muted
                        ref={userVideo}
                        autoPlay
                        className="w-full h-full object-cover"
                    />
                    <div className={`absolute bottom-2 left-2 bg-yellow-300 px-3 py-1 rounded-lg text-black font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${isGallery ? 'text-sm' : 'text-xs'}`}>
                        <Sparkles size={14} strokeWidth={2.5} className="inline" /> {userName}
                    </div>
                </div>

                {/* Remote Videos */}
                {peers.map((peerObj) => (
                    <div key={peerObj.peerID} className={videoBoxClasses}>
                        <VideoRemote peer={peerObj.peer} />
                        <div className={`absolute bottom-2 left-2 bg-blue-300 px-3 py-1 rounded-lg text-black font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] truncate max-w-[90%] ${isGallery ? 'text-sm' : 'text-xs'}`}>
                            <User size={14} strokeWidth={2.5} className="inline" /> {peerNames[peerObj.peerID] || `User ${peerObj.peerID.slice(0, 4)} `}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
