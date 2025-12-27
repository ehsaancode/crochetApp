import React, { useState, useContext } from 'react';
import DecryptedText from './pages/uiComponents/DecryptedText';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Heart, Home as HomeIcon, Store, User, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Home from './pages/Home';
import Collection from './pages/Collection';
import About from './pages/About';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import PlaceOrder from './pages/PlaceOrder';
import Orders from './pages/Orders';
import CustomOrder from './pages/CustomOrder';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import { ShopContext } from './context/ShopContext';
import QToast from './pages/uiComponents/QToast';
import ScrollToTop from './components/ScrollToTop';


// Global state to track animation status across navigation (resets on full reload)
let brandAnimationCompleted = false;

const phrases = ["Aalaboo"];

function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const { getCartCount, userData } = useContext(ShopContext);

    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(brandAnimationCompleted ? phrases.length - 1 : 0);
    const [brandText, setBrandText] = useState(brandAnimationCompleted ? phrases[phrases.length - 1] : phrases[0]);
    const [startDecryption, setStartDecryption] = useState(false);
    const [isGreeting, setIsGreeting] = useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => setStartDecryption(true), 5000);
        return () => clearTimeout(timer);
    }, []);

    // Track if we have already greeted the user in this session
    const hasGreetedRef = React.useRef(false);

    React.useEffect(() => {
        if (userData && userData.name) {
            const sessionGreeted = sessionStorage.getItem('userGreeted');
            if (!hasGreetedRef.current && !sessionGreeted) {
                // Trigger greeting animation
                setBrandText(`Hi, ${userData.name.split(' ')[0]}!`);
                setIsGreeting(true);
                setStartDecryption(true);
                hasGreetedRef.current = true;
                sessionStorage.setItem('userGreeted', 'true');

                // Revert back to brand name after 4 seconds
                const timer = setTimeout(() => {
                    setBrandText(phrases[0]);
                    setIsGreeting(false);
                }, 2500);
                return () => clearTimeout(timer);
            }
        }
    }, [userData]);

    const handleDecryptionComplete = React.useCallback(() => {
        if (!isGreeting && currentPhraseIndex < phrases.length - 1) {
            setTimeout(() => {
                setCurrentPhraseIndex(prev => prev + 1);
                setBrandText(phrases[currentPhraseIndex + 1]);
            }, 1000);
        } else if (!isGreeting) {
            brandAnimationCompleted = true;
        }
    }, [currentPhraseIndex, isGreeting]);

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
                        <Link to="/collection" onClick={() => { setIsMenuOpen(false); sessionStorage.removeItem('collectionScrollY'); sessionStorage.removeItem('collectionVisibleProducts'); }} className="font-serif text-3xl text-silk-900 dark:text-silk-50 hover:text-silk-600 transition-colors">Shop</Link>
                        <Link to="/about" onClick={() => setIsMenuOpen(false)} className="font-serif text-3xl text-silk-900 dark:text-silk-50 hover:text-silk-600 transition-colors">About</Link>

                        <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="font-serif text-3xl text-silk-900 dark:text-silk-50 hover:text-silk-600 transition-colors">Contact</Link>
                        <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="font-serif text-3xl text-silk-900 dark:text-silk-50 hover:text-silk-600 transition-colors">Orders</Link>
                        <Link to="/account" onClick={() => setIsMenuOpen(false)} className="font-serif text-3xl text-silk-900 dark:text-silk-50 hover:text-silk-600 transition-colors">Profile</Link>
                    </nav>

                    <div className="mt-auto border-t border-silk-200 dark:border-silk-800 pt-8 md:hidden">
                        <div className="flex justify-center space-x-8 mb-8">
                            <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="flex flex-col items-center text-silk-600 dark:text-silk-400 hover:text-silk-900 dark:hover:text-silk-50">
                                <Heart className="w-6 h-6 mb-2" strokeWidth={1.5} />
                                <span className="text-xs uppercase tracking-widest">Wishlist</span>
                            </Link>
                            <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="flex flex-col items-center text-silk-600 dark:text-silk-400 hover:text-silk-900 dark:hover:text-silk-50">
                                <ShoppingBag className="w-6 h-6 mb-2" strokeWidth={1.5} />
                                <span className="text-xs uppercase tracking-widest">Cart ({getCartCount()})</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <header className="fixed top-0 left-0 w-full bg-silk-50 dark:bg-[linear-gradient(105deg,var(--tw-gradient-stops))] dark:from-black dark:to-silk-blue-dark backdrop-blur-sm z-40 border-b border-silk-200 dark:border-silk-blue-border transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between relative">

                    <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="font-serif text-2xl tracking-tight text-silk-900 dark:text-white absolute left-1/2 -translate-x-1/2 group flex items-center justify-center gap-2">
                        <DecryptedText
                            text={brandText}
                            speed={100}
                            maxIterations={15}
                            characters="ILOVEYOU"
                            className="revealed"
                            parentClassName="font-serif text-2xl tracking-tight text-silk-900 dark:text-white whitespace-nowrap"
                            encryptedClassName="text-silk-900 dark:text-white"
                            animateOn={isGreeting ? "view" : (startDecryption ? (brandAnimationCompleted ? "hover" : "view") : "none")}
                            revealDirection="start"
                            onDecryptionComplete={handleDecryptionComplete}
                        />
                        <AnimatePresence>
                            {isGreeting && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                                    animate={{ opacity: 1, scale: 1, rotate: [0, 20, -10, 20, 0] }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    className="text-3xl pb-1.5"
                                >
                                    👋
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Link>
                    <nav className="flex items-center space-x-2 ml-auto">
                        <ThemeToggle />
                        <Link to="/wishlist" className="p-2 hover:bg-silk-100 dark:hover:bg-silk-blue-border rounded-full transition-colors duration-200 hidden sm:block">
                            <Heart className="w-5 h-5 text-silk-900 dark:text-white" strokeWidth={1.5} />
                        </Link>
                        <Link to="/cart" className="relative p-2 hover:bg-silk-100 dark:hover:bg-silk-blue-border rounded-full transition-colors duration-200 hidden sm:block">
                            <ShoppingBag className="w-5 h-5 text-silk-900 dark:text-white" strokeWidth={1.5} />
                            <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
                        </Link>
                        <button onClick={() => setIsMenuOpen(true)} className="p-2 hover:bg-silk-100 dark:hover:bg-silk-blue-border rounded-full transition-colors duration-200 hidden md:block">
                            <span className="sr-only">Menu</span>
                            <Menu className="w-6 h-6 text-silk-900 dark:text-white" strokeWidth={1.5} />
                        </button>
                    </nav>
                </div>
            </header>


            <div className="fixed bottom-0 left-0 right-0 bg-silk-50/90 dark:bg-silk-blue-dark/95 backdrop-blur-md border-t border-silk-200 dark:border-silk-blue-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 md:hidden px-4 py-3 flex justify-between items-center pb-5">
                {[
                    { path: '/', icon: HomeIcon, label: 'Home' },
                    { path: '/collection', icon: Store, label: 'Shop', onClick: () => { sessionStorage.removeItem('collectionScrollY'); sessionStorage.removeItem('collectionVisibleProducts'); } },
                    { path: '/cart', icon: ShoppingBag, label: 'Cart' },
                    { path: '/orders', icon: Package, label: 'Orders' },
                    { path: '/account', icon: User, label: 'Account', isProfile: true }
                ].map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={item.onClick}
                            className={`relative flex items-center justify-center p-2 rounded-full transition-colors duration-300 ${isActive ? 'text-silk-900 dark:text-white' : 'text-silk-500 dark:text-white/50 hover:text-silk-700 dark:hover:text-white'}`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="dock-active-bg"
                                    className="absolute inset-0 bg-silk-200 dark:bg-white/10 rounded-full"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <div className="relative z-10 flex items-center gap-2 px-2">
                                <item.icon className="w-5 h-5" strokeWidth={2} />
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.span
                                            initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                                            animate={{ width: "auto", opacity: 1, marginLeft: 4 }}
                                            exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="text-sm font-medium whitespace-nowrap overflow-hidden"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </>
    );
}




function App() {
    // State moved to ShopContext

    return (
        <ThemeProvider>
            <QToast />
            <ScrollToTop />
            <div className="min-h-screen bg-silk-100 dark:bg-black text-accent-dark dark:text-silk-50 font-sans selection:bg-silk-200 dark:selection:bg-silk-800 transition-colors duration-300">
                <Navigation />
                <main className="pb-24 md:pb-0">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/collection" element={<Collection />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/custom-order" element={<CustomOrder />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/account" element={<Login />} />
                        <Route path="/place-order" element={<PlaceOrder />} />
                        <Route path="/orders" element={<Orders />} />
                    </Routes>
                </main>
            </div>
        </ThemeProvider>
    );
}

export default App;
