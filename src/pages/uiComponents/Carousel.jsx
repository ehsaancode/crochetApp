import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Carousel({ items, autoPlay = true, interval = 3000 }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (!autoPlay || isPaused) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length);
        }, interval);

        return () => clearInterval(timer);
    }, [autoPlay, interval, isPaused, items.length]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    };

    return (
        <div
            className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-2xl shadow-xl bg-silk-100"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = offset.x;

                        if (swipe < -50) {
                            nextSlide();
                        } else if (swipe > 50) {
                            prevSlide();
                        }
                    }}
                    className="absolute inset-0 flex flex-col cursor-grab active:cursor-grabbing"
                >
                    {/* Image Section (Top) */}
                    <div className="w-full h-1/2 relative overflow-hidden">
                        <div className="absolute inset-0 bg-silk-900/10 z-10"></div>
                        <img
                            src={items[currentIndex].img}
                            alt={items[currentIndex].name}
                            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-[2s]"
                        />
                    </div>

                    {/* Text Section (Bottom) */}
                    <div className="w-full h-1/2 flex flex-col justify-center items-center text-center p-6 bg-silk-50 z-10 relative">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-silk-600 text-sm uppercase tracking-widest font-medium mb-2"
                        >
                            New Arrival
                        </motion.span>
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="font-serif text-3xl md:text-4xl text-silk-900 mb-4 leading-tight"
                        >
                            {items[currentIndex].name}
                        </motion.h3>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-silk-700 text-base mb-6 max-w-md hidden md:block"
                        >
                            Handcrafted with premium natural cotton. Experience the luxury of artisan crochet.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Link
                                to={`/product/${items[currentIndex].id}`}
                                className="inline-flex items-center gap-2 bg-silk-900 text-silk-50 px-6 py-3 rounded-full hover:bg-silk-800 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                <span>Shop Now - ${items[currentIndex].price.toFixed(2)}</span>
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/40 backdrop-blur-sm text-silk-900 shadow-lg hover:bg-white transition-all duration-300 md:left-8"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/40 backdrop-blur-sm text-silk-900 shadow-lg hover:bg-white transition-all duration-300 md:right-8"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {items.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-silk-900' : 'bg-silk-400 hover:bg-silk-600'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
