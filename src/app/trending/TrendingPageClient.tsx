'use client';

import { Drama } from "@/lib/api";
import DramaCard from "@/components/DramaCard";
import { TrendingUp, Flame, Star, Eye } from "lucide-react";
import { motion } from "framer-motion";

interface TrendingPageClientProps {
    dramas: Drama[];
}

export default function TrendingPageClient({ dramas }: TrendingPageClientProps) {
    const topDrama = dramas[0];

    return (
        <div className="min-h-screen pb-20">
            {/* Header Section */}
            <div className="relative py-16 md:py-24 px-4 md:px-6 overflow-hidden">
                {/* Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />

                <div className="container relative">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full 
                            badge-trending backdrop-blur-xl mb-6 animate-pulse">
                            <Flame size={20} className="animate-float" />
                            <span className="font-bold uppercase tracking-wider">Hot This Week</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6">
                            <span className="primary-gradient-text">Trending</span> Dramas
                        </h1>

                        <p className="text-gray-300 text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
                            Discover what everyone's watching right now. Updated daily based on views and ratings.
                        </p>
                    </motion.div>

                    {/* Top Drama Highlight */}
                    {topDrama && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-5xl mx-auto glass rounded-3xl overflow-hidden border border-white/10 
                                shadow-2xl shadow-primary/20"
                        >
                            <div className="flex flex-col md:flex-row">
                                <div className="md:w-1/3 aspect-[2/3] md:aspect-auto relative overflow-hidden">
                                    <img
                                        src={topDrama.cover}
                                        alt={topDrama.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <div className="badge-trending px-4 py-2 backdrop-blur-md">
                                            <Flame size={16} />
                                            <span className="font-bold">#1 TRENDING</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 p-6 md:p-8">
                                    <h2 className="text-2xl md:text-3xl font-black mb-4 leading-tight">
                                        {topDrama.title}
                                    </h2>
                                    <p className="text-gray-300 text-sm md:text-base mb-6 line-clamp-3">
                                        {topDrama.summary || "The most popular drama this week!"}
                                    </p>
                                    <div className="flex flex-wrap gap-3 mb-6">
                                        {topDrama.heat && (
                                            <div className="flex items-center gap-2 px-3 py-2 glass rounded-xl 
                                                border border-cyan-500/30">
                                                <Eye size={16} className="text-cyan-400" />
                                                <span className="text-cyan-400 font-semibold text-sm">
                                                    {topDrama.heat > 1000000
                                                        ? `${(topDrama.heat / 1000000).toFixed(1)}M views`
                                                        : `${(topDrama.heat / 1000).toFixed(0)}K views`}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 px-3 py-2 glass rounded-xl 
                                            border border-yellow-500/30">
                                            <Star size={16} className="text-yellow-400" fill="#fbbf24" />
                                            <span className="text-yellow-400 font-semibold text-sm">
                                                {topDrama.heat
                                                    ? Math.min(topDrama.heat / 10000, 9.9).toFixed(1)
                                                    : "8.5"}
                                            </span>
                                        </div>
                                    </div>
                                    <a
                                        href={`/drama/${topDrama.fakeId}`}
                                        className="primary-button inline-flex"
                                    >
                                        Watch Now
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* All Trending Dramas */}
            <div className="container px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                        <TrendingUp size={24} className="text-primary" />
                        <h2 className="text-2xl md:text-3xl font-bold">
                            All Trending Shows
                        </h2>
                        <span className="ml-auto text-gray-400 text-sm">
                            {dramas.length} dramas
                        </span>
                    </div>

                    <div className="movie-grid">
                        {dramas.map((drama, index) => (
                            <motion.div
                                key={drama.fakeId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                            >
                                <DramaCard drama={drama} priority={index < 6} />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
