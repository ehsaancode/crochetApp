import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'

const CartTotal = () => {

    const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

    return (
        <div className='w-full'>
            <div className='text-2xl'>
                <h2 className='font-serif text-2xl text-silk-900 dark:text-silk-50 mb-4'>CART <span className='text-silk-600 font-medium'>TOTALS</span></h2>
            </div>
            <div className='flex flex-col gap-2 mt-2 text-sm text-silk-900 dark:text-gray-200'>
                <div className='flex justify-between py-2 border-b dark:border-gray-700'>
                    <p>Subtotal</p>
                    <p>{currency} {getCartAmount()}.00</p>
                </div>
                <div className='flex justify-between py-2 border-b dark:border-gray-700'>
                    <p>Shipping Fee</p>
                    <p>{currency} {delivery_fee}.00</p>
                </div>
                <div className='flex justify-between py-2 font-bold text-lg'>
                    <p>Total</p>
                    <p>{currency} {getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}.00</p>
                </div>
            </div>
        </div>
    )
}

export default CartTotal
