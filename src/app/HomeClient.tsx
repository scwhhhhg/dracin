'use client';

import { useState, useEffect } from 'react';
import { Drama } from "@/lib/api";
import DramaCard from "@/components/DramaCard";
import { Play, TrendingUp, Sparkles, ChevronRight, Star, Flame, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HomeClientProps {
    dramas: Drama[];
}

export default function HomeClient({ dramas }: HomeClientProps) {
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
    const featured = dramas.slice(0, 5);
    const trending = dramas.slice(5, 13);
    const latest = dramas.slice(13);

    // Auto-rotate hero
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentHeroIndex((prev) => (prev + 1) % featured.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [featured.length]);

    const currentHero = featured[currentHeroIndex] || featured[0];

    return (
        <div className="min-h-screen">
            {/* Hero Section with Auto-Carousel */}
            <section className="relative h-[90vh] md:h-[85vh] w-full overflow-hidden mb-16 md:mb-24">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentHeroIndex}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.7 }}
                        className="absolute inset-0"
                    >
                        <img
                            src={currentHero?.cover || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2000"}
                            alt="Featured"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
                        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
                    </motion.div>
                </AnimatePresence>

                <div className="relative container h-full flex flex-col justify-center px-4 md:px-6 pt-24 md:pt-32">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentHeroIndex}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="max-w-3xl space-y-6 md:space-y-8"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                badge-trending backdrop-blur-xl animate-pulse">
                                <Sparkles size={16} className="animate-float" />
                                <span className="text-xs md:text-sm font-bold tracking-widest uppercase">#1 Trending</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black 
                leading-tight tracking-tight text-white drop-shadow-2xl">
                                {currentHero?.title || "Mulai Menonton Drakor Favoritmu"}
                            </h1>

                            <p className="text-gray-300 text-base md:text-xl max-w-2xl leading-relaxed font-light">
                                {currentHero?.summary || "Temukan ribuan drama pendek dan serial populer dari berbagai genre dengan subtitle Indonesia kualitas HD."}
                            </p>

                            <div className="flex flex-wrap gap-3 md:gap-4 pt-4">
                                <a href={`/drama/${currentHero?.fakeId}`} className="primary-button group">
                                    <Play fill="white" size={20} className="group-hover:scale-110 transition-transform" />
                                    <span className="hidden sm:inline">Watch Now</span>
                                    <span className="sm:hidden">Watch</span>
                                </a>
                                <button className="secondary-button group">
                                    More Info
                                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>

                            {/* Hero Indicators */}
                            <div className="flex gap-2 pt-6">
                                {featured.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentHeroIndex(index)}
                                        className={`h-1 rounded-full transition-all duration-300 ${index === currentHeroIndex
                                                ? 'w-12 bg-primary'
                                                : 'w-8 bg-white/30 hover:bg-white/50'
                                            }`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block">
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
                    >
                        <div className="w-1 h-2 bg-white/50 rounded-full" />
                    </motion.div>
                </div>
            </section>

            <div className="container pb-20 px-4 md:px-6">
                {/* Trending Section */}
                <section className="mb-16 md:mb-24">
                    <div className="flex items-end justify-between mb-8 md:mb-12 pb-4 border-b border-white/5">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-xs md:text-sm uppercase">
                                <Flame size={18} className="animate-pulse" />
                                <span>Hot Right Now</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-gradient">
                                Trending Dramas
                            </h2>
                            <p className="text-gray-400 text-sm mt-1 hidden md:block">
                                What everyone&apos;s watching this week
                            </p>
                        </div>
                        <a
                            href="/trending"
                            className="text-gray-400 hover:text-white flex items-center gap-2 
                transition-colors mb-2 text-sm md:text-base group"
                        >
                            View All
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>

                    <div className="movie-grid">
                        {trending.map((drama, index) => (
                            <DramaCard key={drama.fakeId} drama={drama} priority={index < 4} />
                        ))}
                    </div>
                </section>

                {/* Latest Updates Section */}
                <section>
                    <div className="flex items-center gap-4 mb-8 md:mb-12">
                        <div className="w-1.5 h-16 bg-gradient-to-b from-primary via-purple-500 to-cyan-400 rounded-full" />
                        <div>
                            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs md:text-sm mb-2">
                                <Clock size={16} />
                                <span className="uppercase tracking-wider">Just Added</span>
                            </div>
                            <h2 className="text-2xl md:text-4xl font-bold text-white">Latest Episodes</h2>
                            <p className="text-gray-400 text-sm mt-1">Fresh content updated daily</p>
                        </div>
                    </div>

                    <div className="movie-grid">
                        {latest.map((drama) => (
                            <DramaCard key={drama.fakeId} drama={drama} />
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 md:mt-32 relative overflow-hidden rounded-3xl"
                >
                    <div className="glass p-8 md:p-16 text-center relative z-10">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/10 to-cyan-500/20" />
                        <div className="relative z-10">
                            <motion.div
                                animate={{ rotate: [0, 5, 0, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="inline-block mb-6"
                            >
                                <Star size={48} className="text-primary" fill="currentColor" />
                            </motion.div>
                            <h2 className="text-3xl md:text-5xl font-black mb-4 primary-gradient-text">
                                Discover Your Next Favorite
                            </h2>
                            <p className="text-gray-300 text-base md:text-lg mb-8 max-w-2xl mx-auto">
                                Explore thousands of dramas, movies, and series from around the world.
                                New content added daily!
                            </p>
                            <a href="/genres" className="primary-button text-base md:text-lg inline-flex">
                                <Sparkles size={20} />
                                Browse All Genres
                                <ChevronRight size={20} />
                            </a>
                        </div>
                    </div>
                </motion.section>
            </div>
        </div>
    );
}
