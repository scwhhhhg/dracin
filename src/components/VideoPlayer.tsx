'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Play, Loader2, AlertCircle } from 'lucide-react';

interface VideoPlayerProps {
    url: string;
    poster?: string;
}

export default function VideoPlayer({ url, poster }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !url) {
            setIsLoading(false);
            setHasError(true);
            setErrorMessage('No video URL provided');
            return;
        }

        setIsLoading(true);
        setHasError(false);

        if (Hls.isSupported()) {
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    setHasError(true);
                    setErrorMessage('Failed to load video stream');
                    setIsLoading(false);
                }
            });

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                setIsLoading(false);
            });

            hls.loadSource(url);
            hls.attachMedia(video);

            return () => {
                hls.destroy();
            };
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // For Safari or mobile devices that support HLS natively
            video.src = url;
            video.addEventListener('loadedmetadata', () => {
                setIsLoading(false);
            });
            video.addEventListener('error', () => {
                setHasError(true);
                setErrorMessage('Failed to load video');
                setIsLoading(false);
            });
        } else {
            setHasError(true);
            setErrorMessage('Your browser doesn\'t support video playback');
            setIsLoading(false);
        }
    }, [url]);

    return (
        <div className="relative aspect-video rounded-2xl md:rounded-3xl overflow-hidden bg-black 
            shadow-2xl border border-white/10">
            {/* Video Element */}
            <video
                ref={videoRef}
                controls
                className="w-full h-full"
                poster={poster}
                playsInline
            />

            {/* Loading Overlay */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="text-center">
                        <Loader2 size={48} className="mx-auto mb-4 text-primary animate-spin" />
                        <p className="text-white font-medium">Loading video...</p>
                    </div>
                </div>
            )}

            {/* Error Overlay */}
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="text-center px-6">
                        <div className="w-20 h-20 mx-auto mb-4 bg-red-500/20 rounded-full 
                            flex items-center justify-center">
                            <AlertCircle size={40} className="text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Playback Error</h3>
                        <p className="text-gray-400 text-sm max-w-md">
                            {errorMessage}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 px-6 py-3 bg-primary hover:bg-primary-hover rounded-xl 
                                font-semibold transition-colors"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            )}

            {/* Play icon overlay for poster (before playing) */}
            {!isLoading && !hasError && poster && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none 
                    opacity-0 hover:opacity-100 transition-opacity">
                    <div className="w-20 h-20 bg-primary/80 backdrop-blur-sm rounded-full 
                        flex items-center justify-center shadow-2xl">
                        <Play fill="white" size={32} className="ml-1" />
                    </div>
                </div>
            )}
        </div>
    );
}

