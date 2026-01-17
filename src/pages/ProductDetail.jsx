import React, { useState, useEffect, useContext } from 'react';
import { useDrag } from '@use-gesture/react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { Star, Heart, ShoppingBag, ChevronLeft, ChevronRight, Truck, ShieldCheck, ArrowLeft, Share2, Play, Maximize2, X, Check, Loader2 } from 'lucide-react';
import QToast from './uiComponents/QToast';
import freeSizeIcon from '../assets/centimeter.png';

function ProductDetail() {
    const { id } = useParams();
    const { products, addToCart, userData, addToWishlist, removeFromWishlist, navigate, token, addToRecentlyViewed } = useContext(ShopContext);
    const [product, setProduct] = useState(null)
    const [activeImage, setActiveImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [size, setSize] = useState("");
    const [color, setColor] = useState("");
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const location = useLocation();

    const handleBuyNow = () => {
        if (!token) {
            QToast.error('Please login to buy products', { position: "top-center" });
            navigate('/account', { state: { from: location } });
            return;
        }

        if (product.sizes && product.sizes.length > 0 && !size) {
            QToast.error('Select Product Size', { position: "top-center" });
            return;
        }
        if (product.colors && product.colors.length > 0 && !color) {
            QToast.error('Select Product Color', { position: "top-center" });
            return;
        }

        navigate('/place-order', { state: { product, size, quantity, color } });
    }

    const fetchProductData = async () => {
        products.map((item) => {
            if (item._id === id) {
                setProduct(item)
                addToRecentlyViewed(item._id); // Add to recently viewed
                setActiveImage(0);
                if (item.defaultSize && item.sizes.includes(item.defaultSize)) {
                    setSize(item.defaultSize);
                }
                return null;
            }
        })
    }

    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        fetchProductData();
    }, [id, products])

    useEffect(() => {
        if (product && products.length > 0) {
            const related = products.filter(item => item.category === product.category && item._id !== product._id);
            setRelatedProducts(related.slice(0, 5));
        }
    }, [product, products]);

    const isInWishlist = userData?.wishlist?.some(item => item.productId === product?._id);

    const handleWishlistToggle = () => {
        if (isInWishlist) {
            removeFromWishlist(product._id);
        } else {
            addToWishlist(product);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: `Check out ${product.name} on Aalaboo`,
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

    // Scroll to top when product loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const nextImage = () => {
        if (product && product.image) {
            setActiveImage((prev) => (prev + 1) % product.image.length);
        }
    };

    const prevImage = () => {
        if (product && product.image) {
            setActiveImage((prev) => (prev - 1 + product.image.length) % product.image.length);
        }
    };

    const isVideo = (url) => {
        if (!url) return false;
        return url.match(/\.(mp4|webm|ogg|mov|avi|mkv)($|\?)/i) || url.includes('/video/upload/');
    };

    const bind = useDrag(({ swipe: [swipeX] }) => {
        if (swipeX === -1) {
            nextImage();
        } else if (swipeX === 1) {
            prevImage();
        }
    });

    if (!product) {
        return (
            <div className="min-h-screen pt-32 px-4 text-center dark:bg-black">
                <h2 className="text-2xl font-serif text-silk-900 dark:text-white mb-4">Product not found</h2>
                <Link to="/collection" className="text-silk-600 dark:text-silk-400 hover:text-silk-900 dark:hover:text-white underline">Back to Shop</Link>
            </div>
        );
    }

    return (
        <div className="pt-24 px-4 max-w-7xl mx-auto">
            {/* Breadcrumb / Back */}
            <div className="mb-8">
                <Link to="/collection" className="inline-flex items-center text-silk-600 hover:text-silk-900 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Collection
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                {/* Image Gallery */}
                <div className="space-y-6">
                    <div {...bind()} className="relative aspect-[4/5] bg-silk-100 dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm group touch-pan-y">
                        {isVideo(product.image[activeImage]) ? (
                            <div className="relative w-full h-full cursor-pointer" onClick={() => setIsFullscreen(true)}>
                                <video
                                    src={product.image[activeImage]}
                                    className="w-full h-full object-cover transition-opacity duration-500"
                                    muted
                                    playsInline
                                    loop // loop for preview if needed, but static is better for performance if not playing
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                                    <div className="bg-white/90 dark:bg-black/80 backdrop-blur-sm p-4 rounded-full shadow-lg transform group-hover:scale-110 transition-transform">
                                        <Play className="w-8 h-8 text-silk-900 dark:text-white fill-current" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full cursor-pointer" onClick={() => setIsFullscreen(true)}>
                                <img
                                    src={product.image[activeImage]}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-opacity duration-500"
                                />
                            </div>
                        )}



                        {/* Navigation Arrows */}
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
                    </div>

                    {/* Thumbnails */}
                    <div className="flex space-x-4 overflow-x-auto pb-2">
                        {product.image.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveImage(index)}
                                className={`relative w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeImage === index ? 'border-silk-900' : 'border-transparent hover:border-silk-300'}`}
                            >
                                {isVideo(img) ? (
                                    <video src={img} className="w-full h-full object-cover" muted />
                                ) : (
                                    <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Details */}
                <div className="flex flex-col">
                    <div className="mb-2">
                        {product.category !== 'Not applicable' && (
                            <span className="text-sm font-medium text-silk-500 dark:text-silk-400 uppercase tracking-wider">{product.category}</span>
                        )}
                    </div>
                    <h1 className="text-2xl md:text-4xl font-serif text-silk-900 dark:text-white mb-4">{product.name}</h1>

                    <div className="flex items-center space-x-4 mb-6">
                        <div className="flex items-center text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating || 0) ? 'fill-current' : 'text-gray-300'}`} />
                            ))}
                        </div>
                        <span className="text-silk-400 text-sm">|</span>
                        <span className="text-silk-600 text-sm">{product.numReviews || 0} Reviews</span>
                    </div>

                    <p className="text-xl md:text-2xl font-light text-silk-900 dark:text-silk-200 mb-8">
                        ₹{(size && product.sizePrices && product.sizePrices[size]
                            ? Number(product.sizePrices[size])
                            : (product.sizePrices && Object.values(product.sizePrices).length > 0 ? Number(Object.values(product.sizePrices)[0]) : 0)
                        ).toFixed(2)}
                    </p>

                    <div className="prose prose-sm md:prose-base prose-silk dark:prose-invert text-silk-700 dark:text-silk-300 mb-10 leading-relaxed">
                        <p>{product.description}</p>
                    </div>

                    <div className="flex flex-row gap-8 my-8">
                        {product.sizes.length > 0 && (
                            <div className="flex flex-col gap-4">
                                <p className="text-sm font-medium text-silk-900 dark:text-silk-50">Size</p>
                                <div className="flex gap-2">
                                    {product.sizes.map((item, index) => (
                                        <button
                                            onClick={() => setSize(item)}
                                            className={`${item.toLowerCase() === 'free size' ? 'h-auto w-auto p-1 rounded-none border-0' : 'h-8 w-8 rounded-full border'} flex items-center justify-center text-xs transition-all ${item.toLowerCase() === 'free size'
                                                ? (item === size ? 'opacity-100 scale-110' : 'opacity-50 hover:opacity-80')
                                                : (item === size ? 'bg-silk-50 border-silk-500 dark:bg-white dark:text-black dark:border-white' : 'bg-gray-100 border-transparent dark:bg-slate-800 dark:text-gray-300 dark:border-slate-700 hover:border-silk-300')
                                                }`}
                                            key={index}
                                            title={item}
                                        >
                                            {item.toLowerCase() === 'free size' ? (
                                                <div className="flex flex-col items-center gap-1">
                                                    <img src={freeSizeIcon} alt="Free Size" className="h-8 w-auto object-contain" />
                                                    <span className="text-[10px] text-gray-400 font-medium">Free Size</span>
                                                </div>
                                            ) : (
                                                item
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.colors && product.colors.length > 0 && (
                            <div className="flex flex-col gap-4">
                                <p className="text-sm font-medium text-silk-900 dark:text-silk-50">Color</p>
                                <div className="flex gap-2">
                                    {product.colors.map((item, index) => (
                                        <button
                                            onClick={() => setColor(item)}
                                            className={`w-8 h-8 rounded-full border shadow-sm flex items-center justify-center transition-all ${item === color ? 'border-silk-900 dark:border-white scale-110' : 'border-gray-200'}`}
                                            style={{ backgroundColor: item.toLowerCase() }}
                                            key={index}
                                            title={item}
                                        >
                                            {item === color && <Check className="w-4 h-4 text-white drop-shadow-[0_0_1px_rgba(0,0,0,1)]" strokeWidth={3} />}
                                        </button>
                                    ))}
                                </div>
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
                                onClick={handleWishlistToggle}
                                className={`p-3 border rounded-full transition-colors flex items-center justify-center ${isInWishlist
                                    ? 'border-red-200 bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800'
                                    : 'border-silk-200 dark:border-silk-700 hover:bg-silk-50 dark:hover:bg-white/10 text-silk-600 dark:text-silk-300'
                                    }`}
                                title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                            >
                                <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
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

                                    if (product.sizes && product.sizes.length > 0 && !size) {
                                        QToast.error('Select Product Size', { position: "top-center" });
                                        return;
                                    }
                                    if (product.colors && product.colors.length > 0 && !color) {
                                        QToast.error('Select Product Color', { position: "top-center" });
                                        return;
                                    }

                                    setIsAdding(true);
                                    await addToCart(product._id, size, quantity);
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



            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <div className="mt-20 border-t border-gray-100 dark:border-gray-800 pt-16">
                    <h2 className="text-xl md:text-2xl font-serif text-silk-900 dark:text-white mb-8 text-center">You May Also Like</h2>
                    <div className="flex gap-4 overflow-x-auto pb-8 hide-scrollbar snap-x snap-mandatory px-4 md:justify-center">
                        {relatedProducts.map((item) => (
                            <Link
                                to={`/product/${item._id}`}
                                key={item._id}
                                className="min-w-[140px] md:min-w-[180px] max-w-[180px] snap-center group block bg-white dark:bg-white/5 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all"
                            >
                                <div className="relative aspect-[4/5] rounded-lg overflow-hidden mb-3 bg-gray-100 dark:bg-gray-800">
                                    <img
                                        src={item.image[0]}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <h3 className="font-medium text-sm text-silk-900 dark:text-white truncate font-serif mb-1">{item.name}</h3>
                                <p className="text-xs text-silk-500 dark:text-silk-400 font-medium">₹{item.price}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Reviews Section */}
            <div className="mt-20">
                <div className="text-center mb-12">
                    <h2 className="text-xl md:text-3xl font-serif text-silk-900 dark:text-white mb-4">Customer Reviews</h2>
                    <div className="flex items-center justify-center gap-2">
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-5 h-5 ${i < Math.round(product.rating || 0) ? 'fill-current' : 'text-gray-300'}`} />
                            ))}
                        </div>
                        <p className="text-silk-600 dark:text-silk-300 font-medium">
                            {product.rating ? product.rating.toFixed(1) : '0'} / 5
                            <span className="text-gray-400 mx-2">•</span>
                            {product.numReviews || 0} Reviews
                        </p>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto space-y-8">
                    {product.reviews && product.reviews.length > 0 ? (
                        product.reviews.map((review, index) => (
                            <div key={index} className="bg-silk-50 dark:bg-gray-900 p-6 rounded-2xl animate-fade-in text-left">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-silk-200 dark:bg-gray-700 flex items-center justify-center text-silk-700 dark:text-white font-bold">
                                            {review.userName ? review.userName.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <div>
                                            <p className="font-medium text-silk-900 dark:text-white">{review.userName || 'Anonymous'}</p>
                                            <div className="flex text-yellow-400 text-xs">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(review.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-left">
                                    {review.comment}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                            <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review this product!</p>
                        </div>
                    )}
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
                        {isVideo(product.image[activeImage]) ? (
                            <video
                                src={product.image[activeImage]}
                                className="max-w-full max-h-full rounded-lg shadow-2xl"
                                controls
                                autoPlay
                            />
                        ) : (
                            <img
                                src={product.image[activeImage]}
                                alt={product.name}
                                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                            />
                        )}
                    </div>

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] p-2">
                        {product.image.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveImage(index)}
                                className={`relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${activeImage === index ? 'border-white' : 'border-white/20 hover:border-white/50'}`}
                            >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                                {isVideo(img) && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                        <Play className="w-4 h-4 text-white fill-current" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductDetail;
