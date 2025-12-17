import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { Star, Heart, ShoppingBag, ChevronLeft, ChevronRight, Truck, ShieldCheck, ArrowLeft, Share2 } from 'lucide-react';
import { toast } from 'react-toastify';

function ProductDetail() {
    const { id } = useParams();
    const { products, addToCart, userData, addToWishlist, removeFromWishlist } = useContext(ShopContext);
    const [product, setProduct] = useState(null)
    const [activeImage, setActiveImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [size, setSize] = useState("");

    const fetchProductData = async () => {
        products.map((item) => {
            if (item._id === id) {
                setProduct(item)
                setActiveImage(0);
                return null;
            }
        })
    }

    useEffect(() => {
        fetchProductData();
    }, [id, products])

    const isInWishlist = userData?.wishlist?.some(item => item.productId === product?._id);

    const handleWishlistToggle = () => {
        if (isInWishlist) {
            removeFromWishlist(product._id);
        } else {
            addToWishlist(product);
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
    };

    // Scroll to top when product loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!product) {
        return (
            <div className="min-h-screen pt-32 px-4 text-center dark:bg-black">
                <h2 className="text-2xl font-serif text-silk-900 dark:text-white mb-4">Product not found</h2>
                <Link to="/collection" className="text-silk-600 dark:text-silk-400 hover:text-silk-900 dark:hover:text-white underline">Back to Shop</Link>
            </div>
        );
    }

    const nextImage = () => {
        setActiveImage((prev) => (prev + 1) % product.image.length);
    };

    const prevImage = () => {
        setActiveImage((prev) => (prev - 1 + product.image.length) % product.image.length);
    };

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
                    <div className="relative aspect-[4/5] bg-silk-100 dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm">
                        <img
                            src={product.image[activeImage]}
                            alt={product.name}
                            className="w-full h-full object-cover transition-opacity duration-500"
                        />

                        {/* Wishlist Button (On Image) */}
                        <button
                            onClick={handleWishlistToggle}
                            className={`absolute top-4 right-4 z-10 p-3 rounded-full backdrop-blur-md transition-all duration-300 shadow-sm ${isInWishlist ? 'bg-red-50/90 text-red-500' : 'bg-white/80 dark:bg-black/50 text-silk-900 dark:text-white hover:bg-white dark:hover:bg-black/70 hover:text-red-500'}`}
                        >
                            <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                        </button>

                        {/* Navigation Arrows */}
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white dark:hover:bg-black/70 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-silk-900 dark:text-white" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white dark:hover:bg-black/70 transition-colors"
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
                                <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
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
                    <h1 className="text-4xl font-serif text-silk-900 dark:text-white mb-4">{product.name}</h1>

                    <div className="flex items-center space-x-4 mb-6">
                        <div className="flex items-center text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < product.rating ? 'fill-current' : 'text-gray-300'}`} />
                            ))}
                        </div>
                        <span className="text-silk-400 text-sm">|</span>
                        <span className="text-silk-600 text-sm">42 Reviews</span>
                    </div>

                    <p className="text-2xl font-light text-silk-900 dark:text-silk-200 mb-8">₹{product.price.toFixed(2)}</p>

                    <div className="prose prose-silk dark:prose-invert text-silk-700 dark:text-silk-300 mb-10 leading-relaxed">
                        <p>{product.description}</p>
                    </div>

                    {product.sizes.length > 0 && (
                        <div className="flex flex-col gap-4 my-8">
                            <p className="text-sm font-medium text-silk-900 dark:text-silk-50">Select Size</p>
                            <div className="flex gap-2">
                                {product.sizes.map((item, index) => (
                                    <button onClick={() => setSize(item)} className={`border py-2 px-4 bg-gray-100 dark:bg-slate-800 dark:text-gray-300 dark:border-slate-700 ${item === size ? 'border-silk-500 dark:border-silk-500' : ''}`} key={index}>{item}</button>
                                ))}
                            </div>
                        </div>
                    )}

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
                        </div>

                        {/* Buttons Stack */}
                        <div className="flex flex-col gap-3 pt-4">
                            <button className="w-full bg-silk-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-medium tracking-wide hover:bg-silk-800 dark:hover:bg-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl">
                                Buy Now
                            </button>
                            <button
                                onClick={() => addToCart(product._id, size, quantity)}
                                className="w-full border border-silk-300 dark:border-silk-600 text-silk-900 dark:text-white bg-transparent px-8 py-3 rounded-full font-medium tracking-wide hover:bg-silk-50 dark:hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-2"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                <span>Add to Cart</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Trust Badges (Static) */}
            <div className="flex justify-center items-center mt-12">
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
        </div>
    );
}

export default ProductDetail;
