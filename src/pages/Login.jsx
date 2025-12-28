import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import QToast from './uiComponents/QToast'
import FadeContent from './uiComponents/FadeContent'
import { RainbowButton } from "@/components/ui/rainbow-button"
import { User, Heart, Package, MapPin, LogOut, Edit2, LocateFixed } from 'lucide-react'
import Wishlist from './Wishlist'
import Orders from './Orders'

const Login = () => {

    const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

    const [currentState, setCurrentState] = useState('Login');
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

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
                    QToast.success("Logged in successfully", { position: "bottom" });
                    fetchUserProfile(response.data.token);
                } else {
                    QToast.error(response.data.message, { position: "bottom" });
                }
            }
        } catch (error) {
            console.log(error);
            QToast.error(error.message, { position: "bottom" });
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
        localStorage.removeItem('userData');
        setUserData(null);
        navigate('/account');
    }

    useEffect(() => {
        if (token) {
            fetchUserProfile();
        }
    }, [token])

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
                    setStreet(addr.road || addr.pedestrian || '');
                    setCity(addr.city || addr.town || addr.village || '');
                    setState(addr.state || '');
                    setZip(addr.postcode || '');
                    setCountry(addr.country || '');
                    QToast.success("Address filled from location", { position: "top-center" });
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
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-silk-200 dark:border-gray-800 border-t-silk-900 dark:border-t-green-900 rounded-full animate-spin"></div>
            </div>
        )
    }

    if (token && userData) {
        return (
            <div className='min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto'>
                <FadeContent blur={true} duration={0.6}>
                    <div className='flex flex-col lg:flex-row gap-8'>

                        {/* Sidebar / Top Compact Profile */}
                        <div className='w-full lg:w-1/4 flex flex-col gap-6'>
                            <div className='bg-gradient-to-b from-transparent to-silk-200 dark:from-black dark:to-[#170D27] rounded-3xl p-6 shadow-sm text-center relative overflow-hidden'>
                                <div className='absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-silk-200 to-silk-300 dark:from-gray-800 dark:to-gray-700 opacity-30'></div>
                                <div className='relative z-10 flex flex-col items-center mt-8 space-y-3'>
                                    <div className='w-24 h-24 rounded-full bg-white dark:bg-gray-800 p-1 shadow-md'>
                                        <div className='w-full h-full rounded-full overflow-hidden bg-silk-100 dark:bg-gray-700 flex items-center justify-center text-3xl font-serif'>
                                            {userData.image ? (
                                                <img src={userData.image} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                userData.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className='text-xl font-bold text-silk-900 dark:text-white'>{userData.name}</h2>
                                        <p className='text-sm text-silk-500 dark:text-silk-400'>{userData.email}</p>
                                    </div>
                                    <button onClick={logout} className='flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-medium px-4 py-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-2'>
                                        <LogOut className='w-4 h-4' /> Sign Out
                                    </button>
                                </div>
                            </div>

                            {/* Tab Navigation */}
                            <div className='bg-gradient-to-b from-transparent to-silk-200 dark:from-black dark:to-[#170D27] rounded-3xl shadow-sm overflow-hidden flex flex-row lg:flex-col'>
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 px-6 py-4 transition-colors ${activeTab === 'profile' ? 'bg-silk-50 dark:bg-gray-800 text-silk-900 dark:text-white border-b-2 lg:border-b-0 lg:border-l-4 border-silk-600' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                                >
                                    <User className='w-5 h-5' /> <span className='hidden sm:inline'>Profile</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('wishlist')}
                                    className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 px-6 py-4 transition-colors ${activeTab === 'wishlist' ? 'bg-silk-50 dark:bg-gray-800 text-silk-900 dark:text-white border-b-2 lg:border-b-0 lg:border-l-4 border-silk-600' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                                >
                                    <Heart className='w-5 h-5' /> <span className='hidden sm:inline'>Wishlist</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 px-6 py-4 transition-colors ${activeTab === 'orders' ? 'bg-silk-50 dark:bg-gray-800 text-silk-900 dark:text-white border-b-2 lg:border-b-0 lg:border-l-4 border-silk-600' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                                >
                                    <Package className='w-5 h-5' /> <span className='hidden sm:inline'>Orders</span>
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className='flex-1 lg:w-3/4'>
                            {activeTab === 'profile' && (
                                <div className='bg-gradient-to-b from-transparent to-silk-200 dark:from-black dark:to-[#170D27] rounded-3xl p-6 md:p-8 shadow-sm animate-fade-in'>
                                    <div className='flex justify-between items-center mb-8 pb-4 border-b border-gray-100 dark:border-gray-800'>
                                        <h3 className='text-xl font-serif text-silk-900 dark:text-white'>Profile Details</h3>
                                        <button onClick={() => setIsEditing(!isEditing)} className='flex items-center gap-2 text-silk-600 hover:text-silk-900 dark:text-silk-400 dark:hover:text-white transition-colors'>
                                            <Edit2 className='w-4 h-4' /> {isEditing ? 'Cancel Edit' : 'Edit'}
                                        </button>
                                    </div>

                                    {!isEditing ? (
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                                            <div className='space-y-6'>
                                                <div>
                                                    <p className='text-xs text-gray-500 uppercase tracking-widest mb-1'>Full Name</p>
                                                    <p className='font-medium text-lg text-gray-900 dark:text-white'>{userData.name}</p>
                                                </div>
                                                <div>
                                                    <p className='text-xs text-gray-500 uppercase tracking-widest mb-1'>Email Address</p>
                                                    <p className='font-medium text-lg text-gray-900 dark:text-white'>{userData.email}</p>
                                                </div>
                                                <div>
                                                    <p className='text-xs text-gray-500 uppercase tracking-widest mb-1'>Phone</p>
                                                    <p className='font-medium text-lg text-gray-900 dark:text-white'>{userData.phone || 'Not set'}</p>
                                                </div>
                                            </div>
                                            <div className='space-y-6'>
                                                <div className='flex items-start gap-3'>
                                                    <MapPin className='w-5 h-5 text-silk-600 mt-1' />
                                                    <div>
                                                        <p className='text-xs text-gray-500 uppercase tracking-widest mb-1'>Address</p>
                                                        <p className='font-medium text-gray-900 dark:text-white'>
                                                            {userData.address ? (
                                                                <>
                                                                    {userData.address.street}<br />
                                                                    {userData.address.city}, {userData.address.state}<br />
                                                                    {userData.address.zip}, {userData.address.country}
                                                                </>
                                                            ) : 'No address saved'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <form onSubmit={updateProfileHandler} className='flex flex-col gap-6'>
                                            {/* Editable Image Section */}
                                            <label htmlFor="profile-image-upload" className="cursor-pointer relative group w-24 h-24 mx-auto">
                                                <div className='w-full h-full rounded-full overflow-hidden bg-silk-100 dark:bg-gray-700 relative border-2 border-dashed border-silk-300'>
                                                    {image ? (
                                                        <img src={URL.createObjectURL(image)} alt="Profile" className="w-full h-full object-cover" />
                                                    ) : userData.image ? (
                                                        <img src={userData.image} alt="Profile" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className='w-full h-full flex items-center justify-center text-2xl font-serif'>{userData.name.charAt(0)}</div>
                                                    )}
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Edit2 className="w-6 h-6 text-white" />
                                                    </div>
                                                </div>
                                                <input type="file" id="profile-image-upload" hidden onChange={(e) => setImage(e.target.files[0])} />
                                            </label>

                                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                                <div>
                                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Full Name</label>
                                                    <input onChange={(e) => setName(e.target.value)} value={name} type="text" className='w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-silk-500 focus:outline-none' />
                                                </div>
                                                <div>
                                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Phone</label>
                                                    <input onChange={(e) => setPhone(e.target.value)} value={phone} type="text" className='w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-silk-500 focus:outline-none' />
                                                </div>
                                                <div className='md:col-span-2'>
                                                    <div className="flex justify-between items-center mb-1">
                                                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Street Address</label>
                                                        <button
                                                            type="button"
                                                            onClick={handleLocation}
                                                            className="flex items-center gap-1.5 text-xs text-silk-600 dark:text-silk-400 hover:text-silk-900 dark:hover:text-silk-200 transition-colors bg-silk-50 dark:bg-silk-900/50 px-2 py-1 rounded-md"
                                                        >
                                                            <LocateFixed className="w-3.5 h-3.5" /> Use Current Location
                                                        </button>
                                                    </div>
                                                    <input onChange={(e) => setStreet(e.target.value)} value={street} type="text" className='w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-silk-500 focus:outline-none' />
                                                </div>
                                                <div>
                                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>City</label>
                                                    <input onChange={(e) => setCity(e.target.value)} value={city} type="text" className='w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-silk-500 focus:outline-none' />
                                                </div>
                                                <div>
                                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>State</label>
                                                    <input onChange={(e) => setState(e.target.value)} value={state} type="text" className='w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-silk-500 focus:outline-none' />
                                                </div>
                                                <div>
                                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Zip Code</label>
                                                    <input onChange={(e) => setZip(e.target.value)} value={zip} type="text" className='w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-silk-500 focus:outline-none' />
                                                </div>
                                                <div>
                                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Country</label>
                                                    <input onChange={(e) => setCountry(e.target.value)} value={country} type="text" className='w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-silk-500 focus:outline-none' />
                                                </div>
                                            </div>
                                            <div className='flex gap-4 mt-6'>
                                                <button type='submit' className='bg-silk-900 dark:bg-silk-100 text-white dark:text-black text-sm h-10 px-6 rounded-xl font-medium transition-all hover:bg-silk-800 dark:hover:bg-white shadow-md hover:shadow-lg'>Save Changes</button>
                                                <button type='button' onClick={() => setIsEditing(false)} className='px-6 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'>Cancel</button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            )}

                            {/* Wishlist Tab Content */}
                            {activeTab === 'wishlist' && (
                                <div className='bg-gradient-to-b from-transparent to-silk-200 dark:from-black dark:to-[#170D27] rounded-3xl shadow-sm overflow-hidden min-h-[500px]'>
                                    {/* Hacking styles to make Wishlist fit cleaner: Using css modules often better but here we just render it. 
                                        Since Wishlist has its own container logic, it might have double padding. 
                                        Ideally we'd pass a "compact" prop, but for now let's just see. 
                                        We might need to adjust Wishlist.jsx if it renders a full page structure.
                                        Wishlist.jsx starts with `pt-14`. We might want to remove that top padding with a prop.
                                    */}
                                    <Wishlist compact={true} />
                                </div>
                            )}

                            {/* Orders Tab Content */}
                            {activeTab === 'orders' && (
                                <div className='bg-gradient-to-b from-transparent to-silk-200 dark:from-black dark:to-[#170D27] rounded-3xl shadow-sm overflow-hidden min-h-[500px]'>
                                    {/* Similarly for Orders */}
                                    <Orders compact={true} />
                                </div>
                            )}
                        </div>
                    </div>
                </FadeContent>
            </div>
        )
    }

    return (
        <div className='min-h-screen pt-32 pb-12 flex items-center justify-center px-4'>
            <FadeContent blur={true} duration={0.6}>
                <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-full max-w-md m-auto bg-silk-50 dark:bg-[linear-gradient(105deg,var(--tw-gradient-stops))] dark:from-black dark:to-silk-blue-dark rounded-2xl p-8 shadow-2xl border border-silk-200 dark:border-silk-blue-border text-silk-800 dark:text-gray-200'>
                    {/* ... (Keep existing login form code) ... */}
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
