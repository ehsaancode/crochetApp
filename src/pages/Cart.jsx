import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Trash2 } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom';
import CartTotal from '../components/CartTotal';

const Cart = () => {

    const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
    const [cartData, setCartData] = useState([]);
    const routerNavigate = useNavigate();

    useEffect(() => {

        if (products.length > 0) {
            const tempData = [];
            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        tempData.push({
                            _id: items,
                            size: item,
                            quantity: cartItems[items][item]
                        })
                    }
                }
            }
            setCartData(tempData);
        }
    }, [cartItems, products])

    return (
        <div className='border-t pt-14 px-4 sm:px-12 md:px-24 min-h-[80vh]'>

            <div className='text-2xl mb-3'>
                <h1 className='font-serif text-3xl text-silk-900 dark:text-silk-50'>YOUR <span className='text-silk-600 font-medium'>CART</span></h1>
            </div>

            {cartData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                    <h2 className="text-2xl font-serif text-silk-900 dark:text-silk-50 mb-4">Your cart is empty</h2>
                    <p className="text-silk-600 dark:text-silk-400 mb-8">Looks like you haven't added anything to your cart yet.</p>
                    <button
                        onClick={() => routerNavigate('/collection')}
                        className="bg-silk-900 dark:bg-silk-50 text-white dark:text-silk-900 px-8 py-3 hover:bg-black dark:hover:bg-white/90 transition-colors"
                    >
                        BROWSE COLLECTIONS
                    </button>
                </div>
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
                                            <p className='dark:text-gray-300'>{currency}{productData.price}</p>
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
            )}

            {cartData.length > 0 && (
                <div className='flex justify-end my-20'>
                    <div className='w-full sm:w-[450px]'>
                        <CartTotal />
                        <div className='w-full text-end'>
                            <button onClick={() => routerNavigate('/place-order')} className='bg-silk-900 dark:bg-silk-50 text-white dark:text-silk-900 text-sm my-8 px-8 py-3 hover:bg-black dark:hover:bg-white/90 transition-colors'>PROCEED TO CHECKOUT</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Cart
