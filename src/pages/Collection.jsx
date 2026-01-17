import React, { useState, useEffect, useContext, useRef } from 'react';
import { ShoppingBag, Filter, X, Star, Heart, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Loading from '../components/Loading';

function Collection() {
    const { products, userData, addToWishlist, removeFromWishlist, search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const isVideo = (url) => {
        if (!url) return false;
        return url.match(/\.(mp4|webm|ogg|mov|avi|mkv)($|\?)/i) || url.includes('/video/upload/');
    };

    const [category, setCategory] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [priceRange, setPriceRange] = useState(2000);
    const [isScrolled, setIsScrolled] = useState(false);
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const observerRef = useRef(null);
    const [filterProducts, setFilterProducts] = useState([]);

    // Initialize from storage if available
    const [visibleProducts, setVisibleProducts] = useState(() => {
        const saved = sessionStorage.getItem('collectionVisibleProducts');
        return saved ? parseInt(saved, 10) : 12;
    });

    // Debounce Search Query
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(search);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [search]);

    const toggleCategory = (e) => {
        if (category.includes(e.target.value)) {
            setCategory(prev => prev.filter(item => item !== e.target.value))
        }
        else {
            setCategory(prev => [...prev, e.target.value])
        }
    }

    const toggleSubCategory = (e) => {
        if (subCategory.includes(e.target.value)) {
            setSubCategory(prev => prev.filter(item => item !== e.target.value))
        }
        else {
            setSubCategory(prev => [...prev, e.target.value])
        }
    }

    const toggleReview = (rating) => {
        if (reviews.includes(rating)) {
            setReviews(prev => prev.filter(item => item !== rating));
        } else {
            setReviews(prev => [...prev, rating]);
        }
    }

    const handleLoadMore = () => {
        setIsLoadingMore(true);
        setTimeout(() => {
            setVisibleProducts(prev => prev + 12);
            setIsLoadingMore(false);
        }, 1500);
    };

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const first = entries[0];
            if (first.isIntersecting && visibleProducts < filterProducts.length && !isLoadingMore) {
                handleLoadMore();
            }
        });

        if (observerRef.current) observer.observe(observerRef.current);

        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current);
        };
    }, [visibleProducts, filterProducts.length, isLoadingMore]);

    const isInWishlist = (id) => userData?.wishlist?.some(item => item.productId === id);




    const applyFilter = () => {
        let productsCopy = products.slice();

        if (category.length > 0) {
            productsCopy = productsCopy.filter(item => category.includes(item.category));
        }

        if (subCategory.length > 0) {
            productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));
        }

        if (priceRange) {
            productsCopy = productsCopy.filter(item => {
                const price = item.defaultSize && item.sizePrices && item.sizePrices[item.defaultSize]
                    ? Number(item.sizePrices[item.defaultSize])
                    : (item.sizePrices && Object.values(item.sizePrices).length > 0 ? Number(Object.values(item.sizePrices)[0]) : 0);
                return price <= priceRange;
            });
        }

        if (debouncedSearchQuery) {
            productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()));
        }

        if (reviews.length > 0) {
            const minRating = Math.min(...reviews);
            productsCopy = productsCopy.filter(item => (item.rating || 0) >= minRating);
        }

        setFilterProducts(productsCopy)
    }

    // Effect to apply filters whenever dependencies change
    useEffect(() => {
        applyFilter();
    }, [products, debouncedSearchQuery])


    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        setVisibleProducts(12);
    }, [products]);


    // Extract unique categories and subcategories for the UI
    const availableCategories = [...new Set(products.map(p => p.category))].filter(c => c && c !== "Not applicable");
    const availableSubCategories = [...new Set(products.map(p => p.subCategory))].filter(Boolean);

    const handleWishlistToggle = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        if (isInWishlist(product._id)) {
            removeFromWishlist(product._id);
        } else {
            addToWishlist(product);
        }
    };

    const hasRestoredScroll = useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Restore scroll position after products are loaded
    useEffect(() => {
        if (!hasRestoredScroll.current && filterProducts.length > 0) {
            const savedScrollY = sessionStorage.getItem('collectionScrollY');
            if (savedScrollY) {
                // Small timeout to ensure DOM is ready
                setTimeout(() => {
                    window.scrollTo(0, parseInt(savedScrollY, 10));
                }, 100);
            }
            hasRestoredScroll.current = true;
        }
    }, [filterProducts]);

    const saveScrollPosition = () => {
        sessionStorage.setItem('collectionScrollY', window.scrollY.toString());
        sessionStorage.setItem('collectionVisibleProducts', visibleProducts.toString());
    };

    return (
        <div className="pt-20 pb-12 px-4 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
            {/* Mobile Filter Toggle */}
            {/* Mobile Filter Toggle */}
            <div className="md:hidden sticky top-24 z-40 flex mb-4 transition-all duration-700 ease-in-out w-full justify-start">
                <button
                    onClick={() => setIsFilterOpen(true)}
                    className={`flex items-center justify-center text-silk-900 dark:text-white font-medium shadow-lg overflow-hidden transition-all duration-700 ease-in-out ${isScrolled
                        ? 'w-32 py-2 rounded-full bg-silk-100/50 dark:bg-black/50 backdrop-blur-md hover:bg-silk-200/50 dark:hover:bg-gray-900/50 space-x-2'
                        : 'w-full py-3 rounded-full bg-silk-100/90 dark:bg-gray-900/80 backdrop-blur-sm hover:bg-silk-200 dark:hover:bg-gray-800 space-x-2'
                        }`}
                >
                    <Filter className="w-5 h-5" />
                    <span>Filters</span>
                </button>
            </div>

            {/* Sidebar Filters */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-black p-6 shadow-2xl transform transition-transform duration-300 ease-out md:sticky md:top-24 md:h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-silk-200 dark:scrollbar-thumb-gray-700 md:translate-x-0 md:shadow-none md:bg-transparent md:w-64 md:block ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex justify-between items-center mb-4 md:hidden">
                    <h3 className="font-serif text-xl dark:text-white">Filters</h3>
                    <button onClick={() => setIsFilterOpen(false)} className="dark:text-white"><X className="w-6 h-6" /></button>
                </div>

                <div className="sticky top-[-1.5rem] -mx-6 px-6 py-3 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-900 md:hidden mb-6 shadow-sm">
                    <button
                        onClick={() => { applyFilter(); setIsFilterOpen(false); }}
                        className="w-full py-2 bg-silk-900 dark:bg-silk-100 text-white dark:text-black font-medium text-sm rounded-full hover:bg-silk-800 dark:hover:bg-white transition-all shadow-md active:scale-95"
                    >
                        Apply Filters
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Price Filter */}
                    <div>
                        <h4 className="font-medium mb-4 text-silk-900 dark:text-white">Price Range</h4>
                        <input
                            type="range"
                            min="0"
                            max="5000"
                            step="20"
                            value={priceRange}
                            onChange={(e) => setPriceRange(e.target.value)}
                            className="w-full accent-silk-900 dark:accent-white"
                        />
                        <div className="flex justify-between text-sm text-silk-600 dark:text-silk-400 mt-2">
                            <span>₹0</span>
                            <span>₹{priceRange}</span>
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div>
                        <h4 className="font-medium mb-4 text-silk-900 dark:text-white">Category</h4>
                        <div className="space-y-2">
                            {availableCategories.map((cat) => (
                                <label key={cat} className="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" className="rounded border-silk-300 dark:border-silk-700 text-silk-900 focus:ring-silk-500 dark:bg-black" value={cat} onChange={toggleCategory} checked={category.includes(cat)} />
                                    <span className="text-silk-700 dark:text-silk-300">{cat}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* SubCategory Filter */}
                    <div>
                        <h4 className="font-medium mb-4 text-silk-900 dark:text-white">Type</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-silk-200 dark:scrollbar-thumb-gray-700">
                            {availableSubCategories.map((sub) => (
                                <label key={sub} className="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" className="rounded border-silk-300 dark:border-silk-700 text-silk-900 focus:ring-silk-500 dark:bg-black" value={sub} onChange={toggleSubCategory} checked={subCategory.includes(sub)} />
                                    <span className="text-silk-700 dark:text-silk-300">{sub}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Review Filter */}
                    <div>
                        <h4 className="font-medium mb-4 text-silk-900 dark:text-white">Reviews</h4>
                        <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((star) => (
                                <label key={star} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="rounded border-silk-300 dark:border-silk-700 text-silk-900 focus:ring-silk-500 dark:bg-black"
                                        checked={reviews.includes(star)}
                                        onChange={() => toggleReview(star)}
                                    />
                                    <div className="flex text-silk-500 dark:text-silk-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < star ? 'fill-current text-silk-500 dark:text-silk-400' : 'text-silk-200 dark:text-silk-800'}`} />
                                        ))}
                                    </div>
                                    <span className="text-xs text-silk-400 dark:text-silk-500">& Up</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 hidden md:block">
                    <button
                        onClick={() => { applyFilter(); setIsFilterOpen(false); }}
                        className="w-full px-4 py-2 bg-silk-900 dark:bg-silk-100 text-white dark:text-black font-medium rounded-lg hover:bg-silk-800 dark:hover:bg-white transition-colors shadow-sm"
                    >
                        Apply Filters
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile filter */}
            {isFilterOpen && (
                <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setIsFilterOpen(false)}></div>
            )}

            {/* Product Grid */}
            <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-serif text-3xl text-silk-900 dark:text-white">All Products</h2>
                    <span className="text-silk-500 dark:text-silk-400 text-sm">{filterProducts.length} items</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                    {filterProducts.slice(0, visibleProducts).map((item) => (

                        <Link to={`/product/${item._id}`} key={item._id} className="group cursor-pointer" onClick={saveScrollPosition}>
                            <div className="h-full flex flex-col rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 relative border border-silk-200 dark:border-silk-blue-border/30">
                                {/* Default Background */}
                                <div className="absolute inset-0 bg-silk-50 dark:bg-[linear-gradient(105deg,var(--tw-gradient-stops))] dark:from-black dark:to-silk-blue-dark transition-opacity duration-500"></div>

                                {/* Hover Background (Opposite Gradient) */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-silk-50 dark:bg-[linear-gradient(105deg,var(--tw-gradient-stops))] dark:from-silk-blue-dark dark:to-black"></div>

                                <div className="relative z-10 aspect-[3/4] overflow-hidden">
                                    <button
                                        onClick={(e) => handleWishlistToggle(e, item)}
                                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 z-10"
                                    >
                                        <Heart
                                            className={`w-5 h-5 transition-colors duration-300 ${isInWishlist(item._id) ? 'fill-red-500 text-red-500' : 'text-silk-900 hover:fill-red-500 hover:text-red-500'}`}
                                            strokeWidth={1.5}
                                        />
                                    </button>
                                    <div className="w-full h-full bg-silk-200 dark:bg-gray-900 group-hover:scale-105 transition-transform duration-700 ease-out">
                                        {isVideo(item.image[0]) ? (
                                            <video src={item.image[0]} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                                        ) : (
                                            <img src={item.image[0]} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                                        )}
                                    </div>
                                    <button className="hidden md:flex absolute bottom-4 right-4 w-10 h-10 bg-white text-silk-900 rounded-full items-center justify-center shadow-lg translate-y-14 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100 hover:bg-silk-900 hover:text-white">
                                        <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                                    </button>
                                </div>

                                <div className="relative z-10 p-4 flex flex-col flex-grow">
                                    <h4 className="font-serif text-lg mb-2 text-silk-900 dark:text-white group-hover:text-silk-600 dark:group-hover:text-silk-300 transition-colors truncate w-full" title={item.name}>{item.name}</h4>
                                    <div className="mt-auto flex justify-between items-center">
                                        <p className="text-silk-900 dark:text-silk-200 font-medium">₹{
                                            item.defaultSize && item.sizePrices && item.sizePrices[item.defaultSize]
                                                ? Number(item.sizePrices[item.defaultSize])
                                                : (item.sizePrices && Object.values(item.sizePrices).length > 0 ? Number(Object.values(item.sizePrices)[0]) : 'N/A')
                                        }</p>
                                        <div className="flex text-silk-400 dark:text-silk-500 items-center">
                                            <Star className="w-3 h-3 fill-current" />
                                            <span className="text-xs ml-1">{item.rating || 0}.0</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {visibleProducts < filterProducts.length && (
                    <div ref={observerRef} className="mt-8">
                        <Loading className="h-40" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Collection;
