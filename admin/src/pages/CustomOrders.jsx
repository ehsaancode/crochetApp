import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../config'
import QToast from '../components/QToast'
import { Scissors, MessageSquare, CheckCircle, Package, FileText, ShoppingBag, Loader2 } from 'lucide-react'

const CustomOrders = ({ token }) => {

    const [activeTab, setActiveTab] = useState('commission'); // 'commission' or 'product'

    // Custom Order State
    const [orders, setOrders] = useState([])

    // Product Request State
    const [requests, setRequests] = useState([]);
    const [replyMessage, setReplyMessage] = useState({});
    const [actionStatus, setActionStatus] = useState({});

    // Fetch Custom Orders
    const fetchCustomOrders = async () => {
        if (!token) return null;
        try {
            const response = await axios.get(backendUrl + '/api/custom-order/list', { headers: { token } })
            if (response.data.success) {
                setOrders(response.data.orders)
            } else {
                QToast.error(response.data.message, { position: "top-right" })
            }
        } catch (error) {
            QToast.error(error.message, { position: "top-right" })
        }
    }

    // Fetch Product Requests
    const fetchRequests = async () => {
        if (!token) return;
        try {
            const response = await axios.get(backendUrl + '/api/user/admin/requests', { headers: { token } });
            if (response.data.success) {
                setRequests(response.data.requests);
            } else {
                QToast.error(response.data.message, { position: "top-right" });
            }
        } catch (error) {
            console.log(error);
            QToast.error(error.message, { position: "top-right" });
        }
    }

    // Handlers
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

    const handleAction = async (userId, productId, action, message = "", extraData = {}) => {
        const actionKey = `${userId}-${productId}-${action}`;
        setActionStatus(prev => ({ ...prev, [actionKey]: 'loading' }));

        try {
            const response = await axios.post(backendUrl + '/api/user/admin/request-handle',
                { userId, productId, action, message, ...extraData },
                { headers: { token } }
            );
            if (response.data.success) {
                QToast.success(response.data.message, { position: "top-right" });
                setActionStatus(prev => ({ ...prev, [actionKey]: 'success' }));
                fetchRequests();
                if (action === 'message') {
                    setReplyMessage(prev => ({ ...prev, [`${userId}-${productId}`]: "" }));
                }
            } else {
                QToast.error(response.data.message, { position: "top-right" });
                setActionStatus(prev => ({ ...prev, [actionKey]: 'error' }));
                if (action === 'accept' && response.data.message === "Item not found") {
                    fetchRequests();
                }
            }
        } catch (error) {
            console.log(error);
            setActionStatus(prev => ({ ...prev, [actionKey]: 'error' }));
            QToast.error(error.message, { position: "top-right" });
        }
    }

    useEffect(() => {
        fetchCustomOrders();
        fetchRequests();
    }, [token])

    return (
        <div className="w-full max-w-7xl mx-auto p-4">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className='font-serif text-2xl font-bold text-foreground'>Requests Center</h3>
                    <p className="text-sm text-muted-foreground">Manage custom commissions and product inquiries</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-muted p-1 rounded-lg self-start md:self-auto">
                    <button
                        onClick={() => setActiveTab('commission')}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'commission' ? 'bg-white text-silk-900 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <Scissors className="w-4 h-4" />
                        Custom Orders
                        {orders.length > 0 && <span className="ml-1 bg-silk-100 text-silk-700 text-[10px] px-1.5 py-0.5 rounded-full">{orders.length}</span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('product')}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'product' ? 'bg-white text-silk-900 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Product Requests
                        {requests.length > 0 && <span className="ml-1 bg-silk-100 text-silk-700 text-[10px] px-1.5 py-0.5 rounded-full">{requests.length}</span>}
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex flex-col gap-4">

                {/* --- COMMISSION TAB --- */}
                {activeTab === 'commission' && (
                    <div className="flex flex-col gap-4 animate-fade-in">
                        {orders.map((order, index) => (
                            <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-4 items-start border border-border bg-card shadow-sm rounded-xl p-6 text-xs sm:text-sm text-muted-foreground' key={index}>
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

                                {/* Status */}
                                <div className='flex items-center gap-2'>
                                    <Scissors className="w-5 h-5 text-silk-500" />
                                    <span className={`font-medium ${order.status === 'Completed' ? 'text-green-500' :
                                        order.status === 'Cancelled' ? 'text-red-500' : 'text-yellow-500'
                                        }`}>{order.status}</span>
                                </div>

                                {/* Status Update */}
                                <div className='flex flex-col gap-2 w-full'>
                                    <select
                                        onChange={(event) => statusHandler(event, order._id)}
                                        value={['Pending', 'Cancelled'].includes(order.status) ? order.status : 'Accepted'}
                                        className='p-2.5 font-semibold bg-input border border-border rounded-lg outline-none text-foreground focus:ring-2 focus:ring-silk-500 w-full'
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Accepted">Accepted</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>

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
                            <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
                                <Scissors className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>No custom commissions yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* --- PRODUCT REQUESTS TAB --- */}
                {activeTab === 'product' && (
                    <div className="flex flex-col gap-4 animate-fade-in">
                        {requests.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
                                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>No product requests found.</p>
                            </div>
                        ) : (
                            requests.map((req, index) => {
                                const pid = req.product.productId || req.product._id;
                                const msgKey = `${req.userId}-${pid}`;
                                return (
                                    <div key={index} className='border border-border rounded-lg p-6 bg-card shadow-sm flex flex-col md:flex-row gap-6'>
                                        <div className='flex items-start gap-4 md:w-1/3'>
                                            <div className='w-20 h-24 bg-secondary rounded-md overflow-hidden shrink-0'>
                                                {req.product.image && req.product.image[0] ? (
                                                    <img src={req.product.image[0]} alt={req.product.name} className='w-full h-full object-cover' />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                        <Package size={24} />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className='font-medium text-foreground text-lg'>{req.product.name}</h3>
                                                <p className='text-muted-foreground mb-1'>{currency}{req.product.price}</p>
                                                <p className='text-xs text-muted-foreground font-mono mb-2 flex items-center gap-1'>
                                                    <span className="select-none">ID:</span>
                                                    <span
                                                        className="select-all font-medium text-foreground bg-secondary px-1 rounded cursor-pointer hover:bg-muted border border-transparent hover:border-border"
                                                        onClick={() => { navigator.clipboard.writeText(pid); QToast.success("ID Copied!", { position: "top-right" }); }}
                                                        title="Click to copy"
                                                    >
                                                        {pid}
                                                    </span>
                                                </p>
                                                <div className='space-y-1 mt-2'>
                                                    <p className='text-xs text-muted-foreground'>
                                                        User: <span className="font-medium text-foreground">{req.userName}</span>
                                                    </p>
                                                    <p className='text-xs text-muted-foreground'>
                                                        Email: {req.userEmail}
                                                    </p>
                                                </div>
                                                <p className={`text-xs mt-3 font-medium w-max px-2 py-0.5 rounded ${req.isAvailable ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-blue-50 text-blue-500'}`}>
                                                    Status: {req.isAvailable ? "Restocked / Available" : (req.product.requestStatus === 'message_received' ? 'Message Sent' : 'Pending')}
                                                </p>
                                            </div>
                                        </div>

                                        <div className='flex-1 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6'>
                                            <div className='flex flex-col gap-2'>
                                                <label className='text-sm text-foreground font-medium'>Reply Message to User</label>
                                                <div className='flex gap-2 overflow-x-auto pb-1'>
                                                    <button
                                                        onClick={() => setReplyMessage(prev => ({ ...prev, [msgKey]: "Thank you for your interest! We are working on restocking this item and expect it to be available within 7-10 days. We will verify and notify you once it is back in stock." }))}
                                                        className='px-2 py-1 text-xs bg-secondary border border-border rounded hover:bg-muted transition-colors whitespace-nowrap'
                                                    >
                                                        Restock Update
                                                    </button>
                                                    <button
                                                        onClick={() => setReplyMessage(prev => ({ ...prev, [msgKey]: "Thanks for reaching out! Although this item is out of stock, we can create a similar one as a Custom Order just for you. Let us know if you are interested!" }))}
                                                        className='px-2 py-1 text-xs bg-secondary border border-border rounded hover:bg-muted transition-colors whitespace-nowrap'
                                                    >
                                                        Custom Order Offer
                                                    </button>
                                                </div>
                                                <textarea
                                                    className='w-full bg-input border border-border rounded-md p-2 text-sm focus:ring-1 focus:ring-silk-500 outline-none text-foreground'
                                                    rows='5'
                                                    placeholder='Ex: We can restock this in 5 days...'
                                                    value={replyMessage[msgKey] || ""}
                                                    onChange={(e) => {
                                                        setReplyMessage(prev => ({ ...prev, [msgKey]: e.target.value }));
                                                        if (actionStatus[`${req.userId}-${pid}-message`] === 'success') {
                                                            setActionStatus(prev => ({ ...prev, [`${req.userId}-${pid}-message`]: null }));
                                                        }
                                                    }}
                                                ></textarea>
                                            </div>

                                            <div className='flex justify-end gap-3 mt-auto'>
                                                <button
                                                    onClick={() => handleAction(req.userId, pid, 'message', replyMessage[msgKey], { userEmail: req.userEmail, userName: req.userName })}
                                                    disabled={!replyMessage[msgKey] || actionStatus[`${req.userId}-${pid}-message`] === 'loading'}
                                                    className={`flex items-center gap-2 px-4 py-2 border border-border rounded-md transition-colors ${actionStatus[`${req.userId}-${pid}-message`] === 'success'
                                                        ? 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                                                        : 'text-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed'
                                                        }`}
                                                >
                                                    {actionStatus[`${req.userId}-${pid}-message`] === 'loading' ? <Loader2 size={16} className="animate-spin" /> :
                                                        actionStatus[`${req.userId}-${pid}-message`] === 'success' ? <CheckCircle size={16} /> : <MessageSquare size={16} />}
                                                    {actionStatus[`${req.userId}-${pid}-message`] === 'loading' ? "Sending..." :
                                                        actionStatus[`${req.userId}-${pid}-message`] === 'success' ? "Sent" : "Send Email"}
                                                </button>
                                                {!req.isAvailable && (
                                                    <button
                                                        onClick={() => handleAction(req.userId, pid, 'accept', "", { userEmail: req.userEmail, userName: req.userName })}
                                                        disabled={actionStatus[`${req.userId}-${pid}-accept`] === 'loading' || actionStatus[`${req.userId}-${pid}-accept`] === 'success'}
                                                        className='flex items-center gap-2 px-4 py-2 bg-silk-900 text-white rounded-md hover:bg-silk-800 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed'
                                                    >
                                                        {actionStatus[`${req.userId}-${pid}-accept`] === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                                                        {actionStatus[`${req.userId}-${pid}-accept`] === 'loading' ? "Processing..." :
                                                            actionStatus[`${req.userId}-${pid}-accept`] === 'success' ? "Accepted" : "Accept Order"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CustomOrders;
