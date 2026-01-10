import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add'
import Edit from './pages/Edit'
import List from './pages/List'
import Orders from './pages/Orders'
import Users from './pages/Users'
import Requests from './pages/Requests'
import CustomOrders from './pages/CustomOrders'
import Festival from './pages/Festival'
import Gallery from './pages/Gallery'
import Applications from './pages/Applications'
import Dashboard from './pages/Dashboard'
import Login from './components/Login'
import QToast from './components/QToast';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])

  return (
    <div className='bg-background min-h-screen app-container'>
      <QToast />
      {token === ""
        ? <Login setToken={setToken} />
        : <>
          <Navbar setToken={setToken} toggleSidebar={() => setSidebarOpen(prev => !prev)} />

          <div className='flex w-full'>
            <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
            <div className={`main-content transition-all duration-300 w-full mx-auto my-8 text-foreground text-base ${sidebarOpen ? 'ml-[250px]' : 'ml-0'} md:ml-[250px]`}>
              <Routes>
                <Route path='/' element={<Dashboard token={token} />} />
                <Route path='/dashboard' element={<Dashboard token={token} />} />
                <Route path='/add' element={<Add token={token} />} />
                <Route path='/edit/:id' element={<Add token={token} />} />
                <Route path='/list' element={<List token={token} />} />
                <Route path='/orders' element={<Orders token={token} />} />
                <Route path='/users' element={<Users token={token} />} />
                <Route path='/requests' element={<Requests token={token} />} />
                <Route path='/custom-orders' element={<CustomOrders token={token} />} />
                <Route path='/custom-orders' element={<CustomOrders token={token} />} />
                <Route path='/festival' element={<Festival token={token} />} />
                <Route path='/gallery' element={<Gallery token={token} />} />
                <Route path='/applications' element={<Applications token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default App
