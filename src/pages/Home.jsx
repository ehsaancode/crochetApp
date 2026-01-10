import React, { useContext, useEffect, useState } from 'react';
import { Mail, Phone, Instagram, Lock, Scissors, Globe, Banknote, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext'; // Added context
import FadeContent from './uiComponents/FadeContent'
import DarkVeil from './uiComponents/DarkVeil';
import Carousel from './uiComponents/Carousel';
import ShinyText from './uiComponents/ShinyText';
import GridMotion from './uiComponents/GridMotion';
import FestiveCard from '../components/FestiveCard';
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useTheme } from '../context/ThemeContext';
import Masonry from './uiComponents/Masonry';
import DiscoverIdeas from '../components/DiscoverIdeas';


function Home() {
    const { theme } = useTheme();
    const { products } = useContext(ShopContext);
    const [masonryItems, setMasonryItems] = useState([]);

    useEffect(() => {
        if (products.length > 0) {
            const items = products.slice(0, 12).map((product, index) => ({
                id: product._id,
                img: product.image[0],
                name: product.name,
                url: `/product/${product._id}`,
                height: index % 4 === 1 ? 400 : index % 3 === 2 ? 300 : 300
            }));
            setMasonryItems(items);
        }
    }, [products]);

    return (
        <>

            <section id="home" className="h-[85vh] flex items-center justify-center p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <DarkVeil darkMode={theme === 'dark'} />
                </div>
                <div className="absolute inset-0 opacity-20)] pointer-events-none"></div>
                <div className="relative z-10 animate-slide-up">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] mb-4 text-silk-600 dark:text-white">Handmade Luxury</p>
                    <h2 className="font-serif text-5xl mb-6 text-silk-900 dark:text-silk-200 leading-tight">Artisan<br />Crochet</h2>
                    <Link to="/collection" onClick={() => sessionStorage.removeItem('collectionScrollY')}>
                        <FadeContent blur={true} duration={900} delay={300} easing="ease-out" initialOpacity={10}>
                            <RainbowButton>View Collection</RainbowButton>
                        </FadeContent>
                    </Link>

                </div>
            </section>

            <section id="shop" className="pt-32 px-6 max-w-7xl mx-auto">
                <div className="w-full mb-48">
                    <Masonry
                        items={masonryItems}
                        ease="power3.out"
                        duration={0.6}
                        stagger={0.05}
                        animateFrom="bottom"
                        scaleOnHover={true}
                        hoverScale={0.95}
                        blurToFocus={true}
                        colorShiftOnHover={false}
                    />
                </div>

                <FestiveCard />

                <div className="flex items-end justify-between mb-10">
                    <ShinyText
                        text="New Arrivals"
                        disabled={false}
                        speed={3}
                        className="font-serif text-3xl"
                        baseColor={theme === 'dark' ? '#ece0cc' : '#673c2e'} // silk-200 : silk-900
                        shineColor={theme === 'dark' ? '#add9e6' : '#c58a5b'} // silk-blue-light : silk-500
                    />
                    <Link to="/collection" onClick={() => sessionStorage.removeItem('collectionScrollY')} className="text-xs uppercase tracking-widest border-b border-silk-900 pb-1 hover:text-silk-600 hover:border-silk-600 transition-colors">View All</Link>
                </div>

                <div className="mb-16">
                    <Carousel items={products.slice(0, 5).map(p => ({ ...p, img: p.image[0], id: p._id }))} />
                </div>

                <div className="text-center py-32 px-6 md:px-32 my-24 rounded-3xl bg-gradient-to-b from-transparent to-silk-200 dark:from-black dark:to-[#170D27]">
                    <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
                        <h3 className="font-serif text-3xl md:text-5xl text-silk-900 dark:text-silk-100 mb-4 leading-tight">
                            Have a design in mind?
                        </h3>
                        <p className="text-silk-600 dark:text-silk-300 text-lg md:text-xl font-light mb-8 max-w-2xl mx-auto">
                            Upload an image and we’ll crochet it just for you
                        </p>
                        <Link to="/custom-order">
                            <button className="bg-silk-900 dark:bg-silk-100 text-white dark:text-black text-sm h-10 px-6 rounded-xl font-medium transition-all hover:bg-silk-800 dark:hover:bg-white shadow-md hover:shadow-lg">
                                Upload an image
                            </button>
                        </Link>
                    </FadeContent>
                </div>

                <div className="mb-24">
                    <DiscoverIdeas isHomePage={true} />
                </div>
            </section>

            <div className="mb-32 h-[80vh] w-full overflow-hidden bg-silk-50 dark:bg-black">
                <GridMotion items={products.slice(0, 12).map(product => product.image[0])} />
            </div>

            <section className="text-center py-48 px-8 md:px-32 bg-gradient-to-b from-transparent to-silk-200 dark:from-black dark:to-[#170D27] max-w-7xl mx-6 md:mx-auto rounded-3xl">
                <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
                    <h3 className="font-serif text-4xl md:text-6xl mb-6 relative z-10 bg-gradient-to-r from-silk-900 to-silk-600 dark:from-white dark:to-silk-300 bg-clip-text text-transparent">
                        No machines. <br className="hidden md:block" /> No mass production.
                    </h3>
                    <div className="w-16 h-0.5 bg-silk-400/50 dark:bg-white/20 mx-auto mb-6"></div>
                    <p className="text-silk-600 dark:text-silk-400 text-sm md:text-base tracking-[0.2em] uppercase font-medium max-w-xl mx-auto relative z-10">
                        Every piece is hand-crocheted by skilled artisans
                    </p>
                </FadeContent>
            </section>



            <section className="py-6 px-0 md:px-6 bg-transparent dark:bg-black/20 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col items-center justify-center gap-3 px-4 md:px-0">

                        <div className="flex flex-row justify-center items-center gap-6 md:gap-16 w-full">
                            {[
                                { title: 'Secure', icon: Lock },
                                { title: 'Handmade', icon: Scissors },
                                { title: 'COD', icon: Banknote }
                            ].map((feature, idx) => (
                                <div key={idx} className="flex flex-row items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity duration-300">
                                    <feature.icon className="w-3 h-3 md:w-4 md:h-4 text-silk-600 dark:text-silk-400" strokeWidth={1.5} />
                                    <span className="text-[9px] md:text-xs uppercase tracking-widest font-medium text-silk-600 dark:text-silk-400 whitespace-nowrap">
                                        {feature.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-row items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity duration-300">
                            <Globe className="w-3 h-3 md:w-4 md:h-4 text-silk-600 dark:text-silk-400" strokeWidth={1.5} />
                            <span className="text-[9px] md:text-xs uppercase tracking-widest font-medium text-silk-600 dark:text-silk-400 whitespace-nowrap flex items-center gap-1">
                                Crafted in India with <Heart className="w-2.5 h-2.5 md:w-3 md:h-3 text-red-500 fill-red-500" strokeWidth={0} />
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="bg-silk-900 text-silk-100 py-12 px-6 hidden md:block">
                <div className="max-w-md mx-auto text-center">
                    <h4 className="font-serif text-2xl mb-6">Aalaboo</h4>
                    <div className="flex justify-center space-x-6 mb-8">
                        <a href="#" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
                        <a href="#" className="hover:text-white transition-colors"><Mail className="w-5 h-5" /></a>
                    </div>
                    <p className="text-xs text-silk-400 uppercase tracking-widest">© 2025 Aalaboo.</p>
                </div>
            </footer>
        </>
    );
}

export default Home;
