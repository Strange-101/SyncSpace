import { useState, useEffect, useRef } from 'react';
import Peer from 'simple-peer';
import { io } from 'socket.io-client';

export const useWebRTC = (roomId, userName, initialVideo = true, initialAudio = true) => {
    const [peers, setPeers] = useState([]);
    const [stream, setStream] = useState(null);
    const userVideo = useRef();
    const peersRef = useRef([]);
    const socketRef = useRef(null);
    const [peerNames, setPeerNames] = useState({});
    const [joinRequests, setJoinRequests] = useState([]);

    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isAudioOn, setIsAudioOn] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [peerMediaStates, setPeerMediaStates] = useState({});
    const currentVideoTrackRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
        if (!roomId) return;

        let isMounted = true;

        // Create a fresh socket per mount — essential for React 18 StrictMode
        const socket = io('http://localhost:5001', { forceNew: true });
        socketRef.current = socket;

        // Reset state
        peersRef.current = [];
        setPeers([]);
        setPeerMediaStates({});
        setPeerNames({});

        // Promise that resolves when local stream is ready
        let resolveStream;
        const streamReady = new Promise((res) => { resolveStream = res; });

        // ─────────────────────────────────────────────
        // Helper: create initiator Peer → target user
        // ─────────────────────────────────────────────
        function createInitiatorPeer(targetID, localStream) {
            const peer = new Peer({ initiator: true, trickle: false, stream: localStream });

            peer.on('signal', (signal) => {
                console.log(`[WebRTC] Sending offer to ${targetID}`);
                socket.emit('offer', { target: targetID, caller: socket.id, signal });
            });
            peer.on('stream', (remoteStream) => {
                console.log(`[WebRTC] Got stream from ${targetID}`);
            });
            peer.on('error', (err) => console.warn('[WebRTC] Initiator peer error:', err.message));
            peer.on('connect', () => console.log(`[WebRTC] Connected to ${targetID}`));

            return peer;
        }

        // ─────────────────────────────────────────────
        // Helper: create responder Peer for incoming offer
        // ─────────────────────────────────────────────
        function createResponderPeer(incomingSignal, callerID, localStream) {
            const peer = new Peer({ initiator: false, trickle: false, stream: localStream });

            peer.on('signal', (signal) => {
                console.log(`[WebRTC] Sending answer to ${callerID}`);
                socket.emit('answer', { caller: callerID, signal });
            });
            peer.on('stream', (remoteStream) => {
                console.log(`[WebRTC] Got stream from ${callerID}`);
            });
            peer.on('error', (err) => console.warn('[WebRTC] Responder peer error:', err.message));
            peer.on('connect', () => console.log(`[WebRTC] Connected to ${callerID}`));

            // Signal the incoming offer to start the handshake
            peer.signal(incomingSignal);

            return peer;
        }

        // ─────────────────────────────────────────────
        // Sync peersRef → React state
        // ─────────────────────────────────────────────
        function syncPeersState() {
            if (isMounted) {
                setPeers([...peersRef.current]);
            }
        }

        // ─────────────────────────────────────────────
        // Socket event handlers (registered BEFORE getUserMedia)
        // ─────────────────────────────────────────────

        // Received by the NEW joiner: list of existing users in the room
        socket.on('all_users', async (users) => {
            const localStream = await streamReady;
            if (!isMounted) return;

            console.log(`[WebRTC] all_users received:`, users.map(u => u.name || u.id || u));

            // Track names
            const nameMap = {};
            users.forEach(u => { if (u.name) nameMap[u.id] = u.name; });
            setPeerNames(prev => ({ ...prev, ...nameMap }));

            // Create initiator peers for each existing user
            users.forEach((userObj) => {
                const userID = userObj.id || userObj;
                if (peersRef.current.find(p => p.peerID === userID)) return;

                const peer = createInitiatorPeer(userID, localStream);
                peersRef.current.push({ peerID: userID, peer });
            });

            syncPeersState();
            socket.emit('request_media_states', { roomId });
        });

        // Received by EXISTING users when a new user sends them an offer
        socket.on('offer', async (payload) => {
            const localStream = await streamReady;
            if (!isMounted) return;

            console.log(`[WebRTC] Offer received from ${payload.caller}`);

            if (peersRef.current.find(p => p.peerID === payload.caller)) {
                console.log(`[WebRTC] Already have peer for ${payload.caller}, skipping`);
                return;
            }

            const peer = createResponderPeer(payload.signal, payload.caller, localStream);
            peersRef.current.push({ peerID: payload.caller, peer });
            syncPeersState();

            // Broadcast our media state to the new peer
            const vTrack = streamRef.current?.getVideoTracks()[0];
            const aTrack = streamRef.current?.getAudioTracks()[0];
            socket.emit('media_state_change', {
                roomId,
                video: vTrack ? vTrack.enabled : false,
                audio: aTrack ? aTrack.enabled : false
            });
        });

        // Received by the initiator when the responder sends back an answer
        socket.on('answer', (payload) => {
            console.log(`[WebRTC] Answer received from ${payload.id}`);
            const item = peersRef.current.find((p) => p.peerID === payload.id);
            if (item) {
                item.peer.signal(payload.signal);
            } else {
                console.warn(`[WebRTC] No peer found for answer from ${payload.id}`);
            }
        });

        // Track new user names
        socket.on('user_joined', (data) => {
            if (data && data.id && data.name) {
                console.log(`[WebRTC] user_joined: ${data.name} (${data.id})`);
                setPeerNames(prev => ({ ...prev, [data.id]: data.name }));
            }
        });

        // Clean up disconnected users
        socket.on('user_disconnected', (id) => {
            console.log(`[WebRTC] user_disconnected: ${id}`);
            const peerObj = peersRef.current.find((p) => p.peerID === id);
            if (peerObj) peerObj.peer.destroy();
            peersRef.current = peersRef.current.filter((p) => p.peerID !== id);
            syncPeersState();
            setPeerMediaStates((prev) => { const n = { ...prev }; delete n[id]; return n; });
            setPeerNames((prev) => { const n = { ...prev }; delete n[id]; return n; });
        });

        socket.on('media_state_update', ({ userId, video, audio }) => {
            setPeerMediaStates((prev) => ({ ...prev, [userId]: { video, audio } }));
        });

        socket.on('request_media_states', () => {
            const vTrack = streamRef.current?.getVideoTracks()[0];
            const aTrack = streamRef.current?.getAudioTracks()[0];
            socket.emit('media_state_change', {
                roomId,
                video: vTrack ? vTrack.enabled : false,
                audio: aTrack ? aTrack.enabled : false
            });
        });

        socket.on('connect', () => {
            console.log(`[WebRTC] Socket connected: ${socket.id}`);
        });

        // Host: receive join requests from lobby guests
        socket.on('join_request', ({ socketId, userName: reqName }) => {
            console.log(`[WebRTC] Join request from ${reqName} (${socketId})`);
            setJoinRequests(prev => {
                if (prev.find(r => r.socketId === socketId)) return prev;
                return [...prev, { socketId, userName: reqName }];
            });
        });

        // ─────────────────────────────────────────────
        // Get user media, then join the room
        // ─────────────────────────────────────────────
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((localStream) => {
            if (!isMounted) {
                localStream.getTracks().forEach(t => t.stop());
                return;
            }

            console.log('[WebRTC] Got local media stream');
            streamRef.current = localStream;
            setStream(localStream);
            if (userVideo.current) {
                userVideo.current.srcObject = localStream;
            }

            const videoTrack = localStream.getVideoTracks()[0];
            const audioTrack = localStream.getAudioTracks()[0];

            // Apply lobby media preferences
            if (videoTrack) {
                videoTrack.enabled = initialVideo;
                setIsVideoOn(initialVideo);
                currentVideoTrackRef.current = videoTrack;
            }
            if (audioTrack) {
                audioTrack.enabled = initialAudio;
                setIsAudioOn(initialAudio);
            }

            // Resolve the stream promise so any queued socket handlers proceed
            resolveStream(localStream);

            // Join the room
            console.log(`[WebRTC] Joining room ${roomId} as ${userName}`);
            socket.emit('join_room', { roomId, userName: userName || null });
            socket.emit('media_state_change', {
                roomId,
                video: initialVideo,
                audio: initialAudio
            });
        }).catch(err => {
            console.error("[WebRTC] Failed to get media devices:", err);
        });

        // ─────────────────────────────────────────────
        // Cleanup
        // ─────────────────────────────────────────────
        return () => {
            console.log('[WebRTC] Cleaning up...');
            isMounted = false;

            socket.removeAllListeners();

            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            if (currentVideoTrackRef.current) {
                currentVideoTrackRef.current.stop();
            }
            peersRef.current.forEach(p => {
                if (p.peer) p.peer.destroy();
            });
            peersRef.current = [];
            setPeers([]);

            socket.disconnect();
            socketRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId]);

    const toggleVideo = () => {
        if (streamRef.current) {
            const videoTrack = streamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoOn(videoTrack.enabled);
                socketRef.current?.emit('media_state_change', { roomId, video: videoTrack.enabled, audio: isAudioOn });
                return videoTrack.enabled;
            }
        }
        return false;
    };

    const toggleAudio = () => {
        if (streamRef.current) {
            const audioTrack = streamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsAudioOn(audioTrack.enabled);
                socketRef.current?.emit('media_state_change', { roomId, video: isVideoOn, audio: audioTrack.enabled });
                return audioTrack.enabled;
            }
        }
        return false;
    };

    const stopScreenShare = () => {
        const s = streamRef.current;
        const cameraTrack = s?.getVideoTracks()[0];
        if (!cameraTrack || !currentVideoTrackRef.current) return;

        peersRef.current.forEach(({ peer }) => {
            peer.replaceTrack(currentVideoTrackRef.current, cameraTrack, s);
        });

        currentVideoTrackRef.current.stop();
        currentVideoTrackRef.current = cameraTrack;

        if (userVideo.current) {
            userVideo.current.srcObject = s;
        }
        setIsScreenSharing(false);
    };

    const toggleScreenShare = async () => {
        if (!isScreenSharing) {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ cursor: true });
                const screenTrack = screenStream.getVideoTracks()[0];

                peersRef.current.forEach(({ peer }) => {
                    peer.replaceTrack(currentVideoTrackRef.current, screenTrack, streamRef.current);
                });

                currentVideoTrackRef.current = screenTrack;
                if (userVideo.current) {
                    userVideo.current.srcObject = screenStream;
                }
                setIsScreenSharing(true);

                screenTrack.onended = () => {
                    stopScreenShare();
                };
            } catch (error) {
                console.error("Error sharing screen", error);
            }
        } else {
            stopScreenShare();
        }
    };

    const admitUser = (targetSocketId) => {
        socketRef.current?.emit('admit_user', { roomId, targetSocketId });
        setJoinRequests(prev => prev.filter(r => r.socketId !== targetSocketId));
    };

    const denyUser = (targetSocketId) => {
        socketRef.current?.emit('deny_user', { roomId, targetSocketId });
        setJoinRequests(prev => prev.filter(r => r.socketId !== targetSocketId));
    };

    return {
        peers,
        userVideo,
        stream,
        socket: socketRef.current,
        toggleVideo,
        toggleAudio,
        toggleScreenShare,
        isVideoOn,
        isAudioOn,
        isScreenSharing,
        peerMediaStates,
        peerNames,
        joinRequests,
        admitUser,
        denyUser
    };
};
