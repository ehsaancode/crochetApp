import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '₹';
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState("");
    const [userData, setUserData] = useState(null);

    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.success) {
                setProducts(response.data.products)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getProductsData()
    }, [])

    const fetchUserProfile = async (tokenArg) => {
        const t = tokenArg || token;
        if (!t) return;
        try {
            const response = await axios.get(backendUrl + '/api/user/profile', { headers: { token: t } });
            if (response.data.success) {
                setUserData(response.data.user);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const addToCart = async (itemId, size, quantity = 1) => {
        let finalSize = size;
        const productData = products.find((product) => product._id === itemId);

        if (!finalSize) {
            if (productData && productData.sizes && productData.sizes.length > 0) {
                toast.error('Select Product Size');
                return;
            } else {
                finalSize = "Default";
            }
        }

        let cartData = JSON.parse(JSON.stringify(cartItems));

        if (cartData[itemId]) {
            if (cartData[itemId][finalSize]) {
                cartData[itemId][finalSize] += quantity;
            } else {
                cartData[itemId][finalSize] = quantity;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][finalSize] = quantity;
        }
        setCartItems(cartData);
        toast.success("Item added to cart");

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId, size: finalSize, quantity }, { headers: { token } });
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } });
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (itemInfo) {
                for (const item in cartItems[items]) {
                    try {
                        if (cartItems[items][item] > 0) {
                            totalAmount += itemInfo.price * cartItems[items][item];
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
        }
        return totalAmount;
    }

    const getDeliveryFee = () => {
        let maxFee = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (itemInfo) {
                for (const item in cartItems[items]) {
                    try {
                        if (cartItems[items][item] > 0) {
                            const fee = itemInfo.shippingFee || 100;
                            if (fee > maxFee) maxFee = fee;
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
        }
        return maxFee;
    }

    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } });
            if (response.data.success) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
            fetchUserProfile(localStorage.getItem('token'))
        } else if (token) {
            fetchUserProfile(token)
            getUserCart(token)
        }
    }, [token])

    const addToWishlist = async (product) => {
        if (!token) {
            toast.error("Please login to add to wishlist");
            return;
        }

        if (userData) {
            const exists = userData.wishlist?.some(item => item.productId === product._id);
            if (exists) {
                toast.info("Item already in wishlist");
                return;
            }

            const newWishlistItem = {
                productId: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                description: product.description,
                addedAt: new Date().toISOString()
            };

            const updatedWishlist = [...(userData.wishlist || []), newWishlistItem];
            setUserData(prev => ({ ...prev, wishlist: updatedWishlist }));

            try {
                const response = await axios.post(backendUrl + '/api/user/wishlist/add', { product }, { headers: { token } });
                if (response.data.success) {
                    toast.success("Added to wishlist");
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    }

    const removeFromWishlist = async (productId) => {
        if (!token) return;

        if (userData) {
            const updatedWishlist = userData.wishlist.filter(item => item.productId !== productId);
            setUserData(prev => ({ ...prev, wishlist: updatedWishlist }));

            try {
                const response = await axios.post(backendUrl + '/api/user/wishlist/remove', { productId }, { headers: { token } });
                if (response.data.success) {
                    toast.success("Removed from wishlist");
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    }

    const requestProduct = async (productId) => {
        if (!token) return;

        if (userData) {
            const updatedWishlist = userData.wishlist.map(item => {
                if (item.productId === productId) {
                    return { ...item, requestStatus: 'pending' };
                }
                return item;
            });
            setUserData(prev => ({ ...prev, wishlist: updatedWishlist }));

            try {
                const response = await axios.post(backendUrl + '/api/user/request', { productId }, { headers: { token } });
                if (response.data.success) {
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    }

    const navigate = useNavigate();

    const value = {
        products, currency, delivery_fee: getDeliveryFee(),
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems,
        getCartCount, updateQuantity,
        getCartAmount, navigate,
        backendUrl,
        setToken, token,
        userData, setUserData, fetchUserProfile,
        addToWishlist, removeFromWishlist, requestProduct
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;
