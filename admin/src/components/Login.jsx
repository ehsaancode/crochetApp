import React, { useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../config'
import QToast from './QToast'

const Login = ({ setToken }) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            const response = await axios.post(backendUrl + '/api/user/admin', { email, password })
            if (response.data.success) {
                setToken(response.data.token)
            } else {
                QToast.error(response.data.message, { position: "top-right" })
            }
        } catch (error) {
            console.log(error);
            QToast.error(error.message, { position: "top-right" })
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center w-full bg-background'>
            <div className='bg-card shadow-lg rounded-xl px-8 py-8 max-w-md w-full border border-border'>
                <h1 className='text-3xl font-bold mb-6 text-center font-brand bg-gradient-to-r from-silk-600 to-silk-400 bg-clip-text text-transparent'>Admin Panel</h1>
                <form onSubmit={onSubmitHandler}>
                    <div className='mb-4'>
                        <p className='text-sm font-medium text-foreground mb-2'>Email Address</p>
                        <input onChange={(e) => setEmail(e.target.value)} value={email} className='w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-silk-400 transition-shadow' type="email" placeholder='your@email.com' required />
                    </div>
                    <div className='mb-6'>
                        <p className='text-sm font-medium text-foreground mb-2'>Password</p>
                        <input onChange={(e) => setPassword(e.target.value)} value={password} className='w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-silk-400 transition-shadow' type="password" placeholder='Enter your password' required />
                    </div>
                    <button className='w-full py-2.5 px-4 rounded-lg text-white font-semibold bg-silk-600 hover:bg-silk-700 transition-colors shadow-md' type="submit"> Login </button>
                </form>
            </div>
        </div>
    )
}

export default Login
