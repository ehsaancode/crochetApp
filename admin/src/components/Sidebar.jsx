import React from 'react'
import { NavLink } from 'react-router-dom'

// Sidebar Component
const Sidebar = ({ isOpen, closeSidebar }) => {
    return (
        <div className={`sidebar fixed left-0 top-0 h-full bg-card border-r border-border transition-transform duration-300 z-40 w-[250px] pt-20 shadow-xl ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
            <div className='flex flex-col gap-2 py-8 p-4'>
                <NavLink onClick={closeSidebar} className={({ isActive }) => `sidebar-link ${isActive ? 'bg-silk-500 text-white dark:text-gray-900 shadow-lg' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`} to='/'>
                    <p className="font-medium">Dashboard</p>
                </NavLink>

                <NavLink onClick={closeSidebar} className={({ isActive }) => `sidebar-link ${isActive ? 'bg-silk-500 text-white dark:text-gray-900 shadow-lg' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`} to='/add'>
                    <p className="font-medium">Add Items</p>
                </NavLink>

                <NavLink onClick={closeSidebar} className={({ isActive }) => `sidebar-link ${isActive ? 'bg-silk-500 text-white dark:text-gray-900 shadow-lg' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`} to='/list'>
                    <p className="font-medium">List Items</p>
                </NavLink>

                <NavLink onClick={closeSidebar} className={({ isActive }) => `sidebar-link ${isActive ? 'bg-silk-500 text-white dark:text-gray-900 shadow-lg' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`} to='/add-raw-material'>
                    <p className="font-medium">List Raw Materials</p>
                </NavLink>

                <NavLink onClick={closeSidebar} className={({ isActive }) => `sidebar-link ${isActive ? 'bg-silk-500 text-white dark:text-gray-900 shadow-lg' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`} to='/orders'>
                    <p className="font-medium">Orders</p>
                </NavLink>

                <NavLink onClick={closeSidebar} className={({ isActive }) => `sidebar-link ${isActive ? 'bg-silk-500 text-white dark:text-gray-900 shadow-lg' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`} to='/users'>
                    <p className="font-medium">Users</p>
                </NavLink>

                <NavLink onClick={closeSidebar} className={({ isActive }) => `sidebar-link ${isActive ? 'bg-silk-500 text-white dark:text-gray-900 shadow-lg' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`} to='/custom-orders'>
                    <p className="font-medium">Requests & Orders</p>
                </NavLink>

                <NavLink onClick={closeSidebar} className={({ isActive }) => `sidebar-link ${isActive ? 'bg-silk-500 text-white dark:text-gray-900 shadow-lg' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`} to='/festival'>
                    <p className="font-medium">Festival Config</p>
                </NavLink>

                <NavLink onClick={closeSidebar} className={({ isActive }) => `sidebar-link ${isActive ? 'bg-silk-500 text-white dark:text-gray-900 shadow-lg' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`} to='/gallery'>
                    <p className="font-medium">Gallery</p>
                </NavLink>

                <NavLink onClick={closeSidebar} className={({ isActive }) => `sidebar-link ${isActive ? 'bg-silk-500 text-white dark:text-gray-900 shadow-lg' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`} to='/applications'>
                    <p className="font-medium">Applications</p>
                </NavLink>
            </div>
        </div>
    )
}

export default Sidebar
