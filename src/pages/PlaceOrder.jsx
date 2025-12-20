import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import CartTotal from '../components/CartTotal';
import axios from 'axios';
import QToast from './uiComponents/QToast';

const PlaceOrder = () => {
    const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products, userData, fetchUserProfile } = useContext(ShopContext);
    const [method, setMethod] = useState('cod');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: '',
        landmark: ''
    })

    // Fetch profile on load to ensure we have latest data
    React.useEffect(() => {
        if (token) {
            fetchUserProfile(token);
        }
    }, [token]);

    // Prefill form when userData is available
    React.useEffect(() => {
        if (userData) {
            setFormData(prev => ({
                ...prev,
                firstName: userData.name ? userData.name.split(' ')[0] : '',
                lastName: userData.name && userData.name.split(' ').length > 1 ? userData.name.split(' ').slice(1).join(' ') : '',
                email: userData.email || '',
                phone: userData.phone || '',
                street: userData.address?.street || '',
                city: userData.address?.city || '',
                state: userData.address?.state || '',
                zipcode: userData.address?.zip || '', // Mapping zip to zipcode
                country: userData.address?.country || '',
                landmark: userData.address?.landmark || ''
            }));
        }
    }, [userData]);



    const [showAddressModal, setShowAddressModal] = useState(false);
    const [newAddress, setNewAddress] = useState({
        firstName: '', lastName: '', phone: '', street: '', city: '', state: '', zipcode: '', country: '', landmark: ''
    });

    const handleSaveAddress = async () => {
        try {
            if (!newAddress.firstName || !newAddress.lastName || !newAddress.phone || !newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipcode || !newAddress.country) {
                QToast.error("Please fill all required fields", { position: "top-center" });
                return;
            }

            const response = await axios.post(backendUrl + '/api/user/add-address', { address: newAddress }, { headers: { token } });

            if (response.data.success) {
                QToast.success(response.data.message, { position: "top-center" });
                setShowAddressModal(false);
                fetchUserProfile(token); // Refresh user data to show new address
                // Optionally select the new address
                setFormData(prev => ({
                    ...prev,
                    ...newAddress
                }));
                // Reset form
                setNewAddress({ firstName: '', lastName: '', phone: '', street: '', city: '', state: '', zipcode: '', country: '', landmark: '' });
            } else {
                QToast.error(response.data.message, { position: "top-right" });
            }

        } catch (error) {
            console.log(error);
            QToast.error(error.message, { position: "top-right" });
        }
    }

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormData(data => ({ ...data, [name]: value }))
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        try {
            let orderItems = []

            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        const itemInfo = structuredClone(products.find(product => product._id === items))
                        if (itemInfo) {
                            itemInfo.size = item
                            itemInfo.quantity = cartItems[items][item]
                            orderItems.push(itemInfo)
                        }
                    }
                }
            }

            let orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount() + delivery_fee,
            }

            if (method === 'cod') {
                const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } });
                if (response.data.success) {
                    setCartItems({})
                    navigate('/orders')
                    QToast.success('Order Placed Successfully', { position: 'top-center' });
                } else {
                    QToast.error(response.data.message, { position: 'top-right' })
                }
            }

        } catch (error) {
            console.log(error)
            QToast.error(error.message, { position: 'top-right' })
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t px-4 sm:px-12 md:px-24'>
            {/* Left Side */}
            <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>

                <div className='text-xl sm:text-2xl my-3 font-serif text-silk-900 dark:text-silk-50'>DELIVERY INFORMATION</div>

                {/* Saved Addresses */}
                {userData && (userData.addresses?.length > 0 || userData.address) && (
                    <div className='mb-6'>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Saved Addresses</label>
                        <div className="flex gap-4 overflow-x-auto pb-4">
                            {/* Render stored array addresses */}
                            {userData.addresses && userData.addresses.map((addr, idx) => (
                                <div
                                    key={`saved-${idx}`}
                                    onClick={() => setFormData(prev => ({ ...prev, ...addr, firstName: userData.name.split(' ')[0], lastName: userData.name.split(' ').slice(1).join(' ') }))}
                                    className={`min-w-[200px] p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${JSON.stringify(formData.street) === JSON.stringify(addr.street) ? 'border-silk-600 bg-silk-50 dark:bg-silk-900' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-black'}`}
                                >
                                    <p className="font-semibold text-sm truncate dark:text-white">{addr.street}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{addr.city}, {addr.state}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{addr.zipcode}</p>
                                </div>
                            ))}
                            {/* Render main profile address if distinct or if array is empty but this exists */}
                            {userData.address && (!userData.addresses || userData.addresses.length === 0) && (
                                <div
                                    onClick={() => setFormData(prev => ({
                                        ...prev,
                                        street: userData.address.street,
                                        city: userData.address.city,
                                        state: userData.address.state,
                                        zipcode: userData.address.zip,
                                        country: userData.address.country
                                    }))}
                                    className={`min-w-[200px] p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${formData.street === userData.address.street ? 'border-silk-600 bg-silk-50 dark:bg-silk-900' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-black'}`}
                                >
                                    <p className="font-semibold text-sm truncate dark:text-white">{userData.address.street}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userData.address.city}, {userData.address.state}</p>
                                </div>
                            )}

                            {/* Add New Button */}
                            <button
                                type="button"
                                onClick={() => setShowAddressModal(true)}
                                className="min-w-[100px] flex flex-col items-center justify-center p-4 border border-dashed border-gray-300 rounded-lg hover:border-silk-500 hover:bg-silk-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-silk-100 dark:bg-gray-800 flex items-center justify-center mb-1">
                                    <span className="text-xl text-silk-600 dark:text-silk-400">+</span>
                                </div>
                                <span className="text-xs font-medium text-silk-600 dark:text-silk-400">Add New</span>
                            </button>
                        </div>
                    </div>
                )}


                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full dark:bg-black dark:border-gray-700 dark:text-white' type="text" placeholder='First name' />
                    <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full dark:bg-black dark:border-gray-700 dark:text-white' type="text" placeholder='Last name' />
                </div>
                <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full dark:bg-black dark:border-gray-700 dark:text-white' type="email" placeholder='Email address' />
                <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full dark:bg-black dark:border-gray-700 dark:text-white' type="text" placeholder='Street' />
                <input onChange={onChangeHandler} name='landmark' value={formData.landmark} className='border border-gray-300 rounded py-1.5 px-3.5 w-full dark:bg-black dark:border-gray-700 dark:text-white' type="text" placeholder='Landmark (Optional)' />
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full dark:bg-black dark:border-gray-700 dark:text-white' type="text" placeholder='City' />
                    <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full dark:bg-black dark:border-gray-700 dark:text-white' type="text" placeholder='State' />
                </div>
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full dark:bg-black dark:border-gray-700 dark:text-white' type="text" placeholder='Zipcode' />
                    <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full dark:bg-black dark:border-gray-700 dark:text-white' type="text" placeholder='Country' />
                </div>
                <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full dark:bg-black dark:border-gray-700 dark:text-white' type="number" placeholder='Phone' />
            </div>

            {/* Address Modal */}
            {showAddressModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl w-full max-w-md shadow-2xl animate-fade-in relative">
                        <button
                            type="button"
                            onClick={() => setShowAddressModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white"
                        >
                            ✕
                        </button>
                        <h3 className="text-xl font-serif mb-6 text-silk-900 dark:text-white">Add New Address</h3>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <input
                                    placeholder="First Name"
                                    value={newAddress.firstName}
                                    onChange={(e) => setNewAddress({ ...newAddress, firstName: e.target.value })}
                                    className="w-full p-2 border rounded dark:bg-black dark:border-gray-700 dark:text-white"
                                />
                                <input
                                    placeholder="Last Name"
                                    value={newAddress.lastName}
                                    onChange={(e) => setNewAddress({ ...newAddress, lastName: e.target.value })}
                                    className="w-full p-2 border rounded dark:bg-black dark:border-gray-700 dark:text-white"
                                />
                            </div>
                            <input
                                placeholder="Phone Number"
                                value={newAddress.phone}
                                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                className="w-full p-2 border rounded dark:bg-black dark:border-gray-700 dark:text-white"
                            />
                            <input
                                placeholder="Street Address"
                                value={newAddress.street}
                                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                className="w-full p-2 border rounded dark:bg-black dark:border-gray-700 dark:text-white"
                            />
                            <input
                                placeholder="Landmark (Optional)"
                                value={newAddress.landmark}
                                onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                                className="w-full p-2 border rounded dark:bg-black dark:border-gray-700 dark:text-white"
                            />
                            <div className="flex gap-4">
                                <input
                                    placeholder="City"
                                    value={newAddress.city}
                                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                    className="w-full p-2 border rounded dark:bg-black dark:border-gray-700 dark:text-white"
                                />
                                <input
                                    placeholder="State"
                                    value={newAddress.state}
                                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                    className="w-full p-2 border rounded dark:bg-black dark:border-gray-700 dark:text-white"
                                />
                            </div>
                            <div className="flex gap-4">
                                <input
                                    placeholder="Zipcode"
                                    value={newAddress.zipcode}
                                    onChange={(e) => setNewAddress({ ...newAddress, zipcode: e.target.value })}
                                    className="w-full p-2 border rounded dark:bg-black dark:border-gray-700 dark:text-white"
                                />
                                <input
                                    placeholder="Country"
                                    value={newAddress.country}
                                    onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                                    className="w-full p-2 border rounded dark:bg-black dark:border-gray-700 dark:text-white"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleSaveAddress}
                                className="w-full bg-silk-900 text-white py-3 rounded hover:bg-black dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors mt-2"
                            >
                                Save Address
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Right Side */}
            <div className='mt-8'>
                <div className='mt-8 min-w-80'>
                    <CartTotal />
                </div>
                <div className='mt-12'>
                    <div className='text-xl sm:text-2xl my-3'>
                        <h2 className='font-serif text-2xl text-silk-900 dark:text-silk-50 mb-4'>PAYMENT <span className='text-silk-600 font-medium'>METHOD</span></h2>
                    </div>
                    {/* Payment Method Selection */}
                    <div className='flex gap-3 flex-col lg:flex-row'>
                        <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer opacity-50' title="Not available yet">
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
                            <p className='text-gray-500 text-sm font-medium mx-4'>Stripe</p>
                        </div>
                        <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer opacity-50' title="Not available yet">
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
                            <p className='text-gray-500 text-sm font-medium mx-4'>Razorpay</p>
                        </div>
                        <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer border-silk-500 bg-silk-50 dark:bg-slate-800 dark:border-silk-400'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
                            <p className='text-silk-900 dark:text-white text-sm font-medium mx-4'>Cash on Delivery</p>
                        </div>
                    </div>

                    <div className='w-full text-end mt-8'>
                        <button type='submit' className='bg-silk-900 dark:bg-white text-white dark:text-silk-900 px-16 py-3 text-sm rounded hover:bg-black dark:hover:bg-gray-200'>PLACE ORDER</button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder
