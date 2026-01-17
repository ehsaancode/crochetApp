import React, { useEffect, useState } from 'react'
import { backendUrl } from '../config'
import axios from 'axios'
import QToast from '../components/QToast'
import { X, Pencil } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Loading from '../components/Loading'

const List = ({ token }) => {

    const navigate = useNavigate();
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("products"); // products | rawMaterials

    const fetchList = async () => {
        setLoading(true)
        try {
            const url = activeTab === "products"
                ? backendUrl + '/api/product/list'
                : backendUrl + '/api/raw-material/list';

            const response = await axios.get(url)
            if (response.data.success) {
                setList(activeTab === "products" ? response.data.products : response.data.rawMaterials);
            } else {
                QToast.error(response.data.message, { position: "top-right" })
            }

        } catch (error) {
            console.log(error);
            QToast.error(error.message, { position: "top-right" })
        } finally {
            setLoading(false)
        }
    }

    const removeItem = async (id) => {
        try {
            const url = activeTab === "products"
                ? backendUrl + '/api/product/remove'
                : backendUrl + '/api/raw-material/remove';

            const response = await axios.post(url, { id }, { headers: { token } })
            if (response.data.success) {
                QToast.success(response.data.message, { position: "top-right" })
                await fetchList();
            } else {
                QToast.error(response.data.message, { position: "top-right" })
            }
        } catch (error) {
            console.log(error);
            QToast.error(error.message, { position: "top-right" })
        }
    }

    useEffect(() => {
        fetchList()
    }, [activeTab])

    if (loading) {
        return <Loading />
    }

    return (
        <div className="w-full max-w-7xl mx-auto p-4">
            <div className='flex justify-between items-center mb-6'>
                <div className="flex gap-4">
                    <button
                        onClick={() => setActiveTab("products")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "products" ? "bg-silk-600 text-white shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                    >
                        Products
                    </button>
                    <button
                        onClick={() => setActiveTab("rawMaterials")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "rawMaterials" ? "bg-silk-600 text-white shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                    >
                        Raw Materials
                    </button>
                </div>
                <p className='font-semibold text-lg text-foreground'>Total: {list.length}</p>
            </div>
            <div className='flex flex-col gap-2'>
                {/* List Table Title */}
                <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-3 px-4 border border-border bg-muted/50 rounded-lg text-sm font-medium text-foreground'>
                    <b>Image</b>
                    <b>Name</b>
                    <b>{activeTab === "products" ? "Category" : "Type"}</b>
                    <b>Price</b>
                    <b className='text-center'>Action</b>
                </div>

                {/* List Items */}
                {list.map((item, index) => (
                    <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-3 px-4 border border-border bg-card rounded-lg text-sm text-foreground hover:bg-muted/30 transition-colors shadow-sm' key={index}>
                        <img className='w-12 h-12 object-cover rounded-md border border-border' src={item.image[0]} alt="" />
                        <p className="font-medium truncate">{item.name}</p>
                        <p>{activeTab === "products" ? item.category : item.type}</p>
                        <p className="font-semibold text-silk-600 dark:text-silk-400">{currency}{item.price}</p>
                        <div className='flex justify-center gap-2'>
                            <button
                                onClick={() => navigate(activeTab === "products" ? `/edit/${item._id}` : `/edit-raw-material/${item._id}`)}
                                className='cursor-pointer text-silk-600 hover:bg-silk-50 p-2 rounded-full transition-colors'
                            >
                                <Pencil className="w-5 h-5" />
                            </button>
                            <button onClick={() => removeItem(item._id)} className='cursor-pointer text-destructive hover:bg-destructive/10 p-2 rounded-full transition-colors'>
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
const currency = '₹' // Or import from config
export default List
