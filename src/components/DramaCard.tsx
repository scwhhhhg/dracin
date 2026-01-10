'use client';

import Link from 'next/link';
import { Drama } from '@/lib/api';
import { Play, Star, Flame, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface DramaCardProps {
    drama: Drama;
    priority?: boolean;
}

export default function DramaCard({ drama, priority = false }: DramaCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Calculate rating from heat
    const rating = drama.heat
        ? Math.min(drama.heat / 10000, 9.9).toFixed(1)
        : (Math.random() * 2 + 7.5).toFixed(1);
    const isHot = drama.heat && drama.heat > 50000;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4 }}
            className="group relative"
        >
            <Link href={`/drama/${drama.fakeId}`}>
                <motion.div
                    whileHover={{ y: -10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="relative aspect-[2/3] rounded-2xl overflow-hidden 
                        shadow-lg shadow-black/50 
                        border border-white/5 
                        group-hover:border-primary/30 
                        group-hover:shadow-2xl group-hover:shadow-primary/20
                        transition-all duration-500"
                >
                    {/* Image */}
                    <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900">
                        {!imageError ? (
                            <>
                                {!imageLoaded && (
                                    <div className="absolute inset-0 skeleton" />
                                )}
                                <img
                                    src={drama.cover}
                                    alt={drama.title}
                                    className={`w-full h-full object-cover transition-all duration-700
                                        ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
                                        group-hover:scale-110`}
                                    loading={priority ? "eager" : "lazy"}
                                    onLoad={() => setImageLoaded(true)}
                                    onError={() => {
                                        setImageError(true);
                                        setImageLoaded(true);
                                    }}
                                />
                            </>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary-dark/20">
                                <Film size={48} className="text-primary/50" />
                            </div>
                        )}
                    </div>

                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent 
                        opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

                    {/* Top gradient for better badge visibility */}
                    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/60 to-transparent 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Hot Badge */}
                    {isHot && (
                        <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="absolute top-3 left-3 z-10"
                        >
                            <div className="badge-trending flex items-center gap-1.5 px-2.5 py-1.5 
                                backdrop-blur-md shadow-lg animate-pulse">
                                <Flame size={12} className="animate-float" />
                                <span className="text-xs font-bold">HOT</span>
                            </div>
                        </motion.div>
                    )}

                    {/* Provider Badge */}
                    {drama.provider && (
                        <div className="absolute top-3 right-3 z-10">
                            <div className="glass border border-white/20 px-2.5 py-1 rounded-lg 
                                backdrop-blur-md shadow-lg bg-black/50">
                                <span className="text-[10px] font-bold text-white/90 uppercase tracking-wider">
                                    {drama.provider === 'radreel' ? 'RadReel' :
                                        drama.provider === 'flickreels' ? 'FlickReels' :
                                            drama.provider === 'dotdrama' ? 'DotDrama' :
                                                drama.provider === 'reelshort' ? 'ReelShort' :
                                                    drama.provider === 'dramabox' ? 'DramaBox' :
                                                        drama.provider === 'dramacool' ? 'DramaCool' :
                                                            drama.provider === 'kissasian' ? 'KissAsian' :
                                                                drama.provider}
                                </span>
                            </div>
                        </div>
                    )}


                    {/* Tag */}
                    {drama.tag && !isHot && (
                        <div className="absolute top-3 right-3 z-10">
                            <span className="bg-black/70 backdrop-blur-md border border-white/20 
                                text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg 
                                uppercase tracking-wider shadow-lg">
                                {drama.tag}
                            </span>
                        </div>
                    )}

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center 
                        opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <motion.div
                            initial={{ scale: 0.5 }}
                            whileHover={{ scale: 1.1 }}
                            className="relative"
                        >
                            {/* Pulsing ring */}
                            <div className="absolute inset-0 bg-primary/30 rounded-full 
                                animate-ping opacity-75" />

                            {/* Outer ring */}
                            <div className="relative w-20 h-20 bg-white/10 backdrop-blur-xl 
                                rounded-full flex items-center justify-center 
                                border-2 border-white/30 shadow-2xl
                                transform transition-transform group-hover:scale-110">
                                {/* Inner button */}
                                <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark 
                                    rounded-full flex items-center justify-center shadow-lg 
                                    shadow-primary/50">
                                    <Play fill="white" color="white" size={22} className="ml-0.5" />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Info at Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 
                        transform translate-y-2 group-hover:translate-y-0 
                        transition-transform duration-300">
                        <h3 className="font-bold text-base md:text-lg text-white leading-tight mb-2 
                            line-clamp-2 drop-shadow-lg">
                            {drama.title}
                        </h3>

                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 text-xs">
                                {/* Rating */}
                                <div className="flex items-center gap-1.5 px-2 py-1 
                                    bg-black/50 backdrop-blur-sm rounded-lg border border-yellow-500/30">
                                    <Star size={12} fill="#fbbf24" color="#fbbf24" />
                                    <span className="font-bold text-yellow-400">{rating}</span>
                                </div>

                                {/* Views indicator */}
                                {drama.heat && (
                                    <div className="flex items-center gap-1.5 px-2 py-1 
                                        bg-black/50 backdrop-blur-sm rounded-lg border border-cyan-500/30">
                                        <Eye size={12} className="text-cyan-400" />
                                        <span className="font-semibold text-cyan-400">
                                            {drama.heat > 1000000
                                                ? `${(drama.heat / 1000000).toFixed(1)}M`
                                                : `${(drama.heat / 1000).toFixed(0)}K`}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Summary on hover (desktop only) */}
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <p className="text-xs text-gray-300 mt-2 line-clamp-2 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                hidden md:block">
                                {drama.summary || "Tonton drama seru ini sekarang!"}
                            </p>
                        </motion.div>
                    </div>

                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 
                        transition-opacity duration-700 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-r 
                            from-transparent via-white/10 to-transparent 
                            -translate-x-full group-hover:translate-x-full 
                            transition-transform duration-1000" />
                    </div>
                </motion.div>
            </Link>
        </motion.div>
    );
}

// Import Film icon
import { Film } from 'lucide-react';
