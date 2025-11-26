import React, { useState, useEffect } from 'react';
import { ShoppingBag, Filter, X, Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

import { products } from '../data/products';

function Collection({ wishlist, toggleWishlist }) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [priceRange, setPriceRange] = useState(300);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="pt-20 pb-12 px-4 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
            {/* Mobile Filter Toggle */}
            <button
                onClick={() => setIsFilterOpen(true)}
                className={`md:hidden sticky top-24 z-40 flex items-center space-x-2 text-silk-900 font-medium shadow-lg mb-4 transition-all duration-700 ease-in-out ${isScrolled
                    ? 'self-start w-auto px-6 py-2 rounded-full bg-silk-100/60 backdrop-blur-md hover:bg-silk-200/60'
                    : 'w-full justify-center p-3 rounded-lg bg-silk-100/90 backdrop-blur-sm hover:bg-silk-200'
                    }`}
            >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
            </button>

            {/* Sidebar Filters */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white p-6 shadow-2xl transform transition-transform duration-300 ease-out md:sticky md:top-24 md:h-fit md:translate-x-0 md:shadow-none md:bg-transparent md:w-64 md:block ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex justify-between items-center mb-8 md:hidden">
                    <h3 className="font-serif text-xl">Filters</h3>
                    <button onClick={() => setIsFilterOpen(false)}><X className="w-6 h-6" /></button>
                </div>

                <div className="space-y-8">
                    {/* Price Filter */}
                    <div>
                        <h4 className="font-medium mb-4 text-silk-900">Price Range</h4>
                        <input
                            type="range"
                            min="0"
                            max="300"
                            value={priceRange}
                            onChange={(e) => setPriceRange(e.target.value)}
                            className="w-full accent-silk-900"
                        />
                        <div className="flex justify-between text-sm text-silk-600 mt-2">
                            <span>$0</span>
                            <span>${priceRange}</span>
                        </div>
                    </div>

                    {/* Product Type Filter */}
                    <div>
                        <h4 className="font-medium mb-4 text-silk-900">Product Type</h4>
                        <div className="space-y-2">
                            {['Dress', 'Top', 'Accessory', 'Set'].map((type) => (
                                <label key={type} className="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" className="rounded border-silk-300 text-silk-900 focus:ring-silk-500" />
                                    <span className="text-silk-700">{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Review Filter */}
                    <div>
                        <h4 className="font-medium mb-4 text-silk-900">Reviews</h4>
                        <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((star) => (
                                <label key={star} className="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" className="rounded border-silk-300 text-silk-900 focus:ring-silk-500" />
                                    <div className="flex text-silk-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < star ? 'fill-current text-silk-500' : 'text-silk-200'}`} />
                                        ))}
                                    </div>
                                    <span className="text-xs text-silk-400">& Up</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile filter */}
            {isFilterOpen && (
                <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setIsFilterOpen(false)}></div>
            )}

            {/* Product Grid */}
            <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-serif text-3xl text-silk-900">All Products</h2>
                    <span className="text-silk-500 text-sm">{products.length} items</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((item) => (
                        <Link to={`/product/${item.id}`} key={item.id} className="group cursor-pointer">
                            <div className="relative aspect-[3/4] bg-silk-200 mb-4 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-500">
                                <button
                                    onClick={(e) => toggleWishlist(e, item.id)}
                                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 z-10"
                                >
                                    <Heart
                                        className={`w-5 h-5 transition-colors duration-300 ${wishlist.includes(item.id) ? 'fill-red-500 text-red-500' : 'text-silk-900 hover:fill-red-500 hover:text-red-500'}`}
                                        strokeWidth={1.5}
                                    />
                                </button>
                                <div className="w-full h-full bg-silk-300 group-hover:scale-105 transition-transform duration-700 ease-out overflow-hidden">
                                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <button className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg translate-y-14 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100 hover:bg-silk-900 hover:text-white">
                                    <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                                </button>
                            </div>

                            <div>
                                <h4 className="font-serif text-lg mb-1 group-hover:text-silk-700 transition-colors">{item.name}</h4>
                                <div className="flex justify-between items-center">
                                    <p className="text-silk-900 font-medium">${item.price.toFixed(2)}</p>
                                    <div className="flex text-silk-400">
                                        <Star className="w-3 h-3 fill-current" />
                                        <span className="text-xs ml-1">{item.rating}.0</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Collection;
