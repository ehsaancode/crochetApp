import React, { useState, useEffect } from 'react'
import { Upload } from 'lucide-react'
import axios from 'axios'
import { backendUrl } from '../config'
import { toast } from 'react-toastify'
import { useParams, useNavigate } from 'react-router-dom'

const Edit = ({ token }) => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [image1, setImage1] = useState(false)
    const [image2, setImage2] = useState(false)
    const [image3, setImage3] = useState(false)
    const [image4, setImage4] = useState(false)

    // Store original URLs for preview if no new file selected
    const [oldImages, setOldImages] = useState([]);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [shippingFee, setShippingFee] = useState("");
    const [category, setCategory] = useState("Men");
    const [subCategory, setSubCategory] = useState("Topwear");
    const [bestseller, setBestseller] = useState(false);
    const [sizes, setSizes] = useState([]);

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
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
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

            image1 && formData.append("image1", image1)
            image2 && formData.append("image2", image2)
            image3 && formData.append("image3", image3)
            image4 && formData.append("image4", image4)

            const response = await axios.post(backendUrl + "/api/product/update", formData, { headers: { token } })

            if (response.data.success) {
                toast.success(response.data.message)
                navigate('/list');
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message)
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
                        {/* Image 1 */}
                        <label htmlFor="image1">
                            <div className='w-24 h-24 border-2 border-dashed border-border flex items-center justify-center cursor-pointer bg-muted/30 rounded-lg hover:bg-muted/60 transition-colors overflow-hidden group'>
                                {image1 ? (
                                    <img className='w-full h-full object-cover' src={URL.createObjectURL(image1)} alt="" />
                                ) : oldImages[0] ? (
                                    <img className='w-full h-full object-cover' src={oldImages[0]} alt="" />
                                ) : (
                                    <Upload className='text-muted-foreground group-hover:text-foreground transition-colors' />
                                )}
                            </div>
                            <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />
                        </label>

                        {/* Image 2 */}
                        <label htmlFor="image2">
                            <div className='w-24 h-24 border-2 border-dashed border-border flex items-center justify-center cursor-pointer bg-muted/30 rounded-lg hover:bg-muted/60 transition-colors overflow-hidden group'>
                                {image2 ? (
                                    <img className='w-full h-full object-cover' src={URL.createObjectURL(image2)} alt="" />
                                ) : oldImages[1] ? (
                                    <img className='w-full h-full object-cover' src={oldImages[1]} alt="" />
                                ) : (
                                    <Upload className='text-muted-foreground group-hover:text-foreground transition-colors' />
                                )}
                            </div>
                            <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden />
                        </label>

                        {/* Image 3 */}
                        <label htmlFor="image3">
                            <div className='w-24 h-24 border-2 border-dashed border-border flex items-center justify-center cursor-pointer bg-muted/30 rounded-lg hover:bg-muted/60 transition-colors overflow-hidden group'>
                                {image3 ? (
                                    <img className='w-full h-full object-cover' src={URL.createObjectURL(image3)} alt="" />
                                ) : oldImages[2] ? (
                                    <img className='w-full h-full object-cover' src={oldImages[2]} alt="" />
                                ) : (
                                    <Upload className='text-muted-foreground group-hover:text-foreground transition-colors' />
                                )}
                            </div>
                            <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden />
                        </label>

                        {/* Image 4 */}
                        <label htmlFor="image4">
                            <div className='w-24 h-24 border-2 border-dashed border-border flex items-center justify-center cursor-pointer bg-muted/30 rounded-lg hover:bg-muted/60 transition-colors overflow-hidden group'>
                                {image4 ? (
                                    <img className='w-full h-full object-cover' src={URL.createObjectURL(image4)} alt="" />
                                ) : oldImages[3] ? (
                                    <img className='w-full h-full object-cover' src={oldImages[3]} alt="" />
                                ) : (
                                    <Upload className='text-muted-foreground group-hover:text-foreground transition-colors' />
                                )}
                            </div>
                            <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden />
                        </label>
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
                        <select onChange={(e) => setCategory(e.target.value)} value={category} className='w-full px-4 py-2.5 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-silk-400 transition-all cursor-pointer'>
                            <option value="Men">Men</option>
                            <option value="Women">Women</option>
                            <option value="Kids">Kids</option>
                            <option value="Unisex">Unisex</option>
                            <option value="Not applicable">Not applicable</option>
                        </select>
                    </div>

                    <div className='flex-1'>
                        <p className='mb-2 font-medium'>Sub Category</p>
                        <select onChange={(e) => setSubCategory(e.target.value)} value={subCategory} className='w-full px-4 py-2.5 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-silk-400 transition-all cursor-pointer'>
                            <option value="Topwear">Topwear</option>
                            <option value="Bottomwear">Bottomwear</option>
                            <option value="Winterwear">Winterwear</option>
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
                        {['S', 'M', 'L', 'XL', 'XXL'].map((s) => (
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

                <button type="submit" className='min-w-[120px] py-3 mt-4 bg-silk-600 text-white font-bold rounded-lg hover:bg-silk-700 transition-all shadow-md active:scale-95'>Update Product</button>

            </form>
        </div>
    )
}

export default Edit
