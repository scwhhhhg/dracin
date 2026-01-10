'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search, TrendingUp, Film } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-2xl"
            >
                {/* 404 Number */}
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="mb-8"
                >
                    <h1 className="text-[120px] sm:text-[180px] md:text-[220px] font-black leading-none 
                        primary-gradient-text drop-shadow-2xl">
                        404
                    </h1>
                </motion.div>

                {/* Error Message */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                        Oops! Page Not Found
                    </h2>
                    <p className="text-gray-400 text-base sm:text-lg mb-8 max-w-md mx-auto">
                        The page you're looking for doesn't exist or has been moved to another location.
                    </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <Link href="/" className="primary-button px-8 py-4 w-full sm:w-auto">
                        <Home size={20} />
                        Back to Home
                    </Link>
                    <Link href="/search" className="secondary-button px-8 py-4 w-full sm:w-auto">
                        <Search size={20} />
                        Search Dramas
                    </Link>
                </motion.div>

                {/* Quick Links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 pt-8 border-t border-white/10"
                >
                    <p className="text-sm text-gray-500 mb-4">Or explore these sections:</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link
                            href="/trending"
                            className="px-4 py-2 glass rounded-xl text-sm border border-white/10 
                                hover:border-primary/50 hover:bg-primary/10 transition-all
                                flex items-center gap-2"
                        >
                            <TrendingUp size={14} />
                            Trending
                        </Link>
                        <Link
                            href="/genres"
                            className="px-4 py-2 glass rounded-xl text-sm border border-white/10 
                                hover:border-primary/50 hover:bg-primary/10 transition-all
                                flex items-center gap-2"
                        >
                            <Film size={14} />
                            Genres
                        </Link>
                    </div>
                </motion.div>

                {/* Decorative Element */}
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/4 right-10 w-20 h-20 bg-primary/10 rounded-full blur-3xl -z-10"
                />
                <motion.div
                    animate={{
                        y: [0, 10, 0],
                        rotate: [0, -5, 5, 0]
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute bottom-1/4 left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -z-10"
                />
            </motion.div>
        </div>
    );
}
