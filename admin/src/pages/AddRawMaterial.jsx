import React, { useState, useEffect } from 'react'
import { Upload, X } from 'lucide-react'
import axios from 'axios'
import { backendUrl } from '../config'
import QToast from '../components/QToast'
import UploadProgressPopup from '../components/UploadProgressPopup'
import { useNavigate, useParams } from 'react-router-dom'

const AddRawMaterial = ({ token }) => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [image1, setImage1] = useState(false)
    const [image2, setImage2] = useState(false)
    const [image3, setImage3] = useState(false)
    const [image4, setImage4] = useState(false)

    const [oldImages, setOldImages] = useState([]);
    const [deletedIndices, setDeletedIndices] = useState([]);

    const handleImageChange = (e, index) => {
        const file = e.target.files[0];
        if (!file) return;
        if (index === 0) setImage1(file);
        if (index === 1) setImage2(file);
        if (index === 2) setImage3(file);
        if (index === 3) setImage4(file);
    }

    const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);
    const [isUploadSuccess, setIsUploadSuccess] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [color, setColor] = useState("");
    const [type, setType] = useState("Yarn");
    const [length, setLength] = useState("");

    const materialTypes = ["Yarn", "Hook", "Needle", "Accessory", "Tool", "Other"];

    const fetchRawMaterialData = async () => {
        if (!id) return;
        try {
            const response = await axios.post(backendUrl + '/api/raw-material/single', { id })
            if (response.data.success) {
                const material = response.data.rawMaterial;
                setName(material.name);
                setDescription(material.description);
                setPrice(material.price);
                setColor(material.color);
                setType(material.type);
                setLength(material.length);
                setOldImages(material.image || []);
            } else {
                QToast.error(response.data.message, { position: "top-right" })
            }
        } catch (error) {
            console.log(error);
            QToast.error(error.message, { position: "top-right" })
        }
    }

    useEffect(() => {
        if (id) {
            fetchRawMaterialData();
        }
    }, [id])

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            setIsUploadPopupOpen(true);
            setIsUploadSuccess(false);

            const formData = new FormData()

            formData.append("name", name)
            formData.append("description", description)
            formData.append("price", price)
            formData.append("color", color)
            formData.append("type", type)
            if (length) formData.append("length", length)

            image1 && formData.append("image1", image1)
            image2 && formData.append("image2", image2)
            image3 && formData.append("image3", image3)
            image4 && formData.append("image4", image4)

            let response;
            if (id) {
                formData.append("id", id);
                formData.append("deletedIndices", JSON.stringify(deletedIndices));
                response = await axios.post(backendUrl + "/api/raw-material/update", formData, { headers: { token } })
            } else {
                response = await axios.post(backendUrl + "/api/raw-material/add", formData, { headers: { token } })
            }


            if (response.data.success) {
                setIsUploadSuccess(true);
                setTimeout(() => {
                    setIsUploadPopupOpen(false);
                    setIsUploadSuccess(false);
                    QToast.success(response.data.message, { position: "top-right" })
                    if (!id) {
                        // Reset form only if adding
                        setName('')
                        setDescription('')
                        setImage1(false)
                        setImage2(false)
                        setImage3(false)
                        setImage4(false)
                        setPrice('')
                        setColor('')
                        setType('Yarn')
                        setLength('')
                        setOldImages([])
                        setDeletedIndices([])
                    } else {
                        navigate('/list');
                    }
                }, 2000);
            } else {
                setIsUploadPopupOpen(false);
                QToast.error(response.data.message, { position: "top-right" })
            }

        } catch (error) {
            console.log(error);
            setIsUploadPopupOpen(false); // Close popup on error
            QToast.error(error.response?.data?.message || error.message, { position: "top-right" })
        }
    }

    return (
        <div className="bg-card m-4 rounded-xl shadow-sm border border-border p-6 max-w-6xl w-full mx-auto">
            <h2 className="text-xl font-bold mb-6">{id ? "Edit Raw Material" : "Add Raw Material"}</h2>
            <form onSubmit={onSubmitHandler} className='flex flex-col w-full gap-8 text-foreground'>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Images and Basic Info */}
                    <div className="flex flex-col gap-6">
                        <div>
                            <h3 className='text-lg font-semibold mb-4'>Upload Images</h3>
                            <div className='flex gap-4 flex-wrap'>
                                {[image1, image2, image3, image4].map((img, index) => {
                                    const oldImg = oldImages && oldImages[index] ? oldImages[index] : null;
                                    const isDeleted = deletedIndices.includes(index);
                                    const content = img ? URL.createObjectURL(img) : (oldImg && !isDeleted ? oldImg : null);
                                    const isNew = !!img;
                                    const isOld = !!(oldImg && !isDeleted);

                                    return (
                                        <div key={index} className='relative group'>
                                            <label htmlFor={`image${index}`}>
                                                <div className={`w-20 h-20 md:w-24 md:h-24 border-2 border-dashed border-border flex items-center justify-center cursor-pointer bg-muted/30 rounded-lg hover:bg-muted/60 transition-colors overflow-hidden relative ${isNew || isOld ? 'border-solid' : 'border-dashed'}`}>
                                                    {content ? (
                                                        <img className='w-full h-full object-cover' src={content} alt={`Material ${index + 1}`} />
                                                    ) : (
                                                        <Upload className='text-muted-foreground group-hover:text-foreground transition-colors' />
                                                    )}
                                                </div>
                                                <input onChange={(e) => handleImageChange(e, index)} type="file" id={`image${index}`} accept="image/*" hidden />
                                            </label>
                                            {(isNew || isOld) && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (isNew) {
                                                            const setters = [setImage1, setImage2, setImage3, setImage4];
                                                            setters[index](false);
                                                        } else {
                                                            setDeletedIndices(prev => [...prev, index]);
                                                        }
                                                    }}
                                                    className='absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-md hover:bg-destructive/90 transition-colors z-10'
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
                            <p className='mb-2 font-medium'>Material Name</p>
                            <input onChange={(e) => setName(e.target.value)} value={name} className='w-full px-4 py-2.5 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-silk-400 transition-all' type="text" placeholder='e.g. Cotton Yarn' required />
                        </div>

                        <div className='w-full'>
                            <p className='mb-2 font-medium'>Description</p>
                            <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full px-4 py-2.5 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-silk-400 transition-all min-h-[120px]' type="text" placeholder='Material details...' required />
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="flex flex-col gap-6">
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 w-full'>
                            <div>
                                <p className='mb-2 font-medium'>Type</p>
                                <select
                                    onChange={(e) => setType(e.target.value)}
                                    value={type}
                                    className='w-full px-4 py-2.5 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-silk-400 transition-all cursor-pointer'
                                >
                                    {materialTypes.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <p className='mb-2 font-medium'>Price</p>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                                    <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full pl-8 pr-4 py-2.5 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-silk-400 transition-all' type="number" placeholder='0' required />
                                </div>
                            </div>

                            <div>
                                <p className='mb-2 font-medium'>Color</p>
                                <input onChange={(e) => setColor(e.target.value)} value={color} className='w-full px-4 py-2.5 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-silk-400 transition-all' type="text" placeholder='e.g. Red, Blue, Multicolor' required />
                            </div>

                            <div>
                                <p className='mb-2 font-medium'>Length (Optional)</p>
                                <input onChange={(e) => setLength(e.target.value)} value={length} className='w-full px-4 py-2.5 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-silk-400 transition-all' type="text" placeholder='e.g. 100 meters, 5 inches' />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-start">
                    <button type="submit" className='px-8 py-3 bg-emerald-100 text-emerald-800 text-base font-medium rounded-lg hover:bg-emerald-200 transition-all shadow-sm active:scale-95'>
                        {id ? "Update Material" : "Add Material"}
                    </button>
                </div>

            </form>
            <UploadProgressPopup
                isOpen={isUploadPopupOpen}
                isSuccess={isUploadSuccess}
            />
        </div>
    )
}

export default AddRawMaterial

