import React, { useState } from 'react';
import { ShoppingBag, Heart, Mail, Phone, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import FadeContent from './uiComponents/FadeContent'
import DarkVeil from './uiComponents/DarkVeil';
import Carousel from './uiComponents/Carousel';
import ShinyText from './uiComponents/ShinyText';
import GridMotion from './uiComponents/GridMotion';
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useTheme } from '../context/ThemeContext';

function Home({ wishlist, toggleWishlist }) {
    const [visibleCount, setVisibleCount] = useState(16);
    const { theme } = useTheme();

    const showMore = () => {
        setVisibleCount(prev => prev + 16);
    };

    return (
        <>

            <section id="home" className="h-[85vh] flex items-center justify-center p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <DarkVeil darkMode={theme === 'dark'} />
                </div>
                <div className="absolute inset-0 opacity-20)] pointer-events-none"></div>
                <div className="relative z-10 animate-slide-up">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] mb-4 text-silk-600">Handmade Luxury</p>
                    <h2 className="font-serif text-5xl mb-6 text-silk-900 leading-tight">Artisan<br />Crochet</h2>
                    <Link to="/collection" onClick={() => sessionStorage.removeItem('collectionScrollY')}>
                        <FadeContent blur={true} duration={900} delay={300} easing="ease-out" initialOpacity={10}>
                            <RainbowButton>View Collection</RainbowButton>
                        </FadeContent>
                    </Link>

                </div>
            </section>

            <section id="shop" className="pt-16 px-6 max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-10">
                    <ShinyText
                        text="New Arrivals"
                        disabled={false}
                        speed={3}
                        className="font-serif text-3xl"
                        baseColor="#673c2e" // silk-900
                        shineColor="#c58a5b" // silk-500
                    />
                    <Link to="/collection" onClick={() => sessionStorage.removeItem('collectionScrollY')} className="text-xs uppercase tracking-widest border-b border-silk-900 pb-1 hover:text-silk-600 hover:border-silk-600 transition-colors">View All</Link>
                </div>

                <div className="mb-16">
                    <Carousel items={products.slice(0, 5)} />
                </div>
            </section>

            <div className="mb-16 h-[80vh] w-full overflow-hidden">
                <GridMotion items={products.map(product => product.img)} />
            </div>

            <section className="pb-16 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    {products.slice(0, visibleCount).map((item, index) => (
                        <Link to={`/product/${item.id}`} key={item.id} className="group cursor-pointer" style={{ animationDelay: `${index * 50}ms` }}>
                            <div className="relative aspect-[4/5] bg-silk-200 mb-6 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-500">
                                {item.tag && (
                                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-wider font-medium z-10">
                                        {item.tag}
                                    </span>
                                )}
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

                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-serif text-xl mb-1 group-hover:text-silk-700 transition-colors">{item.name}</h4>
                                    <p className="text-sm text-silk-500">Natural Cotton</p>
                                </div>
                                <p className="text-lg font-medium text-silk-900">₹{item.price.toFixed(2)}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {visibleCount < products.length && (
                    <div className="text-center mt-16">
                        <button
                            onClick={showMore}
                            className="inline-block border border-silk-900 text-silk-900 px-10 py-3 rounded-full text-xs uppercase tracking-widest hover:bg-silk-900 hover:text-white transition-all duration-300"
                        >
                            Show More
                        </button>
                    </div>
                )}
            </section>

            <footer className="bg-silk-900 text-silk-100 py-12 px-6 hidden md:block">
                <div className="max-w-md mx-auto text-center">
                    <h4 className="font-serif text-2xl mb-6">Crochet & Co.</h4>
                    <div className="flex justify-center space-x-6 mb-8">
                        <a href="#" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
                        <a href="#" className="hover:text-white transition-colors"><Mail className="w-5 h-5" /></a>
                    </div>
                    <p className="text-xs text-silk-400 uppercase tracking-widest">© 2025 Crochet & Co.</p>
                </div>
            </footer>
        </>
    );
}

export default Home;
