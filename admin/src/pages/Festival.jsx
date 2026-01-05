import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl } from '../config'
import QToast from '../components/QToast'
import { Upload, X } from 'lucide-react'

const Festival = ({ token }) => {
    const [name, setName] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [backgroundColor, setBackgroundColor] = useState("#ffffff");
    const [heroImage, setHeroImage] = useState(false);
    const [backgroundImage, setBackgroundImage] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [heroWidth, setHeroWidth] = useState("12rem");
    const [productIds, setProductIds] = useState([]);

    const [existingHero, setExistingHero] = useState("");
    const [existingBg, setExistingBg] = useState("");

    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            // Get Config
            const res = await axios.get(backendUrl + '/api/festival/get');
            if (res.data.success) {
                const f = res.data.festival;
                setName(f.name);
                setSubtitle(f.subtitle || "");
                setBackgroundColor(f.backgroundColor || "#ffffff");
                setIsActive(f.isActive);
                setHeroWidth(f.heroWidth || "12rem");
                setProductIds(f.productIds || []);
                setExistingHero(f.heroImage);
                setExistingBg(f.backgroundImage);
            }

            // Get Products for selection
            const prodRes = await axios.get(backendUrl + '/api/product/list');
            if (prodRes.data.success) {
                setAllProducts(prodRes.data.products);
            }
        } catch (error) {
            console.error(error);
            QToast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const toggleProduct = (id) => {
        setProductIds(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("subtitle", subtitle);
            formData.append("backgroundColor", backgroundColor);
            formData.append("isActive", isActive);
            formData.append("heroWidth", heroWidth);
            formData.append("productIds", JSON.stringify(productIds));

            if (heroImage) formData.append("heroImage", heroImage);
            if (backgroundImage) formData.append("backgroundImage", backgroundImage);

            const response = await axios.post(backendUrl + '/api/festival/update', formData, { headers: { token } });
            if (response.data.success) {
                QToast.success("Festival Updated");
                fetchData(); // Refresh to show new images
                setHeroImage(false);
                setBackgroundImage(false);
            } else {
                QToast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            QToast.error(error.message);
        }
    }

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 max-w-4xl m-4">
            <h2 className='text-xl font-bold mb-6 text-foreground'>Festival Card Configuration</h2>
            <form onSubmit={onSubmitHandler} className='flex flex-col gap-6'>

                <div className="flex gap-4 items-center p-4 bg-muted/30 rounded-lg border border-border">
                    <input
                        type="checkbox"
                        id="isActive"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="w-5 h-5 accent-silk-600"
                    />
                    <label htmlFor="isActive" className="font-medium cursor-pointer">Activate Festival Card on Home Page</label>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                        <p className='mb-2 font-medium'>Festival Name</p>
                        <input value={name} onChange={(e) => setName(e.target.value)} className='w-full px-4 py-2 rounded-lg border border-border bg-input' placeholder="e.g. Diwali Special" required />
                    </div>
                    <div>
                        <p className='mb-2 font-medium'>Subtitle / Tagline</p>
                        <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className='w-full px-4 py-2 rounded-lg border border-border bg-input' placeholder="e.g. Light up your home" />
                    </div>
                    <div>
                        <p className='mb-2 font-medium'>Background Color</p>
                        <div className="flex gap-2">
                            <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="h-10 w-20 p-1 rounded cursor-pointer" />
                            <input type="text" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="flex-1 px-4 py-2 rounded-lg border border-border bg-input" />
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                        <p className='mb-2 font-medium'>Hero Image (Main Graphic)</p>
                        <div className="flex gap-4 items-end">
                            <label htmlFor="hero" className="w-24 h-24 border-2 border-dashed border-border flex items-center justify-center cursor-pointer bg-muted/30 rounded-lg hover:bg-muted/60 relative overflow-hidden">
                                {heroImage ? (
                                    <img src={URL.createObjectURL(heroImage)} className="w-full h-full object-cover" />
                                ) : existingHero ? (
                                    <img src={existingHero} className="w-full h-full object-cover" />
                                ) : <Upload className="text-muted-foreground" />}
                                <input type="file" id="hero" hidden onChange={(e) => setHeroImage(e.target.files[0])} />
                            </label>
                            {existingHero && !heroImage && <span className="text-xs text-muted-foreground">Current Image</span>}
                        </div>
                        <div className="mt-4">
                            <p className='mb-1 text-sm font-medium'>Hero Width (e.g. 12rem, 200px)</p>
                            <input value={heroWidth} onChange={(e) => setHeroWidth(e.target.value)} className='w-full px-3 py-1.5 rounded-lg border border-border bg-input' />
                        </div>
                    </div>
                    <div>
                        <p className='mb-2 font-medium'>Background Image (Optional)</p>
                        <div className="flex gap-4 items-end">
                            <label htmlFor="bg" className="w-24 h-24 border-2 border-dashed border-border flex items-center justify-center cursor-pointer bg-muted/30 rounded-lg hover:bg-muted/60 relative overflow-hidden">
                                {backgroundImage ? (
                                    <img src={URL.createObjectURL(backgroundImage)} className="w-full h-full object-cover" />
                                ) : existingBg ? (
                                    <img src={existingBg} className="w-full h-full object-cover" />
                                ) : <Upload className="text-muted-foreground" />}
                                <input type="file" id="bg" hidden onChange={(e) => setBackgroundImage(e.target.files[0])} />
                            </label>
                            {existingBg && !backgroundImage && <span className="text-xs text-muted-foreground">Current Image</span>}
                        </div>
                    </div>
                </div>

                <div>
                    <p className='mb-2 font-medium'>Select Products ({productIds.length} selected)</p>
                    <div className="h-60 overflow-y-auto border border-border rounded-lg p-2 bg-muted/10 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {allProducts.map(p => (
                            <div
                                key={p._id}
                                onClick={() => toggleProduct(p._id)}
                                className={`p-2 rounded border cursor-pointer flex items-center gap-3 transition-colors ${productIds.includes(p._id) ? 'bg-silk-100 border-silk-500 dark:bg-silk-900' : 'bg-card border-border hover:border-gray-400'}`}
                            >
                                <img src={p.image[0]} className="w-10 h-10 object-cover rounded" />
                                <div className="flex-1 overflow-hidden">
                                    <p className="truncate text-sm font-medium">{p.name}</p>
                                    <p className="text-xs text-muted-foreground">₹{p.price}</p>
                                </div>
                                {productIds.includes(p._id) && <div className="w-4 h-4 rounded-full bg-green-500"></div>}
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" className='px-6 py-3 bg-silk-600 text-white font-medium rounded-lg hover:bg-silk-700 transition-all shadow-sm w-max'>
                    Save Configuration
                </button>
            </form>
        </div>
    )
}

export default Festival
