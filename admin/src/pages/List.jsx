import React, { useEffect, useState } from 'react'
import { backendUrl } from '../config'
import axios from 'axios'
import { toast } from 'react-toastify'
import { X, Pencil } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const List = ({ token }) => {

    const navigate = useNavigate();
    const [list, setList] = useState([])

    const fetchList = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.success) {
                setList(response.data.products);
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const removeProduct = async (id) => {
        try {
            const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })
            if (response.data.success) {
                toast.success(response.data.message)
                await fetchList();
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchList()
    }, [])

    return (
        <>
            <p className='mb-4 font-semibold text-lg text-foreground'>All Products List</p>
            <div className='flex flex-col gap-2'>
                {/* List Table Title */}
                <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-3 px-4 border border-border bg-muted/50 rounded-lg text-sm font-medium text-foreground'>
                    <b>Image</b>
                    <b>Name</b>
                    <b>Category</b>
                    <b>Price</b>
                    <b className='text-center'>Action</b>
                </div>

                {/* Product List */}
                {list.map((item, index) => (
                    <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-3 px-4 border border-border bg-card rounded-lg text-sm text-foreground hover:bg-muted/30 transition-colors shadow-sm' key={index}>
                        <img className='w-12 h-12 object-cover rounded-md border border-border' src={item.image[0]} alt="" />
                        <p className="font-medium truncate">{item.name}</p>
                        <p>{item.category}</p>
                        <p className="font-semibold text-silk-600 dark:text-silk-400">{currency}{item.price}</p>
                        <div className='flex justify-center gap-2'>
                            <button onClick={() => navigate(`/edit/${item._id}`)} className='cursor-pointer text-silk-600 hover:bg-silk-50 p-2 rounded-full transition-colors'>
                                <Pencil className="w-5 h-5" />
                            </button>
                            <button onClick={() => removeProduct(item._id)} className='cursor-pointer text-destructive hover:bg-destructive/10 p-2 rounded-full transition-colors'>
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
const currency = '₹' // Or import from config
export default List
