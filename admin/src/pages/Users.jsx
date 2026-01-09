import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../config' // Correct import path based on sibling pages
import QToast from '../components/QToast'
import { User, ShoppingBag, Heart, ChevronDown, ChevronUp } from 'lucide-react'
import Loading from '../components/Loading'

const Users = ({ token }) => {
    const [users, setUsers] = useState([])
    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    // Fetch all required data
    const fetchData = async () => {
        try {
            const [usersRes, productsRes, ordersRes] = await Promise.all([
                axios.post(backendUrl + '/api/user/all-users', {}, { headers: { token } }),
                axios.get(backendUrl + '/api/product/list'),
                axios.post(backendUrl + '/api/order/list', {}, { headers: { token } }) // Assuming this endpoint exists and works for admin
            ])

            if (usersRes.data.success) setUsers(usersRes.data.users)
            else QToast.error(usersRes.data.message, { position: "top-right" })

            if (productsRes.data.success) setProducts(productsRes.data.products)
            // ordersRes might handle success differently or just return list, checking standard pattern
            if (ordersRes.data.success) setOrders(ordersRes.data.orders)

        } catch (error) {
            console.log(error)
            QToast.error(error.message, { position: "top-right" })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [token])

    if (loading) {
        return <Loading />
    }

    return (
        <div className='w-full p-4'>
            <p className='mb-4 font-semibold text-lg text-foreground'>Users Management</p>
            <div className='flex flex-col gap-4'>
                {users.map((user, index) => (
                    <UserCard key={index} user={user} products={products} orders={orders} />
                ))}
            </div>
        </div>
    )
}

const UserCard = ({ user, products, orders }) => {
    const [isCartOpen, setIsCartOpen] = useState(false)

    // Helper to get cart item details (moved inside or passed props)
    // I'll duplicate the helper or move it outside. Moving outside is better.
    // .. Wait, I can't move 'products' dependency easily if outside. I'll just pass 'products' to helper or keep helper in component.

    // Re-implement helper here or use props
    const getCartDetails = (cartData) => {
        if (!cartData) return []
        const details = []
        for (const [itemId, sizeObj] of Object.entries(cartData)) {
            const product = products.find(p => p._id === itemId)
            if (product && sizeObj && typeof sizeObj === 'object') {
                for (const [size, quantity] of Object.entries(sizeObj)) {
                    if (quantity > 0) details.push({ ...product, quantity, size })
                }
            }
        }
        return details
    }

    const getUserOrders = (userId) => {
        return orders.filter(o => o.userId === userId)
    }

    const cartItems = getCartDetails(user.cartData)
    const userOrders = getUserOrders(user._id)

    return (
        <div className='border border-border bg-card rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow'>
            <div className='flex flex-col md:flex-row gap-6 items-start'>
                {/* User Identity */}
                <div className='flex items-center gap-4 min-w-[250px]'>
                    <div className='w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border flex-shrink-0'>
                        {user.image ? (
                            <img src={user.image} alt="" className='w-full h-full object-cover' />
                        ) : (
                            <span className='text-2xl font-serif text-muted-foreground'>{user.name.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    <div>
                        <h3 className='font-semibold text-foreground'>{user.name}</h3>
                        <p className='text-sm text-muted-foreground'>{user.email}</p>
                        <p className='text-xs text-silk-600 mt-1'>{user.phone || 'No phone'}</p>
                    </div>
                </div>

                {/* Stats & Data */}
                <div className='flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 w-full'>
                    {/* Cart Section - Dropdown */}
                    <div className='bg-muted/30 rounded-lg p-3'>
                        <div
                            className='flex items-center justify-between gap-2 text-sm font-medium cursor-pointer select-none'
                            onClick={() => setIsCartOpen(!isCartOpen)}
                        >
                            <div className='flex items-center gap-2'>
                                <ShoppingBag className='w-4 h-4' />
                                Cart ({cartItems.length} items)
                            </div>
                            {isCartOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>

                        {isCartOpen && (
                            <div className='mt-3 space-y-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar animate-fade-in'>
                                {cartItems.length > 0 ? cartItems.map((item, i) => (
                                    <div key={i} className='flex gap-2 text-xs bg-background p-2 rounded border border-border'>
                                        <img src={item.image[0]} className='w-8 h-8 rounded object-cover' alt="" />
                                        <div className='flex-1 min-w-0'>
                                            <p className='truncate font-medium'>{item.name}</p>
                                            <p className='text-muted-foreground'>Qty: {item.quantity} | {item.size}</p>
                                        </div>
                                    </div>
                                )) : <p className='text-xs text-muted-foreground italic pl-6'>Cart is empty</p>}
                            </div>
                        )}
                    </div>

                    {/* Orders Section */}
                    <div className='bg-muted/30 rounded-lg p-3'>
                        <div className='flex items-center gap-2 mb-2 text-sm font-medium'>
                            <User className='w-4 h-4' />
                            Total Orders ({userOrders.length})
                        </div>
                        <div className='text-xs text-muted-foreground'>
                            {userOrders.length > 0 ? (
                                <div className='flex flex-wrap gap-2'>
                                    {userOrders.slice(0, 3).map((o, i) => (
                                        <span key={i} className={`px-2 py-1 rounded-full border ${o.status === 'Delivered' ? 'bg-green-100 text-green-700 border-green-200' :
                                            o.status === 'Cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
                                                'bg-blue-100 text-blue-700 border-blue-200'
                                            }`}>
                                            {o.status}
                                        </span>
                                    ))}
                                    {userOrders.length > 3 && <span>+{userOrders.length - 3} more</span>}
                                </div>
                            ) : <p className='italic'>No orders yet</p>}
                        </div>
                    </div>

                    {/* Address Section */}
                    {user.address && (
                        <div className='col-span-1 md:col-span-2 bg-muted/30 rounded-lg p-3 text-xs w-full'>
                            <div className='font-medium mb-1'>Address:</div>
                            <div className='grid grid-cols-2 lg:grid-cols-4 gap-2 text-muted-foreground'>
                                <p><span className='font-semibold'>Street:</span> {user.address.street || 'N/A'}</p>
                                <p><span className='font-semibold'>City:</span> {user.address.city || 'N/A'}</p>
                                <p><span className='font-semibold'>State:</span> {user.address.state || 'N/A'}</p>
                                <p><span className='font-semibold'>Zip:</span> {user.address.zip || 'N/A'}</p>
                                <p><span className='font-semibold'>Country:</span> {user.address.country || 'N/A'}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Users
