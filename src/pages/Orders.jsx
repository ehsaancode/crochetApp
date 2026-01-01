import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios';
import { Package, Star, X, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import QToast from './uiComponents/QToast';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import girlStichingAnimation from './uiComponents/lottie/Girl stitching YT.lottie';
import confettiAnimation from './uiComponents/lottie/Confetti.lottie';
import { useLocation } from 'react-router-dom';

const Orders = ({ compact }) => {

    const location = useLocation();
    const [showConfetti, setShowConfetti] = useState(false);
    const { backendUrl, token, currency, getProductsData } = useContext(ShopContext);
    const [orderData, setOrderData] = useState([])
    const [customOrders, setCustomOrders] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (location.state?.newOrder) {
            setShowConfetti(true);
            const timer = setTimeout(() => {
                setShowConfetti(false);
            }, 5000);
            window.history.replaceState({}, document.title);
            return () => clearTimeout(timer);
        }
    }, [location]);

    // Review Modal State
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [reviewData, setReviewData] = useState({ productId: '', rating: 0, comment: '' });

    const loadOrderData = async () => {
        try {
            if (!token) {
                return null
            }

            // Fetch Standard Orders
            const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } })
            if (response.data.success) {
                let allOrdersItem = []
                response.data.orders.map((order) => {
                    order.items.map((item) => {
                        item['status'] = order.status
                        item['payment'] = order.payment
                        item['paymentMethod'] = order.paymentMethod
                        item['date'] = order.date
                        allOrdersItem.push(item)
                    })
                })
                setOrderData(allOrdersItem.reverse())
            }

            // Fetch Custom Orders
            const customResponse = await axios.post(backendUrl + '/api/custom-order/userorders', { userId: token }, { headers: { token } }) // userId typically from taken in middleware, but passing body just in case logic needs it
            if (customResponse.data.success) {
                setCustomOrders(customResponse.data.orders)
            }

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    // ... handleReviewSubmit ...

    useEffect(() => {
        loadOrderData()
    }, [token])

    const downloadInvoice = (order) => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.text("Aalaboo Invoice", 20, 20);

        doc.setFontSize(12);
        doc.text("Handmade Luxury Crochet", 20, 30);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 20);
        doc.text(`Order ID: ${order._id ? order._id.slice(-8).toUpperCase() : 'N/A'}`, 150, 30);

        // Product Details
        doc.setLineWidth(0.5);
        doc.line(20, 40, 190, 40);

        doc.setFontSize(14);
        doc.text("Product Details", 20, 50);

        doc.setFontSize(12);
        doc.text(`Product: ${order.name}`, 20, 60);
        doc.text(`Quantity: ${order.quantity}`, 20, 70);
        doc.text(`Size: ${order.size}`, 20, 80);
        doc.text(`Price: Rs. ${order.price}`, 150, 60);

        // Summary
        doc.line(20, 90, 190, 90);
        doc.setFontSize(14);
        doc.text("Total", 20, 100);
        doc.text(`Rs. ${order.price * order.quantity}`, 150, 100);

        // Footer
        doc.setFontSize(10);
        doc.text("Thank you for shopping with Aalaboo!", 20, 130);
        doc.text("www.aalaboo.com", 20, 135);

        doc.save(`invoice_${order.name}.pdf`);
    }

    return (
        <div className={compact ? 'p-6' : 'border-t pt-24 px-4 sm:px-12 md:px-24 min-h-[80vh]'}>

            {!compact && (
                <div className='text-2xl mb-8'>
                    <h2 className='font-serif text-3xl text-silk-900 dark:text-silk-50'>MY <span className='text-silk-600 font-medium'>ORDERS</span></h2>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="w-12 h-12 border-4 border-silk-200 dark:border-gray-800 border-t-silk-900 dark:border-t-green-900 rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                    {/* Standard Orders Section */}
                    <div className='mb-12'>
                        <h3 className="text-xl font-medium text-silk-900 dark:text-silk-50 mb-4 border-b pb-2">Standard Orders</h3>
                        <div className='flex flex-col gap-4'>
                            {orderData.length === 0 ? (
                                <div className={`flex flex-col items-center justify-center text-center animate-fade-in ${compact ? 'py-4' : 'py-10'}`}>
                                    <div className="w-80 sm:w-96 mb-4">
                                        <DotLottieReact
                                            src={girlStichingAnimation}
                                            loop
                                            autoplay
                                        />
                                    </div>
                                    <p className="text-silk-500 text-sm">No standard orders yet.</p>
                                </div>
                            ) : (
                                orderData.map((item, index) => (
                                    <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in dark:text-gray-200 dark:border-gray-700'>
                                        <div className='flex items-start gap-6 text-sm'>
                                            <img className='w-16 sm:w-20' src={item.image[0]} alt="" />
                                            <div>
                                                <p className='sm:text-base font-medium'>{item.name}</p>
                                                <div className='flex items-center gap-3 mt-1 text-base text-gray-700 dark:text-gray-300'>
                                                    <p>{currency}{item.price}</p>
                                                    <p>Quantity: {item.quantity}</p>
                                                    <p>Size: {item.size}</p>
                                                </div>
                                                <p className='mt-1'>Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                                                <p className='mt-1'>Payment: <span className='text-gray-400'>{item.paymentMethod}</span></p>
                                            </div>
                                        </div>
                                        <div className='md:w-1/2 flex justify-between'>
                                            <div className='flex items-center gap-2'>
                                                <p className={`min-w-2 h-2 rounded-full ${item.status === 'Delivered' ? 'bg-green-500' : 'bg-green-500'}`}></p>
                                                <p className='text-sm md:text-base'>{item.status}</p>
                                            </div>
                                            {item.status === 'Delivered' ? (
                                                <div className='flex gap-2'>
                                                    <button
                                                        onClick={() => openReviewModal(item._id)}
                                                        className='border px-3 py-1.5 text-xs font-medium rounded-sm border-silk-600 text-silk-600 hover:bg-silk-50 dark:hover:bg-gray-800 transition-all'
                                                    >
                                                        Review
                                                    </button>
                                                    <button
                                                        onClick={() => downloadInvoice(item)}
                                                        className='flex items-center justify-center gap-1 border px-3 py-1.5 text-xs font-medium rounded-sm border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all'
                                                    >
                                                        <Download className='w-3 h-3' /> Invoice
                                                    </button>
                                                </div>
                                            ) : (
                                                <button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all'>Track Order</button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Custom Orders Section */}
                    {!compact && (
                        <div>
                            <h3 className="text-xl font-medium text-silk-900 dark:text-silk-50 mb-4 border-b pb-2">Custom Requests</h3>
                            <div className='flex flex-col gap-4'>
                                {customOrders.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center text-center animate-fade-in py-10">
                                        <div className="w-80 sm:w-96 mb-4">
                                            <DotLottieReact
                                                src={girlStichingAnimation}
                                                loop
                                                autoplay
                                            />
                                        </div>
                                        <p className="text-silk-500 text-sm">No custom requests yet.</p>
                                    </div>
                                ) : (
                                    customOrders.map((item, index) => (
                                        <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in dark:text-gray-200 dark:border-gray-700'>
                                            <div className='flex items-start gap-6 text-sm'>
                                                <div className="flex flex-col gap-2">
                                                    {Array.isArray(item.image) ? (
                                                        <div className="flex gap-2">
                                                            {item.image.slice(0, 3).map((img, idx) => (
                                                                <img key={idx} className='w-16 sm:w-20 rounded-md object-cover aspect-square' src={img} alt="Custom Request" />
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <img className='w-16 sm:w-20 rounded-md object-cover' src={item.image} alt="Custom Request" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className='sm:text-base font-medium'>Custom Request ({item.size})</p>
                                                    <div className='space-y-1 mt-1 text-sm text-gray-600 dark:text-gray-400'>
                                                        <p>Color: {item.colorPreference === 'original' ? 'Original' : item.customColor}</p>
                                                        {item.yarnType && <p>Yarn: {item.yarnType}</p>}
                                                        <p className="italic">"{item.description}"</p>
                                                    </div>
                                                    <p className='mt-2'>Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                                                </div>
                                            </div>
                                            <div className='md:w-1/2 flex justify-end'>
                                                <div className='flex items-center gap-2'>
                                                    <p className={`min-w-2 h-2 rounded-full ${item.status === 'Completed' ? 'bg-green-500' : item.status === 'Cancelled' ? 'bg-red-500' : 'bg-yellow-500'}`}></p>
                                                    <p className='text-sm md:text-base font-medium'>{item.status === 'Accepted' ? 'Pending' : item.status}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Review Modal */}
            {isReviewOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl w-full max-w-md shadow-2xl animate-fade-in relative">
                        <button
                            onClick={() => setIsReviewOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-xl font-serif mb-4 text-silk-900 dark:text-white">Write a Review</h3>

                        <div className="flex flex-col gap-4">
                            {/* Star Rating */}
                            <div className="flex gap-1 justify-center py-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-8 h-8 cursor-pointer transition-colors ${reviewData.rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                        onClick={() => setReviewData({ ...reviewData, rating: star })}
                                    />
                                ))}
                            </div>

                            <textarea
                                className="w-full p-3 border rounded-lg h-32 resize-none focus:outline-none focus:border-silk-500 dark:bg-black dark:border-gray-700 dark:text-white"
                                placeholder="Share your thoughts about the product..."
                                value={reviewData.comment}
                                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                            />

                            <button
                                onClick={handleReviewSubmit}
                                className="w-full bg-silk-900 text-white py-3 rounded-lg hover:bg-black dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors"
                            >
                                Submit Review
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-[100] w-full h-full">
                    <DotLottieReact
                        src={confettiAnimation}
                        autoplay
                    />
                </div>
            )}
        </div>
    )
}


export default Orders
