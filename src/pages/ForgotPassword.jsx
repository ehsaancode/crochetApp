import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import QToast from './uiComponents/QToast'
import { ArrowLeft, Mail, Lock, KeyRound } from 'lucide-react'
import FadeContent from './uiComponents/FadeContent'

const ForgotPassword = () => {
    const { backendUrl, navigate } = useContext(ShopContext);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(backendUrl + '/api/user/send-reset-otp', { email });
            if (response.data.success) {
                QToast.success(response.data.message);
                setStep(2);
            } else {
                QToast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            QToast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(backendUrl + '/api/user/reset-password', { email, otp, newPassword });
            if (response.data.success) {
                QToast.success(response.data.message);
                setTimeout(() => {
                    navigate('/account'); // Navigate to login/account page
                }, 1500);
            } else {
                QToast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            QToast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='min-h-screen pt-24 pb-12 px-4 max-w-md mx-auto flex flex-col items-center justify-center'>
            <FadeContent>
                <div className='bg-white dark:bg-[#1a1a1a] p-8 rounded-2xl shadow-xl w-full border border-gray-100 dark:border-gray-800'>

                    <button onClick={() => step === 1 ? navigate(-1) : setStep(1)} className='mb-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors'>
                        <ArrowLeft className='w-5 h-5' />
                    </button>

                    <h2 className='text-2xl font-serif text-silk-900 dark:text-white mb-2'>
                        {step === 1 ? 'Forgot Password?' : 'Reset Password'}
                    </h2>
                    <p className='text-sm text-gray-500 dark:text-gray-400 mb-8'>
                        {step === 1
                            ? 'Enter your email address and we’ll send you an OTP to reset your password.'
                            : 'Enter the OTP sent to your email and create a new password.'
                        }
                    </p>

                    {step === 1 ? (
                        <form onSubmit={handleSendOtp} className='flex flex-col gap-4'>
                            <div className='bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 flex items-center gap-3'>
                                <Mail className='w-5 h-5 text-gray-400' />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className='bg-transparent outline-none flex-1 text-silk-900 dark:text-white placeholder-gray-400'
                                    placeholder='Enter your email'
                                    required
                                />
                            </div>
                            <button
                                type='submit'
                                disabled={loading}
                                className='bg-silk-900 dark:bg-white text-white dark:text-black font-medium py-3 rounded-xl hover:bg-black dark:hover:bg-gray-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4'
                            >
                                {loading ? 'Sending OTP...' : 'Send OTP'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} className='flex flex-col gap-4'>
                            <div className='bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 flex items-center gap-3'>
                                <KeyRound className='w-5 h-5 text-gray-400' />
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className='bg-transparent outline-none flex-1 text-silk-900 dark:text-white placeholder-gray-400 tracking-widest'
                                    placeholder='Enter OTP'
                                    maxLength={6}
                                    required
                                />
                            </div>
                            <div className='bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 flex items-center gap-3'>
                                <Lock className='w-5 h-5 text-gray-400' />
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
                                {loading ? 'Resetting Password...' : 'Reset Password'}
                            </button>
                        </form>
                    )}

                </div>
            </FadeContent>
        </div>
    )
}

export default ForgotPassword
