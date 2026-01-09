import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Search, X } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SearchBar = () => {
    const { search, setSearch, setShowSearch, products } = useContext(ShopContext);
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [initialScroll] = useState(window.scrollY);

    // Close on scroll if empty
    useEffect(() => {
        const handleScroll = () => {
            if (search.trim() === '' && Math.abs(window.scrollY - initialScroll) > 20) {
                setShowSearch(false);
                // Also blur to hide keyboard on mobile
                if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [initialScroll, search, setShowSearch]);

    useEffect(() => {
        if (search.length > 0 && products) {
            const timer = setTimeout(() => {
                const lowerSearch = search.toLowerCase();
                const filtered = products.filter(product =>
                    product.name.toLowerCase().includes(lowerSearch) ||
                    product.category?.toLowerCase().includes(lowerSearch) ||
                    product.subCategory?.toLowerCase().includes(lowerSearch) ||
                    product.description?.toLowerCase().includes(lowerSearch)
                ).slice(0, 5);
                setResults(filtered);
            }, 500); // Debounce delay

            return () => clearTimeout(timer);
        } else {
            setResults([]);
        }
    }, [search, products]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            navigate('/collection');
            setShowSearch(false);
        }
    }

    const handleResultClick = (id) => {
        navigate(`/product/${id}`);
        setShowSearch(false);
        setSearch('');
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20, width: 0 }}
            animate={{ opacity: 1, x: 0, width: "auto" }}
            exit={{ opacity: 0, x: -20, width: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className='relative flex-1 ml-32 sm:ml-36 mr-4 max-w-2xl'
        >
            <div className='relative w-full bg-silk-50 dark:bg-white/10 border border-silk-200 dark:border-white/10 rounded-full flex items-center px-4 py-2'>
                <Search className='w-4 h-4 text-silk-500 dark:text-gray-400 mr-2 flex-shrink-0' />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className='flex-1 outline-none bg-transparent text-silk-900 dark:text-gray-200 placeholder:text-silk-400 dark:placeholder:text-gray-500 text-sm'
                    type="text"
                    placeholder='Search products...'
                    autoFocus
                />
                <X
                    onClick={() => { setShowSearch(false); setSearch(''); }}
                    className='w-4 h-4 cursor-pointer text-silk-400 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex-shrink-0 ml-2'
                />
            </div>

            {/* Live Search Results */}
            {results.length > 0 && (
                <div className="absolute top-full left-0 right-0 w-full bg-white dark:bg-zinc-950 mt-2 rounded-xl shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden max-h-[60vh] overflow-y-auto z-[100]">
                    {results.map((product) => (
                        <div
                            key={product._id}
                            onClick={() => handleResultClick(product._id)}
                            className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-zinc-900 cursor-pointer border-b border-gray-50 dark:border-zinc-900 last:border-none transition-colors"
                        >
                            <img src={product.image[0]} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-silk-900 dark:text-gray-200 truncate">{product.name}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">₹{product.price}</p>
                            </div>
                        </div>
                    ))}
                    <div
                        onClick={() => { navigate('/collection'); setShowSearch(false); }}
                        className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-silk-600 dark:text-silk-400 hover:bg-gray-50 dark:hover:bg-zinc-900 cursor-pointer"
                    >
                        View All {results.length} Results
                    </div>
                </div>
            )}
        </motion.div>
    )
}

export default SearchBar
