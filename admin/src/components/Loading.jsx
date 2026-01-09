import React from 'react'
import { Loader } from 'lucide-react'

const Loading = () => {
    return (
        <div className='w-full min-h-[50vh] flex flex-col justify-center items-center gap-3'>
            <Loader className="w-10 h-10 animate-spin text-silk-600 dark:text-silk-400" />
            <p className='text-muted-foreground text-sm font-medium animate-pulse'>Loading...</p>
        </div>
    )
}

export default Loading
