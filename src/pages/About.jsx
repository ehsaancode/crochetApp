import React from 'react';
import { Heart } from 'lucide-react';
import bgImage from '../assets/images/about_bg.png';

function About() {
    return (
        <div className="min-h-screen pt-16">
            {/* Hero Section */}
            <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img src={bgImage} alt="Artisan Crocheting" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-silk-900/30 backdrop-blur-[2px]"></div>
                </div>
                <div className="relative z-10 text-center text-white p-6 animate-slide-up">
                    <p className="text-xs font-medium uppercase tracking-[0.3em] mb-4 opacity-90">Est. 2025</p>
                    <h1 className="font-serif text-5xl md:text-7xl mb-6">The Art of<br />Slow Fashion</h1>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-6 py-24">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6 text-silk-800">
                        <h2 className="font-serif text-3xl text-silk-900">Weaving Stories,<br />One Stitch at a Time.</h2>
                        <p className="leading-relaxed text-silk-600">
                            Crochet & Co. was born from a simple desire: to slow down. In a world of fast fashion and instant gratification, we chose to take the long route. Our journey began in a small sunlit studio, where the rhythmic click of hooks and the soft touch of yarn became our meditation.
                        </p>
                        <p className="leading-relaxed text-silk-600">
                            We believe that luxury lies in the details—the slight irregularities that mark a human touch, the premium natural fibers that breathe with you, and the timeless designs that transcend seasons.
                        </p>
                    </div>
                    <div className="bg-silk-100 p-10 rounded-2xl text-center relative">
                        <div className="absolute top-0 left-0 w-full h-full border border-silk-200 rounded-2xl transform translate-x-4 translate-y-4 -z-10"></div>
                        <Heart className="w-12 h-12 text-silk-400 mx-auto mb-6" strokeWidth={1} />
                        <h3 className="font-serif text-xl mb-4 text-silk-900">Our Values</h3>
                        <ul className="space-y-4 text-sm uppercase tracking-widest text-silk-600">
                            <li>Sustainable Materials</li>
                            <li>Ethical Production</li>
                            <li>Artisan Craftsmanship</li>
                            <li>Timeless Design</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
