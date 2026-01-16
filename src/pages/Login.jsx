import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import QToast from './uiComponents/QToast'
import FadeContent from './uiComponents/FadeContent'

import { User, Heart, Package, MapPin, LogOut, Edit2, LocateFixed, Info, Phone, Settings, ChevronRight, Lock, HelpCircle, ArrowLeft, Camera } from 'lucide-react'
import Wishlist from './Wishlist'
import Orders from './Orders'
import Loading from '../components/Loading'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useTheme } from '../context/ThemeContext';
import girlSayHiAnimation from '../assets/newLottie/girl say hi.lottie';

const Login = () => {
    const { theme } = useTheme();
    const { token, setToken, navigate, backendUrl, userData, fetchUserProfile, setUserData } = useContext(ShopContext);
    const location = useLocation();

    const [currentState, setCurrentState] = useState('Login');
    // const [userData, setUserData] = useState(null); // Removed local state
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    // Form States
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [street, setStreet] = useState('');
    const [landmark, setLandmark] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [country, setCountry] = useState('');
    const [image, setImage] = useState(false);

    // Sync form with userData from Context
    useEffect(() => {
        if (userData) {
            setName(userData.name || '');
            setEmail(userData.email || '');
            setPhone(userData.phone || '');
            if (userData.address) {
                setStreet(userData.address.street || '');
                setLandmark(userData.address.landmark || '');
                setCity(userData.address.city || '');
                setState(userData.address.state || '');
                setZip(userData.address.zip || '');
                setCountry(userData.address.country || '');
            }
        }
    }, [userData]);

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

                    if (location.state?.from) {
                        navigate(location.state.from);
                    } else {
                        fetchUserProfile(response.data.token);
                    }
                } else {
                    QToast.error(response.data.message, { position: "top-right" });
                }
            } else {
                const response = await axios.post(backendUrl + '/api/user/login', { email, password });
                if (response.data.success) {
                    setToken(response.data.token);
                    localStorage.setItem('token', response.data.token);
                    QToast.success("Logged in successfully", { position: "bottom" });

                    if (location.state?.from) {
                        navigate(location.state.from);
                    } else {
                        fetchUserProfile(response.data.token);
                    }
                } else {
                    QToast.error(response.data.message, { position: "bottom" });
                }
            }
        } catch (error) {
            console.log(error);
            QToast.error(error.message, { position: "bottom" });
        }
    }

    const updateProfileHandler = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('userId', userData._id);
            formData.append('name', name);
            formData.append('phone', phone);
            const addressObj = { street, landmark, city, state, zip, country };
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
        localStorage.removeItem('userData');
        setUserData(null);
        navigate('/account');
    }


    const handleLocation = () => {
        if (!navigator.geolocation) {
            QToast.error("Geolocation is not supported by your browser", { position: "top-center" });
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                if (response.data && response.data.address) {
                    const addr = response.data.address;
                    // Construct more detailed street address
                    const streetAddr = [(addr.house_number || ''), (addr.road || addr.pedestrian || '')].filter(Boolean).join(', ');
                    setStreet(streetAddr);

                    // Construct landmark from available details
                    const landmarkDetails = [
                        addr.neighbourhood,
                        addr.suburb,
                        addr.commercial,
                        addr.point_of_interest
                    ].filter(Boolean).join(', ');
                    setLandmark(landmarkDetails);

                    setCity(addr.city || addr.town || addr.village || addr.county || '');
                    setState(addr.state || '');
                    setZip(addr.postcode || '');
                    setCountry(addr.country || '');
                    QToast.success("Address details filled from location", { position: "top-center" });
                }
            } catch (error) {
                console.error(error);
                QToast.error("Failed to fetch address", { position: "top-center" });
            }
        }, () => {
            QToast.error("Unable to retrieve your location", { position: "top-center" });
        });
    }

    if (token && !userData) {
        return (
            <Loading className="min-h-screen" />
        )
    }

    // Helper component for menu items
    const MenuItem = ({ icon: Icon, label, onClick, isDanger }) => (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between p-4 rounded-xl transition-all border-b border-gray-100 dark:border-gray-800 last:border-0 ${isDanger ? 'text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10' : 'text-silk-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5'}`}
        >
            <div className="flex items-center gap-4">
                <Icon className="w-5 h-5 opacity-70" strokeWidth={1.5} />
                <span className="font-medium text-base">{label}</span>
            </div>
            {!isDanger && <ChevronRight className="w-4 h-4 text-gray-400" />}
        </button>
    );

    if (token && userData) {
        return (
            <div className='min-h-screen pt-28 pb-12 px-4 max-w-lg mx-auto'>
                <FadeContent blur={true} duration={0.6}>
                    {!isEditing ? (
                        <>
                            {/* Simple Header */}
                            <div className="flex items-center justify-between mb-8">
                                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                                    <ArrowLeft className="w-6 h-6 text-silk-900 dark:text-white" />
                                </button>
                                <h1 className="text-xl font-bold text-silk-900 dark:text-white">Profile</h1>
                                <div className="w-10"></div>
                            </div>

                            {/* Centered Profile Info */}
                            <div className="flex flex-col items-center mb-10">
                                <div className="w-28 h-28 rounded-full p-1 border-2 border-silk-100 dark:border-silk-800 mb-4">
                                    <div className="w-full h-full rounded-full overflow-hidden bg-silk-50 dark:bg-gray-800 flex items-center justify-center">
                                        {userData.image ? (
                                            <img src={userData.image} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-4xl font-serif text-silk-300 dark:text-silk-600">
                                                {userData.name.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-silk-900 dark:text-white mb-1">{userData.name}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{userData.email}</p>

                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-black dark:bg-white text-white dark:text-black px-8 py-2.5 rounded-full font-medium text-sm hover:shadow-lg transition-all active:scale-95"
                                >
                                    Edit Profile
                                </button>
                            </div>

                            {/* Clean Menu List */}
                            <div className="flex flex-col">
                                <MenuItem icon={Settings} label="Settings" onClick={() => QToast.info('Settings coming soon')} />
                                <MenuItem icon={Package} label="My Orders" onClick={() => navigate('/orders')} />
                                <MenuItem icon={Heart} label="Wishlist" onClick={() => navigate('/wishlist')} />
                                <MenuItem icon={MapPin} label="Address" onClick={() => setIsEditing(true)} />
                                <MenuItem icon={Lock} label="Change Password" onClick={() => navigate('/change-password')} />
                                <MenuItem icon={HelpCircle} label="Help & Support" onClick={() => navigate('/contact')} />
                                <MenuItem icon={LogOut} label="Log out" onClick={logout} isDanger />
                            </div>
                        </>
                    ) : (
                        <div className="animate-fade-in">
                            <div className="flex items-center justify-between mb-8">
                                <button onClick={() => setIsEditing(false)} className="flex items-center text-silk-600 dark:text-silk-400 hover:text-silk-900 dark:hover:text-white transition-colors">
                                    <ArrowLeft className="w-5 h-5 mr-1" /> Back
                                </button>
                                <h1 className="text-xl font-bold text-silk-900 dark:text-white">Edit Profile</h1>
                                <div className="w-12" />
                            </div>

                            <form onSubmit={updateProfileHandler} className='flex flex-col gap-6'>
                                <label htmlFor="profile-image-upload" className="cursor-pointer relative group w-28 h-28 mx-auto mb-4">
                                    <div className='w-full h-full rounded-full overflow-hidden bg-silk-100 dark:bg-gray-800 relative border-2 border-dashed border-silk-300 dark:border-silk-700'>
                                        {image ? (
                                            <img src={URL.createObjectURL(image)} alt="Profile" className="w-full h-full object-cover" />
                                        ) : userData.image ? (
                                            <img src={userData.image} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className='w-full h-full flex items-center justify-center text-3xl font-serif text-silk-400'>{userData.name.charAt(0)}</div>
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                    <input type="file" id="profile-image-upload" hidden onChange={(e) => setImage(e.target.files[0])} />
                                </label>

                                <div className='space-y-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>Full Name</label>
                                        <input onChange={(e) => setName(e.target.value)} value={name} type="text" className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-silk-500 focus:outline-none' />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>Phone</label>
                                        <input onChange={(e) => setPhone(e.target.value)} value={phone} type="text" className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-silk-500 focus:outline-none' />
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className='block text-sm font-medium text-gray-900 dark:text-white'>Address Details</label>
                                            <button
                                                type="button"
                                                onClick={handleLocation}
                                                className="flex items-center gap-1.5 text-xs font-medium text-silk-600 dark:text-silk-400 hover:text-silk-900 dark:hover:text-silk-200 bg-silk-50 dark:bg-silk-900/50 px-3 py-1.5 rounded-full transition-colors"
                                            >
                                                <LocateFixed className="w-3.5 h-3.5" /> Use Current Location
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            <input onChange={(e) => setStreet(e.target.value)} value={street} type="text" placeholder="Street Address" className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-silk-500 focus:outline-none' />
                                            <input onChange={(e) => setLandmark(e.target.value)} value={landmark} type="text" placeholder="Landmark (Optional)" className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-silk-500 focus:outline-none' />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input onChange={(e) => setCity(e.target.value)} value={city} type="text" placeholder="City" className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-silk-500 focus:outline-none' />
                                                <input onChange={(e) => setState(e.target.value)} value={state} type="text" placeholder="State" className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-silk-500 focus:outline-none' />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input onChange={(e) => setZip(e.target.value)} value={zip} type="text" placeholder="Zip Code" className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-silk-500 focus:outline-none' />
                                                <input onChange={(e) => setCountry(e.target.value)} value={country} type="text" placeholder="Country" className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-silk-500 focus:outline-none' />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex gap-4 mt-2'>
                                    <button type='submit' className='flex-1 bg-silk-900 dark:bg-silk-100 text-white dark:text-black py-3.5 rounded-full font-medium transition-all hover:bg-black dark:hover:bg-white/90 shadow-lg active:scale-95'>Save Changes</button>
                                </div>
                            </form>
                        </div>
                    )}
                </FadeContent>
            </div>
        )
    }

    return (
        <div className='h-[100dvh] w-full flex flex-col md:flex-row-reverse items-center justify-between px-4 relative bg-white dark:bg-black transition-colors duration-300 overflow-hidden pt-16'>

            {/* Top/Right Lottie Animation */}
            <div className={`w-full md:w-1/2 flex justify-center items-center transition-all duration-500 ease-in-out shrink-0 relative ${currentState === 'Sign Up' ? 'h-[25vh] md:h-full' : 'h-[30vh] md:h-full'}`}>
                <div className="w-full h-full md:w-[75%] md:h-[75%]">
                    <DotLottieReact
                        src={girlSayHiAnimation}
                        loop
                        autoplay
                        style={{
                            width: '100%',
                            height: '100%',
                            filter: theme === 'dark' ? 'brightness(0.85) sepia(1) hue-rotate(190deg) saturate(2.5)' : 'none',
                        }}
                    />
                </div>
            </div>

            <FadeContent blur={true} duration={0.6} className="w-full md:w-1/2 flex-1 flex flex-col items-center relative z-10 justify-start md:justify-center h-full overflow-y-auto md:overflow-hidden">

                {/* Main Content Container - Centered and Spaced */}
                <div className='flex flex-col pb-20 items-center justify-center w-full max-w-lg mx-auto gap-3 md:gap-6 py-0 md:py-0 scale-90 sm:scale-100'>

                    {/* Welcome Messages */}
                    <div className="text-center">
                        <h2 className='font-serif text-4xl md:text-5xl text-silk-900 dark:text-silk-100 mb-2 leading-tight'>Welcome to <span className="italic">Aalaboo</span></h2>
                        <p className='text-sm md:text-lg text-silk-600 dark:text-silk-300'>
                            {currentState === 'Login'
                                ? 'Please sign in to continue.'
                                : 'Join our community of crochet lovers today!'}
                        </p>
                    </div>

                    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-full px-2 md:px-0'>

                        <p className='font-serif text-2xl md:text-3xl font-medium text-silk-900 dark:text-white mb-4'>{currentState}</p>

                        {currentState === 'Sign Up' && (
                            <div className="w-full animate-fade-in flex flex-col gap-3 mb-3">
                                <div className='flex items-center gap-4 w-full justify-center'>
                                    <label htmlFor="image-upload-signup" className='cursor-pointer flex items-center gap-2 group whitespace-nowrap bg-silk-50 dark:bg-gray-900/50 px-4 py-2 rounded-full border border-silk-100 dark:border-gray-800 hover:border-silk-300 transition-all'>
                                        <div className='w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/40 dark:bg-gray-800 flex items-center justify-center overflow-hidden border border-silk-200 dark:border-gray-700 transition-colors group-hover:border-silk-400'>
                                            {image ? <img src={URL.createObjectURL(image)} alt="Profile" className='w-full h-full object-cover' /> : <span className='text-[10px] md:text-xs text-silk-500 dark:text-silk-400'>+ Img</span>}
                                        </div>
                                        <span className='text-xs md:text-sm text-silk-600 dark:text-silk-300 group-hover:text-silk-900 dark:group-hover:text-white transition-colors'>Add Picture</span>
                                    </label>
                                    <input type="file" id="image-upload-signup" hidden onChange={(e) => setImage(e.target.files[0])} />
                                </div>
                                <div className="grid grid-cols-2 gap-3 w-full">
                                    <input onChange={(e) => setName(e.target.value)} value={name} type="text" className='w-full px-3 py-2 md:px-4 md:py-3 border border-silk-200 dark:border-gray-700 rounded-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-silk-500 placeholder:text-xs md:placeholder:text-sm text-sm dark:text-white' placeholder='Full Name' required />
                                    <input onChange={(e) => setPhone(e.target.value)} value={phone} type="text" className='w-full px-3 py-2 md:px-4 md:py-3 border border-silk-200 dark:border-gray-700 rounded-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-silk-500 placeholder:text-xs md:placeholder:text-sm text-sm dark:text-white' placeholder='Phone' />
                                </div>
                            </div>
                        )}

                        <div className="w-full flex flex-col gap-3 mb-4">
                            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className='w-full px-3 py-2.5 md:px-4 md:py-3.5 border border-silk-200 dark:border-gray-700 rounded-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-silk-500 placeholder:text-xs md:placeholder:text-base text-sm dark:text-white' placeholder='Email' required />
                            <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className='w-full px-3 py-2.5 md:px-4 md:py-3.5 border border-silk-200 dark:border-gray-700 rounded-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-silk-500 placeholder:text-xs md:placeholder:text-base text-sm dark:text-white' placeholder='Password' required />
                        </div>

                        <div className='w-full flex justify-between text-xs md:text-sm mt-1 mb-6 px-1'>
                            <p
                                className='cursor-pointer text-silk-600 dark:text-silk-400 hover:text-silk-900 dark:hover:text-white transition-colors font-medium'
                                onClick={() => navigate('/forgot-password')}
                            >
                                Forgot password?
                            </p>
                            {currentState === 'Login'
                                ? <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer text-silk-600 dark:text-silk-400 hover:text-silk-900 dark:hover:text-white transition-colors font-medium'>Create account</p>
                                : <p onClick={() => setCurrentState('Login')} className='cursor-pointer text-silk-600 dark:text-silk-400 hover:text-silk-900 dark:hover:text-white transition-colors font-medium'>Login Here</p>
                            }
                        </div>

                        <div className="w-full">
                            <button type="submit" className="w-full py-2.5 md:py-4 bg-silk-900 dark:bg-white text-white dark:text-black text-base md:text-lg font-semibold rounded-full hover:bg-black dark:hover:bg-gray-200 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95">
                                {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
                            </button>
                        </div>
                    </form>
                </div>
            </FadeContent>
        </div>
    )
}

export default Login
