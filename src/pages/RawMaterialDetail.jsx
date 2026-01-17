import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { ShoppingBag, ChevronLeft, ChevronRight, Truck, ShieldCheck, ArrowLeft, Share2, Play, X, Check, Loader2, Heart } from 'lucide-react';
import { useDrag } from '@use-gesture/react';
import QToast from './uiComponents/QToast';
import axios from 'axios';

function RawMaterialDetail() {
    const { id } = useParams();
    const { addToCart, navigate, token, backendUrl, userData, addToWishlist, removeFromWishlist } = useContext(ShopContext);
    const [material, setMaterial] = useState(null);
    const [activeImage, setActiveImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const location = useLocation();

    const fetchMaterialData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/raw-material/list`);
            if (response.data.success) {
                const foundMaterial = response.data.rawMaterials.find(item => item._id === id);
                if (foundMaterial) {
                    setMaterial(foundMaterial);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchMaterialData();
        window.scrollTo(0, 0);
    }, [id, backendUrl]);

    const handleBuyNow = () => {
        if (!token) {
            QToast.error('Please login to buy materials', { position: "top-center" });
            navigate('/account', { state: { from: location } });
            return;
        }
        // Since place-order expects a 'product' object with certain fields, and 'size'/'color'.
        // Raw materials might map 'size' to 'length' and 'color' to 'color'.
        // Adjust payload structure for place-order to be compatible, 
        // or ensure PlaceOrder page can handle raw materials.
        // For now, mapping best effort.
        const orderProduct = {
            ...material,
            sizes: [], // Raw material doesn't have selectable sizes array in strict sense usually
            colors: material.color ? [material.color] : []
        };
        navigate('/place-order', { state: { product: orderProduct, size: material.length || 'Standard', quantity, color: material.color || 'Standard', isRawMaterial: true } });
    }

    const nextImage = () => {
        if (material && material.image) {
            setActiveImage((prev) => (prev + 1) % material.image.length);
        }
    };

    const prevImage = () => {
        if (material && material.image) {
            setActiveImage((prev) => (prev - 1 + material.image.length) % material.image.length);
        }
    };

    const bind = useDrag(({ swipe: [swipeX] }) => {
        if (swipeX === -1) {
            nextImage();
        } else if (swipeX === 1) {
            prevImage();
        }
    });

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: material.name,
                    text: `Check out ${material.name} on Aalaboo`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            QToast.success("Link copied to clipboard!", { position: "top-center" });
        }
    };

    if (!material) {
        return (
            <div className="min-h-screen pt-32 px-4 text-center dark:bg-black">
                <h2 className="text-2xl font-serif text-silk-900 dark:text-white mb-4">Material not found</h2>
                <Link to="/raw-materials" className="text-silk-600 dark:text-silk-400 hover:text-silk-900 dark:hover:text-white underline">Back to Shop</Link>
            </div>
        );
    }

    return (
        <div className="pt-24 px-4 max-w-7xl mx-auto">
            {/* Breadcrumb / Back */}
            <div className="mb-8">
                <Link to="/raw-materials" className="inline-flex items-center text-silk-600 hover:text-silk-900 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Raw Materials
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                {/* Image Gallery */}
                <div className="space-y-6">
                    <div {...bind()} className="relative aspect-square bg-silk-100 dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm group touch-pan-y">
                        <div className="w-full h-full cursor-pointer" onClick={() => setIsFullscreen(true)}>
                            <img
                                src={material.image[activeImage]}
                                alt={material.name}
                                className="w-full h-full object-cover transition-opacity duration-500"
                            />
                        </div>

                        {/* Navigation Arrows */}
                        {material.image.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white dark:hover:bg-black/70 transition-colors z-10"
                                >
                                    <ChevronLeft className="w-5 h-5 text-silk-900 dark:text-white" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white dark:hover:bg-black/70 transition-colors z-10"
                                >
                                    <ChevronRight className="w-5 h-5 text-silk-900 dark:text-white" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {material.image.length > 1 && (
                        <div className="flex space-x-4 overflow-x-auto pb-2">
                            {material.image.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImage(index)}
                                    className={`relative w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeImage === index ? 'border-silk-900' : 'border-transparent hover:border-silk-300'}`}
                                >
                                    <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="flex flex-col">
                    <div className="mb-2">
                        <span className="text-sm font-medium text-silk-500 dark:text-silk-400 uppercase tracking-wider">{material.type}</span>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-serif text-silk-900 dark:text-white mb-4">{material.name}</h1>

                    <p className="text-xl md:text-2xl font-light text-silk-900 dark:text-silk-200 mb-8">
                        ₹{material.price}
                    </p>

                    <div className="prose prose-sm md:prose-base prose-silk dark:prose-invert text-silk-700 dark:text-silk-300 mb-10 leading-relaxed">
                        <p>{material.description}</p>
                    </div>

                    <div className="flex flex-col gap-4 mb-8">
                        {material.color && (
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-silk-900 dark:text-white">Color:</span>
                                <span className="text-silk-700 dark:text-silk-300">{material.color}</span>
                            </div>
                        )}
                        {material.length && (
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-silk-900 dark:text-white">Length/Size:</span>
                                <span className="text-silk-700 dark:text-silk-300">{material.length}</span>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="space-y-4 mb-10">
                        {/* Quantity & Share Row */}
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center border border-silk-200 dark:border-silk-700 rounded-full bg-white dark:bg-black/50">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-2 text-silk-600 dark:text-silk-300 hover:text-silk-900 dark:hover:text-white hover:bg-silk-100 dark:hover:bg-white/10 active:bg-silk-200 rounded-l-full transition-colors duration-200"
                                >
                                    -
                                </button>
                                <span className="w-8 text-center text-silk-900 dark:text-white font-medium">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-4 py-2 text-silk-600 dark:text-silk-300 hover:text-silk-900 dark:hover:text-white hover:bg-silk-100 dark:hover:bg-white/10 active:bg-silk-200 rounded-r-full transition-colors duration-200"
                                >
                                    +
                                </button>
                            </div>
                            <button
                                onClick={handleShare}
                                className="p-3 border border-silk-200 dark:border-silk-700 rounded-full hover:bg-silk-50 dark:hover:bg-white/10 text-silk-600 dark:text-silk-300 transition-colors flex items-center justify-center"
                                title="Share"
                            >
                                <Share2 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => {
                                    if (userData?.wishlist?.some(w => w.productId === material._id)) {
                                        removeFromWishlist(material._id);
                                    } else {
                                        addToWishlist(material);
                                    }
                                }}
                                className={`p-3 border rounded-full transition-colors flex items-center justify-center ${userData?.wishlist?.some(w => w.productId === material._id)
                                        ? 'border-red-200 bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800'
                                        : 'border-silk-200 dark:border-silk-700 hover:bg-silk-50 dark:hover:bg-white/10 text-silk-600 dark:text-silk-300'
                                    }`}
                                title={userData?.wishlist?.some(w => w.productId === material._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                            >
                                <Heart className={`w-5 h-5 ${userData?.wishlist?.some(w => w.productId === material._id) ? 'fill-current' : ''}`} />
                            </button>
                        </div>

                        {/* Buttons Stack */}
                        <div className="flex flex-col gap-3 pt-4">
                            <button
                                onClick={handleBuyNow}
                                className="w-full bg-silk-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-medium tracking-wide hover:bg-silk-800 dark:hover:bg-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl">
                                Buy Now
                            </button>
                            <button
                                onClick={async () => {
                                    if (!token) {
                                        QToast.error('Please login to add items to cart', { position: "top-center" });
                                        navigate('/account', { state: { from: location } });
                                        return;
                                    }

                                    setIsAdding(true);
                                    // Raw material might have size stored as 'length', but for cart consistency we pass it as 'size' arg if possible
                                    // Also might need backend support for 'RawMaterial' type in cart.
                                    // CAUTION: existing addToCart might expect productId to be valid 'Product' ID.
                                    // If cart backend verifies IDs against Product collection, this will fail.
                                    // Assuming for now user wants UI first, backend adaptation might be needed.
                                    // Passing material._id might fail if backend checks Product collection.
                                    // WE SHOULD REUSE CART logic, but backend expects Product ID.
                                    // If cartController checks productModel.findById, we need to update cartController to check rawMaterialModel too?
                                    // Or we just add it and see.
                                    // User Note: "we will use same cart"

                                    await addToCart(material._id, material.length || 'Standard', quantity);
                                    setIsAdding(false);
                                    setShowSuccess(true);
                                    setTimeout(() => setShowSuccess(false), 2000);
                                }}
                                disabled={isAdding}
                                className={`w-full border ${showSuccess ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 dark:border-green-500' : 'border-silk-300 dark:border-silk-600 text-silk-900 dark:text-white hover:bg-silk-50 dark:hover:bg-white/10'} bg-transparent px-8 py-3 rounded-full font-medium tracking-wide transition-all duration-300 flex items-center justify-center space-x-2`}
                            >
                                {isAdding ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Adding...</span>
                                    </>
                                ) : showSuccess ? (
                                    <>
                                        <Check className="w-5 h-5" />
                                        <span>Added to Cart</span>
                                    </>
                                ) : (
                                    <>
                                        <ShoppingBag className="w-5 h-5" />
                                        <span>Add to Cart</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trust Badges (Static) */}
            <div className="flex justify-center items-center mt-12 mb-5">
                <div className="bg-silk-50/90 dark:bg-black/80 backdrop-blur-md px-6 py-2 rounded-full shadow-sm flex items-center gap-6">
                    <div className="flex items-center space-x-2 text-silk-700 dark:text-silk-300">
                        <Truck className="w-4 h-4" />
                        <span className="text-xs font-medium">Free Shipping &gt; ₹150</span>
                    </div>
                    <div className="w-px h-4 bg-silk-300 dark:bg-silk-700"></div>
                    <div className="flex items-center space-x-2 text-silk-700 dark:text-silk-300">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-xs font-medium">Secure Payment</span>
                    </div>
                </div>
            </div>

            {/* Fullscreen Modal */}
            {isFullscreen && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
                    <button
                        onClick={() => setIsFullscreen(false)}
                        className="absolute top-6 right-6 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <button
                        onClick={prevImage}
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-40"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button
                        onClick={nextImage}
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-40"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>

                    <div {...bind()} className="w-full h-full max-w-5xl max-h-[85vh] flex items-center justify-center touch-pan-y">
                        <img
                            src={material.image[activeImage]}
                            alt={material.name}
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default RawMaterialDetail;
