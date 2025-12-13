import React from 'react'
import { NavLink } from 'react-router-dom'

// Sidebar Component
const Sidebar = ({ isOpen }) => {
    return (
        <div className={`sidebar fixed left-0 top-0 h-full bg-card border-r border-border transition-transform duration-300 z-40 w-[250px] pt-20 shadow-xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className='flex flex-col gap-2 px-4'>
                <NavLink className={({ isActive }) => `sidebar-link ${isActive ? 'bg-silk-500 text-white shadow-lg' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`} to='/add'>
                    <p className="font-medium">Add Items</p>
                </NavLink>

                <NavLink className={({ isActive }) => `sidebar-link ${isActive ? 'bg-silk-500 text-white shadow-lg' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`} to='/list'>
                    <p className="font-medium">List Items</p>
                </NavLink>

                <NavLink className={({ isActive }) => `sidebar-link ${isActive ? 'bg-silk-500 text-white shadow-lg' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`} to='/orders'>
                    <p className="font-medium">Orders</p>
                </NavLink>

                <NavLink className={({ isActive }) => `sidebar-link ${isActive ? 'bg-silk-500 text-white shadow-lg' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`} to='/users'>
                    <p className="font-medium">Users</p>
                </NavLink>
            </div>
        </div>
    )
}

export default Sidebar
