import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import QToast from './uiComponents/QToast'
import FadeContent from './uiComponents/FadeContent'
import { RainbowButton } from "@/components/ui/rainbow-button"

const Login = () => {

    const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

    const [currentState, setCurrentState] = useState('Login');
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Form States
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [country, setCountry] = useState('');
    const [image, setImage] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            if (currentState === 'Sign Up') {
                const formData = new FormData();
                formData.append('name', name);
                formData.append('email', email);
                formData.append('password', password);
                formData.append('phone', phone);
                const addressObj = { street, city, state, zip, country };
                formData.append('address', JSON.stringify(addressObj));
                if (image) {
                    formData.append('image', image);
                }

                const response = await axios.post(backendUrl + '/api/user/register', formData);
                if (response.data.success) {
                    setToken(response.data.token);
                    localStorage.setItem('token', response.data.token);
                    QToast.success("Account created successfully", { position: "top-center" });
                    fetchUserProfile(response.data.token);
                } else {
                    QToast.error(response.data.message, { position: "top-right" });
                }
            } else {
                const response = await axios.post(backendUrl + '/api/user/login', { email, password });
                if (response.data.success) {
                    setToken(response.data.token);
                    localStorage.setItem('token', response.data.token);
                    QToast.success("Logged in successfully", { position: "top-center" });
                    fetchUserProfile(response.data.token);
                } else {
                    QToast.error(response.data.message, { position: "top-right" });
                }
            }
        } catch (error) {
            console.log(error);
            QToast.error(error.message, { position: "top-right" });
        }
    }

    const fetchUserProfile = async (tokenArg) => {
        const t = tokenArg || token;
        if (!t) return;
        try {
            const response = await axios.get(backendUrl + '/api/user/profile', { headers: { token: t } });
            if (response.data.success) {
                setUserData(response.data.user);
                // Pre-fill edit form
                // ... (rest of the logic remains same, just ensuring we don't need to repeat it in instruction if replace content is full block)
                setName(response.data.user.name);
                setEmail(response.data.user.email);
                setPhone(response.data.user.phone || '');
                if (response.data.user.address) {
                    setStreet(response.data.user.address.street || '');
                    setCity(response.data.user.address.city || '');
                    setState(response.data.user.address.state || '');
                    setZip(response.data.user.address.zip || '');
                    setCountry(response.data.user.address.country || '');
                }
                setImage(false); // Reset image state
            } else {
                QToast.error(response.data.message, { position: "top-right" });
            }
        } catch (error) {
            console.log(error);
            QToast.error(error.message, { position: "top-right" });
        }
    }

    const updateProfileHandler = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('userId', userData._id);
            formData.append('name', name);
            formData.append('phone', phone);
            const addressObj = { street, city, state, zip, country };
            formData.append('address', JSON.stringify(addressObj));
            if (image) {
                formData.append('image', image);
            }

            const response = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } });
            if (response.data.success) {
                QToast.success("Profile updated", { position: "top-center" });
                setIsEditing(false);
                fetchUserProfile();
            } else {
                QToast.error(response.data.message, { position: "top-right" });
            }
        } catch (error) {
            console.log(error);
            QToast.error(error.message, { position: "top-right" });
        }
    }

    const logout = () => {
        setToken('');
        localStorage.removeItem('token');
        setUserData(null);
        navigate('/account');
    }

    useEffect(() => {
        if (token) {
            fetchUserProfile();
        }
    }, [token])

    if (token && userData) {
        return (
            <div className='min-h-screen pt-32 pb-12 px-4 max-w-4xl mx-auto flex items-center justify-center'>
                <FadeContent blur={true} duration={0.6}>
                    <div className='relative bg-silk-50 dark:bg-[linear-gradient(105deg,var(--tw-gradient-stops))] dark:from-black dark:to-silk-blue-dark rounded-2xl p-8 shadow-xl border border-silk-200 dark:border-silk-blue-border w-full'>

                        <div className="absolute top-4 right-4 z-10">
                            <button onClick={logout} className='text-red-500 hover:text-red-700 text-xs font-medium uppercase tracking-wider'>Sign Out</button>
                        </div>

                        {!isEditing ? (
                            <div className='flex flex-col gap-8'>
                                {/* Section 1: Identity */}
                                <div className='flex flex-col items-center text-center'>
                                    <div className='w-32 h-32 rounded-full bg-silk-100 dark:bg-black/40 flex items-center justify-center text-4xl text-silk-900 dark:text-silk-100 font-serif border-2 border-silk-200 dark:border-silk-blue-border overflow-hidden shadow-lg'>
                                        {userData.image ? (
                                            <img src={userData.image} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            userData.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <h2 className='text-3xl font-serif text-silk-900 dark:text-white mt-4 mb-1'>{userData.name}</h2>
                                    <p className='text-silk-600 dark:text-silk-200'>{userData.email}</p>
                                </div>

                                {/* Section 2: Account Details */}
                                <div className='w-full'>
                                    <h3 className='text-lg font-serif text-silk-900 dark:text-silk-100 border-b border-silk-200 dark:border-silk-blue-border pb-2 text-center mb-6'>Account Information</h3>

                                    <div className='flex flex-wrap gap-4 justify-center'>
                                        <div className='flex-1 min-w-[250px] p-4 bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-xl border border-silk-100 dark:border-silk-blue-border/30 transition-all hover:bg-white/80 dark:hover:bg-black/40'>
                                            <p className='text-xs text-silk-500 dark:text-silk-400 uppercase tracking-widest mb-1'>Phone</p>
                                            <p className='text-silk-900 dark:text-silk-100 font-medium break-words'>{userData.phone || 'Not set'}</p>
                                        </div>

                                        <div className='flex-1 min-w-[250px] p-4 bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-xl border border-silk-100 dark:border-silk-blue-border/30 transition-all hover:bg-white/80 dark:hover:bg-black/40'>
                                            <p className='text-xs text-silk-500 dark:text-silk-400 uppercase tracking-widest mb-1'>Street Address</p>
                                            <p className='text-silk-900 dark:text-silk-100 font-medium break-words'>{userData.address?.street || 'Not set'}</p>
                                        </div>

                                        <div className='flex-1 min-w-[250px] p-4 bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-xl border border-silk-100 dark:border-silk-blue-border/30 transition-all hover:bg-white/80 dark:hover:bg-black/40'>
                                            <p className='text-xs text-silk-500 dark:text-silk-400 uppercase tracking-widest mb-1'>City</p>
                                            <p className='text-silk-900 dark:text-silk-100 font-medium break-words'>{userData.address?.city || 'Not set'}</p>
                                        </div>

                                        <div className='flex-1 min-w-[250px] p-4 bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-xl border border-silk-100 dark:border-silk-blue-border/30 transition-all hover:bg-white/80 dark:hover:bg-black/40'>
                                            <p className='text-xs text-silk-500 dark:text-silk-400 uppercase tracking-widest mb-1'>State/Province</p>
                                            <p className='text-silk-900 dark:text-silk-100 font-medium break-words'>{userData.address?.state || 'Not set'}</p>
                                        </div>

                                        <div className='flex-1 min-w-[250px] p-4 bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-xl border border-silk-100 dark:border-silk-blue-border/30 transition-all hover:bg-white/80 dark:hover:bg-black/40'>
                                            <p className='text-xs text-silk-500 dark:text-silk-400 uppercase tracking-widest mb-1'>Zip Code</p>
                                            <p className='text-silk-900 dark:text-silk-100 font-medium break-words'>{userData.address?.zip || 'Not set'}</p>
                                        </div>

                                        <div className='flex-1 min-w-[250px] p-4 bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-xl border border-silk-100 dark:border-silk-blue-border/30 transition-all hover:bg-white/80 dark:hover:bg-black/40'>
                                            <p className='text-xs text-silk-500 dark:text-silk-400 uppercase tracking-widest mb-1'>Country</p>
                                            <p className='text-silk-900 dark:text-silk-100 font-medium break-words'>{userData.address?.country || 'Not set'}</p>
                                        </div>
                                    </div>

                                    <div className='mt-8 flex justify-center'>
                                        <div onClick={() => setIsEditing(true)}>
                                            <RainbowButton className="w-full sm:w-auto">Edit Details</RainbowButton>
                                        </div>
                                    </div>

                                    {/* Mobile Only: About & Contact */}
                                    <div className="grid grid-cols-2 gap-4 mt-2 md:hidden border-t border-silk-200 dark:border-silk-blue-border pt-6">
                                        <Link to="/about" className="flex items-center justify-center py-3 px-4 border border-silk-200 dark:border-silk-blue-border rounded-xl text-silk-900 dark:text-silk-100 font-medium hover:bg-silk-100 dark:hover:bg-white/10 transition-colors bg-white/40 dark:bg-black/20 text-sm">
                                            About Us
                                        </Link>
                                        <Link to="/contact" className="flex items-center justify-center py-3 px-4 border border-silk-200 dark:border-silk-blue-border rounded-xl text-silk-900 dark:text-silk-100 font-medium hover:bg-silk-100 dark:hover:bg-white/10 transition-colors bg-white/40 dark:bg-black/20 text-sm">
                                            Contact
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={updateProfileHandler} className='flex flex-col items-center gap-6 animate-fade-in'>
                                {/* Editable Image Section */}
                                <label htmlFor="profile-image-upload" className="cursor-pointer relative group">
                                    <div className='w-32 h-32 rounded-full bg-silk-100 dark:bg-black/40 flex items-center justify-center text-4xl text-silk-900 dark:text-silk-100 font-serif border-2 border-silk-200 dark:border-silk-blue-border overflow-hidden shadow-lg relative'>
                                        {image ? (
                                            <img src={URL.createObjectURL(image)} alt="Profile" className="w-full h-full object-cover" />
                                        ) : userData.image ? (
                                            <img src={userData.image} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            userData.name.charAt(0).toUpperCase()
                                        )}

                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-100 transition-opacity">
                                            <span className="text-white text-xl">✏️</span>
                                        </div>
                                    </div>
                                    <input type="file" id="profile-image-upload" hidden onChange={(e) => setImage(e.target.files[0])} />
                                    <p className='text-center text-sm text-silk-600 dark:text-silk-400 mt-2'>Change Picture</p>
                                </label>

                                <div className='w-full grid grid-cols-1 gap-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-silk-700 dark:text-silk-300 mb-1'>Full Name</label>
                                        <input onChange={(e) => setName(e.target.value)} value={name} type="text" className='w-full px-4 py-2 rounded-lg border border-silk-200 dark:border-silk-blue-border bg-white/60 dark:bg-black/30 backdrop-blur-sm text-silk-900 dark:text-white focus:ring-2 focus:ring-silk-500 focus:outline-none' />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-silk-700 dark:text-silk-300 mb-1'>Phone Number</label>
                                        <input onChange={(e) => setPhone(e.target.value)} value={phone} type="text" className='w-full px-4 py-2 rounded-lg border border-silk-200 dark:border-silk-blue-border bg-white/60 dark:bg-black/30 backdrop-blur-sm text-silk-900 dark:text-white focus:ring-2 focus:ring-silk-500 focus:outline-none' />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-silk-700 dark:text-silk-300 mb-1'>Street Address</label>
                                        <input onChange={(e) => setStreet(e.target.value)} value={street} type="text" className='w-full px-4 py-2 rounded-lg border border-silk-200 dark:border-silk-blue-border bg-white/60 dark:bg-black/30 backdrop-blur-sm text-silk-900 dark:text-white focus:ring-2 focus:ring-silk-500 focus:outline-none' />
                                    </div>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div>
                                            <label className='block text-sm font-medium text-silk-700 dark:text-silk-300 mb-1'>City</label>
                                            <input onChange={(e) => setCity(e.target.value)} value={city} type="text" className='w-full px-4 py-2 rounded-lg border border-silk-200 dark:border-silk-blue-border bg-white/60 dark:bg-black/30 backdrop-blur-sm text-silk-900 dark:text-white focus:ring-2 focus:ring-silk-500 focus:outline-none' />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-silk-700 dark:text-silk-300 mb-1'>State</label>
                                            <input onChange={(e) => setState(e.target.value)} value={state} type="text" className='w-full px-4 py-2 rounded-lg border border-silk-200 dark:border-silk-blue-border bg-white/60 dark:bg-black/30 backdrop-blur-sm text-silk-900 dark:text-white focus:ring-2 focus:ring-silk-500 focus:outline-none' />
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div>
                                            <label className='block text-sm font-medium text-silk-700 dark:text-silk-300 mb-1'>Zip Code</label>
                                            <input onChange={(e) => setZip(e.target.value)} value={zip} type="text" className='w-full px-4 py-2 rounded-lg border border-silk-200 dark:border-silk-blue-border bg-white/60 dark:bg-black/30 backdrop-blur-sm text-silk-900 dark:text-white focus:ring-2 focus:ring-silk-500 focus:outline-none' />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-silk-700 dark:text-silk-300 mb-1'>Country</label>
                                            <input onChange={(e) => setCountry(e.target.value)} value={country} type="text" className='w-full px-4 py-2 rounded-lg border border-silk-200 dark:border-silk-blue-border bg-white/60 dark:bg-black/30 backdrop-blur-sm text-silk-900 dark:text-white focus:ring-2 focus:ring-silk-500 focus:outline-none' />
                                        </div>
                                    </div>
                                </div>

                                <div className='flex gap-4 mt-4'>
                                    <RainbowButton type='submit'>Save</RainbowButton>
                                    <button type='button' onClick={() => setIsEditing(false)} className='px-6 py-2 border border-silk-300 dark:border-silk-blue-border text-silk-900 dark:text-white rounded-full hover:bg-silk-50 dark:hover:bg-black/40 transition-colors'>Cancel</button>
                                </div>
                            </form>
                        )}

                    </div>
                </FadeContent>
            </div>
        )
    }

    return (
        <div className='min-h-screen pt-32 pb-12 flex items-center justify-center px-4'>
            <FadeContent blur={true} duration={0.6}>
                <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-full max-w-md m-auto bg-silk-50 dark:bg-[linear-gradient(105deg,var(--tw-gradient-stops))] dark:from-black dark:to-silk-blue-dark rounded-2xl p-8 shadow-2xl border border-silk-200 dark:border-silk-blue-border text-silk-800 dark:text-gray-200'>
                    <div className='inline-flex items-center gap-2 mb-6'>
                        <p className='font-serif text-3xl font-medium text-silk-900 dark:text-white'>{currentState}</p>
                        <hr className='border-none h-[1.5px] w-8 bg-silk-900 dark:bg-white' />
                    </div>

                    {currentState === 'Sign Up' && (
                        <>
                            <div className='flex items-center gap-4 mb-4 w-full'>
                                <label htmlFor="image-upload-signup" className='cursor-pointer flex items-center gap-2 group'>
                                    <div className='w-12 h-12 rounded-full bg-white/40 dark:bg-black/40 flex items-center justify-center overflow-hidden border border-silk-200 dark:border-silk-blue-border transition-colors group-hover:border-silk-400'>
                                        {image ? <img src={URL.createObjectURL(image)} alt="Profile" className='w-full h-full object-cover' /> : <span className='text-xs text-silk-500 dark:text-silk-400'>+ Img</span>}
                                    </div>
                                    <span className='text-sm text-silk-600 dark:text-silk-300 group-hover:text-silk-900 dark:group-hover:text-white transition-colors'>Add Profile Picture</span>
                                </label>
                                <input type="file" id="image-upload-signup" hidden onChange={(e) => setImage(e.target.files[0])} />
                            </div>
                            <input onChange={(e) => setName(e.target.value)} value={name} type="text" className='w-full px-4 py-3 border border-silk-200 dark:border-silk-blue-border rounded-lg bg-white/60 dark:bg-black/30 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-silk-500 mb-3' placeholder='Full Name' required />
                            <input onChange={(e) => setPhone(e.target.value)} value={phone} type="text" className='w-full px-4 py-3 border border-silk-200 dark:border-silk-blue-border rounded-lg bg-white/60 dark:bg-black/30 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-silk-500 mb-3' placeholder='Phone Number' />
                        </>
                    )}

                    <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className='w-full px-4 py-3 border border-silk-200 dark:border-silk-blue-border rounded-lg bg-white/60 dark:bg-black/30 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-silk-500 mb-3' placeholder='Email' required />
                    <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className='w-full px-4 py-3 border border-silk-200 dark:border-silk-blue-border rounded-lg bg-white/60 dark:bg-black/30 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-silk-500 mb-3' placeholder='Password' required />

                    <div className='w-full flex justify-between text-sm mt-1 mb-8'>
                        <p
                            className='cursor-pointer text-silk-600 dark:text-silk-400 hover:text-silk-900 dark:hover:text-white transition-colors'
                            onClick={() => QToast.info('Password reset feature coming soon!', { position: "top-center" })}
                        >
                            Forgot your password?
                        </p>
                        {currentState === 'Login'
                            ? <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer text-silk-600 dark:text-silk-400 hover:text-silk-900 dark:hover:text-white transition-colors'>Create account</p>
                            : <p onClick={() => setCurrentState('Login')} className='cursor-pointer text-silk-600 dark:text-silk-400 hover:text-silk-900 dark:hover:text-white transition-colors'>Login Here</p>
                        }
                    </div>

                    <div className="w-full">
                        <RainbowButton type="submit" className="w-full py-3">
                            {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
                        </RainbowButton>
                    </div>
                </form>
            </FadeContent>
        </div>
    )
}

export default Login
