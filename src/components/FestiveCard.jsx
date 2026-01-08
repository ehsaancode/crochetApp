import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const FestiveCard = () => {
    const { products, currency, backendUrl, theme } = useContext(ShopContext);
    const [config, setConfig] = useState(null);
    const [displayProducts, setDisplayProducts] = useState([]);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await axios.get(backendUrl + '/api/festival/get');
                if (res.data.success) {
                    setConfig(res.data.festival);
                }
            } catch (error) {
                console.error("Error fetching festival config", error);
            }
        };
        fetchConfig();
    }, [backendUrl]);

    useEffect(() => {
        if (config && config.productIds && products.length > 0) {
            const filtered = products.filter(p => config.productIds.includes(p._id));
            setDisplayProducts(filtered);
        }
    }, [config, products]);

    // Verify config isActive
    const isActive = config && (config.isActive === true || config.isActive === "true");

    if (!config || !isActive) return null;

    // Helper to convert hex to rgba
    const hexToRgba = (hex, alpha) => {
        if (!hex) return '#ffffff';
        let c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split('');
            if (c.length === 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c = '0x' + c.join('');
            return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')';
        }
        return hex;
    }

    const isBlur = (config.blurBackground === true || config.blurBackground === "true");

    // Glassmorphism (Backdrop blur) - applies if no image or if user wants glass effect over color
    const backdropClass = (isBlur && !config.backgroundImage) ? 'backdrop-blur-xl' : '';

    // Image Blur - applies if there IS an image and blur is requested
    const imgBlurClass = (isBlur && config.backgroundImage) ? 'blur-2xl scale-110' : '';

    // Handle transparency for Classmorphism (Color only)
    let finalBackgroundColor = config.backgroundColor || '#ffffff';
    if (isBlur && !config.backgroundImage) {
        finalBackgroundColor = hexToRgba(config.backgroundColor, 0.4); // 40% opacity for glass effect
    }

    const bgStyle = config.backgroundImage
        ? { backgroundImage: `url(${config.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : { backgroundColor: finalBackgroundColor };

    const isLightBg = config.backgroundColor === '#ffffff' || config.backgroundColor.toLowerCase() === '#fff' || config.backgroundColor.toLowerCase() === '#ffffff';

    // Config Styles
    const dynamicTextColor = config.fontColor ? { color: config.fontColor } : {};
    const textColorClass = config.fontColor ? '' : (isLightBg ? 'text-gray-900' : 'text-white');

    const productCardStyle = config.productCardColor ? { backgroundColor: config.productCardColor } : {};

    return (
        /* Main Card Container */
        <div className={`relative w-full shadow-2xl min-h-[400px] md:min-h-[500px] flex flex-col md:flex-row rounded-3xl mb-16 ${backdropClass}`}>

            {/* Background Layer Wrapper - Clips the background but allows Hero Image to pop out */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden z-0">
                <div className={`w-full h-full transition-all duration-700 ${imgBlurClass}`} style={bgStyle}>
                    {config.backgroundImage && <div className="absolute inset-0 bg-black/30"></div>}
                </div>
            </div>

            {/* Hero Image - Popping Out (Top Right) */}
            {config.heroImage && (
                <img
                    src={config.heroImage}
                    alt="Festival"
                    style={{
                        '--mobile-w': config.heroWidth || '12rem',
                        '--desktop-w': config.heroWidthDesktop || '24rem',
                        top: config.heroTop || '-2.5rem',
                        right: config.heroRight || '-1.5rem'
                    }}
                    className="absolute z-20 object-contain animate-float pointer-events-none w-[var(--mobile-w)] md:w-[var(--desktop-w)]"
                />
            )}

            {/* Content Section (Left) */}
            <div className={`relative z-10 w-full md:w-1/3 p-6 md:p-8 flex flex-col justify-center ${textColorClass}`} style={dynamicTextColor}>
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3 leading-tight" style={dynamicTextColor}>
                    {config.name}
                </h2>
                {config.subtitle && (
                    <p className="text-base md:text-lg opacity-90 mb-6 font-light tracking-wide" style={dynamicTextColor}>
                        {config.subtitle}
                    </p>
                )}
                <Link to="/collection" className={`bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 px-5 py-2.5 rounded-full w-max flex items-center gap-2 transition-all text-sm ${textColorClass}`} style={dynamicTextColor}>
                    <span>Explore Collection</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Products Section (Right) */}
            <div className="relative z-10 w-full md:w-2/3 p-2 md:p-4 flex items-center">
                <div className="w-full py-3 overflow-x-auto pb-2 hide-scrollbar flex gap-4 snap-x snap-mandatory">
                    {displayProducts.map((product) => (
                        <Link
                            to={`/product/${product._id}`}
                            key={product._id}
                            className={`min-w-[140px] md:min-w-[180px] rounded-xl p-3 shadow-lg hover:-translate-y-2 transition-transform duration-300 snap-center group ${!config.productCardColor ? 'bg-white/95 dark:bg-black/80 backdrop-blur-sm' : ''}`}
                            style={productCardStyle}
                        >
                            <div className="w-full aspect-[4/5] rounded-lg overflow-hidden mb-3 relative">
                                <img
                                    src={product.image[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-white truncate text-xs md:text-sm font-serif">{product.name}</h3>
                                <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-0.5">{product.category}</p>
                                <p className="font-semibold text-gray-900 dark:text-white mt-1 text-xs md:text-sm">{currency}{product.price}</p>
                            </div>
                        </Link>
                    ))}
                    {displayProducts.length === 0 && (
                        <div className="min-w-[150px] h-[250px] flex items-center justify-center text-white/50 border-2 border-dashed border-white/20 rounded-2xl">
                            No products selected
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FestiveCard;
