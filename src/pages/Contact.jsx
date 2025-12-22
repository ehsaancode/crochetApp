import React from 'react';
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Twitter } from 'lucide-react';
import bgImage from '../assets/images/contact_bg.png';

function Contact() {
    return (
        <div className="min-h-screen pt-16 bg-silk-50 dark:bg-black transition-colors duration-300">
            <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">

                {/* Visual Side */}
                <div className="w-full md:w-1/2 relative min-h-[40vh] md:min-h-auto">
                    <img src={bgImage} alt="Contact Us" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-silk-900/20 backdrop-blur-[1px]"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-white p-12">
                        <div className="max-w-md">
                            <h1 className="font-serif text-4xl md:text-6xl mb-6">Get in<br />Touch</h1>
                            <p className="text-lg opacity-90 font-light">
                                We'd love to hear from you. Whether it's a custom order request or just to say hello.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="w-full md:w-1/2 bg-white dark:bg-black p-8 md:p-16 flex items-center transition-colors duration-300">
                    <div className="w-full max-w-md mx-auto">
                        <div className="grid grid-cols-2 gap-8 mb-12">
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2 text-silk-400 mb-1">
                                    <Mail className="w-4 h-4" />
                                    <span className="text-xs uppercase tracking-widest">Email</span>
                                </div>
                                <p className="text-silk-900 dark:text-silk-50 font-medium">hello@aalaboo.com</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2 text-silk-400 mb-1">
                                    <Phone className="w-4 h-4" />
                                    <span className="text-xs uppercase tracking-widest">Phone</span>
                                </div>
                                <p className="text-silk-900 dark:text-silk-50 font-medium">+1 (555) 123-4567</p>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="mb-12">
                            <h3 className="text-xs uppercase tracking-widest text-silk-500 dark:text-silk-400 mb-4">Follow Us</h3>
                            <div className="flex space-x-6">
                                <a href="#" className="transform hover:scale-110 transition-transform duration-200">
                                    <Instagram className="w-6 h-6 text-silk-900 dark:text-white hover:text-silk-600 dark:hover:text-silk-300" />
                                </a>
                                <a href="#" className="transform hover:scale-110 transition-transform duration-200">
                                    <Facebook className="w-6 h-6 text-silk-900 dark:text-white hover:text-silk-600 dark:hover:text-silk-300" />
                                </a>
                                <a href="#" className="transform hover:scale-110 transition-transform duration-200">
                                    <Twitter className="w-6 h-6 text-silk-900 dark:text-white hover:text-silk-600 dark:hover:text-silk-300" />
                                </a>
                            </div>
                        </div>

                        <form className="space-y-6">
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-silk-500 dark:text-silk-400 mb-2">Name</label>
                                <input type="text" className="w-full border-b border-silk-200 dark:border-silk-700 py-2 text-silk-900 dark:text-white focus:outline-none focus:border-silk-900 dark:focus:border-silk-400 transition-colors bg-transparent placeholder-silk-300 dark:placeholder-silk-600" placeholder="Jane Doe" />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-silk-500 dark:text-silk-400 mb-2">Email</label>
                                <input type="email" className="w-full border-b border-silk-200 dark:border-silk-700 py-2 text-silk-900 dark:text-white focus:outline-none focus:border-silk-900 dark:focus:border-silk-400 transition-colors bg-transparent placeholder-silk-300 dark:placeholder-silk-600" placeholder="jane@example.com" />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-silk-500 dark:text-silk-400 mb-2">Message</label>
                                <textarea rows="4" className="w-full border-b border-silk-200 dark:border-silk-700 py-2 text-silk-900 dark:text-white focus:outline-none focus:border-silk-900 dark:focus:border-silk-400 transition-colors bg-transparent resize-none placeholder-silk-300 dark:placeholder-silk-600" placeholder="How can we help you?"></textarea>
                            </div>
                            <button className="w-full bg-silk-900 dark:bg-silk-50 text-white dark:text-silk-900 py-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-silk-800 dark:hover:bg-silk-200 transition-all duration-300 shadow-lg hover:shadow-xl group">
                                <span className="uppercase tracking-widest text-sm">Send Message</span>
                                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
