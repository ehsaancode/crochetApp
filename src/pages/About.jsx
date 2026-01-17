import React from 'react';
import { Heart, Sparkles, User, Feather } from 'lucide-react';
import FadeContent from './uiComponents/FadeContent';
import DarkVeil from './uiComponents/DarkVeil';
import { useTheme } from '../context/ThemeContext';
import humanTouchImg from '../assets/images/about_human_touch.jpg';

import SEO from '../components/SEO';

function About() {
    const { theme } = useTheme();

    return (
        <div className="min-h-screen">
            <SEO
                title="About Aalaboo"
                description="Learn about the soul of slow fashion at Aalaboo. We celebrate the art of handmade crochet, empowering artisans and prioritizing conscious production."
            />
            {/* Hero Section */}
            <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <DarkVeil darkMode={theme === 'dark'} />
                </div>

                <div className="relative z-10 text-center p-6 max-w-4xl mx-auto">
                    <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
                        <div className="mb-6 flex justify-center">
                            <Sparkles className="w-8 h-8 text-silk-600 dark:text-silk-300 opacity-80" strokeWidth={1} />
                        </div>
                        <p className="text-xs md:text-sm font-medium uppercase tracking-[0.4em] mb-6 text-silk-600 dark:text-silk-300">
                            Est. 2025
                        </p>
                        <h1 className="font-serif text-5xl md:text-8xl mb-8 text-silk-900 dark:text-silk-100 leading-tight">
                            The Soul of <br />
                            <span className="italic">Slow Fashion</span>
                        </h1>
                        <p className="text-silk-700 dark:text-silk-400 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto">
                            Where patience meets passion, and every stitch tells a story.
                        </p>
                    </FadeContent>
                </div>
            </section>

            {/* Manifesto Section */}
            <section className="py-32 px-6 bg-gradient-to-b from-transparent via-silk-50/50 to-transparent dark:from-transparent dark:via-white/5 dark:to-transparent">
                <div className="max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
                        <FadeContent blur={true} duration={1000} delay={200} easing="ease-out" initialOpacity={0}>
                            <div className="text-center">
                                <h2 className="font-serif text-4xl md:text-5xl text-silk-900 dark:text-silk-100 leading-tight mb-8">
                                    No Machines. <br />
                                    Pure Human Art.
                                </h2>
                                <div className="w-20 h-1 bg-silk-900 dark:bg-silk-100 mb-8 opacity-20 mx-auto"></div>
                                <p className="text-silk-800 dark:text-silk-300 text-lg leading-relaxed font-light mb-6 mx-auto">
                                    In a world obsessed with speed, we choose to pause. Aalaboo was born from a rebellion against the impersonal nature of mass production.
                                </p>
                                <p className="text-silk-800 dark:text-silk-300 text-lg leading-relaxed font-light mx-auto">
                                    We believe that true luxury cannot be automated. It is found in the slight irregularities of a hand-turned loop, the warmth of natural fibers, and the dedication of an artisan who pours hours into a single creation.
                                </p>
                            </div>
                        </FadeContent>

                        <div className="relative">
                            <FadeContent blur={true} duration={1000} delay={400} easing="ease-out" initialOpacity={0}>
                                <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-silk-100 dark:bg-white/5 relative group">
                                    <div className="absolute inset-0 bg-silk-900/0 dark:bg-black/10 z-10 transition-colors duration-500 group-hover:bg-silk-900/10"></div>

                                    <img
                                        src={humanTouchImg}
                                        alt="The Human Touch"
                                        className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105"
                                    />

                                    <div className="absolute bottom-0 left-0 right-0 p-8 z-20 bg-gradient-to-t from-silk-900/80 to-transparent">
                                        <p className="text-white text-sm tracking-widest uppercase font-medium">
                                            The Human Touch
                                        </p>
                                    </div>
                                </div>
                            </FadeContent>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Grid */}
            <section className="py-32 px-6">
                <div className="max-w-6xl mx-auto">
                    <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
                        <div className="text-center mb-20">
                            <h3 className="font-serif text-3xl md:text-4xl text-silk-900 dark:text-silk-100 mb-4">Our Core Philosophy</h3>
                            <p className="text-silk-600 dark:text-silk-400 font-light">Built on three pillars of conscious creation.</p>
                        </div>
                    </FadeContent>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Feather,
                                title: "Uncompromising Quality",
                                desc: "We source only the finest yarns that feel as good as they look. Taking no shortcuts, we ensure every piece stands the test of time."
                            },
                            {
                                icon: User,
                                title: "Empowering Artisans",
                                desc: "We are a community-first platform. Every purchase directly supports the skilled crocheters who bring these designs to life."
                            },
                            {
                                icon: Heart,
                                title: "Conscious Production",
                                desc: "Zero waste. Made to order. We produce only what is needed, respecting our planet and its resources."
                            }
                        ].map((item, idx) => (
                            <FadeContent key={idx} blur={true} duration={800} delay={idx * 200} easing="ease-out" initialOpacity={0}>
                                <div className="group p-10 py-12 rounded-3xl bg-silk-50 dark:bg-white/5 border border-transparent hover:border-silk-200 dark:hover:border-white/10 transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center md:items-start md:text-left">
                                    <div className="w-12 h-12 rounded-full bg-silk-100 dark:bg-white/10 flex items-center justify-center mb-6 text-silk-900 dark:text-silk-100 group-hover:bg-silk-200 dark:group-hover:bg-white/20 transition-colors">
                                        <item.icon strokeWidth={1.5} className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-serif text-xl text-silk-900 dark:text-silk-50 mb-3">{item.title}</h4>
                                    <p className="text-silk-600 dark:text-silk-400 text-sm leading-relaxed font-light">
                                        {item.desc}
                                    </p>
                                </div>
                            </FadeContent>
                        ))}
                    </div>
                </div>
            </section>

            {/* Closing Statement */}
            <section className="py-32 px-6 bg-silk-900 dark:bg-black text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:24px_24px]"></div>
                <div className="max-w-3xl mx-auto relative z-10">
                    <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
                        <h2 className="font-serif text-3xl md:text-5xl mb-8 leading-tight text-silk-50">
                            "You are not just buying a product.<br /> You are buying a piece of someone’s heart."
                            <br />❤️
                        </h2>
                        <div className="w-24 h-px bg-white/30 mx-auto"></div>
                    </FadeContent>
                </div>
            </section>
        </div>
    );
}

export default About;
