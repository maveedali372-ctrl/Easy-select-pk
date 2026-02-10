import React, { useState } from 'react';
import { AdminVideo } from '../types';
import VideoPlayer from './VideoPlayer';

interface NewsModalProps {
    videos: AdminVideo[];
    onClose: () => void;
    onVideoWatched: (video: AdminVideo) => void;
    onVideoReaction?: (videoId: string, type: 'like' | 'dislike') => void;
}

const NewsModal: React.FC<NewsModalProps> = ({ videos, onClose, onVideoWatched, onVideoReaction }) => {
    const [selectedVideo, setSelectedVideo] = useState<AdminVideo | null>(null);

    const handleVideoComplete = () => {
        if (selectedVideo) {
            onVideoWatched(selectedVideo);
            setSelectedVideo(null); // Return to list or close?
            // Optional: Close modal completely or just go back
        }
    };

    if (selectedVideo) {
        return (
            <VideoPlayer 
                video={selectedVideo} 
                onClose={() => setSelectedVideo(null)} 
                onComplete={handleVideoComplete} 
                onReaction={onVideoReaction}
            />
        );
    }

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
            
            <div className="bg-white w-full max-w-sm h-[80vh] rounded-3xl relative z-10 shadow-2xl overflow-hidden flex flex-col animate-fade-in-up">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-500 p-5 text-white">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <i className="fas fa-bullhorn"></i> Announcements
                        </h2>
                        <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <p className="text-xs text-red-100 opacity-90">Watch updates from the admin team.</p>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {videos.length === 0 ? (
                        <div className="text-center py-10 text-slate-400">
                            <i className="fas fa-video-slash text-4xl mb-3 opacity-30"></i>
                            <p>No announcements yet.</p>
                        </div>
                    ) : (
                        videos.map(video => (
                            <div key={video.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-3 hover:shadow-md transition-shadow">
                                <div className="aspect-video bg-black rounded-xl overflow-hidden mb-3 relative group flex items-center justify-center">
                                    {video.sourceType === 'upload' ? (
                                        <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-slate-500">
                                            <i className="fas fa-file-video text-4xl mb-2 opacity-50"></i>
                                            <span className="text-[10px] uppercase font-bold tracking-widest">Uploaded Video</span>
                                        </div>
                                    ) : (
                                        <iframe 
                                            src={video.url} 
                                            title={video.title}
                                            className="w-full h-full pointer-events-none" 
                                            frameBorder="0"
                                        ></iframe>
                                    )}
                                    
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                        <button 
                                            onClick={() => setSelectedVideo(video)}
                                            className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-red-600 shadow-lg transform group-hover:scale-110 transition-transform"
                                        >
                                            <i className="fas fa-play pl-1"></i>
                                        </button>
                                    </div>
                                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded">
                                        {video.duration} min
                                    </div>
                                </div>
                                <h3 className="font-bold text-slate-800 line-clamp-2 mb-1">{video.title}</h3>
                                <div className="flex justify-between items-center text-[10px] text-slate-400">
                                    <span>{new Date(video.timestamp).toLocaleDateString()}</span>
                                    <span className="text-blue-500 font-bold cursor-pointer" onClick={() => setSelectedVideo(video)}>Tap to Watch</span>
                                </div>
                                {(video.likes || video.dislikes) && (
                                    <div className="mt-2 flex gap-3 text-[10px] text-slate-400">
                                        <span className="flex items-center gap-1"><i className="fas fa-thumbs-up text-blue-400"></i> {video.likes || 0}</span>
                                        <span className="flex items-center gap-1"><i className="fas fa-thumbs-down text-red-400"></i> {video.dislikes || 0}</span>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewsModal;