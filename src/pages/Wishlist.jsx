import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, AlertCircle, Trash2 } from 'lucide-react'
import { RainbowButton } from '../components/ui/rainbow-button'
import FadeContent from './uiComponents/FadeContent'
import QToast from './uiComponents/QToast'

const Wishlist = ({ compact }) => {

    const { products, currency, userData, removeFromWishlist, addToCart, requestProduct, token, fetchUserProfile, navigate } = useContext(ShopContext);

    useEffect(() => {
        if (token) {
            fetchUserProfile();
        }
    }, [token]);

    if (!userData || !userData.wishlist || userData.wishlist.length === 0) {
        if (compact) {
            return (
                <div className="flex flex-col items-center justify-center text-center p-8 h-full min-h-[400px]">
                    <Heart className="w-12 h-12 text-silk-200 dark:text-silk-800 mb-4" />
                    <h2 className="text-xl font-serif text-silk-900 dark:text-silk-50 mb-2">Your Wishlist is Empty</h2>
                    <p className="text-sm text-silk-600 dark:text-silk-400 mb-6">Save items you love to revisit later.</p>
                    <Link to="/collection">
                        <RainbowButton className="px-6 py-2 text-sm">Explore Products</RainbowButton>
                    </Link>
                </div>
            )
        }
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
                <Heart className="w-16 h-16 text-silk-200 dark:text-silk-800 mb-4" />
                <h2 className="text-2xl font-serif text-silk-900 dark:text-silk-50 mb-2">Your Wishlist is Empty</h2>
                <p className="text-silk-600 dark:text-silk-400 mb-8">Save items you love to revisit later.</p>
                <Link to="/collection">
                    <RainbowButton className="px-8 py-3">Explore Products</RainbowButton>
                </Link>
            </div>
        )
    }

    return (
        <div className={compact ? 'p-6' : 'border-t pt-14 px-4 sm:px-12 md:px-24 min-h-screen pb-12'}>
            {!compact && (
                <div className='text-2xl mb-8'>
                    <h1 className='font-serif text-3xl text-silk-900 dark:text-silk-50'>MY <span className='text-silk-600 font-medium'>WISHLIST</span></h1>
                </div>
            )}

            <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 gap-y-10'>
                {userData.wishlist.map((item, index) => {
                    const isAvailable = products.find(p => p._id === item.productId);
                    const productData = isAvailable || item; // Use live data if available, else snapshot

                    return (
                        <FadeContent key={index} blur={true} duration={0.4} delay={index * 0.05} className="h-full">
                            <div className='group relative border border-silk-100 dark:border-silk-800 rounded-xl overflow-hidden bg-white dark:bg-black/20 hover:shadow-lg transition-all duration-300 h-full flex flex-col'>

                                {/* Image Section */}
                                <div className='relative overflow-hidden aspect-[4/5] bg-silk-50 dark:bg-silk-900/30'>
                                    <img
                                        src={productData.image && productData.image[0]}
                                        alt={productData.name}
                                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!isAvailable ? 'grayscale opacity-70' : ''}`}
                                    />

                                    {/* Unavailable Overlay */}
                                    {!isAvailable && (
                                        <div className='absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white p-4 text-center'>
                                            <AlertCircle className='w-8 h-8 mb-2' />
                                            <span className='font-bold uppercase tracking-wider text-sm'>No Longer Available</span>
                                        </div>
                                    )}

                                    {/* Remove Button (Icon) */}
                                    <button
                                        onClick={() => removeFromWishlist(item.productId)}
                                        className='absolute top-3 right-3 p-2 bg-white/80 dark:bg-black/40 backdrop-blur-sm rounded-full text-red-500 hover:bg-white hover:scale-110 transition-all shadow-sm'
                                        title="Remove from Wishlist"
                                    >
                                        <Heart className='w-5 h-5 fill-current' />
                                    </button>
                                </div>

                                {/* Content Section */}
                                <div className='p-4 flex flex-col flex-1'>
                                    <h3 className='font-serif text-lg text-silk-900 dark:text-white truncate mb-1'>{productData.name}</h3>

                                    {isAvailable ? (
                                        <>
                                            {/* Admin Message / Status for Restocked Items */}
                                            {(item.adminMessage || item.requestStatus === 'accepted') && (
                                                <div className={`text-xs p-2 rounded mb-3 ${item.requestStatus === 'accepted' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                                                    {item.requestStatus === 'accepted' ? (
                                                        <span className='font-medium'>Request Accepted!</span>
                                                    ) : (
                                                        <span><span className="font-bold">Admin:</span> {item.adminMessage}</span>
                                                    )}
                                                </div>
                                            )}

                                            <p className='text-silk-600 dark:text-silk-400 font-medium mb-4'>{currency}{productData.price}</p>

                                            <div className="mt-auto flex flex-col gap-2">
                                                <div className='flex gap-2'>
                                                    <Link to={`/product/${productData._id}`} className='flex-1'>
                                                        <button className='w-full py-2 border border-silk-900 dark:border-silk-200 text-silk-900 dark:text-silk-200 rounded-lg text-sm hover:bg-silk-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors'>
                                                            View
                                                        </button>
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            if (!token) {
                                                                QToast.error('Please login to add items to cart', { position: "top-center" });
                                                                navigate('/login');
                                                                return;
                                                            }
                                                            addToCart(productData._id, productData.sizes[0] || 'Default')
                                                        }}
                                                        className='p-2 bg-silk-900 dark:bg-silk-50 text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity'
                                                        title="Quick Add"
                                                    >
                                                        <ShoppingBag className='w-5 h-5' />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromWishlist(item.productId)}
                                                    className='w-full py-1 text-xs text-red-500 hover:text-red-700 font-medium border border-transparent hover:border-red-100 rounded-lg transition-colors flex items-center justify-center gap-1'
                                                >
                                                    <Trash2 className="w-3 h-3" /> Remove
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p className='text-muted-foreground text-sm line-through mb-1'>{currency}{productData.price}</p>
                                            <p className="text-red-500 text-xs font-semibold mb-3">Out of Stock</p>

                                            <div className="mt-auto flex flex-col gap-2">
                                                {item.requestStatus === 'accepted' ? (
                                                    <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-2 rounded text-xs font-medium text-center border border-green-100 dark:border-green-800">
                                                        Request Accepted! Order Created.
                                                    </div>
                                                ) : (
                                                    <>
                                                        {item.adminMessage && (
                                                            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-2 rounded text-xs mb-2 text-left border border-blue-100 dark:border-blue-800">
                                                                <p className="font-bold text-[10px] uppercase tracking-wider mb-1 opacity-70">Admin Message</p>
                                                                {item.adminMessage}
                                                            </div>
                                                        )}

                                                        <button
                                                            onClick={() => requestProduct(item.productId)}
                                                            disabled={item.requestStatus === 'pending'}
                                                            className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${item.requestStatus === 'pending'
                                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500'
                                                                : 'bg-silk-200 dark:bg-silk-800 text-silk-900 dark:text-silk-100 hover:bg-silk-300 dark:hover:bg-silk-700'
                                                                }`}
                                                        >
                                                            {item.requestStatus === 'pending' ? 'Request Pending' : 'Request Product'}
                                                        </button>
                                                        <button
                                                            onClick={() => removeFromWishlist(item.productId)}
                                                            className='w-full py-1 text-xs text-red-500 hover:text-red-700 font-medium border border-transparent hover:border-red-100 rounded-lg transition-colors flex items-center justify-center gap-1'
                                                        >
                                                            <Trash2 className="w-3 h-3" /> Remove
                                                        </button>
                                                    </>
                                                )}

                                                {/* Add Remove button for Accepted status too for symmetry, or leave as is if not requested? 
                                                    User requested "add an option to remove". 
                                                    If accepted, they previously could only remove via icon. 
                                                    I will add it here for consistency if I am wrapping.
                                                    But 'item.requestStatus === accepted' renders a DIV.
                                                    I'll add the button after the DIV.
                                                */}
                                                {item.requestStatus === 'accepted' && (
                                                    <button
                                                        onClick={() => removeFromWishlist(item.productId)}
                                                        className='w-full py-1 text-xs text-red-500 hover:text-red-700 font-medium border border-transparent hover:border-red-100 rounded-lg transition-colors flex items-center justify-center gap-1'
                                                    >
                                                        <Trash2 className="w-3 h-3" /> Remove
                                                    </button>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </FadeContent>
                    )
                })}
            </div>
        </div>
    )
}

export default Wishlist
