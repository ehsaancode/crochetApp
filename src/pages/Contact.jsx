import React, { useState, useContext } from 'react';
import { Mail, Phone, Send, Instagram, Facebook, Sparkles, MessageSquare, Loader2, Check } from 'lucide-react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import QToast from './uiComponents/QToast';
import FadeContent from './uiComponents/FadeContent';
import DarkVeil from './uiComponents/DarkVeil';
import { useTheme } from '../context/ThemeContext';

function Contact() {
    const { theme } = useTheme();
    const { backendUrl } = useContext(ShopContext);
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleOnChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(backendUrl + '/api/user/contact', formData);
            if (response.data.success) {
                setSent(true);
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => setSent(false), 3000);
            } else {
                QToast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            QToast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <DarkVeil darkMode={theme === 'dark'} />
                </div>

                <div className="relative z-10 text-center p-6 max-w-4xl mx-auto">
                    <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
                        <div className="mb-6 flex justify-center">
                            <MessageSquare className="w-8 h-8 text-silk-600 dark:text-silk-300 opacity-80" strokeWidth={1} />
                        </div>
                        <p className="text-xs md:text-sm font-medium uppercase tracking-[0.4em] mb-6 text-silk-600 dark:text-silk-300">
                            We'd love to hear from you
                        </p>
                        <h1 className="font-serif text-5xl md:text-7xl mb-6 text-silk-900 dark:text-silk-100 leading-tight">
                            Get in <span className="italic">Touch</span>
                        </h1>
                    </FadeContent>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-16 md:gap-24">

                    {/* Contact Info Side */}
                    <div className="w-full md:w-1/2 space-y-12 text-center md:text-left">
                        <FadeContent blur={true} duration={1000} delay={200} easing="ease-out" initialOpacity={0}>
                            <h2 className="font-serif text-3xl md:text-4xl text-silk-900 dark:text-silk-100 mb-6">
                                Connect with Us
                            </h2>
                            <p className="text-silk-800 dark:text-silk-400 text-lg font-light leading-relaxed mb-12">
                                Whether you have a custom order in mind, a question about our collection, or just want to say hello, we are here for you.
                            </p>

                            <div className="space-y-8">
                                <div className="group p-8 rounded-3xl bg-silk-50 dark:bg-white/5 border border-transparent hover:border-silk-200 dark:hover:border-white/10 transition-all duration-300 hover:-translate-y-1 w-full flex flex-col items-center md:items-start">
                                    <div className="flex items-center gap-3 mb-2 text-silk-600 dark:text-silk-300">
                                        <Mail className="w-5 h-5" strokeWidth={1.5} />
                                        <span className="text-xs uppercase tracking-widest font-medium">Email</span>
                                    </div>
                                    <p className="text-xl md:text-2xl font-serif text-silk-900 dark:text-silk-100">mail.aalaboo@gmail.com</p>
                                </div>

                                {/* <div className="group p-8 rounded-3xl bg-silk-50 dark:bg-white/5 border border-transparent hover:border-silk-200 dark:hover:border-white/10 transition-all duration-300 hover:-translate-y-1 w-full flex flex-col items-center md:items-start">
                                    <div className="flex items-center gap-3 mb-2 text-silk-600 dark:text-silk-300">
                                        <Phone className="w-5 h-5" strokeWidth={1.5} />
                                        <span className="text-xs uppercase tracking-widest font-medium">Phone</span>
                                    </div>
                                    <p className="text-xl md:text-2xl tracking-widest text-silk-900 dark:text-silk-100">+91 7278969146</p>
                                </div> */}

                                <a href="https://wa.me/917278969146" target="_blank" rel="noopener noreferrer" className="block group p-8 rounded-3xl bg-silk-50 dark:bg-white/5 border border-transparent hover:border-silk-200 dark:hover:border-white/10 transition-all duration-300 hover:-translate-y-1 w-full">
                                    <div className="flex flex-col items-center md:items-start">
                                        <div className="flex items-center gap-3 mb-2 text-silk-600 dark:text-silk-300">
                                            <MessageSquare className="w-5 h-5" strokeWidth={1.5} />
                                            <span className="text-xs uppercase tracking-widest font-medium">WhatsApp</span>
                                        </div>
                                        <p className="text-xl md:text-2xl font-serif text-silk-900 dark:text-silk-100">Chat with us</p>
                                    </div>
                                </a>
                            </div>

                            <div className="mt-12 flex flex-col items-center md:items-start">
                                <h3 className="text-xs uppercase tracking-widest text-silk-500 dark:text-silk-400 mb-6">Follow Us On</h3>
                                <div className="flex gap-6">
                                    <a href="https://www.instagram.com/aalaboo__/" className="w-12 h-12 rounded-full bg-silk-100 dark:bg-white/10 flex items-center justify-center text-silk-900 dark:text-white hover:bg-silk-200 dark:hover:bg-white/20 transition-all hover:scale-110">
                                        <Instagram className="w-5 h-5" />
                                    </a>
                                    <a href="#" className="w-12 h-12 rounded-full bg-silk-100 dark:bg-white/10 flex items-center justify-center text-silk-900 dark:text-white hover:bg-silk-200 dark:hover:bg-white/20 transition-all hover:scale-110">
                                        <Facebook className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        </FadeContent>
                    </div>

                    {/* Form Side */}
                    <div className="w-full md:w-1/2">
                        <FadeContent blur={true} duration={1000} delay={400} easing="ease-out" initialOpacity={0}>
                            <div className="bg-white dark:bg-black/40 backdrop-blur-sm p-8 md:p-12 rounded-[2rem] shadow-xl border border-silk-100 dark:border-white/10">
                                <form onSubmit={handleOnSubmit} className="space-y-8">
                                    <div className="group space-y-2">
                                        <label className="block text-xs uppercase tracking-widest text-silk-500 dark:text-silk-400 ml-1 group-focus-within:text-silk-800 dark:group-focus-within:text-silk-200 transition-colors">Name</label>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleOnChange}
                                            type="text"
                                            className="w-full bg-silk-50 dark:bg-white/5 border border-transparent focus:border-silk-300 dark:focus:border-white/20 rounded-xl py-4 px-6 text-silk-900 dark:text-white placeholder-silk-300 dark:placeholder-silk-700 focus:outline-none transition-all"
                                            placeholder="Your name"
                                            required
                                        />
                                    </div>
                                    <div className="group space-y-2">
                                        <label className="block text-xs uppercase tracking-widest text-silk-500 dark:text-silk-400 ml-1 group-focus-within:text-silk-800 dark:group-focus-within:text-silk-200 transition-colors">Email</label>
                                        <input
                                            name="email"
                                            value={formData.email}
                                            onChange={handleOnChange}
                                            type="email"
                                            className="w-full bg-silk-50 dark:bg-white/5 border border-transparent focus:border-silk-300 dark:focus:border-white/20 rounded-xl py-4 px-6 text-silk-900 dark:text-white placeholder-silk-300 dark:placeholder-silk-700 focus:outline-none transition-all"
                                            placeholder="yourname@example.com"
                                            required
                                        />
                                    </div>
                                    <div className="group space-y-2">
                                        <label className="block text-xs uppercase tracking-widest text-silk-500 dark:text-silk-400 ml-1 group-focus-within:text-silk-800 dark:group-focus-within:text-silk-200 transition-colors">Message</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleOnChange}
                                            rows="5"
                                            className="w-full bg-silk-50 dark:bg-white/5 border border-transparent focus:border-silk-300 dark:focus:border-white/20 rounded-xl py-4 px-6 text-silk-900 dark:text-white placeholder-silk-300 dark:placeholder-silk-700 focus:outline-none transition-all resize-none"
                                            placeholder="How can we help you?"
                                            required
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading || sent}
                                        className={`w-full py-4 rounded-full font-medium tracking-wide flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg disabled:opacity-70 disabled:cursor-wait ${sent
                                                ? 'bg-green-600 text-white hover:bg-green-700'
                                                : 'bg-silk-900 dark:bg-white text-white dark:text-black hover:bg-silk-800 dark:hover:bg-gray-100'
                                            }`}
                                    >
                                        {loading ? (
                                            <><span>Sending...</span><Loader2 className="w-5 h-5 animate-spin" /></>
                                        ) : sent ? (
                                            <><span>Message Sent</span><Check className="w-5 h-5" /></>
                                        ) : (
                                            <><span>Send Message</span><Send className="w-4 h-4" /></>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </FadeContent>
                    </div>

                </div>
            </section>
        </div>
    );
}

export default Contact;
