import { createContext, useEffect, useState } from "react";
import QToast from "../pages/uiComponents/QToast";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '₹';
    // Use production URL as fallback so the deployed app works on other devices
    // const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://172.20.10.10:5000"
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    // const backendUrl = "http://localhost:5000"
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState(() => {
        const saved = localStorage.getItem('products');
        return saved ? JSON.parse(saved) : [];
    });
    const [token, setToken] = useState("");
    const [userData, setUserData] = useState(() => {
        const saved = localStorage.getItem('userData');
        return saved ? JSON.parse(saved) : null;
    });
    const [orderCount, setOrderCount] = useState(0);
    const [recentlyViewed, setRecentlyViewed] = useState(() => {
        const saved = localStorage.getItem('recentlyViewed');
        return saved ? JSON.parse(saved) : [];
    });

    const [galleryImages, setGalleryImages] = useState([]);

    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.success) {
                setProducts(response.data.products)
                localStorage.setItem('products', JSON.stringify(response.data.products));
            } else {
                QToast.error(response.data.message, { position: "top-right" })
            }
        } catch (error) {
            console.log(error)
            QToast.error(error.message, { position: "top-right" })
        }
    }

    const getGalleryImages = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/gallery/list');
            if (response.data.success) {
                setGalleryImages(response.data.images);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getProductsData()
        getGalleryImages()
    }, [])

    const fetchUserProfile = async (tokenArg) => {
        const t = tokenArg || token;
        if (!t) return;
        try {
            const response = await axios.get(backendUrl + '/api/user/profile', { headers: { token: t } });
            if (response.data.success) {
                setUserData(response.data.user);
                localStorage.setItem('userData', JSON.stringify(response.data.user));
            } else {
                if (response.data.message.includes('invalid signature') || response.data.message.includes('jwt') || response.data.message.includes('Not Authorized')) {
                    setToken('');
                    localStorage.removeItem('token');
                    setUserData(null);
                    localStorage.removeItem('userData');
                    QToast.error("Session expired. Please login again.", { position: "top-center" });
                } else {
                    QToast.error(response.data.message, { position: "top-right" });
                }
            }
        } catch (error) {
            console.log(error);
            QToast.error(error.message, { position: "top-right" });
        }
    }

    const addToCart = async (itemId, size, quantity = 1) => {
        let finalSize = size;
        const productData = products.find((product) => product._id === itemId);

        if (!finalSize) {
            if (productData && productData.sizes && productData.sizes.length > 0) {
                QToast.error('Select Product Size', { position: "top-center" });
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
        // QToast.success("Item added to cart", { position: "center" });

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId, size: finalSize, quantity }, { headers: { token } });
            } catch (error) {
                console.log(error);
                QToast.error(error.message, { position: "top-right" });
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
                QToast.error(error.message, { position: "top-right" });
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
                            let price = itemInfo.price;
                            if (itemInfo.sizePrices && itemInfo.sizePrices[item]) {
                                price = Number(itemInfo.sizePrices[item]);
                            }
                            totalAmount += price * cartItems[items][item];
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
            QToast.error(error.message, { position: "top-right" });
        }
    }

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
            fetchUserProfile(localStorage.getItem('token'))
            getOrderCount(localStorage.getItem('token'))
        } else if (token) {
            fetchUserProfile(token)
            getUserCart(token)
            getOrderCount(token)
        }
    }, [token])

    const getOrderCount = async (token) => {
        try {
            if (!token) return;

            let count = 0;

            // Standard Orders
            const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } })
            if (response.data.success) {
                response.data.orders.forEach((order) => {
                    order.items.forEach((item) => {
                        if (order.status !== 'Delivered' && order.status !== 'Cancelled') {
                            count++;
                        }
                    })
                })
            }

            // Custom Orders
            const customResponse = await axios.post(backendUrl + '/api/custom-order/userorders', {}, { headers: { token } })
            if (customResponse.data.success) {
                customResponse.data.orders.forEach((order) => {
                    if (order.status !== 'Completed' && order.status !== 'Cancelled') {
                        count++;
                    }
                })
            }

            setOrderCount(count);

        } catch (error) {
            console.log(error);
        }
    }

    const addToWishlist = async (product) => {
        if (!token) {
            QToast.error("Please login to add to wishlist", { position: "top-center" });
            return;
        }

        if (userData) {
            const exists = userData.wishlist?.some(item => item.productId === product._id);
            if (exists) {
                QToast.info("Item already in wishlist", { position: "top-center" });
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
                    QToast.success("Added to wishlist", { position: "top-center" });
                } else {
                    QToast.error(response.data.message, { position: "top-right" });
                }
            } catch (error) {
                console.log(error);
                QToast.error(error.message, { position: "top-right" });
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
                    QToast.success("Removed from wishlist", { position: "top-center" });
                } else {
                    QToast.error(response.data.message, { position: "top-right" });
                }
            } catch (error) {
                console.log(error);
                QToast.error(error.message, { position: "top-right" });
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
                    QToast.success(response.data.message, { position: "center" });
                } else {
                    QToast.error(response.data.message, { position: "top-right" });
                }
            } catch (error) {
                console.log(error);
                QToast.error(error.message, { position: "top-right" });
            }
        }
    }

    const addToRecentlyViewed = (productId) => {
        setRecentlyViewed(prev => {
            const temp = prev.filter(id => id !== productId); // Remove if exists to move to top
            const updated = [productId, ...temp].slice(0, 10); // Keep max 10
            localStorage.setItem('recentlyViewed', JSON.stringify(updated));
            return updated;
        });
    }

    const navigate = useNavigate();

    const [shippingFee, setShippingFee] = useState(null);

    const value = {
        products, currency, delivery_fee: shippingFee !== null ? shippingFee : getDeliveryFee(),
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems,
        getCartCount, updateQuantity,
        getCartAmount, navigate,
        backendUrl,
        setToken, token,
        userData, setUserData, fetchUserProfile,
        addToWishlist, removeFromWishlist, requestProduct,
        getProductsData,
        setShippingFee, orderCount, getOrderCount,
        recentlyViewed, addToRecentlyViewed,
        galleryImages
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;
