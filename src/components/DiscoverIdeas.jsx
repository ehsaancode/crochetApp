import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, X } from 'lucide-react';
import axios from 'axios';

const DiscoverIdeas = ({ isHomePage }) => {
    const { backendUrl } = useContext(ShopContext);
    const navigate = useNavigate();
    const [gallery, setGallery] = useState([]);

    const [visibleCount, setVisibleCount] = useState(window.innerWidth > 768 ? 12 : 6);

    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const response = await axios.get(backendUrl + '/api/gallery/list');
                if (response.data.success) {
                    setGallery(response.data.images);
                }
            } catch (error) {
                console.error("Failed to load gallery ideas", error);
            }
        };
        fetchGallery();
    }, [backendUrl]);

    const handleIdeaClick = (image) => {
        // Navigate to Custom Order with the selected image
        navigate('/custom-order', { state: { initialImage: image } });
    };

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 6);
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
                    <h4 className={`font-serif text-lg text-silk-900 dark:text-silk-50 flex items-center gap-2 ${isHomePage ? 'justify-center text-3xl mb-2' : ''}`}>
                        <Sparkles className="w-4 h-4 text-silk-500" />
                        Ready to create something unique?
                    </h4>
                    <p className={`text-sm text-silk-600 dark:text-silk-400 ${isHomePage ? 'text-lg max-w-2xl mx-auto' : ''}`}>Discover ideas from our gallery to start your custom request.</p>
                </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {gallery.slice(0, visibleCount).map((item) => (
                    <div
                        key={item._id}
                        onClick={() => setSelectedImage(item.image)}
                        className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-gray-100 dark:bg-white/5"
                    >
                        <img
                            src={optimizeImageUrl(item.image, 500)}
                            loading="lazy"
                            alt="Idea"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                ))}
            </div>

            <div className={`mt-8 flex flex-col gap-4 ${isHomePage ? 'items-center sm:flex-row sm:justify-center' : 'items-end sm:flex-row sm:items-center justify-between'}`}>
                {visibleCount < gallery.length && (
                    <button
                        onClick={handleLoadMore}
                        className="text-xs uppercase tracking-widest font-medium text-silk-600 dark:text-silk-400 hover:text-silk-900 dark:hover:text-white flex items-center gap-1 transition-colors"
                    >
                        Load More <ArrowRight className="w-3 h-3" />
                    </button>
                )}

                <button
                    onClick={() => navigate('/custom-order')}
                    className={`text-xs uppercase tracking-widest font-medium text-silk-600 dark:text-silk-400 hover:text-silk-900 dark:hover:text-white flex items-center gap-1 transition-colors ${isHomePage ? '' : 'ml-auto'}`}
                >
                    Start blank request <ArrowRight className="w-3 h-3" />
                </button>
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 animate-fade-in backdrop-blur-sm"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-4xl w-full flex flex-col items-center gap-6" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-0 right-0 -mt-10 sm:-mr-10 sm:mt-0 text-white/70 hover:text-white transition-colors p-2"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <img
                            src={selectedImage}
                            alt="Full view"
                            className="max-h-[70vh] w-auto object-contain rounded-lg shadow-2xl"
                        />

                        <button
                            onClick={() => handleIdeaClick(selectedImage)}
                            className="bg-white text-black px-10 py-3 rounded-full font-serif uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                            Use This Design
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiscoverIdeas;
