'use client';

import { Drama, Episode } from "@/lib/api";
import VideoPlayer from "@/components/VideoPlayer";
import { Download, Share2, ChevronLeft, ChevronRight, List, Play, Sparkles, Clock, Eye } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

interface WatchPageClientProps {
    drama: Drama;
    episodes: Episode[];
    playUrl: string;
    currentEpisode: number;
    id: string;
}

export default function WatchPageClient({
    drama,
    episodes,
    playUrl,
    currentEpisode,
    id
}: WatchPageClientProps) {
    const [showPlaylist, setShowPlaylist] = useState(false);
    const prevEpisode = currentEpisode > 1 ? currentEpisode - 1 : null;
    const nextEpisode = currentEpisode < episodes.length ? currentEpisode + 1 : null;

    return (
        <div className="min-h-screen pb-20">
            {/* Background Gradient */}
            <div className="fixed inset-0 bg-gradient-to-b from-background via-background to-background-elevated -z-10" />

            <div className="container px-4 md:px-6 py-6 md:py-10">
                <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
                    {/* Main Content: Player and Info */}
                    <div className="flex-1">
                        {/* Back Button & Title */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 md:mb-6"
                        >
                            <Link
                                href={`/drama/${id}`}
                                className="inline-flex items-center gap-2 text-gray-400 hover:text-white 
                                    transition-colors mb-4 group"
                            >
                                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                                <span className="text-sm md:text-base">Back to Drama</span>
                            </Link>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2">
                                {drama.title}
                            </h1>
                            <div className="flex items-center gap-3 text-sm md:text-base text-gray-400">
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    <span>Episode {currentEpisode}</span>
                                </div>
                                {episodes.length > 0 && (
                                    <>
                                        <span>•</span>
                                        <span>{episodes.length} Episodes</span>
                                    </>
                                )}
                            </div>
                        </motion.div>

                        {/* Video Player */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                        >
                            <VideoPlayer url={playUrl} />
                        </motion.div>

                        {/* Episode Navigation & Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mt-6 md:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center 
                                justify-between gap-4"
                        >
                            {/* Navigation Buttons */}
                            <div className="flex gap-3">
                                {prevEpisode ? (
                                    <Link
                                        href={`/watch/${id}/${prevEpisode}`}
                                        className="secondary-button flex-1 sm:flex-none px-6 py-3"
                                    >
                                        <ChevronLeft size={18} />
                                        <span className="hidden sm:inline">Previous</span>
                                        <span className="sm:hidden">Prev</span>
                                    </Link>
                                ) : (
                                    <button
                                        disabled
                                        className="secondary-button flex-1 sm:flex-none px-6 py-3 opacity-50 cursor-not-allowed"
                                    >
                                        <ChevronLeft size={18} />
                                        <span className="hidden sm:inline">Previous</span>
                                        <span className="sm:hidden">Prev</span>
                                    </button>
                                )}

                                {nextEpisode ? (
                                    <Link
                                        href={`/watch/${id}/${nextEpisode}`}
                                        className="primary-button flex-1 sm:flex-none px-6 py-3"
                                    >
                                        <span className="hidden sm:inline">Next Episode</span>
                                        <span className="sm:hidden">Next</span>
                                        <ChevronRight size={18} />
                                    </Link>
                                ) : (
                                    <Link
                                        href={`/drama/${id}`}
                                        className="primary-button flex-1 sm:flex-none px-6 py-3"
                                    >
                                        <Sparkles size={18} />
                                        <span>Finish</span>
                                    </Link>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    className="lg:hidden secondary-button px-4 py-3"
                                    onClick={() => setShowPlaylist(!showPlaylist)}
                                >
                                    <List size={18} />
                                    <span className="hidden sm:inline">Playlist</span>
                                </button>

                                {playUrl && (
                                    <a
                                        href={playUrl}
                                        download
                                        className="secondary-button px-4 py-3"
                                        title="Download Episode"
                                    >
                                        <Download size={18} />
                                        <span className="hidden md:inline">Download</span>
                                    </a>
                                )}

                                <button className="secondary-button px-4 py-3" title="Share">
                                    <Share2 size={18} />
                                    <span className="hidden md:inline">Share</span>
                                </button>
                            </div>
                        </motion.div>

                        {/* Drama Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-8 md:mt-12 glass p-6 md:p-8 rounded-3xl border border-white/5"
                        >
                            <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
                                <Sparkles size={20} className="text-primary" />
                                <span>About This Drama</span>
                            </h2>
                            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                                {drama.summary || `Watching ${drama.title} Episode ${currentEpisode} with Subtitle Indonesia.`}
                            </p>

                            {drama.heat && (
                                <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-sm text-gray-400">
                                    <Eye size={16} />
                                    <span>
                                        {drama.heat > 1000000
                                            ? `${(drama.heat / 1000000).toFixed(1)}M views`
                                            : `${(drama.heat / 1000).toFixed(0)}K views`}
                                    </span>
                                </div>
                            )}
                        </motion.div>

                        {/* Mobile Playlist (Dropdown) */}
                        {showPlaylist && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="lg:hidden mt-6 glass rounded-3xl overflow-hidden border border-white/5"
                            >
                                <div className="p-4 border-b border-white/10 bg-white/5">
                                    <h3 className="font-bold flex items-center gap-2">
                                        <List size={18} className="text-primary" />
                                        All Episodes
                                    </h3>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {episodes.map((ep) => (
                                        <Link
                                            key={ep.seq}
                                            href={`/watch/${id}/${ep.seq}`}
                                            className={`flex items-center gap-3 p-4 hover:bg-white/5 transition-all 
                                                border-b border-white/5 ${ep.seq === currentEpisode
                                                    ? 'bg-primary/20 border-l-4 border-l-primary'
                                                    : ''
                                                }`}
                                            onClick={() => setShowPlaylist(false)}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center 
                                                font-bold text-sm ${ep.seq === currentEpisode
                                                    ? 'bg-primary text-white'
                                                    : 'bg-white/10 text-gray-400'
                                                }`}>
                                                {ep.seq}
                                            </div>
                                            <div className="flex-1">
                                                <div className={`font-medium ${ep.seq === currentEpisode ? 'text-primary' : ''
                                                    }`}>
                                                    Episode {ep.seq}
                                                </div>
                                                {ep.vip && (
                                                    <span className="text-[10px] text-yellow-500 font-bold uppercase">
                                                        VIP
                                                    </span>
                                                )}
                                            </div>
                                            {ep.seq === currentEpisode && (
                                                <Play size={16} className="text-primary" fill="currentColor" />
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar: Episode Playlist (Desktop) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="hidden lg:block w-80 xl:w-96"
                    >
                        <div className="glass rounded-3xl overflow-hidden sticky top-24 border border-white/5">
                            <div className="p-5 border-b border-white/10 bg-white/5">
                                <h3 className="font-bold flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <List size={18} className="text-primary" />
                                        All Episodes
                                    </span>
                                    <span className="text-sm text-gray-400">{episodes.length} EP</span>
                                </h3>
                            </div>
                            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                                {episodes.map((ep) => (
                                    <Link
                                        key={ep.seq}
                                        href={`/watch/${id}/${ep.seq}`}
                                        className={`flex items-center gap-4 p-4 hover:bg-white/5 transition-all 
                                            border-b border-white/5 ${ep.seq === currentEpisode
                                                ? 'bg-primary/20 border-l-4 border-l-primary'
                                                : ''
                                            }`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center 
                                            font-bold ${ep.seq === currentEpisode
                                                ? 'bg-primary text-white'
                                                : 'bg-white/10 text-gray-400'
                                            }`}>
                                            {ep.seq}
                                        </div>
                                        <div className="flex-1">
                                            <div className={`font-medium ${ep.seq === currentEpisode ? 'text-primary' : ''
                                                }`}>
                                                Episode {ep.seq}
                                            </div>
                                            {ep.vip && (
                                                <span className="text-[10px] text-yellow-500 font-bold uppercase">
                                                    VIP Content
                                                </span>
                                            )}
                                        </div>
                                        {ep.seq === currentEpisode && (
                                            <Play size={16} className="text-primary" fill="currentColor" />
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
