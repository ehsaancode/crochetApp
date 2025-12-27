import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RainbowButton } from "@/components/ui/rainbow-button";

export default function Carousel({ items, autoPlay = true, interval = 3000 }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (!autoPlay || isPaused || !items || items.length === 0) return;

        const timer = setInterval(() => {
            setDirection(1);
            setCurrentIndex((prev) => (prev + 1) % items.length);
        }, interval);

        return () => clearInterval(timer);
    }, [autoPlay, interval, isPaused, items?.length]);

    if (!items || items.length === 0) {
        return <div className="w-full h-[500px] md:h-[600px] flex items-center justify-center bg-silk-100 dark:bg-black/20 rounded-2xl">
            <div className="animate-pulse text-silk-400">Loading New Arrivals...</div>
        </div>;
    }

    const nextSlide = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % items.length);
    };

    const prevSlide = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    };

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 100 : -100,
            opacity: 0
        })
    };

    return (
        <div
            className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-2xl shadow-xl bg-silk-100 dark:bg-[linear-gradient(105deg,var(--tw-gradient-stops))] dark:from-black dark:to-silk-blue-dark"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
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
                    className="absolute inset-0 flex flex-col md:flex-row cursor-grab active:cursor-grabbing"
                >
                    {/* Image Section (Top/Left) */}
                    <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden">
                        <div className="absolute inset-0 bg-silk-900/10 z-10"></div>
                        <img
                            src={items[currentIndex].img}
                            alt={items[currentIndex].name}
                            className="w-full h-full object-cover object-center pointer-events-none"
                            loading="lazy"
                        />
                    </div>

                    {/* Text Section (Bottom/Right) */}
                    <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center items-center text-center p-6 md:p-12 bg-silk-50 dark:bg-[linear-gradient(105deg,var(--tw-gradient-stops))] dark:from-black dark:to-silk-blue-dark z-10 relative">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-silk-600 dark:text-silk-200 text-sm uppercase tracking-widest font-medium mb-2"
                        >
                            New Arrival
                        </motion.span>
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="font-serif text-3xl md:text-5xl text-silk-900 dark:text-white mb-4 leading-tight"
                        >
                            {items[currentIndex].name}
                        </motion.h3>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-silk-700 dark:text-silk-300 text-base mb-6 max-w-md hidden md:block"
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
                                className="pointer-events-auto"
                            >
                                <RainbowButton className="px-6 py-2.5 text-sm gap-2">
                                    <ShoppingBag className="w-4 h-4" />
                                    <span>Shop Now - ₹{items[currentIndex].price.toFixed(2)}</span>
                                </RainbowButton>
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/40 backdrop-blur-sm text-silk-900 dark:text-white shadow-lg hover:bg-white dark:hover:bg-black/40 transition-all duration-300 md:left-8"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/40 backdrop-blur-sm text-silk-900 dark:text-white shadow-lg hover:bg-white dark:hover:bg-black/40 transition-all duration-300 md:right-8"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:left-3/4 md:-translate-x-1/2 z-20 flex gap-2">
                {items.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setDirection(idx > currentIndex ? 1 : -1);
                            setCurrentIndex(idx);
                        }}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-silk-900 dark:bg-white' : 'bg-silk-400 dark:bg-silk-600 hover:bg-silk-600 dark:hover:bg-silk-400'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
