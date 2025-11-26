import React, { useState } from 'react'; // Force rebuild
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Heart } from 'lucide-react';
import Home from './pages/Home';
import Collection from './pages/Collection';
import About from './pages/About';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';

// Navigation Component to handle location-based logic if needed
function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    return (
        <>
            {/* Navigation Overlay */}
            <div className={`fixed inset-0 bg-silk-900/20 backdrop-blur-sm z-50 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)}></div>

            <div className={`fixed top-0 right-0 h-full w-[80%] max-w-sm bg-silk-50 z-50 shadow-2xl transform transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 flex flex-col h-full">
                    <div className="flex justify-end mb-8">
                        <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-silk-100 rounded-full transition-colors">
                            <X className="w-6 h-6 text-silk-900" strokeWidth={1.5} />
                        </button>
                    </div>

                    <nav className="flex flex-col space-y-6 text-center">
                        <Link to="/" onClick={() => setIsMenuOpen(false)} className="font-serif text-3xl text-silk-900 hover:text-silk-600 transition-colors">Home</Link>
                        <Link to="/collection" onClick={() => { setIsMenuOpen(false); sessionStorage.removeItem('collectionScrollY'); }} className="font-serif text-3xl text-silk-900 hover:text-silk-600 transition-colors">Shop</Link>
                        <Link to="/about" onClick={() => setIsMenuOpen(false)} className="font-serif text-3xl text-silk-900 hover:text-silk-600 transition-colors">About</Link>
                        <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="font-serif text-3xl text-silk-900 hover:text-silk-600 transition-colors">Contact</Link>
                    </nav>

                    <div className="mt-auto border-t border-silk-200 pt-8 md:hidden">
                        <div className="flex justify-center space-x-8 mb-8">
                            <a href="#" className="flex flex-col items-center text-silk-600 hover:text-silk-900">
                                <Heart className="w-6 h-6 mb-2" strokeWidth={1.5} />
                                <span className="text-xs uppercase tracking-widest">Wishlist</span>
                            </a>
                            <a href="#" className="flex flex-col items-center text-silk-600 hover:text-silk-900">
                                <ShoppingBag className="w-6 h-6 mb-2" strokeWidth={1.5} />
                                <span className="text-xs uppercase tracking-widest">Cart (0)</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <header className="fixed w-full bg-silk-50/90 backdrop-blur-sm z-40 border-b border-silk-200 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="font-serif text-2xl tracking-tight text-silk-900">Aalaboo & Co.</Link>
                    <nav className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-silk-100 rounded-full transition-colors duration-200 hidden sm:block">
                            <Heart className="w-5 h-5 text-silk-900" strokeWidth={1.5} />
                        </button>
                        <button className="p-2 hover:bg-silk-100 rounded-full transition-colors duration-200 hidden sm:block">
                            <ShoppingBag className="w-5 h-5 text-silk-900" strokeWidth={1.5} />
                        </button>
                        <button onClick={() => setIsMenuOpen(true)} className="p-2 hover:bg-silk-100 rounded-full transition-colors duration-200">
                            <span className="sr-only">Menu</span>
                            <Menu className="w-6 h-6 text-silk-900" strokeWidth={1.5} />
                        </button>
                    </nav>
                </div>
            </header>
        </>
    );
}

function App() {
    const [wishlist, setWishlist] = useState([]);

    const toggleWishlist = (e, productId) => {
        e.preventDefault(); // Prevent navigation if inside a Link
        e.stopPropagation();
        setWishlist(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    return (
        <Router>
            <div className="min-h-screen bg-silk-50 text-accent-dark font-sans selection:bg-silk-200">
                <Navigation />
                <main>
                    <Routes>
                        <Route path="/" element={<Home wishlist={wishlist} toggleWishlist={toggleWishlist} />} />
                        <Route path="/collection" element={<Collection wishlist={wishlist} toggleWishlist={toggleWishlist} />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/product/:id" element={<ProductDetail wishlist={wishlist} toggleWishlist={toggleWishlist} />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
