'use client';

import { motion } from "framer-motion";
import { Film, Heart, Laugh, Zap, Drama as DramaIcon, Sparkles } from "lucide-react";
import Link from "next/link";

const genres = [
    { name: "Romance", icon: Heart, color: "from-pink-500 to-rose-500", description: "Love stories that touch your heart" },
    { name: "Action", icon: Zap, color: "from-orange-500 to-red-500", description: "Thrilling adventures and fights" },
    { name: "Comedy", icon: Laugh, color: "from-yellow-500 to-amber-500", description: "Laugh-out-loud moments" },
    { name: "Drama", icon: DramaIcon, color: "from-purple-500 to-indigo-500", description: "Deep emotional stories" },
    { name: "Thriller", icon: Film, color: "from-blue-500 to-cyan-500", description: "Suspense and mystery" },
    { name: "Fantasy", icon: Sparkles, color: "from-violet-500 to-purple-500", description: "Magical and supernatural" },
];

export default function GenresPage() {
    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <div className="relative py-16 md:py-24 px-4 md:px-6">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6">
                            Explore by <span className="primary-gradient-text">Genre</span>
                        </h1>
                        <p className="text-gray-300 text-base md:text-xl leading-relaxed">
                            Find your perfect drama by browsing through different genres
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Genre Grid */}
            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {genres.map((genre, index) => {
                        const Icon = genre.icon;
                        return (
                            <motion.div
                                key={genre.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    href={`/search?q=${genre.name}`}
                                    className="group relative overflow-hidden glass rounded-3xl p-8 border border-white/10 
                                        hover:border-white/20 transition-all duration-500 block h-full"
                                >
                                    {/* Background Gradient */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-0 
                                        group-hover:opacity-20 transition-opacity duration-500`} />

                                    {/* Icon */}
                                    <div className="relative mb-6">
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${genre.color} 
                                                flex items-center justify-center shadow-lg`}
                                        >
                                            <Icon size={32} className="text-white" />
                                        </motion.div>
                                    </div>

                                    {/* Content */}
                                    <div className="relative">
                                        <h3 className="text-2xl md:text-3xl font-black mb-2 group-hover:text-white 
                                            transition-colors">
                                            {genre.name}
                                        </h3>
                                        <p className="text-gray-400 text-sm md:text-base group-hover:text-gray-300 
                                            transition-colors">
                                            {genre.description}
                                        </p>
                                    </div>

                                    {/* Arrow indicator */}
                                    <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 
                                        transition-opacity">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                            className="text-white">
                                            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor"
                                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Coming Soon Notice */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-16 text-center glass rounded-3xl p-8 md:p-12 border border-white/10"
                >
                    <Sparkles size={48} className="mx-auto mb-4 text-primary" />
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">More Genres Coming Soon!</h3>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        We're constantly expanding our collection. Stay tuned for more exciting genres and categories.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
