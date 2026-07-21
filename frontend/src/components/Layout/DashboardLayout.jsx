import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { 
    LayoutDashboard, 
    User, 
    Star, 
    Home as HomeIcon, 
    Heart, 
    MessageSquare, 
    PlusCircle, 
    LogOut 
} from 'lucide-react';
import Navbar from './Navbar';
import { Button } from '@/components/ui/button';

export default function DashboardLayout() {
    const { user, logout, siteSettings } = useAuth();
    const location = useLocation();

    const sidebarLinks = [
        { name: 'Dashboards', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Profile', href: '/dashboard/profile', icon: User },
        { name: 'Reviews', href: '/dashboard/reviews', icon: Star },
        { name: 'My Properties', href: '/dashboard/properties', icon: HomeIcon },
        { name: 'Add Property', href: '/submit-property', icon: PlusCircle },
        { name: 'My Favorite', href: '/dashboard/favorites', icon: Heart },
        { name: 'Message', href: '/dashboard/messages', icon: MessageSquare },
    ];

    const isActive = (href) => {
        if (href === '/dashboard') {
            return location.pathname === '/dashboard';
        }
        return location.pathname.startsWith(href);
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-[#1a202c] text-slate-300 flex flex-col hidden md:flex shrink-0">
                <div className="h-16 flex items-center px-6 border-b border-slate-700/50">
                    <Link to="/" className="flex items-center gap-2 text-white">
                        {siteSettings?.logo ? (
                            <img src={siteSettings.logo} alt="Logo" className="h-8 w-auto brightness-0 invert" />
                        ) : (
                            <>
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
                                    <HomeIcon className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-lg font-bold">Estate<span className="text-primary">Hub</span></span>
                            </>
                        )}
                    </Link>
                </div>
                
                <div className="p-6">
                    <p className="text-xs uppercase font-semibold text-slate-500 mb-4 tracking-wider">Profile</p>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold">
                            {user?.full_name?.charAt(0) || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs text-slate-400">Account</p>
                            <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                        </div>
                    </div>

                    <p className="text-xs uppercase font-semibold text-slate-500 mb-2 tracking-wider">Menu</p>
                    <nav className="space-y-1">
                        {sidebarLinks.map((link) => {
                            const Icon = link.icon;
                            const active = isActive(link.href);
                            return (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                        active 
                                            ? 'bg-primary text-white' 
                                            : 'hover:bg-slate-800 hover:text-white'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {link.name}
                                </Link>
                            );
                        })}
                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </nav>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar hideLogo={true} className="border-b border-slate-200 bg-white" />
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
