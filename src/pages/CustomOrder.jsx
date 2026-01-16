import React, { useState, useRef, useContext, useEffect } from 'react';
import { Upload, X, Info, MapPin, Plus, CheckCircle2, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShopContext } from '../context/ShopContext';
import { useNavigate, useLocation } from 'react-router-dom';
import FadeContent from './uiComponents/FadeContent';
import { toast } from 'react-toastify';
import axios from 'axios';

function CustomOrder() {
    const { token, backendUrl, userData, fetchUserProfile, galleryImages } = useContext(ShopContext); // added userData
    // Force local backend for testing if needed, or user needs to update env.
    // console.log("Using Backend URL:", backendUrl);
    const navigate = useNavigate();
    const location = useLocation();
    const [images, setImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [showProgress, setShowProgress] = useState(false);
    const [progress, setProgress] = useState(0);
    const [description, setDescription] = useState('');
    const [size, setSize] = useState('Medium');
    const [colorOption, setColorOption] = useState('original'); // 'original' or 'custom'
    const [customColor, setCustomColor] = useState('');
    const [yarnType, setYarnType] = useState('');
    const [addressMode, setAddressMode] = useState('new'); // 'saved' or 'new'
    const [isSavingAddress, setIsSavingAddress] = useState(false);
    const [showSaveSuccess, setShowSaveSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    // Gallery Picker
    const gallery = galleryImages;
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);

    const optimizeImageUrl = (url, width) => {
        if (!url || !url.includes('cloudinary.com')) return url;
        if (url.includes('/upload/w_')) return url;
        return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
    };

    const confirmGallerySelection = async (imageUrl) => {
        setIsGalleryOpen(false);
        setSelectedIndex(null);
        setLoading(true);
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const file = new File([blob], "gallery_pick.jpg", { type: blob.type });
            handleFileSelect([file]);
            toast.success("Image added from gallery");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) { toast.error("Failed to add image"); } finally { setLoading(false); }
    };

    const [addressData, setAddressData] = useState({
        firstName: '', lastName: '', street: '', city: '', state: '', zip: '', country: '', phone: '', landmark: ''
    });

    // New state to hold the currently selected "Saved Address" (Primary or from List)
    // This allows the Saved Card to show data even when addressMode is 'new' (which clears addressData)
    const [selectedSavedAddress, setSelectedSavedAddress] = useState(null);
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(-1); // -1 for Primary, 0+ for Secondary

    const isAddressMissing = !userData?.address?.street || !userData?.address?.city || !userData?.address?.state || !userData?.address?.zip || !userData?.address?.country || !userData?.phone;

    // Helper to normalize address object
    const normalizeAddress = (addr, phone) => ({
        firstName: addr?.firstName || '',
        lastName: addr?.lastName || '',
        street: addr?.street || '',
        city: addr?.city || '',
        state: addr?.state || '',
        zip: addr?.zip || '',
        landmark: addr?.landmark || '',
        country: addr?.country || '',
        phone: addr?.phone || phone || '',
    });

    useEffect(() => {
        if (userData && userData.address && userData.address.street) {
            const primary = normalizeAddress(userData.address, userData.phone);
            setSelectedSavedAddress(primary);
            setSelectedAddressIndex(-1);
            setAddressData(primary);
            setAddressMode('saved');
        } else {
            setAddressMode('new');
        }
    }, [userData]);

    const switchToNewAddress = () => {
        setAddressMode('new');
        setAddressData({ firstName: '', lastName: '', street: '', city: '', state: '', zip: '', country: '', phone: '', landmark: '' });
    };

    const switchToSavedAddress = () => {
        if (selectedSavedAddress) {
            setAddressData(selectedSavedAddress);
            setAddressMode('saved');
        } else if (userData && userData.address) {
            // Fallback if selectedSavedAddress not ready
            const primary = normalizeAddress(userData.address, userData.phone);
            setSelectedSavedAddress(primary);
            setAddressData(primary);
            setAddressMode('saved');
        }
    };

    const switchToEditAddress = (e) => {
        e.stopPropagation();
        // Edit the currently selected address (Primary or Secondary)
        const targetAddress = selectedSavedAddress || userData?.address;

        if (targetAddress) {
            setAddressData(normalizeAddress(targetAddress, userData?.phone));
            setAddressMode('edit');
        }
    };

    const handleSaveAddress = async (e) => {
        e.stopPropagation();
        if (!addressData.street || !addressData.city || !addressData.zip || !addressData.country || !addressData.phone) {
            toast.error("Please fill all required address fields");
            return;
        }

        setIsSavingAddress(true);

        try {
            let response;
            if (addressMode === 'new') {
                response = await axios.post(backendUrl + '/api/user/add-address',
                    { address: addressData },
                    { headers: { token } }
                );
            } else if (selectedAddressIndex === -1) {
                // Update Primary
                response = await axios.post(backendUrl + '/api/user/update-profile',
                    {
                        address: addressData,
                        phone: addressData.phone,
                        name: userData?.name
                    },
                    { headers: { token } }
                );
            } else {
                // Update Secondary
                response = await axios.post(backendUrl + '/api/user/update-address',
                    {
                        index: selectedAddressIndex,
                        address: addressData
                    },
                    { headers: { token } }
                );
            }

            if (response.data.success) {
                setShowSaveSuccess(true);
                if (fetchUserProfile) fetchUserProfile();

                // Show success animation for a moment before closing
                setTimeout(() => {
                    setShowSaveSuccess(false);
                    setAddressMode('saved');
                    toast.success("Address saved to profile");
                }, 1500);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setIsSavingAddress(false);
        }
    };

    const handleDeleteAddress = async (index, type = 'secondary', e) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this address?")) {
            try {
                const response = await axios.post(backendUrl + '/api/user/delete-address', { index, type }, { headers: { token } });
                if (response.data.success) {
                    toast.success("Address deleted");
                    fetchUserProfile(token);
                    // If deleted address was selected, reset to primary
                    // For legacy, index matching is tricky since we use -2. Just reset if mode was 'new' and data matched?
                    // Simpler to just reset if we were editing SOMETHING.
                    // Or precise check:
                    if ((type === 'secondary' && selectedAddressIndex === index) || (type === 'legacy' && addressMode === 'new')) {
                        const primary = normalizeAddress(userData.address, userData.phone);
                        setSelectedSavedAddress(primary);
                        setSelectedAddressIndex(-1);
                        setAddressData(primary);
                        setAddressMode('saved');
                    }
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error(error);
                toast.error(error.message);
            }
        }
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddressData(prev => ({ ...prev, [name]: value }));
    };

    const fileInputRef = useRef(null);



    const handleImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelect(Array.from(e.target.files));
        }
    };

    const handleFileSelect = (files) => {
        if (images.length + files.length > 6) {
            toast.error('Maximum 6 images allowed');
            return;
        }

        const validFiles = [];
        const newPreviews = [];

        files.forEach(file => {
            if (!file.type.startsWith('image/')) {
                toast.error(`Scanning ${file.name}: Not an image`);
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name} is too large (>5MB)`);
                return;
            }
            validFiles.push(file);
            newPreviews.push(URL.createObjectURL(file));
        });

        if (validFiles.length > 0) {
            setImages(prev => [...prev, ...validFiles]);
            setPreviewUrls(prev => [...prev, ...newPreviews]);
        }
    };

    const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
    const handleDrop = (e) => {
        e.preventDefault(); e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelect(Array.from(e.dataTransfer.files));
        }
    };

    // Handle initial image from DiscoverIdeas
    useEffect(() => {
        if (location.state?.initialImage && images.length === 0) {
            const fetchImage = async () => {
                try {
                    const response = await fetch(location.state.initialImage);
                    const blob = await response.blob();
                    const file = new File([blob], "inspiration.jpg", { type: blob.type });
                    handleFileSelect([file]);
                    // Clean up state to prevent re-adding
                    window.history.replaceState({}, document.title);
                } catch (error) {
                    console.error("Error loading inspiration image:", error);
                }
            };
            fetchImage();
        }
    }, [location.state]);

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => {
            // Revoke url to free memory
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // const [loading, setLoading] = useState(false); // Removed duplicate

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            toast.info('Please log in to place a custom order');
            navigate('/account');
            return;
        }

        if (images.length === 0) {
            toast.error('Please upload at least one design image');
            return;
        }

        if (!addressData.street || !addressData.city || !addressData.state || !addressData.zip || !addressData.country || !addressData.phone) {
            toast.error("Please complete your shipping details");
            return;
        }

        setLoading(true);
        setShowProgress(true);
        setProgress(0);

        try {
            const formData = new FormData();
            images.forEach((img) => {
                formData.append('image', img);
            });
            formData.append('size', size);
            formData.append('colorPreference', colorOption);
            formData.append('customColor', customColor);
            formData.append('yarnType', yarnType);
            formData.append('description', description);

            // Always send address data if available to ensure latest details are used
            if (addressData.street) {
                formData.append('street', addressData.street);
                formData.append('city', addressData.city);
                formData.append('state', addressData.state);
                formData.append('zip', addressData.zip);
                formData.append('country', addressData.country);
                formData.append('phone', addressData.phone);
                if (addressData.landmark) formData.append('landmark', addressData.landmark);
            }

            const response = await axios.post(backendUrl + '/api/custom-order/create', formData, {
                headers: { token: String(token), 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                }
            });

            if (response.data.success) {
                setTimeout(() => {
                    setShowProgress(false);
                    toast.success("Request sent successfully!");
                    // Clear form
                    setDescription('');
                    setCustomColor('');
                    setYarnType('');
                    setImages([]);
                    setPreviewUrls([]);
                }, 1000);
            } else {
                console.error("Server Error:", response.data.message);
                setShowProgress(false);
                toast.error(response.data.message || 'Failed to submit request');
            }
        } catch (error) {
            console.error("Submission Error:", error);
            setShowProgress(false);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(`Server Error: ${error.response.data.message}`);
            } else {
                toast.error(error.message || 'Something went wrong');
            }
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
                            {/* Image Upload Column - Updated for Multiple Images */}
                            <div className="w-full md:w-4/12 flex flex-col gap-4">
                                <div className={previewUrls.length === 0 ? "flex justify-center" : "grid grid-cols-2 gap-2"}>
                                    <AnimatePresence>
                                        {previewUrls.map((url, idx) => (
                                            <motion.div
                                                key={`preview-${idx}`}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.5 }}
                                                className="relative aspect-square rounded-xl overflow-hidden border border-silk-200 dark:border-silk-800"
                                            >
                                                <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                                                    className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full hover:bg-red-500 transition-colors backdrop-blur-md"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>

                                    {/* Upload Button */}
                                    <div
                                        className={`relative ${previewUrls.length === 0 ? 'w-full aspect-[4/3] max-w-xs' : 'aspect-square'} rounded-2xl border border-dashed transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col items-center justify-center text-silk-400 dark:text-silk-600 hover:text-silk-600 dark:hover:text-silk-400 hover:border-silk-400 dark:hover:border-silk-600 bg-silk-50/50 dark:bg-black/20 border-silk-200 dark:border-silk-800`}
                                        onClick={() => fileInputRef.current?.click()}
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                    >
                                        <Upload className="w-8 h-8 mb-2 opacity-70" strokeWidth={1.5} />
                                        <span className="text-[10px] uppercase tracking-widest font-medium">Upload images</span>
                                    </div>
                                </div>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleImageChange} />
                                <p className="text-[10px] text-center text-silk-400 dark:text-silk-600">Max 5MB per image. Multiple images supported.</p>
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

                                {/* Address Selection */}
                                <div className="border-t border-silk-200 dark:border-silk-800 pt-6 mt-2 animate-fade-in">
                                    <h4 className="font-medium text-silk-900 dark:text-silk-100 mb-4 flex items-center gap-2">
                                        <Info className="w-4 h-4" /> Shipping Details
                                    </h4>

                                    {/* Selection Boxes Grid */}
                                    <div className="grid grid-cols-1 gap-4 mb-6">

                                        {/* Primary Address Card */}
                                        {(() => {
                                            const primaryAddr = normalizeAddress(userData?.address, userData?.phone);
                                            const isSelected = selectedAddressIndex === -1 && addressMode !== 'new';
                                            const displayAddr = (isSelected && addressMode === 'edit') ? addressData : primaryAddr;

                                            return (
                                                <div
                                                    onClick={() => {
                                                        setSelectedAddressIndex(-1);
                                                        setSelectedSavedAddress(primaryAddr);
                                                        setAddressData(primaryAddr);
                                                        setAddressMode('saved');
                                                    }}
                                                    className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-3 ${isSelected
                                                        ? 'border-silk-900 bg-silk-50 dark:border-silk-100 dark:bg-white/5'
                                                        : 'border-silk-100 dark:border-silk-800 bg-transparent hover:border-silk-300 dark:hover:border-silk-600'
                                                        }`}
                                                >
                                                    {isSelected && (
                                                        <div className="absolute top-3 right-3 text-silk-900 dark:text-green-500">
                                                            <CheckCircle2 className="w-5 h-5 fill-current" />
                                                        </div>
                                                    )}

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedAddressIndex(-1);
                                                            setSelectedSavedAddress(primaryAddr);
                                                            setAddressData(primaryAddr);
                                                            setAddressMode('edit');
                                                        }}
                                                        className="absolute bottom-3 right-3 p-1.5 hover:bg-silk-200 dark:hover:bg-white/20 rounded-full transition-colors z-10"
                                                        title="Edit Address"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5 text-silk-600 dark:text-silk-300" />
                                                    </button>

                                                    <div className="w-10 h-10 rounded-full bg-silk-100 dark:bg-silk-900 flex items-center justify-center text-silk-900 dark:text-silk-100">
                                                        <MapPin className="w-5 h-5" />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-sm text-silk-900 dark:text-silk-50 mb-1">
                                                            {(isSelected && addressMode === 'edit')
                                                                ? 'Editing Primary...'
                                                                : (displayAddr.firstName ? `${displayAddr.firstName} ${displayAddr.lastName}` : 'Primary Address')}
                                                        </p>
                                                        {displayAddr.street ? (
                                                            <div className="flex flex-col text-[11px] leading-tight text-silk-600 dark:text-silk-400">
                                                                <p className="truncate font-medium text-silk-800 dark:text-silk-300">{displayAddr.street}</p>
                                                                {displayAddr.landmark && <p className="truncate">{displayAddr.landmark}</p>}
                                                                <p className="truncate">{displayAddr.city}, {displayAddr.state} {displayAddr.zip}</p>
                                                                <p className="truncate">{displayAddr.country}</p>
                                                                {displayAddr.phone && <p className="mt-1 opacity-80">{displayAddr.phone}</p>}
                                                            </div>
                                                        ) : (
                                                            <p className="text-xs text-silk-400 italic">No address set</p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                        {/* Other Addresses Cards */}
                                        {userData?.address?.otherAddresses?.map((addr, i) => {
                                            const thisAddr = normalizeAddress(addr, userData?.phone);
                                            const isSelected = selectedAddressIndex === i && addressMode !== 'new';
                                            const displayAddr = (isSelected && addressMode === 'edit') ? addressData : thisAddr;

                                            return (
                                                <div
                                                    key={`other-${i}`}
                                                    onClick={() => {
                                                        setSelectedAddressIndex(i);
                                                        setSelectedSavedAddress(thisAddr);
                                                        setAddressData(thisAddr);
                                                        setAddressMode('saved');
                                                    }}
                                                    className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-3 ${isSelected
                                                        ? 'border-silk-900 bg-silk-50 dark:border-silk-100 dark:bg-white/5'
                                                        : 'border-silk-100 dark:border-silk-800 bg-transparent hover:border-silk-300 dark:hover:border-silk-600'
                                                        }`}
                                                >
                                                    {isSelected && (
                                                        <div className="absolute top-3 right-3 text-silk-900 dark:text-green-500">
                                                            <CheckCircle2 className="w-5 h-5 fill-current" />
                                                        </div>
                                                    )}

                                                    <div className="absolute bottom-3 right-3 flex gap-2 z-10">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedAddressIndex(i);
                                                                setSelectedSavedAddress(thisAddr);
                                                                setAddressData(thisAddr);
                                                                setAddressMode('edit');
                                                            }}
                                                            className="p-1.5 hover:bg-silk-200 dark:hover:bg-white/20 rounded-full transition-colors"
                                                            title="Edit Address"
                                                        >
                                                            <Pencil className="w-3.5 h-3.5 text-silk-600 dark:text-silk-300" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleDeleteAddress(i, 'secondary', e)}
                                                            className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors group"
                                                            title="Delete Address"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5 text-silk-400 group-hover:text-red-500 transition-colors" />
                                                        </button>
                                                    </div>

                                                    <div className="w-10 h-10 rounded-full bg-silk-100 dark:bg-silk-900 flex items-center justify-center text-silk-900 dark:text-silk-100">
                                                        <MapPin className="w-5 h-5" />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-sm text-silk-900 dark:text-silk-50 mb-1">
                                                            {(isSelected && addressMode === 'edit')
                                                                ? 'Editing Address...'
                                                                : (displayAddr.firstName ? `${displayAddr.firstName} ${displayAddr.lastName}` : `Saved Address ${i + 1}`)}
                                                        </p>
                                                        {displayAddr.street ? (
                                                            <div className="flex flex-col text-[11px] leading-tight text-silk-600 dark:text-silk-400">
                                                                <p className="truncate font-medium text-silk-800 dark:text-silk-300">{displayAddr.street}</p>
                                                                {displayAddr.landmark && <p className="truncate">{displayAddr.landmark}</p>}
                                                                <p className="truncate">{displayAddr.city}, {displayAddr.state} {displayAddr.zip}</p>
                                                                <p className="truncate">{displayAddr.country}</p>
                                                                {displayAddr.phone && <p className="mt-1 opacity-80">{displayAddr.phone}</p>}
                                                            </div>
                                                        ) : (
                                                            <p className="text-xs text-silk-400 italic">Empty saved address</p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Legacy Addresses (Backward Compatibility) */}
                                        {userData?.addresses?.map((addr, i) => {
                                            const thisAddr = normalizeAddress(addr, userData?.phone);
                                            // Legacy addresses are treated as 'new' inputs initially to encourage saving to new schema
                                            // Or we can just just populate the form. We won't mark them as 'Saved' mode because they aren't in the new list index.
                                            // Let's mark them visually but keep addressMode as 'new' so saving creates a NEW entry in the proper place.
                                            const isSelected = JSON.stringify(addressData.street) === JSON.stringify(thisAddr.street) && addressMode === 'new';

                                            return (
                                                <div
                                                    key={`legacy-${i}`}
                                                    onClick={() => {
                                                        setSelectedAddressIndex(-2); // Special index for unindexed/legacy
                                                        setSelectedSavedAddress(thisAddr);
                                                        setAddressData(thisAddr);
                                                        setAddressMode('new'); // Treat as new so it saves to new schema
                                                    }}
                                                    className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-3 ${isSelected
                                                        ? 'border-silk-900 bg-silk-50 dark:border-silk-100 dark:bg-white/5'
                                                        : 'border-silk-100 dark:border-silk-800 bg-transparent hover:border-silk-300 dark:hover:border-silk-600'
                                                        }`}
                                                >
                                                    <div className="absolute bottom-3 right-3 flex gap-2 z-10">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedAddressIndex(-2);
                                                                setSelectedSavedAddress(thisAddr);
                                                                setAddressData(thisAddr);
                                                                setAddressMode('new');
                                                            }}
                                                            className="p-1.5 hover:bg-silk-200 dark:hover:bg-white/20 rounded-full transition-colors"
                                                            title="Edit/Copy Address"
                                                        >
                                                            <Pencil className="w-3.5 h-3.5 text-silk-600 dark:text-silk-300" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleDeleteAddress(i, 'legacy', e)}
                                                            className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors group"
                                                            title="Delete Address"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5 text-silk-400 group-hover:text-red-500 transition-colors" />
                                                        </button>
                                                    </div>

                                                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
                                                        <MapPin className="w-5 h-5" />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-sm text-silk-900 dark:text-silk-50 mb-1">
                                                            Legacy Address
                                                        </p>
                                                        <div className="flex flex-col text-[11px] leading-tight text-silk-600 dark:text-silk-400">
                                                            <p className="truncate font-medium text-silk-800 dark:text-silk-300">{thisAddr.street}</p>
                                                            <p className="truncate">{thisAddr.city}, {thisAddr.state} {thisAddr.zip}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* New Address Button Card */}
                                        <div
                                            onClick={switchToNewAddress}
                                            className="relative p-5 rounded-2xl border-2 border-silk-100 dark:border-silk-800 bg-transparent hover:border-silk-300 dark:hover:border-silk-600 transition-all cursor-pointer flex flex-col gap-3"
                                        >

                                            <div className="w-10 h-10 rounded-full bg-silk-100 dark:bg-silk-900 flex items-center justify-center text-silk-900 dark:text-silk-100">
                                                <Plus className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-silk-900 dark:text-silk-50 mb-1">Add New Address</p>
                                                <p className="text-xs text-silk-600 dark:text-silk-400">Ship to a different location</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form Fields - Show if adding new or editing */}
                                    <AnimatePresence>
                                        {(addressMode === 'new' || addressMode === 'edit') && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden"
                                            >
                                                <input
                                                    name="firstName"
                                                    value={addressData.firstName}
                                                    onChange={handleAddressChange}
                                                    placeholder="First Name"
                                                    className="w-full bg-transparent border-b border-silk-200 dark:border-silk-800 py-2 text-sm focus:outline-none focus:border-silk-900 dark:text-white dark:placeholder-silk-700"
                                                    required
                                                />
                                                <input
                                                    name="lastName"
                                                    value={addressData.lastName}
                                                    onChange={handleAddressChange}
                                                    placeholder="Last Name"
                                                    className="w-full bg-transparent border-b border-silk-200 dark:border-silk-800 py-2 text-sm focus:outline-none focus:border-silk-900 dark:text-white dark:placeholder-silk-700"
                                                    required
                                                />

                                                <input
                                                    name="street"
                                                    value={addressData.street}
                                                    onChange={handleAddressChange}
                                                    placeholder="Street Address"
                                                    className="w-full bg-transparent border-b border-silk-200 dark:border-silk-800 py-2 text-sm focus:outline-none focus:border-silk-900 dark:text-white dark:placeholder-silk-700"
                                                    required
                                                />
                                                <input name="city" value={addressData.city} onChange={handleAddressChange} placeholder="City" className="w-full bg-transparent border-b border-silk-200 dark:border-silk-800 py-2 text-sm focus:outline-none focus:border-silk-900 dark:text-white placeholder-silk-300 dark:placeholder-silk-700" required />
                                                <input name="zip" value={addressData.zip} onChange={handleAddressChange} placeholder="Zip Code" className="w-full bg-transparent border-b border-silk-200 dark:border-silk-800 py-2 text-sm focus:outline-none focus:border-silk-900 dark:text-white placeholder-silk-300 dark:placeholder-silk-700" required />
                                                <input name="landmark" value={addressData.landmark} onChange={handleAddressChange} placeholder="Landmark (Optional)" className="w-full bg-transparent border-b border-silk-200 dark:border-silk-800 py-2 text-sm focus:outline-none focus:border-silk-900 dark:text-white placeholder-silk-300 dark:placeholder-silk-700" />
                                                <input name="state" value={addressData.state} onChange={handleAddressChange} placeholder="State" className="w-full bg-transparent border-b border-silk-200 dark:border-silk-800 py-2 text-sm focus:outline-none focus:border-silk-900 dark:text-white placeholder-silk-300 dark:placeholder-silk-700" required />
                                                <input name="country" value={addressData.country} onChange={handleAddressChange} placeholder="Country" className="w-full bg-transparent border-b border-silk-200 dark:border-silk-800 py-2 text-sm focus:outline-none focus:border-silk-900 dark:text-white placeholder-silk-300 dark:placeholder-silk-700" required />
                                                <input name="phone" value={addressData.phone} onChange={handleAddressChange} placeholder="Phone Number" className="w-full bg-transparent border-b border-silk-200 dark:border-silk-800 py-2 text-sm focus:outline-none focus:border-silk-900 dark:text-white placeholder-silk-300 dark:placeholder-silk-700" required />

                                                {(addressMode === 'edit' || addressMode === 'new') && (
                                                    <div className="col-span-1 md:col-span-2 pt-2 flex justify-end">
                                                        <button
                                                            type="button"
                                                            onClick={handleSaveAddress}
                                                            disabled={isSavingAddress || showSaveSuccess}
                                                            className={`px-4 py-2 rounded-lg text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${showSaveSuccess
                                                                ? 'bg-green-500 text-white'
                                                                : 'bg-silk-900 dark:bg-silk-100 text-white dark:text-black hover:bg-silk-800 dark:hover:bg-white'
                                                                }`}
                                                        >
                                                            {isSavingAddress ? (
                                                                <span className="flex items-center gap-2">
                                                                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                                    Saving...
                                                                </span>
                                                            ) : showSaveSuccess ? (
                                                                <span className="flex items-center gap-2">
                                                                    <CheckCircle2 className="w-4 h-4" />
                                                                    Saved!
                                                                </span>
                                                            ) : (
                                                                addressMode === 'new' ? 'Save New Address' : 'Save Changes'
                                                            )}
                                                        </button>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`w-full bg-silk-900 dark:bg-silk-100 text-white dark:text-black py-4 rounded-xl text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300 shadow-lg hover:shadow-xl ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-silk-800 dark:hover:bg-white'}`}
                                >
                                    {loading ? 'Processing...' : (token ? 'Request Quote' : 'Login to Request')}
                                </motion.button>

                                <div className="mt-4 text-center">
                                    <button
                                        type="button"
                                        onClick={() => setIsGalleryOpen(true)}
                                        className="text-xs uppercase tracking-widest text-silk-600 dark:text-silk-400 hover:text-silk-900 dark:hover:text-silk-200 transition-colors border-b border-transparent hover:border-silk-900 dark:hover:border-silk-200 pb-0.5"
                                    >
                                        Need a suggestion? Pick from Gallery
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </FadeContent>
            </div>

            {/* Gallery Picker Modal */}
            <AnimatePresence>
                {isGalleryOpen && (
                    <div className="fixed inset-0 z-[60] bg-white dark:bg-black overflow-y-auto animate-fade-in p-6 md:p-12">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="font-serif text-2xl md:text-3xl text-silk-900 dark:text-silk-50 mb-2">Pick a Design</h2>
                                    <p className="text-sm text-silk-600 dark:text-silk-400">Select an image to use as a reference</p>
                                </div>
                                <button
                                    onClick={() => setIsGalleryOpen(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-8 h-8 text-silk-900 dark:text-silk-50" />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
                                {gallery.map((item, index) => (
                                    <div
                                        key={item._id}
                                        onClick={() => setSelectedIndex(index)}
                                        className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-gray-100 dark:bg-white/5 border border-transparent hover:border-silk-500 transition-all"
                                    >
                                        <img
                                            src={optimizeImageUrl(item.image, 300)}
                                            loading="lazy"
                                            alt="Idea"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* Full Screen Image View */}
            {selectedIndex !== null && gallery[selectedIndex] && (
                <div
                    className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 p-4 animate-fade-in backdrop-blur-sm"
                    onClick={() => setSelectedIndex(null)}
                >
                    <div className="relative max-w-4xl w-full flex flex-col items-center gap-6" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedIndex(null)}
                            className="absolute top-0 right-0 -mt-14 sm:-mr-12 sm:mt-0 text-white/70 hover:text-white transition-colors p-2 z-50"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <button
                            onClick={(e) => { e.stopPropagation(); setSelectedIndex((prev) => (prev - 1 + gallery.length) % gallery.length); }}
                            className="absolute left-[-20px] sm:left-[-60px] top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors hidden sm:block"
                        >
                            <ChevronLeft className="w-10 h-10" />
                        </button>

                        <button
                            onClick={(e) => { e.stopPropagation(); setSelectedIndex((prev) => (prev + 1) % gallery.length); }}
                            className="absolute right-[-20px] sm:right-[-60px] top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors hidden sm:block"
                        >
                            <ChevronRight className="w-10 h-10" />
                        </button>

                        <img
                            src={gallery[selectedIndex].image}
                            alt="Full view"
                            className="max-h-[70vh] w-auto object-contain rounded-lg shadow-2xl select-none"
                        />

                        <button
                            onClick={() => confirmGallerySelection(gallery[selectedIndex].image)}
                            className="bg-white text-black px-10 py-3 rounded-full font-serif uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                            Use This Design
                        </button>
                    </div>
                </div>
            )}

            {/* AnimatePresence for Progress (kept for structure) */}

            {/* Progress Popup */}
            <AnimatePresence>
                {showProgress && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white dark:bg-[#1a1a1a] p-8 rounded-2xl w-full max-w-sm shadow-2xl text-center"
                        >
                            <h3 className="font-serif text-2xl mb-2 text-silk-900 dark:text-silk-50">
                                {progress === 100 ? 'Success!' : 'Submitting...'}
                            </h3>
                            <p className="text-silk-600 dark:text-silk-400 text-sm mb-6">
                                {progress === 100 ? 'Your custom order request has been received.' : 'Please wait while we upload your details.'}
                            </p>

                            <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-2">
                                <motion.div
                                    className="h-full bg-silk-900 dark:bg-white"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                            <span className="text-xs font-mono text-silk-400">{progress}%</span>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default CustomOrder;
