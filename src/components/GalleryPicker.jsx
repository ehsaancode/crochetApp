import React, { useState, useEffect, useRef, useContext } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShopContext } from '../context/ShopContext';

const GalleryPicker = ({ isOpen, onClose, onSelect, title = "Gallery", subtitle = "Select an image to use as a reference", actionLabel = "Use This Design" }) => {
    const { galleryImages } = useContext(ShopContext);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const touchStart = useRef(null);
    const touchEnd = useRef(null);
    const minSwipeDistance = 50;

    // Reset loop
    useEffect(() => {
        if (!isOpen) setSelectedIndex(null);
    }, [isOpen]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (selectedIndex === null) {
                if (e.key === 'Escape') onClose();
                return;
            }
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'Escape') setSelectedIndex(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, selectedIndex, galleryImages]);

    const handleNext = (e) => {
        if (e) e.stopPropagation();
        setSelectedIndex((prev) => (prev + 1) % galleryImages.length);
    };

    const handlePrev = (e) => {
        if (e) e.stopPropagation();
        setSelectedIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    };

    const optimizeImageUrl = (url, width) => {
        if (!url || !url.includes('cloudinary.com')) return url;
        if (url.includes('/upload/w_')) return url;
        return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
    };

    // Swipe handlers
    const onTouchStart = (e) => {
        touchEnd.current = null;
        touchStart.current = e.targetTouches[0].clientX;
    };

    const onTouchMove = (e) => {
        touchEnd.current = e.targetTouches[0].clientX;
    };

    const onTouchEnd = () => {
        if (!touchStart.current || !touchEnd.current) return;
        const distance = touchStart.current - touchEnd.current;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) handleNext();
        if (isRightSwipe) handlePrev();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="gallery-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] bg-white dark:bg-black overflow-y-auto p-6 md:p-12"
                >
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-8 pt-10 md:pt-0">
                            <div>
                                <h2 className="font-serif text-2xl md:text-3xl text-silk-900 dark:text-silk-50 mb-2">{title}</h2>
                                {subtitle && <p className="text-sm text-silk-600 dark:text-silk-400">{subtitle}</p>}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-8 h-8 text-silk-900 dark:text-silk-50" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
                            {galleryImages.map((item, index) => (
                                <div
                                    key={item._id}
                                    onClick={() => setSelectedIndex(index)}
                                    className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-gray-100 dark:bg-white/5 border border-transparent hover:border-silk-500 transition-all"
                                >
                                    <img
                                        src={optimizeImageUrl(item.image, 300)}
                                        loading="lazy"
                                        alt="Idea"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Full Screen Viewer */}
            {isOpen && selectedIndex !== null && galleryImages[selectedIndex] && (
                <motion.div
                    key="gallery-viewer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
                    onClick={() => setSelectedIndex(null)}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    <div className="relative max-w-4xl w-full flex flex-col items-center gap-6" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedIndex(null)}
                            className="absolute top-0 right-0 -mt-14 sm:-mr-12 sm:mt-0 text-white/70 hover:text-white transition-colors p-2 z-50"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <button
                            onClick={handlePrev}
                            className="absolute left-[-20px] sm:left-[-60px] top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors hidden sm:block"
                        >
                            <ChevronLeft className="w-10 h-10" />
                        </button>

                        <button
                            onClick={handleNext}
                            className="absolute right-[-20px] sm:right-[-60px] top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors hidden sm:block"
                        >
                            <ChevronRight className="w-10 h-10" />
                        </button>

                        <img
                            src={galleryImages[selectedIndex].image}
                            alt="Full view"
                            className="max-h-[70vh] w-auto object-contain rounded-lg shadow-2xl select-none"
                        />

                        <button
                            onClick={() => onSelect(galleryImages[selectedIndex].image)}
                            className="bg-white text-black px-10 py-3 rounded-full font-serif uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                            {actionLabel}
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GalleryPicker;
