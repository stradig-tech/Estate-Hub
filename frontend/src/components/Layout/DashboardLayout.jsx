import { useState, useEffect } from 'react';
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
    LogOut,
    Clock,
    X
} from 'lucide-react';
import Navbar from './Navbar';
import { Button } from '@/components/ui/button';

export default function DashboardLayout() {
    const { user, logout, siteSettings } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    const isApprovedAgentOrAdmin = user?.role === 'admin' || (user?.role === 'agent' && user?.agent_status === 'approved');
    const isPendingAgent = user?.role === 'agent' && user?.agent_status === 'pending';

    const allLinks = [
        { name: 'Dashboards', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Profile', href: '/dashboard/profile', icon: User },
        { name: 'Reviews', href: '/dashboard/reviews', icon: Star, requiresApproved: true },
        { name: 'My Properties', href: '/dashboard/properties', icon: HomeIcon, roles: ['agent', 'admin'], requiresApproved: true },
        { name: 'Add Property', href: '/submit-property', icon: PlusCircle, roles: ['agent', 'admin'], requiresApproved: true },
        { name: 'My Favorite', href: '/dashboard/favorites', icon: Heart },
        { name: 'Message', href: '/dashboard/messages', icon: MessageSquare },
    ];

    // Filter sidebar links: pending agents only get limited profile/dashboard access
    const sidebarLinks = allLinks.filter((l) => {
        if (l.requiresApproved && !isApprovedAgentOrAdmin) return false;
        if (!l.roles) return true;
        return l.roles.includes(user?.role);
    });

    const isActive = (href) => {
        if (href === '/dashboard') {
            return location.pathname === '/dashboard';
        }
        return location.pathname.startsWith(href);
    };

    const renderSidebarContent = (onLinkClick) => (
        <>
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-700/50 shrink-0">
                <Link to="/" className="flex items-center gap-2 text-white" onClick={onLinkClick}>
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
                {onLinkClick && (
                    <button
                        type="button"
                        onClick={onLinkClick}
                        className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                        aria-label="Close sidebar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
                <p className="text-xs uppercase font-semibold text-slate-500 mb-4 tracking-wider">Profile</p>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold overflow-hidden shrink-0 border border-slate-700">
                        {user?.avatar_url ? (
                            <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                            user?.full_name?.charAt(0) || 'U'
                        )}
                    </div>
                    <div className="overflow-hidden">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="text-xs text-slate-400 capitalize">{user?.role || 'Account'}</p>
                            {isPendingAgent && (
                                <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/10 px-1.5 py-0.2 rounded">
                                    Pending Approval
                                </span>
                            )}
                        </div>
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
                                onClick={onLinkClick}
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
                        onClick={() => {
                            if (onLinkClick) onLinkClick();
                            logout();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </nav>
            </div>
        </>
    );

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className="w-64 bg-[#1a202c] text-slate-300 flex flex-col hidden md:flex shrink-0">
                {renderSidebarContent()}
            </aside>

            {/* Mobile Slide-over Drawer */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex">
                    <div 
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
                        onClick={() => setSidebarOpen(false)}
                    />
                    <aside className="relative w-72 max-w-[85vw] bg-[#1a202c] text-slate-300 flex flex-col z-10 shadow-2xl h-full animate-in slide-in-from-left duration-200">
                        {renderSidebarContent(() => setSidebarOpen(false))}
                    </aside>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar 
                    hideLogo={true} 
                    className="border-b border-slate-200 bg-white" 
                    onSidebarToggle={() => setSidebarOpen(prev => !prev)}
                />
                
                {/* Persistent Banner for Pending Agents */}
                {isPendingAgent && (
                    <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 md:px-8 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-amber-900 dark:text-amber-200 shrink-0">
                        <div className="flex items-center gap-2.5 text-xs sm:text-sm">
                            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                            <span>
                                <strong>Agent Account Pending Admin Approval:</strong> Your registration ({user?.agency_name || 'Agent'}) is currently under review. You currently have limited access to your profile. Property listing features will unlock upon approval.
                            </span>
                        </div>
                        <Link to="/dashboard/profile" className="text-xs font-semibold text-amber-800 dark:text-amber-300 hover:underline shrink-0">
                            Check Profile &rarr;
                        </Link>
                    </div>
                )}

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
