import React, { useState, useRef, useContext, useEffect } from 'react';
import { Upload, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import FadeContent from './uiComponents/FadeContent';
import { toast } from 'react-toastify';
import axios from 'axios';

function CustomOrder() {
    const { token, backendUrl, userData, fetchUserProfile } = useContext(ShopContext); // added userData
    // Force local backend for testing if needed, or user needs to update env.
    // console.log("Using Backend URL:", backendUrl);
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [description, setDescription] = useState('');
    const [size, setSize] = useState('Medium');
    const [colorOption, setColorOption] = useState('original'); // 'original' or 'custom'
    const [customColor, setCustomColor] = useState('');
    const [yarnType, setYarnType] = useState('');

    const [addressData, setAddressData] = useState({
        street: '', city: '', state: '', zip: '', country: '', phone: '', landmark: ''
    });

    const isAddressMissing = !userData?.address?.street || !userData?.address?.city || !userData?.address?.state || !userData?.address?.zip || !userData?.address?.country || !userData?.phone;

    useEffect(() => {
        if (userData) {
            setAddressData({
                street: userData.address?.street || '',
                city: userData.address?.city || '',
                state: userData.address?.state || '',
                zip: userData.address?.zip || '',
                landmark: userData.address?.landmark || '',
                country: userData.address?.country || '',
                phone: userData.phone || '',

            });
        }
    }, [userData]);

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddressData(prev => ({ ...prev, [name]: value }));
    };

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

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
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

        if (isAddressMissing) {
            if (!addressData.street || !addressData.city || !addressData.state || !addressData.zip || !addressData.country || !addressData.phone) {
                toast.error("Please complete your shipping details");
                return;
            }
        }

        // Use a toast ID to update it later
        const toastId = toast.loading("Submitting your request...");
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('image', image);
            formData.append('size', size);
            formData.append('colorPreference', colorOption);
            formData.append('customColor', customColor);
            formData.append('yarnType', yarnType);
            formData.append('description', description);

            if (isAddressMissing) {
                formData.append('street', addressData.street);
                formData.append('city', addressData.city);
                formData.append('state', addressData.state);
                formData.append('zip', addressData.zip);
                formData.append('country', addressData.country);
                formData.append('phone', addressData.phone);
                if (addressData.landmark) formData.append('landmark', addressData.landmark);
            }

            console.log("Sending Custom Order Request...", { size, colorOption, description });

            const response = await axios.post(backendUrl + '/api/custom-order/create', formData, {
                headers: { token }
            });

            console.log("Response:", response.data);

            if (response.data.success) {
                toast.update(toastId, { render: "Request sent successfully!", type: "success", isLoading: false, autoClose: 3000 });
                // Clear form
                setDescription('');
                setCustomColor('');
                setYarnType('');
                removeImage();
            } else {
                console.error("Server Error:", response.data.message);
                toast.update(toastId, { render: response.data.message || 'Failed to submit request', type: "error", isLoading: false, autoClose: 3000 });
            }
        } catch (error) {
            console.error("Submission Error:", error);
            toast.update(toastId, { render: error.message || 'Something went wrong', type: "error", isLoading: false, autoClose: 3000 });
        } finally {
            setLoading(false);
        }
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

                                {/* Address Form (Conditional) */}
                                {isAddressMissing && (
                                    <div className="border-t border-silk-200 dark:border-silk-800 pt-6 mt-2 animate-fade-in">
                                        <h4 className="font-medium text-silk-900 dark:text-silk-100 mb-4 flex items-center gap-2">
                                            <Info className="w-4 h-4" /> Shipping Details Required
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input name="street" value={addressData.street} onChange={handleAddressChange} placeholder="Street Address" className="w-full bg-transparent border-b border-silk-200 dark:border-silk-800 py-2 text-sm focus:outline-none focus:border-silk-900 dark:text-white placeholder-silk-300 dark:placeholder-silk-700" required />
                                            <input name="city" value={addressData.city} onChange={handleAddressChange} placeholder="City" className="w-full bg-transparent border-b border-silk-200 dark:border-silk-800 py-2 text-sm focus:outline-none focus:border-silk-900 dark:text-white placeholder-silk-300 dark:placeholder-silk-700" required />
                                            <input name="zip" value={addressData.zip} onChange={handleAddressChange} placeholder="Zip Code" className="w-full bg-transparent border-b border-silk-200 dark:border-silk-800 py-2 text-sm focus:outline-none focus:border-silk-900 dark:text-white placeholder-silk-300 dark:placeholder-silk-700" required />
                                            <input name="landmark" value={addressData.landmark} onChange={handleAddressChange} placeholder="Landmark (Optional)" className="w-full bg-transparent border-b border-silk-200 dark:border-silk-800 py-2 text-sm focus:outline-none focus:border-silk-900 dark:text-white placeholder-silk-300 dark:placeholder-silk-700" />
                                            <input name="state" value={addressData.state} onChange={handleAddressChange} placeholder="State" className="w-full bg-transparent border-b border-silk-200 dark:border-silk-800 py-2 text-sm focus:outline-none focus:border-silk-900 dark:text-white placeholder-silk-300 dark:placeholder-silk-700" required />
                                            <input name="country" value={addressData.country} onChange={handleAddressChange} placeholder="Country" className="w-full bg-transparent border-b border-silk-200 dark:border-silk-800 py-2 text-sm focus:outline-none focus:border-silk-900 dark:text-white placeholder-silk-300 dark:placeholder-silk-700" required />
                                            <input name="phone" value={addressData.phone} onChange={handleAddressChange} placeholder="Phone Number" className="w-full bg-transparent border-b border-silk-200 dark:border-silk-800 py-2 text-sm focus:outline-none focus:border-silk-900 dark:text-white placeholder-silk-300 dark:placeholder-silk-700" required />
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full bg-silk-900 dark:bg-silk-100 text-white dark:text-black py-4 rounded-xl text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform active:scale-[0.99] ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-silk-800 dark:hover:bg-white'}`}
                                >
                                    {loading ? 'Processing...' : (token ? 'Request Quote' : 'Login to Request')}
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
