import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import GridMotion from '../pages/uiComponents/GridMotion';
import GalleryPicker from './GalleryPicker';

const DiscoverIdeas = ({ isHomePage }) => {
    const { backendUrl, galleryImages } = useContext(ShopContext);
    const navigate = useNavigate();
    const gallery = galleryImages;

    const [visibleCount, setVisibleCount] = useState(window.innerWidth > 768 ? 24 : 12);
    const [showAllGallery, setShowAllGallery] = useState(false);

    const handleGallerySelect = (image) => {
        navigate('/custom-order', { state: { initialImage: image } });
    };

    if (gallery.length === 0) return null;

    // Helper to optimize Cloudinary URLs
    const optimizeImageUrl = (url, width = 500) => {
        if (!url || !url.includes('cloudinary.com')) return url;
        // Check if already has transformation
        if (url.includes('/upload/w_')) return url;
        return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
    };

    return (
        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5 animate-fade-in">
            <div className={`flex items-center ${isHomePage ? 'justify-center text-center mb-8' : 'justify-between mb-4'}`}>
                <div>
                    <div className={`flex flex-col ${isHomePage ? 'items-center' : 'items-start'} gap-2 mb-2`}>
                        <Sparkles className="w-5 h-5 text-silk-500" />
                        <h4 className={`font-serif text-lg text-silk-900 dark:text-silk-50 ${isHomePage ? 'text-xl md:text-3xl' : ''}`}>
                            Ready to create something <span className="italic">unique?</span>
                        </h4>
                    </div>
                    <p className={`text-sm text-silk-600 dark:text-silk-400 ${isHomePage ? 'text-sm md:text-lg max-w-2xl mx-auto' : ''}`}>Discover ideas from our gallery to start your custom request.</p>
                </div>
            </div>

            <div className="h-[60vh] w-full overflow-hidden rounded-xl bg-gray-50 dark:bg-black/20 my-6">
                <GridMotion
                    items={gallery.slice(0, visibleCount).map(item => optimizeImageUrl(item.image, 500))}
                    gradientColor="transparent"
                />
            </div>

            <div className={`mt-10 pb-15 flex flex-col gap-6 ${isHomePage ? 'items-center sm:flex-row sm:justify-center' : 'items-end sm:flex-row sm:items-center justify-between'}`}>
                <button
                    onClick={() => setShowAllGallery(true)}
                    className="px-5 py-3 rounded-full border border-silk-900 dark:border-silk-100 text-silk-900 dark:text-silk-100 text-[10px] md:text-xs uppercase tracking-widest hover:bg-silk-900 hover:text-silk-50 dark:hover:bg-silk-100 dark:hover:text-silk-900 transition-all duration-300 flex items-center gap-1"
                >
                    Show All <ArrowRight className="w-3 h-3" />
                </button>

                <button
                    onClick={() => navigate('/custom-order')}
                    className={`text-xs uppercase tracking-widest font-medium text-silk-600 dark:text-silk-400 hover:text-silk-900 dark:hover:text-white flex items-center gap-1 transition-colors ${isHomePage ? '' : 'ml-auto'}`}
                >
                    Start blank request <ArrowRight className="w-3 h-3" />
                </button>
            </div>

            {/* Reusable Gallery Picker */}
            <GalleryPicker
                isOpen={showAllGallery}
                onClose={() => setShowAllGallery(false)}
                onSelect={handleGallerySelect}
                title="Gallery"
                subtitle=""
            />
        </div>
    );
};

export default DiscoverIdeas;
