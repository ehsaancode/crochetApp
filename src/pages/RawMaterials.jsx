import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Filter, X, Search, Heart } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import Loading from '../components/Loading';
import QToast from './uiComponents/QToast';

import SEO from '../components/SEO';

function RawMaterials() {
    const { backendUrl, search, setSearch, showSearch, userData, addToWishlist, removeFromWishlist, token, navigate } = useContext(ShopContext);
    const [rawMaterials, setRawMaterials] = useState([]);
    const [filterMaterials, setFilterMaterials] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Filters
    const [type, setType] = useState([]);
    const [priceRange, setPriceRange] = useState(2000);
    const [color, setColor] = useState('');

    const [visibleMaterials, setVisibleMaterials] = useState(12);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const observerRef = useRef(null);

    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

    const fetchRawMaterials = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/raw-material/list');
            if (response.data.success) {
                setRawMaterials(response.data.rawMaterials);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchRawMaterials();
    }, []);

    // Debounce Search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(search);
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    const toggleType = (e) => {
        if (type.includes(e.target.value)) {
            setType(prev => prev.filter(item => item !== e.target.value))
        } else {
            setType(prev => [...prev, e.target.value])
        }
    }

    const applyFilter = () => {
        let materialsCopy = rawMaterials.slice();

        if (type.length > 0) {
            materialsCopy = materialsCopy.filter(item => type.includes(item.type));
        }

        if (priceRange) {
            materialsCopy = materialsCopy.filter(item => item.price <= priceRange);
        }

        if (debouncedSearchQuery) {
            materialsCopy = materialsCopy.filter(item => item.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()));
        }

        setFilterMaterials(materialsCopy);
    }

    useEffect(() => {
        applyFilter();
    }, [rawMaterials, debouncedSearchQuery]);

    const handleLoadMore = () => {
        setIsLoadingMore(true);
        setTimeout(() => {
            setVisibleMaterials(prev => prev + 12);
            setIsLoadingMore(false);
        }, 1500);
    };

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const first = entries[0];
            if (first.isIntersecting && visibleMaterials < filterMaterials.length && !isLoadingMore) {
                handleLoadMore();
            }
        });

        if (observerRef.current) observer.observe(observerRef.current);

        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current);
        };
    }, [visibleMaterials, filterMaterials.length, isLoadingMore]);

    const uniqueTypes = [...new Set(rawMaterials.map(m => m.type))];
    return (
        <div className="pt-28 pb-12 px-4 max-w-7xl mx-auto flex flex-col md:flex-row gap-8 min-h-screen">
            <SEO
                title="Raw Materials"
                description="Purchase high-quality crochet raw materials including yarns, hooks, and accessories directly from Aalaboo."
            />
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
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-black p-6 shadow-2xl transform transition-transform duration-300 ease-out md:sticky md:top-28 md:h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-silk-200 dark:scrollbar-thumb-gray-700 md:translate-x-0 md:shadow-none md:bg-transparent md:w-64 md:block ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
                            step="50"
                            value={priceRange}
                            onChange={(e) => setPriceRange(e.target.value)}
                            className="w-full accent-silk-900 dark:accent-white"
                        />
                        <div className="flex justify-between text-sm text-silk-600 dark:text-silk-400 mt-2">
                            <span>₹0</span>
                            <span>₹{priceRange}</span>
                        </div>
                    </div>

                    {/* Type Filter */}
                    <div>
                        <h4 className="font-medium mb-4 text-silk-900 dark:text-white">Material Type</h4>
                        <div className="space-y-2">
                            {uniqueTypes.map((t) => (
                                <label key={t} className="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" className="rounded border-silk-300 dark:border-silk-700 text-silk-900 focus:ring-silk-500 dark:bg-black" value={t} onChange={toggleType} checked={type.includes(t)} />
                                    <span className="text-silk-700 dark:text-silk-300">{t}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 hidden md:block">
                    <button
                        onClick={() => { applyFilter(); }}
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
                    <h2 className="font-serif text-3xl text-silk-900 dark:text-white">Raw Materials</h2>
                    <span className="text-silk-500 dark:text-silk-400 text-sm">{filterMaterials.length} items</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                    {filterMaterials.slice(0, visibleMaterials).map((item) => (
                        <Link to={`/raw-material/${item._id}`} key={item._id} className="group cursor-pointer">
                            <div className="h-full flex flex-col rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 relative border border-silk-200 dark:border-silk-blue-border/30 bg-silk-50 dark:bg-black">
                                <div className="relative z-10 aspect-square overflow-hidden bg-white dark:bg-gray-800">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (userData?.wishlist?.some(w => w.productId === item._id)) {
                                                removeFromWishlist(item._id);
                                            } else {
                                                addToWishlist(item);
                                            }
                                        }}
                                        className="absolute top-2 left-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 z-20"
                                    >
                                        <Heart
                                            className={`w-5 h-5 transition-colors duration-300 ${userData?.wishlist?.some(w => w.productId === item._id) ? 'fill-red-500 text-red-500' : 'text-silk-900 hover:fill-red-500 hover:text-red-500'}`}
                                            strokeWidth={1.5}
                                        />
                                    </button>
                                    <img src={item.image[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" loading="lazy" />
                                    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                                        {item.length}
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col flex-grow">
                                    <h4 className="font-serif text-lg mb-1 text-silk-900 dark:text-white truncate" title={item.name}>{item.name}</h4>
                                    <p className="text-xs text-silk-500 dark:text-silk-400 mb-2">{item.type} • {item.color}</p>
                                    <div className="mt-auto flex justify-between items-center">
                                        <p className="text-silk-900 dark:text-silk-200 font-medium">₹{item.price}</p>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (!token) {
                                                    QToast.error('Please login to buy products', { position: "top-center" });
                                                    navigate('/login');
                                                    return;
                                                }
                                                navigate('/place-order', { state: { product: item, quantity: 1, size: item.length || 'Standard', color: item.color || 'Standard' } });
                                            }}
                                            className="px-4 py-1.5 bg-silk-900 dark:bg-silk-100 text-white dark:text-black text-sm font-medium tracking-wide rounded-full hover:bg-silk-800 dark:hover:bg-white/90 transition-colors shadow-sm"
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden md:flex items-center justify-center bg-gradient-to-t from-black/80 to-transparent">
                                    {/* Placeholder for Add to Cart or View Details Interaction for Raw Materials if needed */}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {visibleMaterials < filterMaterials.length && (
                    <div ref={observerRef} className="mt-8">
                        <Loading className="h-40" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default RawMaterials;
