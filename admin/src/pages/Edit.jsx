import React, { useState, useEffect } from 'react'
import { Upload, X } from 'lucide-react'
import axios from 'axios'
import { backendUrl } from '../config'
import QToast from '../components/QToast'
import { useParams, useNavigate } from 'react-router-dom'

const Edit = ({ token }) => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [images, setImages] = useState([false, false, false, false, false, false]);
    const [oldImages, setOldImages] = useState([]);
    const [deletedIndices, setDeletedIndices] = useState([]);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [shippingFee, setShippingFee] = useState("");
    const [category, setCategory] = useState("Men");
    const [subCategory, setSubCategory] = useState("Topwear");
    const [bestseller, setBestseller] = useState(false);
    const [sizes, setSizes] = useState([]);

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

    const fetchProductData = async () => {
        try {
            const response = await axios.post(backendUrl + '/api/product/single', { productId: id })
            if (response.data.success) {
                const product = response.data.product;
                setName(product.name);
                setDescription(product.description);
                setPrice(product.price);
                setShippingFee(product.shippingFee || 100);
                setCategory(product.category);
                setSubCategory(product.subCategory);
                setBestseller(product.bestseller);
                setSizes(product.sizes);
                setOldImages(product.image); // Array of URLs
            } else {
                QToast.error(response.data.message, { position: "top-right" })
            }
        } catch (error) {
            console.log(error)
            QToast.error(error.message, { position: "top-right" })
        }
    }

    useEffect(() => {
        fetchProductData();
    }, [id])

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData()

            formData.append("productId", id)
            formData.append("name", name)
            formData.append("description", description)
            formData.append("price", price)
            formData.append("shippingFee", shippingFee)
            formData.append("category", category)
            formData.append("subCategory", subCategory)
            formData.append("bestseller", bestseller)
            formData.append("sizes", JSON.stringify(sizes))
            formData.append("deletedIndices", JSON.stringify(deletedIndices))

            images.forEach((image, index) => {
                if (image) {
                    formData.append(`image${index + 1}`, image);
                }
            });

            const response = await axios.post(backendUrl + "/api/product/update", formData, { headers: { token } })

            if (response.data.success) {
                QToast.success(response.data.message, { position: "top-right" })
                navigate('/list');
            } else {
                QToast.error(response.data.message, { position: "top-right" })
            }

        } catch (error) {
            console.log(error);
            QToast.error(error.response?.data?.message || error.message, { position: "top-right" })
        }
    }

    const toggleSize = (s) => {
        setSizes(prev => prev.includes(s) ? prev.filter(item => item !== s) : [...prev, s])
    }

    return (
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 max-w-4xl">
            <h2 className='text-xl font-bold mb-6 text-foreground'>Edit Product</h2>
            <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-5 text-foreground'>

                <div>
                    <h3 className='text-lg font-semibold mb-4'>Upload Images (Click to replace)</h3>
                    <div className='flex gap-4 flex-wrap'>
                        {/* Images 1-6 */}
                        {images.map((img, index) => {
                            const showOldImage = !img && oldImages[index] && !deletedIndices.includes(index);
                            const showNewImage = !!img;
                            const showUpload = !showOldImage && !showNewImage;

                            const isVideo = (fileOrUrl) => {
                                if (!fileOrUrl) return false;
                                if (typeof fileOrUrl === 'string') {
                                    const ext = fileOrUrl.split('.').pop().toLowerCase();
                                    return ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'].includes(ext) || fileOrUrl.includes('/video/');
                                }
                                return fileOrUrl.type?.startsWith('video/');
                            };

                            const mediaSource = showNewImage ? URL.createObjectURL(img) : showOldImage ? oldImages[index] : null;
                            const isMediaVideo = isVideo(showNewImage ? img : (showOldImage ? oldImages[index] : null));


                            return (
                                <div key={index} className='relative group'>
                                    <label htmlFor={`image${index}`}>
                                        <div className={`w-24 h-24 border-2 border-dashed border-border flex items-center justify-center cursor-pointer bg-muted/30 rounded-lg hover:bg-muted/60 transition-colors overflow-hidden relative ${!showUpload ? 'border-solid' : ''}`}>
                                            {showNewImage || showOldImage ? (
                                                isMediaVideo ? (
                                                    <video className='w-full h-full object-cover' src={mediaSource} muted loop autoPlay />
                                                ) : (
                                                    <img className='w-full h-full object-cover' src={mediaSource} alt={`Preview ${index}`} />
                                                )
                                            ) : (
                                                <Upload className='text-muted-foreground group-hover:text-foreground transition-colors' />
                                            )}
                                        </div>
                                        <input
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const newImages = [...images];
                                                    newImages[index] = file;
                                                    setImages(newImages);
                                                }
                                            }}
                                            type="file"
                                            id={`image${index}`}
                                            accept="image/*,video/*"
                                            hidden
                                        />
                                    </label>
                                    {(showNewImage || showOldImage) && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (showNewImage) {
                                                    const newImages = [...images];
                                                    newImages[index] = false;
                                                    setImages(newImages);
                                                } else {
                                                    setDeletedIndices(prev => [...prev, index]);
                                                }
                                            }}
                                            className='absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-md hover:bg-destructive/90 transition-colors z-10'
                                            title="Remove media"
                                        >
                                            <X className='w-3 h-3' />
                                        </button>
                                    )}
                                </div>
                            )
                        })}
                    </div>
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
                                if (categoryList[newCategory]) {
                                    const firstGroup = Object.keys(categoryList[newCategory])[0];
                                    if (firstGroup) {
                                        setSubCategory(categoryList[newCategory][firstGroup][0]);
                                    }
                                }
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
                            className='w-full px-4 py-2.5 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-silk-400 transition-all cursor-pointer'
                        >
                            {categoryList[category] && Object.keys(categoryList[category]).map(group => (
                                <optgroup key={group} label={group} className="text-silk-700 font-bold bg-silk-50/50 dark:text-silk-400 dark:bg-gray-800">
                                    {categoryList[category][group].map(sub => (
                                        <option key={sub} value={sub} className="text-foreground bg-white font-normal pl-4 dark:bg-black dark:text-white">{sub}</option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>

                    <div className='flex-1'>
                        <p className='mb-2 font-medium'>Price</p>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                            <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full pl-8 pr-4 py-2.5 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-silk-400 transition-all' type="number" placeholder='2500' />
                        </div>
                    </div>

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
                </div>

                <div className='flex items-center gap-2 mt-2 p-3 bg-muted/30 rounded-lg border border-border cursor-pointer w-full max-w-[200px]' onClick={() => setBestseller(prev => !prev)}>
                    <input readOnly checked={bestseller} type="checkbox" id="bestseller" className='w-4 h-4 accent-silk-600' />
                    <label className='cursor-pointer font-medium select-none' htmlFor="bestseller">Bestseller Product</label>
                </div>

                <button type="submit" className='px-6 py-2 mt-4 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-lg hover:bg-emerald-200 transition-all shadow-sm active:scale-95'>Update Product</button>

            </form>
        </div>
    )
}

export default Edit
