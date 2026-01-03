import React, { useState } from 'react'
import { Upload, X } from 'lucide-react'
import axios from 'axios'
import { backendUrl } from '../config'
import QToast from '../components/QToast'
import UploadProgressPopup from '../components/UploadProgressPopup'

const Add = ({ token }) => {

    const [image1, setImage1] = useState(false)
    const [image2, setImage2] = useState(false)
    const [image3, setImage3] = useState(false)
    const [image4, setImage4] = useState(false)
    const [image5, setImage5] = useState(false)
    const [image6, setImage6] = useState(false)

    const handleImageChange = (e, startIndex) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        const setters = [setImage1, setImage2, setImage3, setImage4, setImage5, setImage6];
        files.forEach((file, i) => {
            const index = startIndex + i;
            if (index < 6) setters[index](file);
        });
    }

    const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);
    const [isUploadSuccess, setIsUploadSuccess] = useState(false);



    const categoryList = {
        "Men": {
            "Wearables": ["Sweaters", "Cardigans", "Vests", "Shrugs", "Scarves", "Cowls", "Hats", "Beanies", "Berets", "Gloves", "Arm Warmers", "Socks", "Slippers", "Leg Warmers"],
            "Accessories": ["Headbands", "Ear Warmers", "Belts", "Bracelets", "Necklaces", "Mug Cozies", "Bottle Sleeves"],
            "Bags & Utility": ["Tote Bags", "Slings", "Backpacks", "Pouches", "Coin Purses", "Market Bags"],
            "Functional Home Utility": ["Pot Holders", "Trivets", "Dishcloths", "Washcloths"]
        },
        "Women": {
            "Wearables": ["Sweaters", "Cardigans", "Vests", "Shrugs", "Shawls", "Wraps", "Ponchos", "Capes", "Scarves", "Cowls", "Hats", "Beanies", "Berets", "Mittens", "Gloves", "Arm Warmers", "Socks", "Slippers", "Leg Warmers"],
            "Accessories": ["Headbands", "Ear Warmers", "Hair Accessories", "Brooches", "Belts", "Bracelets", "Necklaces", "Anklets", "Mug Cozies", "Bottle Sleeves"],
            "Bags & Utility": ["Tote Bags", "Handbags", "Slings", "Backpacks", "Pouches", "Coin Purses", "Storage Baskets", "Organizers", "Market Bags"],
            "Home Decor": ["Blankets", "Afghans", "Throws", "Bedspreads", "Cushion Covers", "Pillow Shams", "Rugs", "Floor Mats", "Wall Hangings", "Tapestries", "Table Runners", "Table Mats", "Placemats", "Coasters", "Curtains", "Door Hangings"],
            "Decorative & Art": ["Floral Crochet", "Leaf Motifs", "Mandala Crochet", "Tapestry Crochet", "Framed Crochet", "3D Crochet Art"],
            "Jewelry & Small Art": ["Crochet Earrings", "Crochet Rings", "Crochet Pendants", "Mini Ornaments", "Bookmark Crochet"]
        },
        "Kids": {
            "Wearables": ["Baby Sweaters", "Baby Caps", "Baby Socks", "Baby Booties", "Rompers", "Slippers", "Hats", "Beanies", "Mittens"],
            "Toys & Amigurumi": ["Animal Amigurumi", "Doll Amigurumi", "Character Figures", "Mini Amigurumi", "Keychain Amigurumi", "Plush Toys"],
            "Baby & Kids": ["Baby Blankets", "Soft Toys", "Nursery Decor"],
            "Accessories": ["Headbands", "Hair Accessories"],
            "Home & Utility": ["Blankets", "Door Stoppers"]
        },
        "All": {
            "Seasonal": ["Seasonal & Festive Decor"],
            "Wall Decor": ["Wall & Hanging Decor"],
            "Techniques": ["Crochet Techniques / Styles"]
        }
    };

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [shippingFee, setShippingFee] = useState("");
    const [category, setCategory] = useState("Men");
    const [subCategory, setSubCategory] = useState("Sweaters");
    const [bestseller, setBestseller] = useState(false);
    const [sizes, setSizes] = useState(["Free Size"]);
    const [sizePrices, setSizePrices] = useState({});
    const [defaultSize, setDefaultSize] = useState("Free Size");
    const [colors, setColors] = useState([]);
    const [currentColor, setCurrentColor] = useState("Red");
    const [isColorListOpen, setIsColorListOpen] = useState(false);
    const [productId, setProductId] = useState("");

    const addColor = () => {
        if (!colors.includes(currentColor)) {
            setColors(prev => [...prev, currentColor]);
        }
    }

    const removeColor = (colorToRemove) => {
        setColors(prev => prev.filter(c => c !== colorToRemove));
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            setIsUploadPopupOpen(true);
            setIsUploadSuccess(false);

            const formData = new FormData()

            formData.append("name", name)
            formData.append("description", description)

            // Clean sizePrices to remove empty values AND ensure only selected sizes are included
            console.log("Add Product Debug - Raw sizePrices:", sizePrices);
            const cleanSizePrices = {};
            sizes.forEach(size => {
                const val = sizePrices[size];
                if (val !== undefined && val !== "" && val !== null && !isNaN(Number(val))) {
                    cleanSizePrices[size] = Number(val);
                }
            });
            console.log("Add Product Debug - Cleaned:", cleanSizePrices);

            // Calculate base price from default size
            const basePrice = (cleanSizePrices[defaultSize] && !isNaN(cleanSizePrices[defaultSize])) ? Number(cleanSizePrices[defaultSize]) : 0;
            formData.append("price", basePrice)
            formData.append("shippingFee", shippingFee)
            formData.append("category", category)
            formData.append("subCategory", subCategory)
            formData.append("bestseller", bestseller)
            formData.append("sizes", JSON.stringify(sizes))
            formData.append("sizePrices", JSON.stringify(cleanSizePrices))
            formData.append("defaultSize", defaultSize)
            formData.append("colors", JSON.stringify(colors))
            formData.append("productId", productId)

            image1 && formData.append("image1", image1)
            image2 && formData.append("image2", image2)
            image3 && formData.append("image3", image3)
            image4 && formData.append("image4", image4)
            image5 && formData.append("image5", image5)
            image6 && formData.append("image6", image6)

            const response = await axios.post(backendUrl + "/api/product/add", formData, { headers: { token } })

            if (response.data.success) {
                // Show success state in popup
                setIsUploadSuccess(true);

                // Hide popup after delay and reset form
                setTimeout(() => {
                    setIsUploadPopupOpen(false);
                    setIsUploadSuccess(false);
                    QToast.success(response.data.message, { position: "top-right" })

                    setName('')
                    setDescription('')
                    setImage1(false)
                    setImage2(false)
                    setImage3(false)
                    setImage4(false)
                    setImage5(false)
                    setImage6(false)
                    setPrice('')
                    setShippingFee('')
                    setProductId('')
                    setCategory('Men')
                    setSubCategory('Sweaters')
                    setSubCategory('Sweaters')
                    setSizes(["Free Size"])
                    setSizePrices({})
                    setDefaultSize("Free Size")
                    setColors([])
                }, 2000);
            } else {
                setIsUploadPopupOpen(false); // Close popup on error
                QToast.error(response.data.message, { position: "top-right" })
            }

        } catch (error) {
            console.log(error);
            setIsUploadPopupOpen(false); // Close popup on error
            QToast.error(error.response?.data?.message || error.message, { position: "top-right" })
        }
    }

    const toggleSize = (s) => {
        setSizes(prev => {
            let newSizes;
            if (s === "Free Size") {
                // If "Free Size" is clicked.
                if (prev.includes("Free Size")) {
                    // If already selected, remove it (empty array)
                    newSizes = [];
                } else {
                    // Start fresh with ONLY Free Size, removing others
                    newSizes = ["Free Size"];
                }
            } else {
                // If a normal size (S, M, etc.) is clicked
                if (prev.includes(s)) {
                    // Remove it
                    newSizes = prev.filter(item => item !== s);
                } else {
                    // Add it, but ensure Free Size is NOT there
                    newSizes = [...prev.filter(item => item !== "Free Size"), s];
                }
            }

            // Auto-set default size logic
            if (newSizes.length === 1) {
                setDefaultSize(newSizes[0]);
            } else if (!newSizes.includes(defaultSize) && newSizes.length > 0) {
                setDefaultSize(newSizes[0]);
            } else if (newSizes.length === 0) {
                setDefaultSize("");
            }

            return newSizes;
        });
    }

    return (
        <div className="bg-card m-4 rounded-xl shadow-sm border border-border p-6 max-w-4xl">
            <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-5 text-foreground'>

                <div>
                    <h3 className='text-lg font-semibold mb-4'>Upload Images</h3>
                    <div className='flex gap-4 flex-wrap'>
                        {[image1, image2, image3, image4, image5, image6].map((img, index) => (
                            <div key={index} className='relative group'>
                                <label htmlFor={`image${index}`}>
                                    <div className={`w-24 h-24 border-2 border-dashed border-border flex items-center justify-center cursor-pointer bg-muted/30 rounded-lg hover:bg-muted/60 transition-colors overflow-hidden relative ${!img ? 'border-dashed' : 'border-solid'}`}>
                                        {img ? (
                                            img.type.startsWith('video/') ? (
                                                <video className='w-full h-full object-cover' src={URL.createObjectURL(img)} muted loop autoPlay />
                                            ) : (
                                                <img className='w-full h-full object-cover' src={URL.createObjectURL(img)} alt={`Product ${index + 1}`} />
                                            )
                                        ) : (
                                            <Upload className='text-muted-foreground group-hover:text-foreground transition-colors' />
                                        )}
                                    </div>
                                    <input onChange={(e) => handleImageChange(e, index)} type="file" id={`image${index}`} accept="image/*,video/*" hidden multiple />
                                </label>
                                {img && (
                                    <button
                                        type="button"
                                        onClick={() => [setImage1, setImage2, setImage3, setImage4, setImage5, setImage6][index](false)}
                                        className='absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-md hover:bg-destructive/90 transition-colors z-10'
                                        title="Remove media"
                                    >
                                        <X className='w-3 h-3' />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className='w-full'>
                    <p className='mb-2 font-medium'>Product ID (Optional)</p>
                    <input onChange={(e) => setProductId(e.target.value)} value={productId} className='w-full max-w-[500px] px-4 py-2.5 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-silk-400 transition-all font-mono text-sm' type="text" placeholder='Paste ID to restore product (e.g. 660...)' />
                    <p className='text-xs text-gray-500 mt-1'>Leave empty for auto-generated ID.</p>
                </div>

                <div className='w-full'>
                    <p className='mb-2 font-medium'>Product Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-4 py-2.5 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-silk-400 transition-all' type="text" placeholder='Type here' required />
                </div>

                <div className='w-full'>
                    <p className='mb-2 font-medium'>Product Description</p>
                    <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-4 py-2.5 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-silk-400 transition-all min-h-[100px]' type="text" placeholder='Write content here' required />
                </div>

                <div className='flex flex-col sm:flex-row gap-4 w-full max-w-[500px]'>
                    <div className='flex-1'>
                        <p className='mb-2 font-medium'>Category</p>
                        <select
                            onChange={(e) => {
                                const newCategory = e.target.value;
                                setCategory(newCategory);
                                // Set first subcategory of first group
                                const firstGroup = Object.keys(categoryList[newCategory])[0];
                                setSubCategory(categoryList[newCategory][firstGroup][0]);
                            }}
                            value={category}
                            className='w-full px-4 py-2.5 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-silk-400 transition-all cursor-pointer'
                        >
                            {Object.keys(categoryList).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className='flex-1'>
                        <p className='mb-2 font-medium'>Sub Category</p>
                        <select
                            onChange={(e) => setSubCategory(e.target.value)}
                            value={subCategory}
                            className='w-full px-4 py-2.5 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-silk-400 transition-all cursor-pointer dark:bg-black dark:text-white'
                        >
                            {Object.keys(categoryList[category]).map(group => (
                                <optgroup key={group} label={group} className="text-silk-700 font-bold bg-silk-50/50 dark:text-silk-400 dark:bg-gray-800">
                                    {categoryList[category][group].map(sub => (
                                        <option key={sub} value={sub} className="text-foreground bg-white font-normal pl-4 dark:bg-black dark:text-white">{sub}</option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>

                    {/* Price Input Removed - Handled by Size Prices */}

                    <div className='flex-1'>
                        <p className='mb-2 font-medium'>Shipping Fee</p>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                            <input onChange={(e) => setShippingFee(e.target.value)} value={shippingFee} className='w-full pl-8 pr-4 py-2.5 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-silk-400 transition-all' type="number" placeholder='100' />
                        </div>
                    </div>
                </div>


                <div>
                    <p className='mb-2 font-medium'>Product Sizes</p>
                    <div className='flex gap-2 flex-wrap'>
                        {['S', 'M', 'L', 'XL', 'XXL', 'Free Size'].map((s) => (
                            <div onClick={() => toggleSize(s)} key={s}>
                                <p className={`${sizes.includes(s) ? "bg-silk-100 ring-2 ring-silk-500 text-silk-700 font-semibold" : "bg-muted text-muted-foreground hover:bg-muted/80"} px-4 py-2 rounded cursor-pointer transition-all`}>{s}</p>
                            </div>
                        ))}
                    </div>

                    {/* Default Size Selector */}
                    {sizes.length > 0 && (
                        <div className="mt-4">
                            <p className="mb-2 font-medium text-sm">Default Size (Shown on load)</p>
                            <div className="flex gap-2 flex-wrap">
                                {sizes.map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setDefaultSize(s)}
                                        className={`px-3 py-1.5 text-xs rounded border transition-all ${defaultSize === s
                                            ? "bg-silk-600 text-white border-silk-600 shadow-sm"
                                            : "bg-background border-border text-muted-foreground hover:bg-muted"
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Size Prices Input */}
                    {sizes.length > 0 && (
                        <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border">
                            <p className="font-medium mb-3 text-sm">Price per Size (Optional override)</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {sizes.map(s => (
                                    <div key={s} className="flex flex-col gap-1">
                                        <label className="text-xs text-muted-foreground">{s}</label>
                                        <div className="relative">
                                            <span className="absolute left-2 top-1.5 text-xs text-muted-foreground">₹</span>
                                            <input
                                                type="number"
                                                placeholder={price || "Base"}
                                                value={sizePrices[s] || ''}
                                                onChange={(e) => setSizePrices(prev => ({ ...prev, [s]: e.target.value }))}
                                                className="w-full pl-5 pr-2 py-1.5 text-sm rounded border border-border bg-background focus:ring-1 focus:ring-silk-400 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <p className='mb-2 font-medium'>Product Colors</p>
                    <div className='flex items-end gap-3 mb-2'>
                        <div className="flex flex-col gap-1 relative z-20">
                            <label className="text-xs text-muted-foreground mr-1">Select Color</label>

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsColorListOpen(!isColorListOpen)}
                                    className="w-32 px-3 py-2.5 rounded-lg border border-border bg-input flex items-center justify-between text-sm transition-all focus:ring-2 focus:ring-silk-400 hover:bg-muted/50"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: currentColor.toLowerCase() }}></div>
                                        <span className="truncate">{currentColor}</span>
                                    </div>
                                    <svg className={`w-4 h-4 transition-transform duration-200 text-muted-foreground ${isColorListOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>

                                {isColorListOpen && (
                                    <div className="absolute top-full left-0 mt-1 w-32 bg-popover text-popover-foreground border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent animate-in vide-in-from-top-1">
                                        {['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Pink', 'Purple', 'Orange', 'Gray', 'Brown', 'Beige', 'Navy', 'Maroon', 'Teal', 'Olive', 'Gold', 'Silver', 'Cream'].map((colorName) => (
                                            <button
                                                key={colorName}
                                                type="button"
                                                onClick={() => { setCurrentColor(colorName); setIsColorListOpen(false); }}
                                                className={`w-full text-left px-3 py-2 hover:bg-muted/50 flex items-center gap-2 text-sm transition-colors ${currentColor === colorName ? 'bg-muted/30 font-medium' : ''}`}
                                            >
                                                <div className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0" style={{ backgroundColor: colorName.toLowerCase() }}></div>
                                                {colorName}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <button type="button" onClick={addColor} className="px-4 py-2 bg-silk-100 text-silk-700 hover:bg-silk-200 rounded font-medium transition-colors border border-silk-300">
                            Add
                        </button>
                    </div>
                    <div className='flex gap-2 flex-wrap'>
                        {colors.map((c, i) => (
                            <div key={i} className='flex items-center gap-2 bg-muted/40 p-1 pr-3 rounded border border-border'>
                                <div className="w-6 h-6 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: c.toLowerCase() }}></div>
                                <span className="text-sm font-mono">{c}</span>
                                <button type="button" onClick={() => removeColor(c)} className="text-muted-foreground hover:text-destructive">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='flex items-center gap-2 mt-2 p-3 bg-muted/30 rounded-lg border border-border cursor-pointer w-full max-w-[200px]' onClick={() => setBestseller(prev => !prev)}>
                    <input readOnly checked={bestseller} type="checkbox" id="bestseller" className='w-4 h-4 accent-silk-600' />
                    <label className='cursor-pointer font-medium select-none' htmlFor="bestseller">Bestseller Product</label>
                </div>

                <button type="submit" className='px-6 py-2 mt-4 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-lg hover:bg-emerald-200 transition-all shadow-sm active:scale-95'>Add Product</button>

            </form>
            <UploadProgressPopup
                isOpen={isUploadPopupOpen}
                isSuccess={isUploadSuccess}
            />
        </div>
    )
}

export default Add
