import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { ToastContainer, toast } from 'react-toastify';
import { Calendar, User, Mail, Phone, ShoppingBag, Clock, FileText, ExternalLink, Image as ImageIcon, CheckCircle, XCircle } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const Applications = ({ token }) => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchApplications = async () => {
        try {
            constresponse = await axios.get(backendUrl + '/api/seller/list', { headers: { token } });
            if (response.data.success) {
                setApplications(response.data.requests);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load applications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [token]);

    const handleStatusUpdate = async (id, status) => {
        // Placeholder for future status update feature
        // await axios.post(backendUrl + '/api/seller/status', { id, status }, { headers: { token } });
        // fetchApplications();
        toast.info("Status update logic coming soon!");
    };

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-[50vh]'>
                <div className='w-12 h-12 border-4 border-gray-200 border-t-silk-500 rounded-full animate-spin'></div>
            </div>
        );
    }

    return (
        <div className='p-6 animate-fade-in'>
            <h1 className='text-3xl font-serif text-gray-800 mb-8 flex items-center gap-3'>
                Seller Applications
                <span className='text-sm bg-silk-100 text-silk-800 px-3 py-1 rounded-full font-sans font-medium'>{applications.length}</span>
            </h1>

            <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
                {applications.map((app) => (
                    <div key={app._id} className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300'>
                        {/* Header Status Bar */}
                        <div className={`h-2 w-full ${app.status === 'pending' ? 'bg-yellow-400' : app.status === 'approved' ? 'bg-green-500' : 'bg-red-500'}`} />

                        <div className='p-6'>
                            <div className='flex justify-between items-start mb-4'>
                                <div>
                                    <h3 className='font-serif text-xl text-gray-900'>{app.name}</h3>
                                    <p className='text-sm text-gray-500 flex items-center gap-1 mt-1'>
                                        <Calendar className='w-3 h-3' />
                                        {new Date(app.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`text-xs uppercase tracking-wider font-bold px-2 py-1 rounded border ${app.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                    app.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                                    }`}>
                                    {app.status}
                                </span>
                            </div>

                            <div className='space-y-3 mb-6'>
                                <div className='flex items-center gap-3 text-sm text-gray-600'>
                                    <Mail className='w-4 h-4 text-gray-400' />
                                    <a href={`mailto:${app.email}`} className='hover:text-silk-600 hover:underline transition-colors truncate'>{app.email}</a>
                                </div>
                                <div className='flex items-center gap-3 text-sm text-gray-600'>
                                    <Phone className='w-4 h-4 text-gray-400' />
                                    <a href={`tel:${app.phone}`} className='hover:text-silk-600 transition-colors'>{app.phone}</a>
                                </div>
                                {app.shopName && (
                                    <div className='flex items-center gap-3 text-sm text-gray-600'>
                                        <ShoppingBag className='w-4 h-4 text-gray-400' />
                                        <span className='font-medium'>{app.shopName}</span>
                                    </div>
                                )}
                                <div className='flex items-center gap-3 text-sm text-gray-600'>
                                    <Clock className='w-4 h-4 text-gray-400' />
                                    <span>{app.experience} Exp.</span>
                                </div>
                            </div>

                            <div className='bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100'>
                                <h4 className='text-xs uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-2'>
                                    <FileText className='w-3 h-3' /> Bio
                                </h4>
                                <p className='text-sm text-gray-700 leading-relaxed italic line-clamp-4 hover:line-clamp-none transition-all'>
                                    "{app.bio}"
                                </p>
                            </div>

                            {/* Portfolio Preview */}
                            {(app.portfolioImages?.length > 0 || app.portfolioVideos?.length > 0) && (
                                <div className='mb-6'>
                                    <h4 className='text-xs uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2'>
                                        <ImageIcon className='w-3 h-3' /> Works ({app.portfolioImages.length + app.portfolioVideos.length})
                                    </h4>
                                    <div className='flex gap-2 overflow-x-auto pb-2 scrollbar-thin'>
                                        {app.portfolioImages.slice(0, 4).map((img, idx) => (
                                            <a key={idx} href={img} target="_blank" rel="noopener noreferrer" className='flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border border-gray-200 block shadow-sm hover:scale-105 transition-transform'>
                                                <img src={img} alt="work" className='w-full h-full object-cover' />
                                            </a>
                                        ))}
                                        {app.portfolioVideos.map((vid, idx) => (
                                            <a key={`v-${idx}`} href={vid} target="_blank" rel="noopener noreferrer" className='flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border border-gray-200 block shadow-sm bg-black relative'>
                                                <video src={vid} className='w-full h-full object-cover opacity-50' />
                                                <div className='absolute inset-0 flex items-center justify-center text-white text-[8px]'>VIDEO</div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Social Links */}
                            {app.socialLinks && (app.socialLinks.instagram || app.socialLinks.portfolio) && (
                                <div className='flex gap-3 mb-6 pt-4 border-t border-gray-100'>
                                    {app.socialLinks.instagram && (
                                        <a href={`https://instagram.com/${app.socialLinks.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className='text-xs text-pink-600 hover:underline flex items-center gap-1 bg-pink-50 px-3 py-1.5 rounded-full'>
                                            <ExternalLink className='w-3 h-3' /> Instagram
                                        </a>
                                    )}
                                    {app.socialLinks.portfolio && (
                                        <a href={app.socialLinks.portfolio} target="_blank" rel="noreferrer" className='text-xs text-blue-600 hover:underline flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full'>
                                            <ExternalLink className='w-3 h-3' /> Portfolio
                                        </a>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                ))}

                {applications.length === 0 && (
                    <div className='col-span-full py-20 text-center text-gray-400'>
                        <p>No applications found yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Applications;
