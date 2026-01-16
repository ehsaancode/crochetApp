import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import QToast from './uiComponents/QToast';
import { ArrowLeft, Lock, KeyRound } from 'lucide-react';
import FadeContent from './uiComponents/FadeContent';

const ChangePassword = () => {
    const { backendUrl, token, navigate } = useContext(ShopContext);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                backendUrl + '/api/user/change-password',
                { currentPassword, newPassword },
                { headers: { token } }
            );

            if (response.data.success) {
                QToast.success(response.data.message);

                // Clear inputs
                setCurrentPassword('');
                setNewPassword('');

                // Optional: navigate back after delay
                setTimeout(() => navigate(-1), 1500);
            } else {
                QToast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            QToast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen pt-24 pb-12 px-4 max-w-md mx-auto flex flex-col items-center justify-center'>
            <FadeContent>
                <div className='bg-white dark:bg-[#1a1a1a] p-8 rounded-2xl shadow-xl w-full border border-gray-100 dark:border-gray-800'>

                    <button onClick={() => navigate(-1)} className='mb-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors'>
                        <ArrowLeft className='w-5 h-5' />
                    </button>

                    <h2 className='text-2xl font-serif text-silk-900 dark:text-white mb-2'>
                        Change Password
                    </h2>
                    <p className='text-sm text-gray-500 dark:text-gray-400 mb-8'>
                        Enter your current password and a new password to update your credentials.
                    </p>

                    <form onSubmit={handleChangePassword} className='flex flex-col gap-4'>
                        <div className='bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 flex items-center gap-3'>
                            <Lock className='w-5 h-5 text-gray-400' />
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className='bg-transparent outline-none flex-1 text-silk-900 dark:text-white placeholder-gray-400'
                                placeholder='Current Password'
                                required
                            />
                        </div>

                        <div className='bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 flex items-center gap-3'>
                            <KeyRound className='w-5 h-5 text-gray-400' />
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className='bg-transparent outline-none flex-1 text-silk-900 dark:text-white placeholder-gray-400'
                                placeholder='New Password'
                                minLength={8}
                                required
                            />
                        </div>

                        <button
                            type='submit'
                            disabled={loading}
                            className='bg-silk-900 dark:bg-white text-white dark:text-black font-medium py-3 rounded-xl hover:bg-black dark:hover:bg-gray-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4'
                        >
                            {loading ? 'Updating Password...' : 'Update Password'}
                        </button>
                    </form>

                </div>
            </FadeContent>
        </div>
    );
};

export default ChangePassword;
