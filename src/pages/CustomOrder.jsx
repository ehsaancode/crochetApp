import React, { useState, useRef, useContext } from 'react';
import { Upload, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import FadeContent from './uiComponents/FadeContent';
import { toast } from 'react-toastify';

function CustomOrder() {
    const { token } = useContext(ShopContext);
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [description, setDescription] = useState('');
    const [size, setSize] = useState('Medium');
    const [colorOption, setColorOption] = useState('original'); // 'original' or 'custom'
    const [customColor, setCustomColor] = useState('');
    const [yarnType, setYarnType] = useState('');

    const fileInputRef = useRef(null);



    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) handleFileSelect(file);
    };

    const handleFileSelect = (file) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result);
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
    const handleDrop = (e) => {
        e.preventDefault(); e.stopPropagation();
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    };

    const removeImage = () => {
        setImage(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!token) {
            toast.info('Please log in to place a custom order');
            navigate('/account');
            return;
        }

        if (!image) {
            toast.error('Please upload a design image');
            return;
        }

        // Success logic
        toast.success('Your custom request has been sent! We will contact you shortly.');
        setDescription('');
        setCustomColor('');
        setYarnType('');
        removeImage();
    };

    return (
        <div className="min-h-screen pt-28 pb-12 bg-silk-50 dark:bg-black transition-colors duration-300 flex items-center justify-center">
            <div className="w-full max-w-5xl px-6">
                <FadeContent blur={true} duration={0.6} easing="ease-out" initialOpacity={0}>
                    <div className="text-center mb-10">
                        <h1 className="font-serif text-3xl md:text-5xl text-silk-900 dark:text-silk-100 mb-3 leading-tight">
                            Turn Your Photo Into a<br />Handmade Crochet Piece
                        </h1>
                        <p className="text-sm text-silk-600 dark:text-silk-400 font-light max-w-lg mx-auto">
                            Transform your inspiration into reality. Choose your preferences, and we'll craft it with love.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-neutral-900/30 border border-silk-100 dark:border-white/5 rounded-3xl shadow-sm overflow-hidden p-6 md:p-10 backdrop-blur-sm">
                        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-10">

                            {/* Image Upload Column */}
                            <div className="w-full md:w-4/12 flex flex-col gap-4">
                                <div
                                    className={`relative w-full aspect-[4/5] rounded-2xl border border-dashed transition-all duration-300 overflow-hidden cursor-pointer group 
                                        ${previewUrl ? 'border-transparent' : 'border-silk-200 dark:border-silk-800 hover:border-silk-400 dark:hover:border-silk-600 bg-silk-50/50 dark:bg-black/20'}`}
                                    onClick={() => !previewUrl && fileInputRef.current?.click()}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                >
                                    <AnimatePresence mode="wait">
                                        {previewUrl ? (
                                            <motion.div
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                className="relative w-full h-full"
                                            >
                                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                                    className="absolute top-3 right-3 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-colors backdrop-blur-md"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </motion.div>
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-silk-400 dark:text-silk-600 p-6 text-center group-hover:text-silk-600 dark:group-hover:text-silk-400 transition-colors">
                                                <Upload className="w-8 h-8 mb-4 opacity-70" strokeWidth={1.5} />
                                                <span className="text-xs uppercase tracking-[0.2em] font-medium">Upload Image</span>
                                            </div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                            </div>

                            {/* Form Fields Column */}
                            <div className="w-full md:w-8/12 flex flex-col gap-6">

                                {/* Size Selection */}
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-silk-500 dark:text-silk-400 mb-3">Size</label>
                                    <div className="flex gap-3">
                                        {['Small', 'Medium', 'Large'].map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setSize(s)}
                                                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 border ${size === s
                                                    ? 'bg-silk-900 text-white border-silk-900 dark:bg-silk-100 dark:text-black dark:border-silk-100'
                                                    : 'bg-transparent text-silk-600 dark:text-silk-400 border-silk-200 dark:border-silk-800 hover:border-silk-400 dark:hover:border-silk-600'
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Color Preference */}
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-silk-500 dark:text-silk-400 mb-3">Color Preference</label>
                                    <div className="flex flex-col gap-3">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="color"
                                                value="original"
                                                checked={colorOption === 'original'}
                                                onChange={() => setColorOption('original')}
                                                className="w-4 h-4 text-silk-900 border-silk-300 focus:ring-silk-900 dark:bg-black dark:border-silk-600"
                                            />
                                            <span className="text-sm text-silk-700 dark:text-silk-300 group-hover:text-silk-900 dark:group-hover:text-white transition-colors">Use original image colors</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="color"
                                                value="custom"
                                                checked={colorOption === 'custom'}
                                                onChange={() => setColorOption('custom')}
                                                className="w-4 h-4 text-silk-900 border-silk-300 focus:ring-silk-900 dark:bg-black dark:border-silk-600"
                                            />
                                            <span className="text-sm text-silk-700 dark:text-silk-300 group-hover:text-silk-900 dark:group-hover:text-white transition-colors">Custom colors</span>
                                        </label>

                                        <AnimatePresence>
                                            {colorOption === 'custom' && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <input
                                                        type="text"
                                                        value={customColor}
                                                        onChange={(e) => setCustomColor(e.target.value)}
                                                        placeholder="Enter custom colors (e.g., Pastel Pink, Navy Blue)..."
                                                        className="w-full mt-2 bg-transparent border-b border-silk-200 dark:border-silk-800 py-2 text-sm text-silk-900 dark:text-silk-100 placeholder-silk-300 dark:placeholder-silk-700 focus:outline-none focus:border-silk-900 dark:focus:border-silk-400 transition-colors"
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Yarn Type */}
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-silk-500 dark:text-silk-400 mb-2">Yarn Type (Optional)</label>
                                    <input
                                        type="text"
                                        value={yarnType}
                                        onChange={(e) => setYarnType(e.target.value)}
                                        placeholder="e.g. Cotton, Wool, Acrylic..."
                                        className="w-full bg-transparent border-b border-silk-200 dark:border-silk-800 py-2 text-sm text-silk-900 dark:text-silk-100 placeholder-silk-300 dark:placeholder-silk-700 focus:outline-none focus:border-silk-900 dark:focus:border-silk-400 transition-colors"
                                    />
                                </div>

                                {/* Description */}
                                <div className="flex-grow">
                                    <label className="block text-[10px] uppercase tracking-widest text-silk-500 dark:text-silk-400 mb-2">Additional Details</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full h-32 bg-silk-50/50 dark:bg-white/5 border border-silk-200 dark:border-silk-800 rounded-xl p-4 text-sm text-silk-900 dark:text-silk-100 placeholder-silk-300 dark:placeholder-silk-700 focus:outline-none focus:border-silk-900 dark:focus:border-silk-400 transition-colors resize-none"
                                        placeholder="Any specific requests?"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-silk-900 dark:bg-silk-100 text-white dark:text-black py-4 rounded-xl text-xs uppercase tracking-[0.15em] font-medium hover:bg-silk-800 dark:hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform active:scale-[0.99]"
                                >
                                    {token ? 'Request Quote' : 'Login to Request'}
                                </button>
                            </div>
                        </form>
                    </div>
                </FadeContent>
            </div>
        </div>
    );
}

export default CustomOrder;
