'use client';

import { Drama } from "@/lib/api";
import DramaCard from "@/components/DramaCard";
import { Search, TrendingUp, Sparkles, Film } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

interface SearchPageClientProps {
    query: string;
    results: Drama[];
}

export default function SearchPageClient({ query, results }: SearchPageClientProps) {
    const [searchInput, setSearchInput] = useState(query);

    const suggestions = query ? [
        "Action",
        "Romance",
        "Comedy",
        "Thriller"
    ] : [];

    return (
        <div className="min-h-screen pb-20">
            {/* Search Header */}
            <div className="relative py-16 md:py-24 px-4 md:px-6">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto"
                    >
                        {/* Title */}
                        <div className="text-center mb-8 md:mb-12">
                            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4">
                                {query ? (
                                    <>
                                        Search Results for{" "}
                                        <span className="primary-gradient-text">"{query}"</span>
                                    </>
                                ) : (
                                    <span className="text-gradient">Search Dramas</span>
                                )}
                            </h1>
                            {results.length > 0 && (
                                <p className="text-gray-400 text-sm md:text-base">
                                    Found {results.length} result{results.length !== 1 ? 's' : ''}
                                </p>
                            )}
                        </div>

                        {/* Search Bar */}
                        <form action="/search" className="relative group">
                            <div className="relative">
                                <input
                                    type="text"
                                    name="q"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder="Search for drama, titles, genres..."
                                    className="w-full glass border-2 border-white/10 rounded-2xl 
                                        py-4 md:py-5 px-6 md:px-8 pl-14 md:pl-16 
                                        text-base md:text-xl 
                                        focus:outline-none focus:border-primary/60 
                                        transition-all shadow-xl
                                        placeholder:text-gray-500"
                                    autoFocus
                                />
                                <Search
                                    className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 
                                        text-gray-400 group-focus-within:text-primary transition-colors"
                                    size={20}
                                />
                                {searchInput && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchInput("")}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 
                                            text-gray-400 hover:text-white transition-colors"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            <button type="submit" className="sr-only">Search</button>
                        </form>

                        {/* Search Suggestions */}
                        {!query && suggestions.length > 0 && (
                            <div className="mt-6 flex flex-wrap justify-center gap-3">
                                <span className="text-sm text-gray-500">Popular searches:</span>
                                {suggestions.map((suggestion) => (
                                    <Link
                                        key={suggestion}
                                        href={`/search?q=${suggestion}`}
                                        className="px-4 py-2 glass rounded-full text-sm border border-white/10 
                                            hover:border-primary/50 hover:bg-primary/10 transition-all"
                                    >
                                        {suggestion}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Results */}
            <div className="container px-4 md:px-6">
                {results.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="movie-grid">
                            {results.map((drama, index) => (
                                <motion.div
                                    key={drama.fakeId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <DramaCard drama={drama} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ) : query ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-16 md:py-24"
                    >
                        <div className="mb-8 flex justify-center">
                            <div className="w-24 h-24 md:w-32 md:h-32 glass rounded-full 
                                flex items-center justify-center border border-white/10">
                                <Search size={48} className="text-gray-600" />
                            </div>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">
                            No dramas found for "{query}"
                        </h2>
                        <p className="text-gray-400 text-base md:text-lg mb-8 max-w-md mx-auto">
                            Try searching with different keywords or browse our trending dramas.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/" className="secondary-button">
                                <Film size={18} />
                                Browse All
                            </Link>
                            <Link href="/trending" className="primary-button">
                                <TrendingUp size={18} />
                                View Trending
                            </Link>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16 md:py-24"
                    >
                        <div className="mb-8 flex justify-center">
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="w-32 h-32 glass rounded-full flex items-center justify-center 
                                    border-2 border-primary/30"
                            >
                                <Sparkles size={56} className="text-primary" />
                            </motion.div>
                        </div>
                        <h2 className="text-2xl md:text-4xl font-bold mb-4 text-gradient">
                            Discover Amazing Dramas
                        </h2>
                        <p className="text-gray-400 text-base md:text-lg max-w-md mx-auto">
                            Start typing to search through thousands of dramas
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
