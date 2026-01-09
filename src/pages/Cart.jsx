import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Trash2, Loader2, Check, ShoppingBag } from 'lucide-react'
import { useNavigate, Link, useLocation } from 'react-router-dom';

const SmallProductCard = ({ product }) => {
    const { currency, addToCart } = useContext(ShopContext);
    const [isAdding, setIsAdding] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleAddToCart = async (e) => {
        e.preventDefault(); // Prevent navigation
        e.stopPropagation();

        setIsAdding(true);
        // Default to first size or 'Default' if no sizes
        const size = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Default';
        await addToCart(product._id, size);
        setIsAdding(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
    }

    return (
        <Link
            to={`/product/${product._id}`}
            className="min-w-[150px] md:min-w-[190px] max-w-[190px] snap-center group block bg-white dark:bg-white/5 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all relative flex flex-col"
        >
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden mb-3 bg-gray-100 dark:bg-gray-800">
                <img
                    src={product.image[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Desktop: Add to Cart Button Overlay */}
                <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className={`hidden md:flex absolute bottom-2 right-2 p-2 rounded-full shadow-lg transition-all transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 ${showSuccess
                        ? 'bg-green-500 text-white'
                        : 'bg-white dark:bg-black text-silk-900 dark:text-white hover:bg-silk-600 hover:text-white dark:hover:bg-white dark:hover:text-black'
                        }`}
                >
                    {isAdding ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : showSuccess ? (
                        <Check className="w-4 h-4" />
                    ) : (
                        <ShoppingBag className="w-4 h-4" />
                    )}
                </button>
            </div>

            <h3 className="font-medium text-sm text-silk-900 dark:text-white truncate font-serif mb-1">{product.name}</h3>
            <p className="text-xs text-silk-500 dark:text-silk-400 font-medium mb-3">{currency}{product.price}</p>

            {/* Mobile: Add to Cart Button */}
            <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`md:hidden mt-auto w-full py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${showSuccess
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-silk-50 text-silk-900 dark:bg-white/10 dark:text-white hover:bg-silk-100 dark:hover:bg-white/20'
                    }`}
            >
                {isAdding ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : showSuccess ? (
                    <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                    </>
                ) : (
                    <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to cart</span>
                    </>
                )}
            </button>
        </Link>
    );
};
import CartTotal from '../components/CartTotal';
import { RainbowButton } from "../components/ui/rainbow-button";
import QToast from './uiComponents/QToast';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import whiteCatAnimation from './uiComponents/lottie/White Cat Peeping.lottie';
import blackCatAnimation from './uiComponents/lottie/blackCatPeek.lottie';
import { useTheme } from '../context/ThemeContext';
import Carousel from './uiComponents/Carousel';

const Cart = () => {

    const { products, currency, cartItems, updateQuantity, navigate, token, recentlyViewed, userData } = useContext(ShopContext);
    const { theme } = useTheme();
    const [cartData, setCartData] = useState([]);
    const [dotLottie, setDotLottie] = useState(null);
    const playCountRef = React.useRef(0);
    const timeoutRef = React.useRef(null);
    const routerNavigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (dotLottie) {
            // Reset counters when lottie instance changes (e.g. theme switch)
            playCountRef.current = 0;

            const onComplete = () => {
                if (playCountRef.current === 0) {
                    playCountRef.current = 1;
                    dotLottie.play(); // Play 2nd time immediately
                } else {
                    playCountRef.current = 0;
                    // Wait 10s then restart the cycle
                    timeoutRef.current = setTimeout(() => {
                        dotLottie.play();
                    }, 15000);
                }
            };
            dotLottie.addEventListener('complete', onComplete);
            return () => {
                dotLottie.removeEventListener('complete', onComplete);
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
            };
        }
    }, [dotLottie]);

    useEffect(() => {

        if (products.length > 0) {
            const tempData = [];
            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        const productExists = products.find(product => product._id === items);
                        if (productExists) {
                            tempData.push({
                                _id: items,
                                size: item,
                                quantity: cartItems[items][item]
                            })
                        }
                    }
                }
            }
            setCartData(tempData);
        }
    }, [cartItems, products])

    return (
        <div className='border-t pt-32 px-4 sm:px-12 md:px-24 min-h-[80vh] relative overflow-hidden'>

            {cartData.length > 0 && (
                <div className='text-2xl mb-3'>
                    <h1 className='font-serif text-3xl text-silk-900 dark:text-silk-50'>YOUR <span className='text-silk-600 font-medium'>CART</span></h1>
                </div>
            )}

            {cartData.length === 0 ? (
                <>
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in h-full">
                        <h2 className="text-xl font-serif text-silk-900 dark:text-silk-50 mb-4">Your cart is empty</h2>
                        <p className="text-silk-600 dark:text-silk-400 text-sm mb-8">Looks like you haven't added anything to your cart yet.</p>
                        <div className="relative mt-8">
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-60 pointer-events-none">
                                <DotLottieReact
                                    src={theme === 'dark' ? whiteCatAnimation : blackCatAnimation}
                                    autoplay
                                    dotLottieRefCallback={setDotLottie}
                                />
                            </div>
                            <button
                                onClick={() => routerNavigate('/collection')}
                                className="relative bg-silk-900 dark:bg-silk-50 text-white dark:text-silk-900 px-8 py-3 hover:bg-black dark:hover:bg-white/90 transition-colors z-10 rounded-full"
                            >
                                BROWSE COLLECTIONS
                            </button>
                        </div>
                        <div className="fixed bottom-12 md:bottom-0 left-1/2 -translate-x-1/2 w-80 h-80 pointer-events-none z-50 hidden"></div>
                    </div>

                    {/* Recently Viewed Section */}
                    {recentlyViewed.length > 0 && (
                        <div className="mt-12 max-w-5xl mx-auto">
                            <h3 className="text-xl font-serif text-silk-900 dark:text-silk-50 mb-6 text-center">Recently Viewed</h3>
                            <div className="flex gap-4 overflow-x-auto pb-8 hide-scrollbar snap-x snap-mandatory px-4 md:justify-center">
                                {recentlyViewed.map((id) => {
                                    const item = products.find(p => p._id === id);
                                    if (!item) return null;
                                    return <SmallProductCard key={item._id} product={item} />;
                                })}
                            </div>
                        </div>
                    )}

                    {/* Suggested Products (You Might Also Like) */}
                    <div className="mt-12 max-w-5xl mx-auto">
                        <h3 className="text-xl font-serif text-silk-900 dark:text-silk-50 mb-6 text-center">You Might Also Like</h3>
                        <div className="flex gap-4 overflow-x-auto pb-8 hide-scrollbar snap-x snap-mandatory px-4 md:justify-center">
                            {products.slice(0, 5).map((item) => (
                                <SmallProductCard key={item._id} product={item} />
                            ))}
                        </div>
                    </div>

                    {/* Wishlist Section */}
                    {userData?.wishlist && userData.wishlist.length > 0 && (
                        <div className="mt-12 max-w-5xl mx-auto">
                            <h3 className="text-xl font-serif text-silk-900 dark:text-silk-50 mb-6 text-center">From Your Wishlist</h3>
                            <div className="flex gap-4 overflow-x-auto pb-8 hide-scrollbar snap-x snap-mandatory px-4 md:justify-center">
                                {userData.wishlist.map((wishlistItem) => {
                                    const item = products.find(p => p._id === wishlistItem.productId);
                                    if (!item) return null;
                                    return <SmallProductCard key={item._id} product={item} />;
                                })}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className='space-y-4'>
                    {cartData.map((item, index) => {

                        const productData = products.find((product) => product._id === item._id);

                        return (
                            <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4 animate-fade-in'>
                                <div className='flex items-start gap-6'>
                                    <Link to={`/product/${item._id}`} className='shrink-0'>
                                        <img className='w-16 sm:w-20' src={productData.image[0]} alt="" />
                                    </Link>
                                    <div>
                                        <Link to={`/product/${item._id}`}>
                                            <p className='text-xs sm:text-lg font-medium dark:text-gray-200 hover:text-silk-600 dark:hover:text-silk-400 transition-colors'>{productData.name}</p>
                                        </Link>
                                        <div className='flex items-center gap-5 mt-2'>
                                            <p className='dark:text-gray-300'>{currency}{productData.sizePrices && productData.sizePrices[item.size] ? Number(productData.sizePrices[item.size]) : productData.price}</p>
                                            <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-300'>{item.size}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center border border-silk-200 dark:border-slate-700 rounded-full w-max">
                                    <button
                                        onClick={() => item.quantity > 1 && updateQuantity(item._id, item.size, item.quantity - 1)}
                                        className={`px-3 py-1 text-silk-600 dark:text-silk-400 hover:bg-silk-50 dark:hover:bg-slate-800 rounded-l-full transition-colors ${item.quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={item.quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span className="w-8 text-center text-silk-900 dark:text-gray-200 font-medium text-sm">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                                        className="px-3 py-1 text-silk-600 dark:text-silk-400 hover:bg-silk-50 dark:hover:bg-slate-800 rounded-r-full transition-colors"
                                    >
                                        +
                                    </button>
                                </div>

                                <Trash2 onClick={() => updateQuantity(item._id, item.size, 0)} className='w-4 h-4 sm:w-5 sm:h-5 cursor-pointer text-red-500 hover:text-red-700 transition-colors' />
                            </div>
                        )
                    })}
                </div>
            )
            }

            {
                cartData.length > 0 && (
                    <div className='flex justify-end my-20'>
                        <div className='w-full sm:w-[450px]'>
                            <CartTotal />
                            <div className='w-full text-end'>
                                <RainbowButton onClick={() => {
                                    if (!token) {
                                        QToast.error('Please login to checkout', { position: "top-center" });
                                        navigate('/account', { state: { from: location } });
                                        return;
                                    }
                                    routerNavigate('/place-order');
                                }} className='my-8 px-6 py-2.5 w-auto text-sm font-semibold'>PROCEED TO CHECKOUT</RainbowButton>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    )
}

export default Cart
