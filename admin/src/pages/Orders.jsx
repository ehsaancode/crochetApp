import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../config'
import QToast from '../components/QToast'
import { Package } from 'lucide-react'

const Orders = ({ token }) => {

    const [orders, setOrders] = useState([])
    const fetchAllOrders = async () => {
        if (!token) {
            return null;
        }
        try {
            const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
            if (response.data.success) {
                setOrders(response.data.orders.reverse())
            } else {
                QToast.error(response.data.message, { position: "top-right" })
            }
        } catch (error) {
            QToast.error(error.message, { position: "top-right" })
        }
    }

    const statusHandler = async (event, orderId) => {
        try {
            const response = await axios.post(backendUrl + '/api/order/status', { orderId, status: event.target.value }, { headers: { token } })
            if (response.data.success) {
                await fetchAllOrders()
            }
        } catch (error) {
            console.log(error);
            QToast.error(error.message, { position: "top-right" })
        }
    }

    useEffect(() => {
        fetchAllOrders()
    }, [token])

    return (
        <div>
            <h3 className='mb-4 pl-4 font-semibold text-lg text-foreground'>Order Page</h3>
            <div className="flex flex-col p-4 gap-4">
                {orders.map((order, index) => (
                    <React.Fragment key={index}>
                        <div className='flex flex-col gap-4 border border-border bg-card shadow-sm rounded-xl p-4 text-sm text-muted-foreground sm:hidden'>
                            <div className="flex gap-4 items-start">
                                <div className="flex flex-col gap-2 max-w-[80px]">
                                    {order.items.map((item, idx) => (
                                        <img
                                            key={idx}
                                            src={item.image && item.image[0] ? item.image[0] : ''}
                                            alt={item.name}
                                            className='w-20 h-20 object-cover rounded shadow-sm border border-border cursor-pointer hover:opacity-80'
                                            onClick={() => window.open(`http://localhost:5173/product/${item._id}`, '_blank')}
                                            title={item.name}
                                        />
                                    ))}
                                </div>
                                <div className="flex-1 flex flex-col gap-1">
                                    <div className='text-foreground font-semibold text-base'>
                                        {order.items.map((item, index) => {
                                            const itemText = (index === order.items.length - 1)
                                                ? item.name + " x " + item.quantity + " (" + item.size + ")"
                                                : item.name + " x " + item.quantity + " (" + item.size + "), ";

                                            return <span key={index} className='cursor-pointer hover:text-silk-600 hover:underline' onClick={() => window.open(`http://localhost:5173/product/${item._id}`, '_blank')}>{itemText}</span>
                                        })}
                                    </div>
                                    <p className='text-xs'>items: {order.items.length}</p>
                                    <p className='text-xs'><span className="font-medium">Method:</span> {order.paymentMethod}</p>
                                    <p className='text-xs'><span className="font-medium">Payment:</span> <span className={order.payment ? "text-green-500" : "text-yellow-500"}>{order.payment ? 'Done' : 'Pending'}</span></p>
                                    <p className='text-xs'><span className="font-medium">Date:</span> {new Date(order.date).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="border-t border-border pt-3">
                                <p className='mb-1 font-medium text-foreground'>{order.address.firstName + " " + order.address.lastName}</p>
                                <div className='mb-2 leading-tight text-xs'>
                                    <p>{order.address.street + ","}</p>
                                    <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
                                </div>
                                <p className="flex items-center gap-1 text-xs mb-3"><span className="font-medium">Phone:</span> {order.address.phone}</p>

                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-between items-center">
                                        <p className='text-base font-bold text-silk-600 dark:text-silk-400'>{currency}{order.amount}</p>
                                    </div>
                                    <select onChange={(event) => statusHandler(event, order._id)} value={order.status} className={`p-2.5 font-semibold bg-input border border-border rounded-lg outline-none focus:ring-2 focus:ring-silk-500 w-full ${order.status === 'Cancelled' ? 'text-red-500' : 'text-foreground'}`}>
                                        <option value="Order Placed">Order Placed</option>
                                        <option value="Packing">Packing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Out for delivery">Out for delivery</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                    {order.status === 'Cancelled' && order.cancelledBy === 'User' && (
                                        <div className="w-full bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm font-medium">
                                            This order was cancelled by the user.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className='hidden sm:grid sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-4 items-start border border-border bg-card shadow-sm rounded-xl p-6 text-xs sm:text-sm text-muted-foreground'>
                            <div className="flex flex-wrap gap-2 justify-start max-w-[150px]">
                                {order.items.map((item, idx) => (
                                    <img
                                        key={idx}
                                        src={item.image && item.image[0] ? item.image[0] : ''}
                                        alt={item.name}
                                        className='w-12 h-12 object-cover rounded shadow-sm border border-border cursor-pointer hover:opacity-80'
                                        onClick={() => window.open(`http://localhost:5173/product/${item._id}`, '_blank')}
                                        title={item.name}
                                    />
                                ))}
                            </div>
                            <div>
                                <div className='text-foreground mb-2 font-semibold text-base'>
                                    {order.items.map((item, index) => {
                                        const itemText = (index === order.items.length - 1)
                                            ? item.name + " x " + item.quantity + " (" + item.size + ")"
                                            : item.name + " x " + item.quantity + " (" + item.size + "), ";

                                        return <span key={index} className='cursor-pointer text-sm hover:text-silk-600 hover:underline' onClick={() => window.open(`http://localhost:5173/product/${item._id}`, '_blank')}>{itemText}</span>
                                    })}
                                </div>
                                <p className='mb-1 font-medium text-foreground'>{order.address.firstName + " " + order.address.lastName}</p>
                                <div className='mb-2 leading-tight'>
                                    <p>{order.address.street + ","}</p>
                                    <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
                                </div>
                                <p className="flex items-center gap-1"><span className="font-medium">Phone:</span> {order.address.phone}</p>
                            </div>
                            <div className="space-y-1">
                                <p className='text-sm sm:text-[15px] font-medium text-foreground'>Items : {order.items.length}</p>
                                <p className='mt-2'><span className="font-medium">Method :</span> {order.paymentMethod}</p>
                                <p><span className="font-medium">Payment :</span> <span className={order.payment ? "text-green-500" : "text-yellow-500"}>{order.payment ? 'Done' : 'Pending'}</span></p>
                                <p><span className="font-medium">Date :</span> {new Date(order.date).toLocaleDateString()}</p>
                            </div>
                            <p className='text-sm sm:text-base font-bold text-silk-600 dark:text-silk-400'>{currency}{order.amount}</p>
                            <select onChange={(event) => statusHandler(event, order._id)} value={order.status} className={`p-2.5 font-semibold bg-input border border-border rounded-lg outline-none focus:ring-2 focus:ring-silk-500 w-full ${order.status === 'Cancelled' ? 'text-red-500' : 'text-foreground'}`}>
                                <option value="Order Placed">Order Placed</option>
                                <option value="Packing">Packing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Out for delivery">Out for delivery</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                            {order.status === 'Cancelled' && order.cancelledBy === 'User' && (
                                <div className="w-full col-span-3 lg:col-span-5 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm font-medium mt-2">
                                    This order was cancelled by the user.
                                </div>
                            )}
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}
const currency = '₹'
export default Orders
