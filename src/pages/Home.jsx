import React from 'react';
import { Mail, Phone, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import FadeContent from './uiComponents/FadeContent'
import DarkVeil from './uiComponents/DarkVeil';
import Carousel from './uiComponents/Carousel';
import ShinyText from './uiComponents/ShinyText';
import GridMotion from './uiComponents/GridMotion';
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useTheme } from '../context/ThemeContext';
import Masonry from './uiComponents/Masonry';

const masonryItems = products.slice(0, 10).map((product, index) => ({
    id: product.id,
    img: product.img,
    name: product.name,
    url: `/product/${product.id}`,
    height: index % 3 === 0 ? 400 : index % 3 === 1 ? 300 : 500
}));

function Home() {
    const { theme } = useTheme();

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

            <section id="shop" className="pt-16 px-6 max-w-7xl mx-auto">
                <div className="w-full mb-32">
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
                    <Carousel items={products.slice(0, 5)} />
                </div>
            </section>

            <div className="mb-16 h-[80vh] w-full overflow-hidden">
                <GridMotion items={products.map(product => product.img)} />
            </div>



            <footer className="bg-silk-900 text-silk-100 py-12 px-6 hidden md:block">
                <div className="max-w-md mx-auto text-center">
                    <h4 className="font-serif text-2xl mb-6">Crochet & Co.</h4>
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
