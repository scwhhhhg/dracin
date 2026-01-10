'use client';

import { Drama, Episode } from "@/lib/api";
import { Play, Calendar, Star, Languages, List, Sparkles, Share2, Clock, Eye, Flame, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

interface DramaPageClientProps {
    drama: Drama & { episodes: Episode[] };
    id: string;
}

export default function DramaPageClient({ drama, id }: DramaPageClientProps) {
    const [selectedRange, setSelectedRange] = useState(0);
    const episodes = drama.episodes || [];
    const episodesPerPage = 50;
    const totalPages = Math.ceil(episodes.length / episodesPerPage);
    const startIndex = selectedRange * episodesPerPage;
    const endIndex = Math.min(startIndex + episodesPerPage, episodes.length);
    const displayedEpisodes = episodes.slice(startIndex, endIndex);

    const rating = drama.heat
        ? Math.min(drama.heat / 10000, 9.9).toFixed(1)
        : "8.5";

    return (
        <div className="min-h-screen pb-20">
            {/* Cinematic Background Header */}
            <div className="relative h-[70vh] md:h-[60vh] w-full overflow-hidden">
                <motion.div
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                >
                    <img
                        src={drama.cover}
                        alt="Background"
                        className="w-full h-full object-cover blur-3xl opacity-40 scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
                </motion.div>

                {/* Back Button */}
                <div className="absolute top-24 left-4 md:left-8 z-20">
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-4 py-2 glass rounded-xl 
                            hover:bg-white/10 transition-all group"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden sm:inline">Back</span>
                    </Link>
                </div>
            </div>

            <div className="container relative -mt-[45vh] md:-mt-[40vh] z-10 px-4 md:px-6">
                <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
                    {/* Poster Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-full lg:w-[320px] xl:w-[350px] shrink-0"
                    >
                        <div className="lg:sticky lg:top-28">
                            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/50 
                                border border-white/10 aspect-[2/3] relative group">
                                <img
                                    src={drama.cover}
                                    alt={drama.title}
                                    className="w-full h-full object-cover transition-transform duration-700 
                                        group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent 
                                    to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                {/* Heat indicator */}
                                {drama.heat && drama.heat > 50000 && (
                                    <div className="absolute top-4 left-4">
                                        <div className="badge-trending flex items-center gap-2 px-3 py-2 
                                            backdrop-blur-md animate-pulse">
                                            <Flame size={16} className="animate-float" />
                                            <span className="font-bold">HOT</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex flex-col gap-4">
                                <Link
                                    href={`/watch/${id}/1`}
                                    className="primary-button justify-center w-full py-4 text-lg"
                                >
                                    <Play fill="white" size={24} />
                                    <span>Start Watching</span>
                                </Link>
                                <div className="flex gap-3">
                                    <button className="secondary-button flex-1 justify-center py-3">
                                        <List size={18} />
                                        <span className="hidden sm:inline">Watchlist</span>
                                    </button>
                                    <button className="secondary-button flex-1 justify-center py-3">
                                        <Share2 size={18} />
                                        <span className="hidden sm:inline">Share</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Info Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex-1 pt-4 lg:pt-10"
                    >
                        <div className="mb-8">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 
                                leading-tight text-white drop-shadow-lg">
                                {drama.title}
                            </h1>

                            <div className="flex flex-wrap gap-3 text-sm md:text-base">
                                <div className="flex items-center gap-2 px-3 py-2 glass rounded-xl 
                                    border border-yellow-500/30">
                                    <Star className="text-yellow-400" fill="#fbbf24" size={18} />
                                    <span className="text-yellow-400 font-bold">{rating}</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 glass rounded-xl 
                                    border border-white/10">
                                    <Calendar size={18} className="text-gray-400" />
                                    <span className="text-gray-300">2024</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 glass rounded-xl 
                                    border border-white/10">
                                    <Languages size={18} className="text-gray-400" />
                                    <span className="text-gray-300">Sub Indo</span>
                                </div>
                                {drama.heat && (
                                    <div className="flex items-center gap-2 px-3 py-2 glass rounded-xl 
                                        border border-cyan-500/30">
                                        <Eye size={18} className="text-cyan-400" />
                                        <span className="text-cyan-400 font-semibold">
                                            {drama.heat > 1000000
                                                ? `${(drama.heat / 1000000).toFixed(1)}M`
                                                : `${(drama.heat / 1000).toFixed(0)}K`}
                                        </span>
                                    </div>
                                )}
                                {drama.tag && (
                                    <div className="badge-primary px-3 py-2 rounded-xl">
                                        <span className="uppercase tracking-wider font-bold text-xs">
                                            {drama.tag}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="glass p-6 md:p-8 rounded-3xl mb-12 border border-white/5">
                            <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2 
                                primary-gradient-text">
                                <Sparkles size={20} />
                                <span>Storyline</span>
                            </h2>
                            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                                {drama.summary || "No summary available for this drama yet. Watch more to find out about the story!"}
                            </p>
                        </div>

                        {/* Episode List */}
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between 
                                gap-4 mb-8 pb-4 border-b border-white/5">
                                <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                                    <Clock size={28} className="text-primary" />
                                    Episodes
                                    <span className="text-base md:text-lg font-normal text-gray-500">
                                        ({episodes.length})
                                    </span>
                                </h2>

                                {/* Episode Range Selector */}
                                {totalPages > 1 && (
                                    <div className="flex gap-2 flex-wrap">
                                        {Array.from({ length: totalPages }, (_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedRange(i)}
                                                className={`px-4 py-2 text-sm rounded-xl font-semibold 
                                                    transition-all ${i === selectedRange
                                                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                                        : 'bg-white/5 hover:bg-white/10 border border-white/10'
                                                    }`}
                                            >
                                                {i * episodesPerPage + 1}-{Math.min((i + 1) * episodesPerPage, episodes.length)}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <motion.div
                                key={selectedRange}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 
                                    xl:grid-cols-8 gap-3"
                            >
                                {displayedEpisodes.map((ep, index) => (
                                    <motion.div
                                        key={ep.seq}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.03, duration: 0.3 }}
                                    >
                                        <Link
                                            href={`/watch/${id}/${ep.seq}`}
                                            className="group relative aspect-square glass hover:bg-primary/20 
                                                border border-white/5 hover:border-primary/50 rounded-xl 
                                                flex flex-col items-center justify-center transition-all 
                                                hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
                                        >
                                            <span className="text-xl md:text-2xl font-bold text-gray-400 
                                                group-hover:text-white transition-colors">
                                                {ep.seq}
                                            </span>
                                            <span className="text-[9px] md:text-[10px] uppercase tracking-widest 
                                                text-gray-600 group-hover:text-primary transition-colors mt-1">
                                                Episode
                                            </span>

                                            {ep.vip && (
                                                <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 
                                                    rounded-full shadow-lg shadow-yellow-400/50 animate-pulse" />
                                            )}

                                            {/* Play icon on hover */}
                                            <div className="absolute inset-0 flex items-center justify-center 
                                                opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="w-8 h-8 bg-primary rounded-full flex items-center 
                                                    justify-center shadow-lg">
                                                    <Play fill="white" size={14} className="ml-0.5" />
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Episode count info */}
                            <p className="text-center text-gray-500 text-sm mt-6">
                                Showing {startIndex + 1}-{endIndex} of {episodes.length} episodes
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
