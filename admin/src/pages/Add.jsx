import React, { useState } from 'react'
import { Upload } from 'lucide-react'
import axios from 'axios'
import { backendUrl } from '../config'
import { toast } from 'react-toastify'

const Add = ({ token }) => {

    const [image1, setImage1] = useState(false)
    const [image2, setImage2] = useState(false)
    const [image3, setImage3] = useState(false)
    const [image4, setImage4] = useState(false)

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [shippingFee, setShippingFee] = useState("");
    const [category, setCategory] = useState("Men");
    const [subCategory, setSubCategory] = useState("Topwear");
    const [bestseller, setBestseller] = useState(false);
    const [sizes, setSizes] = useState([]);
    const [productId, setProductId] = useState("");

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData()

            formData.append("name", name)
            formData.append("description", description)
            formData.append("price", price)
            formData.append("shippingFee", shippingFee)
            formData.append("category", category)
            formData.append("subCategory", subCategory)
            formData.append("bestseller", bestseller)
            formData.append("sizes", JSON.stringify(sizes))
            formData.append("productId", productId)

            image1 && formData.append("image1", image1)
            image2 && formData.append("image2", image2)
            image3 && formData.append("image3", image3)
            image4 && formData.append("image4", image4)

            const response = await axios.post(backendUrl + "/api/product/add", formData, { headers: { token } })

            if (response.data.success) {
                toast.success(response.data.message)
                setName('')
                setDescription('')
                setImage1(false)
                setImage2(false)
                setImage3(false)
                setImage4(false)
                setPrice('')
                setShippingFee('')
                setProductId('')
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
            <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-5 text-foreground'>

                <div>
                    <h3 className='text-lg font-semibold mb-4'>Upload Images</h3>
                    <div className='flex gap-4 flex-wrap'>
                        <label htmlFor="image1">
                            <div className='w-24 h-24 border-2 border-dashed border-border flex items-center justify-center cursor-pointer bg-muted/30 rounded-lg hover:bg-muted/60 transition-colors overflow-hidden group'>
                                {image1 ? <img className='w-full h-full object-cover' src={URL.createObjectURL(image1)} alt="" /> : <Upload className='text-muted-foreground group-hover:text-foreground transition-colors' />}
                            </div>
                            <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />
                        </label>
                        <label htmlFor="image2">
                            <div className='w-24 h-24 border-2 border-dashed border-border flex items-center justify-center cursor-pointer bg-muted/30 rounded-lg hover:bg-muted/60 transition-colors overflow-hidden group'>
                                {image2 ? <img className='w-full h-full object-cover' src={URL.createObjectURL(image2)} alt="" /> : <Upload className='text-muted-foreground group-hover:text-foreground transition-colors' />}
                            </div>
                            <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden />
                        </label>
                        <label htmlFor="image3">
                            <div className='w-24 h-24 border-2 border-dashed border-border flex items-center justify-center cursor-pointer bg-muted/30 rounded-lg hover:bg-muted/60 transition-colors overflow-hidden group'>
                                {image3 ? <img className='w-full h-full object-cover' src={URL.createObjectURL(image3)} alt="" /> : <Upload className='text-muted-foreground group-hover:text-foreground transition-colors' />}
                            </div>
                            <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden />
                        </label>
                        <label htmlFor="image4">
                            <div className='w-24 h-24 border-2 border-dashed border-border flex items-center justify-center cursor-pointer bg-muted/30 rounded-lg hover:bg-muted/60 transition-colors overflow-hidden group'>
                                {image4 ? <img className='w-full h-full object-cover' src={URL.createObjectURL(image4)} alt="" /> : <Upload className='text-muted-foreground group-hover:text-foreground transition-colors' />}
                            </div>
                            <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden />
                        </label>
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
                        <select onChange={(e) => setCategory(e.target.value)} className='w-full px-4 py-2.5 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-silk-400 transition-all cursor-pointer'>
                            <option value="Men">Men</option>
                            <option value="Women">Women</option>
                            <option value="Kids">Kids</option>
                            <option value="Unisex">Unisex</option>
                            <option value="Not applicable">Not applicable</option>
                        </select>
                    </div>

                    <div className='flex-1'>
                        <p className='mb-2 font-medium'>Sub Category</p>
                        <select onChange={(e) => setSubCategory(e.target.value)} className='w-full px-4 py-2.5 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-silk-400 transition-all cursor-pointer'>
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

                <button type="submit" className='min-w-[120px] py-3 mt-4 bg-silk-600 text-white font-bold rounded-lg hover:bg-silk-700 transition-all shadow-md active:scale-95'>Add Product</button>

            </form>
        </div>
    )
}

export default Add
