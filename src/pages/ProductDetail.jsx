import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { Star, Heart, ShoppingBag, ChevronLeft, ChevronRight, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';

function ProductDetail() {
    const { id } = useParams();
    const product = products.find(p => p.id === parseInt(id));
    const [activeImage, setActiveImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    // Scroll to top when product loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!product) {
        return (
            <div className="min-h-screen pt-32 px-4 text-center">
                <h2 className="text-2xl font-serif text-silk-900 mb-4">Product not found</h2>
                <Link to="/collection" className="text-silk-600 hover:text-silk-900 underline">Back to Shop</Link>
            </div>
        );
    }

    const nextImage = () => {
        setActiveImage((prev) => (prev + 1) % product.images.length);
    };

    const prevImage = () => {
        setActiveImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    };

    return (
        <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
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
                    <div className="relative aspect-[4/5] bg-silk-100 rounded-2xl overflow-hidden shadow-sm">
                        <img
                            src={product.images[activeImage]}
                            alt={product.name}
                            className="w-full h-full object-cover transition-opacity duration-500"
                        />

                        {/* Navigation Arrows */}
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-silk-900" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-silk-900" />
                        </button>
                    </div>

                    {/* Thumbnails */}
                    <div className="flex space-x-4 overflow-x-auto pb-2">
                        {product.images.map((img, index) => (
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
                        <span className="text-sm font-medium text-silk-500 uppercase tracking-wider">{product.type}</span>
                    </div>
                    <h1 className="text-4xl font-serif text-silk-900 mb-4">{product.name}</h1>

                    <div className="flex items-center space-x-4 mb-6">
                        <div className="flex items-center text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < product.rating ? 'fill-current' : 'text-gray-300'}`} />
                            ))}
                        </div>
                        <span className="text-silk-400 text-sm">|</span>
                        <span className="text-silk-600 text-sm">42 Reviews</span>
                    </div>

                    <p className="text-2xl font-light text-silk-900 mb-8">${product.price.toFixed(2)}</p>

                    <div className="prose prose-silk text-silk-700 mb-10 leading-relaxed">
                        <p>{product.description}</p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-6 mb-10">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center border border-silk-200 rounded-full">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-2 text-silk-600 hover:text-silk-900"
                                >
                                    -
                                </button>
                                <span className="w-8 text-center text-silk-900 font-medium">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-4 py-2 text-silk-600 hover:text-silk-900"
                                >
                                    +
                                </button>
                            </div>
                            <button className="flex-1 bg-silk-900 text-white px-8 py-3 rounded-full font-medium tracking-wide hover:bg-silk-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                                <ShoppingBag className="w-5 h-5" />
                                <span>Add to Cart</span>
                            </button>
                            <button className="p-3 border border-silk-200 rounded-full hover:bg-silk-50 text-silk-600 transition-colors">
                                <Heart className="w-6 h-6" />
                            </button>
                        </div>
                        <button className="w-full border border-silk-900 text-silk-900 px-8 py-3 rounded-full font-medium tracking-wide hover:bg-silk-50 transition-all duration-300">
                            Buy Now
                        </button>
                    </div>

                    {/* Features / Trust Badges */}
                    <div className="grid grid-cols-2 gap-4 pt-8 border-t border-silk-100">
                        <div className="flex items-center space-x-3 text-silk-700">
                            <Truck className="w-5 h-5" />
                            <span className="text-sm">Free Shipping over $150</span>
                        </div>
                        <div className="flex items-center space-x-3 text-silk-700">
                            <ShieldCheck className="w-5 h-5" />
                            <span className="text-sm">Secure Payment</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
