import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import QToast from '../components/QToast'
import { Upload, X, Trash2 } from 'lucide-react'

const Gallery = ({ token }) => {
    const [images, setImages] = useState([])
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchList = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/gallery/list')
            if (response.data.success) {
                setList(response.data.images)
            } else {
                QToast.error(response.data.message, { position: "top-right" })
            }
        } catch (error) {
            console.log(error)
            QToast.error(error.message, { position: "top-right" })
        }
    }

    const removeImage = async (id) => {
        try {
            const response = await axios.post(backendUrl + '/api/gallery/remove', { id }, { headers: { token } })
            if (response.data.success) {
                QToast.success(response.data.message, { position: "top-right" })
                await fetchList()
            } else {
                QToast.error(response.data.message, { position: "top-right" })
            }
        } catch (error) {
            console.log(error)
            QToast.error(error.message, { position: "top-right" })
        }
    }

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setImages(Array.from(e.target.files));
        }
    };

    const removeSelectedImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            if (images.length === 0) {
                return QToast.error("Please upload at least one image", { position: "top-right" })
            }

            setLoading(true)
            const formData = new FormData()
            images.forEach((img) => {
                formData.append("image", img)
            })

            const response = await axios.post(backendUrl + '/api/gallery/add', formData, { headers: { token } })
            if (response.data.success) {
                QToast.success(response.data.message, { position: "top-right" })
                setImages([])
                await fetchList()
            } else {
                QToast.error(response.data.message, { position: "top-right" })
            }
        } catch (error) {
            console.log(error)
            QToast.error(error.message, { position: "top-right" })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchList()
    }, [])

    return (
        <div className="p-8 w-full max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-foreground">Custom Gallery</h1>

            <div className="bg-card p-6 rounded-lg shadow-sm border border-border mb-10">
                <h2 className="text-xl font-semibold mb-4 text-foreground">Upload Inspiration Images</h2>
                <form onSubmit={onSubmitHandler} className="flex flex-col gap-4 max-w-xl">
                    <label htmlFor="image" className="cursor-pointer group">
                        <div className="flex flex-col items-center justify-center w-full min-h-40 border-2 border-dashed border-border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors p-4">
                            {images.length === 0 ? (
                                <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-foreground">
                                    <Upload className="w-8 h-8" />
                                    <span className="text-sm font-medium">Click to upload multiple images</span>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-2 w-full">
                                    {images.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-md overflow-hidden bg-background border border-border">
                                            <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" alt="preview" />
                                            <button
                                                type="button"
                                                onClick={(e) => { e.preventDefault(); removeSelectedImage(idx); }}
                                                className="absolute top-1 right-1 p-0.5 bg-black/60 text-white rounded-full hover:bg-red-500 transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    <div className="flex items-center justify-center aspect-square border-2 border-dashed border-border rounded-md text-muted-foreground hover:bg-muted/50">
                                        <Upload className="w-6 h-6" />
                                    </div>
                                </div>
                            )}
                        </div>
                        <input type="file" id="image" hidden onChange={handleImageChange} accept="image/*" multiple />
                    </label>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 bg-silk-900 text-white rounded-md font-medium hover:bg-silk-800 transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {loading ? "Uploading..." : `Add ${images.length > 0 ? images.length : ''} Images to Gallery`}
                    </button>
                </form>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-6 text-foreground">Gallery Collection ({list.length})</h2>
                {list.length === 0 ? (
                    <div className="text-center py-20 bg-muted/10 rounded-lg text-muted-foreground">
                        <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No images in gallery yet. Upload one above!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {list.map((item, index) => (
                            <div key={index} className="group relative aspect-square bg-card rounded-xl overflow-hidden shadow-sm border border-border">
                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                                <button
                                    onClick={() => removeImage(item._id)}
                                    className="absolute top-2 right-2 p-2 bg-white/90 text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                    title="Delete Image"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/60 to-transparent text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                    {new Date(item.date).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Gallery
