import React, { useState, useRef } from 'react';
import { Upload, X, Send, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RainbowButton } from '@/components/ui/rainbow-button';
import FadeContent from './uiComponents/FadeContent';
import { toast } from 'react-toastify';

function CustomOrder() {
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [formData, setFormData] = useState({
        description: '',
        name: '',
        email: '',
        phone: ''
    });
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleFileSelect = (file) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast.error('Image size should be less than 5MB');
            return;
        }
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const removeImage = () => {
        setImage(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!image) {
            toast.error('Please upload a design image');
            return;
        }
        if (!formData.description) {
            toast.error('Please describe your request');
            return;
        }

        // Simulate form submission
        toast.success('Your custom request has been sent! We will contact you shortly.');
        setFormData({ description: '', name: '', email: '', phone: '' });
        removeImage();
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-silk-50 dark:bg-black transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6">
                <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
                    <div className="text-center mb-16">
                        <h1 className="font-serif text-4xl md:text-6xl text-silk-900 dark:text-silk-100 mb-6">
                            Bring Your Design to Life
                        </h1>
                        <p className="text-lg text-silk-600 dark:text-silk-400 max-w-2xl mx-auto font-light leading-relaxed">
                            Have a specific pattern or idea in mind? Upload your inspiration, and our artisans will lovingly hand-crochet it just for you.
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
                        {/* Image Upload Section */}
                        <div className="w-full lg:w-1/2">
                            <div
                                className={`relative w-full aspect-square md:aspect-[4/3] rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden group 
                                    ${previewUrl ? 'border-transparent' : 'border-silk-300 dark:border-silk-700 hover:border-silk-500 dark:hover:border-silk-500 bg-silk-100/50 dark:bg-white/5'}`}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                            >
                                <AnimatePresence mode="wait">
                                    {previewUrl ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="relative w-full h-full"
                                        >
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <button
                                                    onClick={removeImage}
                                                    className="bg-white/90 text-red-500 p-3 rounded-full hover:bg-white transition-colors transform hover:scale-110"
                                                >
                                                    <X className="w-6 h-6" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 flex flex-col items-center justify-center text-silk-500 dark:text-silk-400 p-8 text-center cursor-pointer"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <div className="w-20 h-20 mb-6 rounded-full bg-silk-200 dark:bg-silk-800/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <Upload className="w-10 h-10" strokeWidth={1.5} />
                                            </div>
                                            <h3 className="text-xl font-serif mb-2 text-silk-900 dark:text-silk-200">Upload Reference Image</h3>
                                            <p className="text-sm opacity-70 mb-6">Drag & drop or click to browse</p>
                                            <p className="text-xs opacity-50 uppercase tracking-widest">Supports JPG, PNG (Max 5MB)</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>

                        {/* Request Form */}
                        <div className="w-full lg:w-1/2">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-silk-500 dark:text-silk-400 mb-3 ml-1">About Your Design</label>
                                    <textarea
                                        rows="5"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-transparent border-b border-silk-200 dark:border-silk-800 py-3 px-1 text-lg text-silk-900 dark:text-silk-100 placeholder-silk-300 dark:placeholder-silk-700 focus:outline-none focus:border-silk-900 dark:focus:border-silk-400 transition-colors resize-none"
                                        placeholder="Tell us about the product you want... (e.g., color preferences, size, material, or specific details)"
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-silk-500 dark:text-silk-400 mb-3 ml-1">Your Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-transparent border-b border-silk-200 dark:border-silk-800 py-2 px-1 text-silk-900 dark:text-silk-100 placeholder-silk-300 dark:placeholder-silk-700 focus:outline-none focus:border-silk-900 dark:focus:border-silk-400 transition-colors"
                                            placeholder="Jane Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-silk-500 dark:text-silk-400 mb-3 ml-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-transparent border-b border-silk-200 dark:border-silk-800 py-2 px-1 text-silk-900 dark:text-silk-100 placeholder-silk-300 dark:placeholder-silk-700 focus:outline-none focus:border-silk-900 dark:focus:border-silk-400 transition-colors"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-silk-500 dark:text-silk-400 mb-3 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-transparent border-b border-silk-200 dark:border-silk-800 py-2 px-1 text-silk-900 dark:text-silk-100 placeholder-silk-300 dark:placeholder-silk-700 focus:outline-none focus:border-silk-900 dark:focus:border-silk-400 transition-colors"
                                        placeholder="jane@example.com"
                                    />
                                </div>

                                <div className="pt-8">
                                    <RainbowButton className="w-full !rounded-xl !h-14 !text-base uppercase tracking-widest">
                                        Send Request
                                    </RainbowButton>
                                    <p className="text-center text-xs text-silk-400 dark:text-silk-600 mt-4">
                                        Our team will review your design and get back to you with a quote within 24 hours.
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </FadeContent>
            </div>
        </div>
    );
}

export default CustomOrder;
