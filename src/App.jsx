import React, { useState } from 'react';
import DecryptedText from './pages/uiComponents/DecryptedText';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Heart, Home as HomeIcon, Store, User } from 'lucide-react';
import Home from './pages/Home';
import Collection from './pages/Collection';
import About from './pages/About';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';

// Global state to track animation status across navigation (resets on full reload)
let brandAnimationCompleted = false;

const phrases = ["Aalaboo"];

function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(brandAnimationCompleted ? phrases.length - 1 : 0);
    const [brandText, setBrandText] = useState(brandAnimationCompleted ? phrases[phrases.length - 1] : phrases[0]);

    const handleDecryptionComplete = React.useCallback(() => {
        if (currentPhraseIndex < phrases.length - 1) {
            setTimeout(() => {
                setCurrentPhraseIndex(prev => prev + 1);
                setBrandText(phrases[currentPhraseIndex + 1]);
            }, 1000);
        } else {
            brandAnimationCompleted = true;
        }
    }, [currentPhraseIndex]);

    return (
        <>
            {/* Navigation Overlay */}
            <div className={`fixed inset-0 bg-silk-900/20 backdrop-blur-sm z-50 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)}></div>

            <div className={`fixed top-0 right-0 h-full w-[80%] max-w-sm bg-silk-50 dark:bg-silk-900 z-50 shadow-2xl transform transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 flex flex-col h-full">
                    <div className="flex justify-end mb-8">
                        <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-silk-100 dark:hover:bg-silk-800 rounded-full transition-colors">
                            <X className="w-6 h-6 text-silk-900 dark:text-silk-50" strokeWidth={1.5} />
                        </button>
                    </div>

                    <nav className="flex flex-col space-y-6 text-center">
                        <Link to="/" onClick={() => setIsMenuOpen(false)} className="font-serif text-3xl text-silk-900 dark:text-silk-50 hover:text-silk-600 transition-colors">Home</Link>
                        <Link to="/collection" onClick={() => { setIsMenuOpen(false); sessionStorage.removeItem('collectionScrollY'); }} className="font-serif text-3xl text-silk-900 dark:text-silk-50 hover:text-silk-600 transition-colors">Shop</Link>
                        <Link to="/about" onClick={() => setIsMenuOpen(false)} className="font-serif text-3xl text-silk-900 dark:text-silk-50 hover:text-silk-600 transition-colors">About</Link>
                        <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="font-serif text-3xl text-silk-900 dark:text-silk-50 hover:text-silk-600 transition-colors">Contact</Link>
                    </nav>

                    <div className="mt-auto border-t border-silk-200 dark:border-silk-800 pt-8 md:hidden">
                        <div className="flex justify-center space-x-8 mb-8">
                            <a href="#" className="flex flex-col items-center text-silk-600 dark:text-silk-400 hover:text-silk-900 dark:hover:text-silk-50">
                                <Heart className="w-6 h-6 mb-2" strokeWidth={1.5} />
                                <span className="text-xs uppercase tracking-widest">Wishlist</span>
                            </a>
                            <a href="#" className="flex flex-col items-center text-silk-600 dark:text-silk-400 hover:text-silk-900 dark:hover:text-silk-50">
                                <ShoppingBag className="w-6 h-6 mb-2" strokeWidth={1.5} />
                                <span className="text-xs uppercase tracking-widest">Cart (0)</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <header className="fixed w-full bg-silk-50 dark:bg-[linear-gradient(105deg,var(--tw-gradient-stops))] dark:from-black dark:to-silk-blue-dark backdrop-blur-sm z-40 border-b border-silk-200 dark:border-silk-blue-border transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between relative">

                    <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="font-serif text-2xl tracking-tight text-silk-900 dark:text-white absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
                        <DecryptedText
                            text={brandText}
                            speed={100}
                            maxIterations={15}
                            characters="ILOVEYOU"
                            className="revealed"
                            parentClassName="font-serif text-2xl tracking-tight text-silk-900 dark:text-white whitespace-nowrap"
                            encryptedClassName="text-silk-900 dark:text-white"
                            animateOn={brandAnimationCompleted ? "hover" : "view"}
                            revealDirection="start"
                            onDecryptionComplete={handleDecryptionComplete}
                        />
                    </Link>
                    <nav className="flex items-center space-x-2 ml-auto md:ml-0">
                        <ThemeToggle />
                        <button className="p-2 hover:bg-silk-100 dark:hover:bg-silk-blue-border rounded-full transition-colors duration-200 hidden sm:block">
                            <Heart className="w-5 h-5 text-silk-900 dark:text-white" strokeWidth={1.5} />
                        </button>
                        <button className="p-2 hover:bg-silk-100 dark:hover:bg-silk-blue-border rounded-full transition-colors duration-200 hidden sm:block">
                            <ShoppingBag className="w-5 h-5 text-silk-900 dark:text-white" strokeWidth={1.5} />
                        </button>
                        <button onClick={() => setIsMenuOpen(true)} className="p-2 hover:bg-silk-100 dark:hover:bg-silk-blue-border rounded-full transition-colors duration-200 hidden md:block">
                            <span className="sr-only">Menu</span>
                            <Menu className="w-6 h-6 text-silk-900 dark:text-white" strokeWidth={1.5} />
                        </button>
                    </nav>
                </div>
            </header>

            <div className="fixed bottom-0 left-0 right-0 bg-silk-50 dark:bg-[linear-gradient(105deg,var(--tw-gradient-stops))] dark:from-black dark:to-silk-blue-dark border-t border-silk-200 dark:border-silk-blue-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 md:hidden flex justify-around items-center py-4 pb-6 px-2">
                <Link to="/" className={`flex flex-col items-center transition-colors p-1 ${location.pathname === '/' ? 'text-silk-600 dark:text-silk-blue-light' : 'text-silk-900 dark:text-white hover:text-silk-600'}`}>
                    <HomeIcon className="w-6 h-6" strokeWidth={1.5} />
                    <span className="sr-only">Home</span>
                </Link>
                <Link to="/collection" onClick={() => sessionStorage.removeItem('collectionScrollY')} className={`flex flex-col items-center transition-colors p-1 ${location.pathname === '/collection' ? 'text-silk-600 dark:text-silk-blue-light' : 'text-silk-900 dark:text-white hover:text-silk-600'}`}>
                    <Store className="w-6 h-6" strokeWidth={1.5} />
                    <span className="sr-only">All Products</span>
                </Link>
                <button className="flex flex-col items-center text-silk-900 dark:text-white hover:text-silk-600 transition-colors p-1">
                    <ShoppingBag className="w-6 h-6" strokeWidth={1.5} />
                    <span className="sr-only">Cart</span>
                </button>
                <button className="flex flex-col items-center text-silk-900 dark:text-white hover:text-silk-600 transition-colors p-1">
                    <Heart className="w-6 h-6" strokeWidth={1.5} />
                    <span className="sr-only">Wishlist</span>
                </button>
                <Link to="/account" className={`flex flex-col items-center transition-colors p-1 ${location.pathname === '/account' ? 'text-silk-600 dark:text-silk-blue-light' : 'text-silk-900 dark:text-white hover:text-silk-600'}`}>
                    <User className="w-6 h-6" strokeWidth={1.5} />
                    <span className="sr-only">Account</span>
                </Link>
            </div>
        </>
    );
}

function App() {
    const [wishlist, setWishlist] = useState([]);

    const toggleWishlist = (e, productId) => {
        e.preventDefault();
        e.stopPropagation();
        setWishlist(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    return (
        <ThemeProvider>
            <Router>
                <div className="min-h-screen bg-silk-100 dark:bg-black text-accent-dark dark:text-silk-50 font-sans selection:bg-silk-200 dark:selection:bg-silk-800 transition-colors duration-300">
                    <Navigation />
                    <main className="pb-24 md:pb-0">
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
        </ThemeProvider>
    );
}

export default App;
