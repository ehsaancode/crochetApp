import { Menu, LogOut, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const Navbar = ({ setToken, toggleSidebar }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className='flex items-center py-4 px-6 justify-between bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm'>
            <div className='flex items-center gap-4'>
                <button onClick={toggleSidebar} className='p-2 hover:bg-muted rounded-full transition-colors'>
                    <Menu className="w-6 h-6 text-foreground" />
                </button>
                <h1 className='text-2xl font-bold font-brand bg-gradient-to-r from-silk-600 to-silk-400 bg-clip-text text-transparent'>Aalaboo Admin</h1>
            </div>
            <div className='flex items-center gap-4'>
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-muted transition-colors text-foreground"
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button onClick={() => setToken('')} className='flex items-center gap-2 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors'>
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>
        </div>
    )
}

export default Navbar
