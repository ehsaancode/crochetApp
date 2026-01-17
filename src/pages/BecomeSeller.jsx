import React, { useState, useRef, useContext } from 'react';
import { Upload, X, Info, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import QToast from './uiComponents/QToast';
import FadeContent from './uiComponents/FadeContent';
import SEO from '../components/SEO';

const BecomeSeller = () => {
    const { backendUrl } = useContext(ShopContext);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        shopName: '',
        experience: '',
        bio: '',
        socialLinks: { instagram: '', facebook: '', portfolio: '' }
    });

    // File State
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [videos, setVideos] = useState([]);
    const [videoPreviews, setVideoPreviews] = useState([]);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Refs
    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);

    // Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('social_')) {
            const socialKey = name.split('_')[1];
            setFormData(prev => ({
                ...prev,
                socialLinks: { ...prev.socialLinks, [socialKey]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const validFiles = newFiles.filter(file => file.type.startsWith('image/'));

            if (validFiles.length + images.length > 10) {
                QToast.error("Maximum 10 images allowed");
                return;
            }

            setImages(prev => [...prev, ...validFiles]);
            const newPreviews = validFiles.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const handleVideoChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const validFiles = newFiles.filter(file => file.type.startsWith('video/'));

            if (validFiles.length + videos.length > 2) {
                QToast.error("Maximum 2 videos allowed");
                return;
            }

            // Check size (e.g., 50MB limit)
            const oversized = validFiles.find(f => f.size > 50 * 1024 * 1024);
            if (oversized) {
                QToast.error(`Video ${oversized.name} is too large (Max 50MB)`);
                return;
            }

            setVideos(prev => [...prev, ...validFiles]);
            const newPreviews = validFiles.map(file => URL.createObjectURL(file));
            setVideoPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const removeVideo = (index) => {
        setVideos(prev => prev.filter((_, i) => i !== index));
        setVideoPreviews(prev => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('phone', formData.phone);
            data.append('shopName', formData.shopName);
            data.append('experience', formData.experience);
            data.append('bio', formData.bio);
            data.append('socialLinks', JSON.stringify(formData.socialLinks));

            images.forEach(img => data.append('images', img));
            videos.forEach(vid => data.append('videos', vid));

            const response = await axios.post(backendUrl + '/api/seller/register', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                setSuccess(true);
                setFormData({
                    name: '', email: '', phone: '', shopName: '', experience: '', bio: '',
                    socialLinks: { instagram: '', facebook: '', portfolio: '' }
                });
                setImages([]);
                setImagePreviews([]);
                setVideos([]);
                setVideoPreviews([]);
            } else {
                QToast.error(response.data.message);
            }

        } catch (error) {
            console.error(error);
            QToast.error(error.message || "Failed to submit request");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-silk-50 dark:bg-black">
                <div className="max-w-xl text-center">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-500" />
                    </div>
                    <h2 className="text-3xl font-serif mb-4 text-silk-900 dark:text-silk-50">Request Submitted!</h2>
                    <p className="text-silk-600 dark:text-silk-400 mb-8">
                        Thank you for your interest in joining our artisan community. We have received your details and will get back to you shortly after reviewing your portfolio.
                    </p>
                    <button
                        onClick={() => setSuccess(false)}
                        className="text-silk-900 dark:text-silk-100 font-medium underline underline-offset-4 hover:text-silk-700"
                    >
                        Submit another request
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 pb-12 bg-silk-50 dark:bg-black transition-colors duration-300">
            <SEO
                title="Become a Seller"
                description="Join Aalaboo's community of artisans. Sell your handcrafted crochet items on our platform."
            />
            <div className="max-w-4xl mx-auto px-6">

                <FadeContent blur={true} duration={0.6}>
                    <div className="text-center mb-12">
                        <h1 className="font-serif text-4xl md:text-5xl text-silk-900 dark:text-silk-100 mb-4">
                            Join Our Artisan Community
                        </h1>
                        <p className="text-silk-600 dark:text-silk-400 max-w-2xl mx-auto">
                            We'd love to showcase your work. Fill out the form below to apply as a seller on our platform.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-900/30 border border-silk-100 dark:border-white/5 rounded-3xl p-6 md:p-10 shadow-sm">

                        {/* Personal Details */}
                        <section className="mb-10">
                            <h3 className="text-lg font-serif text-silk-900 dark:text-silk-50 mb-6 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-silk-100 dark:bg-silk-900 text-sm flex items-center justify-center">1</span>
                                Personal Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-silk-500 font-medium">Full Name</label>
                                    <input
                                        name="name" value={formData.name} onChange={handleChange} required
                                        className="w-full bg-transparent border-b border-silk-200 dark:border-silk-800 py-2 focus:outline-none focus:border-silk-900 dark:text-white transition-colors"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-silk-500 font-medium">Email Address</label>
                                    <input
                                        type="email" name="email" value={formData.email} onChange={handleChange} required
                                        className="w-full bg-transparent border-b border-silk-200 dark:border-silk-800 py-2 focus:outline-none focus:border-silk-900 dark:text-white transition-colors"
                                        placeholder="yourname@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-silk-500 font-medium">Phone Number</label>
                                    <input
                                        type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                                        className="w-full bg-transparent border-b border-silk-200 dark:border-silk-800 py-2 focus:outline-none focus:border-silk-900 dark:text-white transition-colors"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-silk-500 font-medium">Years of Experience</label>
                                    <input
                                        name="experience" value={formData.experience} onChange={handleChange} required
                                        className="w-full bg-transparent border-b border-silk-200 dark:border-silk-800 py-2 focus:outline-none focus:border-silk-900 dark:text-white transition-colors"
                                        placeholder="e.g. 5 years"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Shop / Bio */}
                        <section className="mb-10">
                            <h3 className="text-lg font-serif text-silk-900 dark:text-silk-50 mb-6 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-silk-100 dark:bg-silk-900 text-sm flex items-center justify-center">2</span>
                                Work Profile
                            </h3>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-silk-500 font-medium">Bio / About Your Work</label>
                                    <textarea
                                        name="bio" value={formData.bio} onChange={handleChange}
                                        className="w-full bg-silk-50/50 dark:bg-white/5 border border-silk-200 dark:border-silk-800 rounded-xl p-4 text-sm focus:outline-none focus:border-silk-900 dark:text-white resize-none h-32"
                                        placeholder="Tell us about yourself, your style, and what you love to make..."
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Portfolio Uploads */}
                        <section className="mb-10">
                            <h3 className="text-lg font-serif text-silk-900 dark:text-silk-50 mb-6 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-silk-100 dark:bg-silk-900 text-sm flex items-center justify-center">3</span>
                                Portfolio
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Images */}
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-silk-500 font-medium mb-3">Work Samples (Images)</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <AnimatePresence>
                                            {imagePreviews.map((url, idx) => (
                                                <motion.div
                                                    key={`img-${idx}`}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.5 }}
                                                    className="relative aspect-square rounded-xl overflow-hidden border border-silk-100 dark:border-white/10"
                                                >
                                                    <img src={url} alt="work" className="w-full h-full object-cover" />
                                                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full"><X className="w-3 h-3" /></button>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>

                                        <div
                                            onClick={() => imageInputRef.current?.click()}
                                            className="aspect-square rounded-xl border border-dashed border-silk-300 dark:border-silk-700 flex flex-col items-center justify-center cursor-pointer hover:bg-silk-50 dark:hover:bg-white/5 transition-colors text-silk-400"
                                        >
                                            <Upload className="w-6 h-6 mb-2" />
                                            <span className="text-[10px] uppercase font-medium">Add Image</span>
                                        </div>
                                        <input type="file" ref={imageInputRef} className="hidden" accept="image/*" multiple onChange={handleImageChange} />
                                    </div>
                                </div>

                                {/* Videos */}
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-silk-500 font-medium mb-3">Work Videos (Max 2)</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <AnimatePresence>
                                            {videoPreviews.map((url, idx) => (
                                                <motion.div
                                                    key={`vid-${idx}`}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.5 }}
                                                    className="relative aspect-video rounded-xl overflow-hidden border border-silk-100 dark:border-white/10 bg-black"
                                                >
                                                    <video src={url} className="w-full h-full object-cover opacity-80" />
                                                    <button type="button" onClick={() => removeVideo(idx)} className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full z-10"><X className="w-3 h-3" /></button>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>

                                        <div
                                            onClick={() => videoInputRef.current?.click()}
                                            className="aspect-video rounded-xl border border-dashed border-silk-300 dark:border-silk-700 flex flex-col items-center justify-center cursor-pointer hover:bg-silk-50 dark:hover:bg-white/5 transition-colors text-silk-400"
                                        >
                                            <Upload className="w-6 h-6 mb-2" />
                                            <span className="text-[10px] uppercase font-medium">Add Video</span>
                                        </div>
                                        <input type="file" ref={videoInputRef} className="hidden" accept="video/*" multiple onChange={handleVideoChange} />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Social Links */}
                        <section className="mb-10">
                            <h3 className="text-lg font-serif text-silk-900 dark:text-silk-50 mb-6 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-silk-100 dark:bg-silk-900 text-sm flex items-center justify-center">4</span>
                                Social Presence
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-silk-500 font-medium">Instagram Profile</label>
                                    <input
                                        name="social_instagram" value={formData.socialLinks.instagram} onChange={handleChange}
                                        className="w-full bg-transparent border-b border-silk-200 dark:border-silk-800 py-2 focus:outline-none focus:border-silk-900 dark:text-white transition-colors"
                                        placeholder="@yourhandle"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Submit */}
                        <div className="pt-6 border-t border-silk-100 dark:border-white/10">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-silk-900 dark:bg-silk-100 text-white dark:text-black py-4 rounded-full font-medium uppercase tracking-[0.1em] transition-all hover:shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-silk-800 dark:hover:bg-white'}`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                                    </span>
                                ) : 'Submit'}
                            </button>
                        </div>

                    </form>
                </FadeContent>
            </div>
        </div>
    );
};

export default BecomeSeller;
