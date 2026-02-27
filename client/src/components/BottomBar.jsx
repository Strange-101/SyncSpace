import React from 'react';
import { Mic, MicOff, Video, VideoOff, MonitorUp, MessageSquare, Users, LogOut, LayoutGrid, PenTool } from 'lucide-react';

export const BottomBar = ({
    isVideoOn,
    isAudioOn,
    toggleVideo,
    toggleAudio,
    viewMode,
    setViewMode,
    toggleScreenShare,
    isScreenSharing,
    onToggleSidebar,
    activeSidebarTab,
    isSidebarOpen,
    onLeave
}) => {

    const btnBase = "p-3 rounded-xl border-2 border-black transition-all duration-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]";
    const btnOff = "bg-white text-black hover:bg-gray-50";
    const btnDanger = "bg-red-300 text-black";
    const btnActive = (color) => `bg-${color}-300 text-black`;

    return (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white border-2 border-black px-5 py-3 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-5 z-50 pointer-events-auto transition-all duration-300 -rotate-[0.3deg]">

            {/* A/V Controls */}
            <div className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1 group">
                    <button
                        onClick={toggleAudio}
                        className={`${btnBase} ${isAudioOn ? btnOff : btnDanger}`}
                    >
                        {isAudioOn ? <Mic size={20} strokeWidth={2.5} /> : <MicOff size={20} strokeWidth={2.5} />}
                    </button>
                    <span className="text-[10px] font-bold text-black">{isAudioOn ? 'Mute' : 'Unmute'}</span>
                </div>

                <div className="flex flex-col items-center gap-1 group">
                    <button
                        onClick={toggleVideo}
                        className={`${btnBase} ${isVideoOn ? btnOff : btnDanger}`}
                    >
                        {isVideoOn ? <Video size={20} strokeWidth={2.5} /> : <VideoOff size={20} strokeWidth={2.5} />}
                    </button>
                    <span className="text-[10px] font-bold text-black">{isVideoOn ? 'Stop Video' : 'Start Video'}</span>
                </div>
            </div>

            {/* Dashed Separator */}
            <div className="w-px h-12 border-l-2 border-black border-dashed"></div>

            {/* View & Collaboration Controls */}
            <div className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1 group">
                    <button
                        onClick={() => setViewMode(viewMode === 'whiteboard' ? 'gallery' : 'whiteboard')}
                        className={`${btnBase} ${viewMode === 'gallery' ? 'bg-blue-300 text-black' : btnOff}`}
                    >
                        {viewMode === 'whiteboard' ? <LayoutGrid size={20} strokeWidth={2.5} /> : <PenTool size={20} strokeWidth={2.5} />}
                    </button>
                    <span className="text-[10px] font-bold text-black">
                        {viewMode === 'whiteboard' ? 'Gallery' : 'Board'}
                    </span>
                </div>

                <div className="flex flex-col items-center gap-1 group">
                    <button
                        onClick={toggleScreenShare}
                        className={`${btnBase} ${isScreenSharing ? 'bg-green-300 text-black' : btnOff}`}
                    >
                        <MonitorUp size={20} strokeWidth={2.5} />
                    </button>
                    <span className="text-[10px] font-bold text-black">
                        {isScreenSharing ? 'Stop' : 'Share'}
                    </span>
                </div>

                <div className="flex flex-col items-center gap-1 group">
                    <button
                        onClick={() => onToggleSidebar('participants')}
                        className={`${btnBase} ${isSidebarOpen && activeSidebarTab === 'participants' ? 'bg-yellow-200 text-black' : btnOff}`}
                    >
                        <Users size={20} strokeWidth={2.5} />
                    </button>
                    <span className="text-[10px] font-bold text-black">People</span>
                </div>

                <div className="flex flex-col items-center gap-1 group">
                    <button
                        onClick={() => onToggleSidebar('chat')}
                        className={`${btnBase} ${isSidebarOpen && activeSidebarTab === 'chat' ? 'bg-yellow-200 text-black' : btnOff}`}
                    >
                        <MessageSquare size={20} strokeWidth={2.5} />
                    </button>
                    <span className="text-[10px] font-bold text-black">Chat</span>
                </div>
            </div>

            {/* Dashed Separator */}
            <div className="w-px h-12 border-l-2 border-black border-dashed"></div>

            {/* End Call */}
            <div className="flex flex-col items-center gap-1 group">
                <button
                    onClick={onLeave}
                    className="p-3 rounded-xl bg-red-400 hover:bg-red-500 text-black border-2 border-black transition-all duration-200 flex items-center gap-2 px-5 font-extrabold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
                >
                    <LogOut size={18} strokeWidth={2.5} />
                    Leave
                </button>
                <span className="text-[10px] font-bold text-transparent">Leave</span>
            </div>

        </div>
    );
};
