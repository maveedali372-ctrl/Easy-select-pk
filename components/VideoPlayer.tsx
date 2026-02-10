import React, { useState, useEffect, useRef } from 'react';
import { AdminVideo } from '../types';

interface VideoPlayerProps {
    video: AdminVideo;
    onClose: () => void;
    onComplete: () => void;
    onReaction?: (videoId: string, type: 'like' | 'dislike') => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, onClose, onComplete, onReaction }) => {
    const [timeLeft, setTimeLeft] = useState(video.duration * 60); // Convert mins to seconds
    const [isCompleted, setIsCompleted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    
    // Reaction State
    const [likes, setLikes] = useState(video.likes || 0);
    const [dislikes, setDislikes] = useState(video.dislikes || 0);
    const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        let timer: any;
        if (isPlaying || video.sourceType === 'embed') { // Embeds autoplay mostly, uploaded needs checking
             timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setIsCompleted(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [isPlaying, video.sourceType]);

    // Format seconds to MM:SS
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleVideoPlay = () => setIsPlaying(true);
    const handleVideoPause = () => setIsPlaying(false);

    const handleReaction = (type: 'like' | 'dislike') => {
        if (type === 'like') {
            if (userReaction === 'like') return; // Prevent double like in this session
            setLikes(likes + 1);
            if (userReaction === 'dislike') setDislikes(dislikes - 1);
            setUserReaction('like');
        } else {
            if (userReaction === 'dislike') return;
            setDislikes(dislikes + 1);
            if (userReaction === 'like') setLikes(likes - 1);
            setUserReaction('dislike');
        }

        if (onReaction) {
            onReaction(video.id, type);
        }
    };

    return (
        <div className="fixed inset-0 z-[250] bg-black flex flex-col">
            {/* Header */}
            <div className="p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10 pointer-events-none">
                <button 
                    onClick={onClose} 
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto hover:bg-white/30 transition-colors"
                >
                    <i className="fas fa-arrow-left"></i>
                </button>
            </div>

            {/* Video Container */}
            <div className="flex-1 flex items-center justify-center bg-black relative">
                {video.sourceType === 'upload' ? (
                    <video 
                        ref={videoRef}
                        src={video.url}
                        className="w-full max-h-screen"
                        controls
                        autoPlay
                        onPlay={handleVideoPlay}
                        onPause={handleVideoPause}
                        controlsList="nodownload"
                    >
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <iframe 
                        src={`${video.url}${video.url.includes('?') ? '&' : '?'}autoplay=1`} 
                        title={video.title}
                        className="w-full aspect-video max-h-screen"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                )}
            </div>

            {/* Footer Control */}
            <div className="p-6 bg-slate-900 pb-10 rounded-t-3xl border-t border-slate-800">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 mr-4">
                        <h3 className="text-white font-bold text-lg leading-tight">{video.title}</h3>
                        <p className="text-slate-400 text-xs mt-1">
                            Watch for <span className="text-white font-bold">{video.duration} minutes</span> to record history.
                        </p>
                    </div>
                </div>

                {/* Like / Dislike Bar */}
                <div className="flex items-center gap-3 mb-6">
                    <button 
                        onClick={() => handleReaction('like')}
                        className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 ${userReaction === 'like' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                    >
                        <i className={`fas fa-thumbs-up ${userReaction === 'like' ? 'animate-bounce-slow' : ''}`}></i>
                        <span className="font-bold text-sm">{likes}</span>
                    </button>
                    
                    <button 
                        onClick={() => handleReaction('dislike')}
                        className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 ${userReaction === 'dislike' ? 'bg-red-600 text-white shadow-lg shadow-red-900/50' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                    >
                        <i className={`fas fa-thumbs-down ${userReaction === 'dislike' ? 'animate-bounce-slow' : ''}`}></i>
                        <span className="font-bold text-sm">{dislikes}</span>
                    </button>
                    
                    <button className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                        <i className="fas fa-share-alt"></i>
                    </button>
                </div>

                {isCompleted ? (
                    <button 
                        onClick={onComplete}
                        className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl shadow-lg shadow-green-900/50 animate-bounce-slow flex items-center justify-center gap-2"
                    >
                        <i className="fas fa-check-circle"></i> Mark as Watched
                    </button>
                ) : (
                    <button 
                        disabled
                        className="w-full py-4 bg-slate-800 text-slate-500 font-bold rounded-2xl flex items-center justify-center gap-3 cursor-not-allowed border border-slate-700"
                    >
                        <i className="fas fa-clock fa-spin"></i> 
                        Tracking History ({formatTime(timeLeft)})
                    </button>
                )}
            </div>
        </div>
    );
};

export default VideoPlayer;