'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, Play, Menu, X, Film, TrendingUp, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
    { name: 'Home', path: '/', icon: Film },
    { name: 'Trending', path: '/trending', icon: TrendingUp },
    { name: 'Genres', path: '/genres', icon: Layers },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 30);
        };

        window.addEventListener('scroll', handleScroll);

        // Prevent body scroll when mobile menu is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-5'
                    }`}
            >
                <div className="container mx-auto">
                    <motion.div
                        animate={{
                            borderRadius: scrolled ? '18px' : '24px',
                        }}
                        transition={{ duration: 0.3 }}
                        className={`glass px-6 md:px-8 py-4 flex items-center justify-between 
                            ${scrolled
                                ? 'shadow-2xl shadow-black/20'
                                : 'shadow-xl shadow-black/10'
                            }
                            border border-white/10`}
                        style={{
                            background: scrolled
                                ? 'rgba(15, 15, 25, 0.85)'
                                : 'rgba(15, 15, 25, 0.6)',
                        }}
                    >
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group relative z-10">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2.5 bg-gradient-to-br from-primary via-purple-600 to-primary-dark 
                                    rounded-xl shadow-lg shadow-primary/40 
                                    group-hover:shadow-primary/60 transition-shadow relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Play size={20} fill="white" color="white" className="relative z-10" />
                            </motion.div>
                            <span className="text-xl md:text-2xl font-black tracking-tight">
                                DRAMA<span className="primary-gradient-text">BOS</span>
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-2">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.path}
                                        className="px-4 py-2.5 font-semibold text-sm text-gray-300 hover:text-white 
                                            transition-all relative group rounded-xl hover:bg-white/5"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icon size={16} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                                            {link.name}
                                        </div>
                                        <motion.span
                                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 
                                                bg-gradient-to-r from-primary to-cyan-400 rounded-full
                                                group-hover:w-1/2 transition-all duration-300"
                                        />
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Desktop Search */}
                        <form action="/search" className="hidden md:block relative group">
                            <motion.div
                                animate={{
                                    width: searchFocused ? '280px' : '200px',
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <input
                                    type="text"
                                    name="q"
                                    placeholder="Search dramas..."
                                    onFocus={() => setSearchFocused(true)}
                                    onBlur={() => setSearchFocused(false)}
                                    className="w-full bg-white/5 border border-white/10 rounded-full 
                                        py-2.5 px-5 pl-11 
                                        focus:outline-none focus:border-primary/60 focus:bg-white/10 
                                        transition-all placeholder:text-gray-500 text-sm"
                                />
                                <Search
                                    className="absolute left-4 top-1/2 -translate-y-1/2 
                                        text-gray-400 group-focus-within:text-primary 
                                        transition-colors pointer-events-none"
                                    size={16}
                                />
                            </motion.div>
                        </form>

                        {/* Mobile Menu Button */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            className="lg:hidden p-2 rounded-xl hover:bg-white/10 
                                text-gray-300 hover:text-white transition-colors"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <AnimatePresence mode="wait">
                                {isOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <X size={24} />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Menu size={24} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </motion.div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Mobile Menu Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed top-24 left-4 right-4 z-50 lg:hidden"
                        >
                            <div className="glass rounded-3xl p-6 border border-white/10 
                                shadow-2xl shadow-black/30 overflow-hidden">
                                {/* Menu Links */}
                                <div className="flex flex-col gap-2 mb-6">
                                    {navLinks.map((link, index) => {
                                        const Icon = link.icon;
                                        return (
                                            <motion.div
                                                key={link.name}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <Link
                                                    href={link.path}
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex items-center gap-3 text-lg font-bold p-4 
                                                        hover:bg-white/10 rounded-2xl transition-all group
                                                        border border-transparent hover:border-white/10"
                                                >
                                                    <div className="p-2 bg-primary/10 rounded-lg 
                                                        group-hover:bg-primary/20 transition-colors">
                                                        <Icon size={20} className="text-primary" />
                                                    </div>
                                                    <span className="group-hover:text-primary transition-colors">
                                                        {link.name}
                                                    </span>
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Mobile Search */}
                                <motion.form
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    action="/search"
                                    className="relative"
                                >
                                    <input
                                        type="text"
                                        name="q"
                                        placeholder="Search dramas..."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl 
                                            py-4 px-5 pl-12 
                                            focus:outline-none focus:border-primary/60 focus:bg-white/10
                                            transition-all placeholder:text-gray-400"
                                    />
                                    <Search
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={20}
                                    />
                                </motion.form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
