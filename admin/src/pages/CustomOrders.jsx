import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../config'
import QToast from '../components/QToast'
import { Scissors } from 'lucide-react'

const CustomOrders = ({ token }) => {

    const [orders, setOrders] = useState([])

    const fetchCustomOrders = async () => {
        if (!token) return null;
        try {
            const response = await axios.get(backendUrl + '/api/custom-order/list', { headers: { token } })
            if (response.data.success) {
                console.log("Admin CustomOrders fetched:", response.data.orders);
                setOrders(response.data.orders)
            } else {
                QToast.error(response.data.message, { position: "top-right" })
            }
        } catch (error) {
            QToast.error(error.message, { position: "top-right" })
        }
    }

    const statusHandler = async (event, orderId) => {
        try {
            const response = await axios.post(backendUrl + '/api/custom-order/status', { orderId, status: event.target.value }, { headers: { token } })
            if (response.data.success) {
                await fetchCustomOrders()
            }
        } catch (error) {
            console.log(error);
            QToast.error(error.message, { position: "top-right" })
        }
    }

    useEffect(() => {
        fetchCustomOrders()
    }, [token])

    return (
        <div className="w-full max-w-7xl mx-auto p-4">
            <h3 className='mb-4 font-semibold text-lg text-foreground'>Custom Commission Requests</h3>
            <div className="flex flex-col gap-4">
                {orders.map((order, index) => (
                    <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-4 items-start border border-border bg-card shadow-sm rounded-xl p-6 text-xs sm:text-sm text-muted-foreground' key={index}>

                        {/* Image Preview */}
                        {/* Image Preview */}
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start max-w-[200px]">
                            {order.image && (Array.isArray(order.image) ? (
                                order.image.map((img, idx) => (
                                    <a key={idx} href={img} target="_blank" rel="noopener noreferrer">
                                        <img src={img} alt={`Reference ${idx + 1}`} className="w-16 h-16 object-cover rounded-lg border border-border hover:scale-105 transition-transform" />
                                    </a>
                                ))
                            ) : (
                                <a href={order.image} target="_blank" rel="noopener noreferrer">
                                    <img src={order.image} alt="Reference" className="w-20 h-20 object-cover rounded-lg border border-border hover:scale-105 transition-transform" />
                                </a>
                            ))}
                        </div>

                        {/* Request Details */}
                        <div>
                            <div className='text-foreground mb-2 font-semibold text-base capitalize'>
                                {order.size} Size
                            </div>
                            <div className='space-y-1 mb-3'>
                                <p><span className="font-medium">Color:</span> {order.colorPreference === 'original' ? 'Original Colors' : order.customColor}</p>
                                {order.yarnType && <p><span className="font-medium">Yarn:</span> {order.yarnType}</p>}
                            </div>
                            <p className='text-xs italic bg-secondary/50 p-2 rounded border border-border'>{order.description}</p>
                        </div>

                        {/* User Details */}
                        <div>
                            <p className='font-semibold text-foreground mb-1'>{order.userId?.name || 'Unknown User'}</p>
                            <p className='text-xs'>{order.userId?.email}</p>
                            <p className='text-xs'>{order.userId?.phone}</p>
                            {order.userId?.address && (
                                <div className="mt-2 text-xs text-muted-foreground border-t border-border pt-1">
                                    <p className="font-medium text-foreground">Address:</p>
                                    <p>{order.userId.address.street}</p>
                                    <p>{order.userId.address.city}, {order.userId.address.state} {order.userId.address.zip}</p>
                                    <p>{order.userId.address.country}</p>
                                </div>
                            )}
                            <p className="mt-2 text-xs text-muted-foreground">Date: {new Date(order.date).toLocaleDateString()}</p>
                        </div>

                        {/* Status (Placeholder col) */}
                        <div className='flex items-center gap-2'>
                            <Scissors className="w-5 h-5 text-silk-500" />
                            <span className={`font-medium ${order.status === 'Completed' ? 'text-green-500' :
                                order.status === 'Cancelled' ? 'text-red-500' : 'text-yellow-500'
                                }`}>{order.status}</span>
                        </div>

                        {/* Status Update */}
                        {/* Dual Status Update */}
                        <div className='flex flex-col gap-2 w-full'>
                            {/* Primary Status (Decision) */}
                            <select
                                onChange={(event) => statusHandler(event, order._id)}
                                value={['Pending', 'Cancelled'].includes(order.status) ? order.status : 'Accepted'}
                                className='p-2.5 font-semibold bg-input border border-border rounded-lg outline-none text-foreground focus:ring-2 focus:ring-silk-500 w-full'
                            >
                                <option value="Pending">Pending</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>

                            {/* Secondary Status (Workflow - visible if Accepted or advanced status) */}
                            {!['Pending', 'Cancelled'].includes(order.status) && (
                                <select
                                    onChange={(event) => statusHandler(event, order._id)}
                                    value={order.status === 'Accepted' ? 'Accepted' : order.status}
                                    className='p-2.5 text-sm font-medium bg-secondary border border-border rounded-lg outline-none text-foreground focus:ring-2 focus:ring-silk-500 w-full animate-fade-in'
                                >
                                    <option value="Accepted" disabled>Select Next Stage...</option>
                                    <option value="Crafting">Crafting</option>
                                    <option value="Packing">Packing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Out for delivery">Out for delivery</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                            )}
                        </div>
                    </div>
                ))}
                {orders.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No custom orders yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CustomOrders;
