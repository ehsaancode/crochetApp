import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../config'
import QToast from '../components/QToast'
import { MessageSquare, CheckCircle, Package } from 'lucide-react'

const Requests = ({ token }) => {

    const [requests, setRequests] = useState([]);
    const [replyMessage, setReplyMessage] = useState({});

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

    const handleAction = async (userId, productId, action, message = "") => {
        try {
            const response = await axios.post(backendUrl + '/api/user/admin/request-handle',
                { userId, productId, action, message },
                { headers: { token } }
            );
            if (response.data.success) {
                QToast.success(response.data.message, { position: "top-right" });
                fetchRequests();
                if (action === 'message') {
                    setReplyMessage(prev => ({ ...prev, [`${userId}-${productId}`]: "" }));
                }
            } else {
                QToast.error(response.data.message, { position: "top-right" });
                if (action === 'accept' && response.data.message === "Item not found") {
                    // Could mean item was removed from wishlist by user
                    fetchRequests();
                }
            }
        } catch (error) {
            console.log(error);
            QToast.error(error.message, { position: "top-right" });
        }
    }

    useEffect(() => {
        fetchRequests();
    }, [token]);

    return (
        <div className='p-6'>
            <h2 className='text-2xl font-serif text-silk-900 mb-6'>Product Requests</h2>

            <div className='space-y-6 p-4'>
                {requests.length === 0 ? (
                    <p className='text-gray-500'>No pending requests found.</p>
                ) : (
                    requests.map((req, index) => {
                        const pid = req.product.productId || req.product._id;
                        const msgKey = `${req.userId}-${pid}`;
                        return (
                            <div key={index} className='border border-silk-200 rounded-lg p-6 bg-white shadow-sm flex flex-col md:flex-row gap-6'>
                                {/* Product Info */}
                                <div className='flex items-start gap-4 md:w-1/3'>
                                    <div className='w-20 h-24 bg-gray-100 rounded-md overflow-hidden shrink-0'>
                                        {req.product.image && req.product.image[0] ? (
                                            <img src={req.product.image[0]} alt={req.product.name} className='w-full h-full object-cover' />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <Package size={24} />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className='font-medium text-silk-900 text-lg'>{req.product.name}</h3>
                                        <p className='text-silk-600 mb-1'>{currency}{req.product.price}</p>
                                        <p className='text-xs text-gray-400 font-mono mb-2 flex items-center gap-1'>
                                            <span className="select-none">ID:</span>
                                            <span
                                                className="select-all font-medium text-gray-600 bg-gray-50 px-1 rounded cursor-pointer hover:bg-gray-100 border border-transparent hover:border-gray-200"
                                                onClick={() => { navigator.clipboard.writeText(pid); QToast.success("ID Copied!", { position: "top-right" }); }}
                                                title="Click to copy"
                                            >
                                                {pid}
                                            </span>
                                        </p>
                                        <p className='text-xs text-gray-500'>
                                            Requested by: <span className="font-medium text-gray-700">{req.userName}</span>
                                        </p>
                                        <p className='text-xs text-gray-500'>
                                            Email: {req.userEmail}
                                        </p>
                                        <p className={`text-xs mt-2 font-medium w-max px-2 py-0.5 rounded ${req.isAvailable ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-blue-50 text-blue-500'}`}>
                                            Status: {req.isAvailable ? "Restocked / Available" : (req.product.requestStatus === 'message_received' ? 'Message Sent' : 'Pending')}
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className='flex-1 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-silk-100 pt-4 md:pt-0 md:pl-6'>
                                    <div className='flex flex-col gap-2'>
                                        <label className='text-sm text-gray-600 font-medium'>Reply Message to User</label>
                                        <textarea
                                            className='w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-silk-500 outline-none'
                                            rows='2'
                                            placeholder='Ex: We can restock this in 5 days...'
                                            value={replyMessage[msgKey] || ""}
                                            onChange={(e) => setReplyMessage(prev => ({ ...prev, [msgKey]: e.target.value }))}
                                        ></textarea>
                                    </div>

                                    <div className='flex justify-end gap-3 mt-auto'>
                                        <button
                                            onClick={() => handleAction(req.userId, pid, 'message', replyMessage[msgKey])}
                                            disabled={!replyMessage[msgKey]}
                                            className='flex items-center gap-2 px-4 py-2 border border-silk-300 text-silk-700 rounded-md hover:bg-silk-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                                        >
                                            <MessageSquare size={16} />
                                            Send Message
                                        </button>
                                        <button
                                            onClick={() => handleAction(req.userId, pid, 'accept')}
                                            className='flex items-center gap-2 px-4 py-2 bg-silk-900 text-white rounded-md hover:bg-silk-800 transition-colors shadow-sm'
                                        >
                                            <CheckCircle size={16} />
                                            Accept Order
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

export default Requests
