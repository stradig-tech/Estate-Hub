import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home as HomeIcon, Menu, X, LayoutDashboard, Plus, LogOut, Shield, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAuth } from '@/lib/AuthContext';
import { cmsService } from '@/api/services';

export default function Navbar({ hideLogo = false, className = "" }) {
    const { user, isAuthenticated, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [navLinks, setNavLinks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const data = await cmsService.getMenus();
                if (data && data.length > 0) {
                    setNavLinks(data);
                } else {
                    // Fallback if no menus are created in the admin panel yet
                    setNavLinks([
                        { id: 1, title: 'Home', url: '/', is_mega_menu: false },
                        { id: 2, title: 'About Us', url: '/about', is_mega_menu: false },
                        { 
                            id: 3, 
                            title: 'Properties', 
                            is_mega_menu: true,
                            items: [
                                { id: 101, title: 'Buy', url: '/listings?listing_type=for_sale', description: 'Find your dream home' },
                                { id: 102, title: 'Rent', url: '/listings?listing_type=for_rent', description: 'Explore rental properties' }
                            ]
                        },
                        { id: 4, title: 'Our Services', url: '/services', is_mega_menu: false },
                        { id: 5, title: 'Blog', url: '/blog', is_mega_menu: false },
                        { id: 6, title: 'Contact Us', url: '/contact', is_mega_menu: false },
                    ]);
                }
            } catch (error) {
                console.error("Failed to fetch menus", error);
                setNavLinks([
                    { id: 1, title: 'Home', url: '/', is_mega_menu: false },
                    { id: 2, title: 'About Us', url: '/about', is_mega_menu: false },
                    { 
                        id: 3, 
                        title: 'Properties', 
                        is_mega_menu: true,
                        items: [
                            { id: 101, title: 'Buy', url: '/listings?listing_type=for_sale', description: 'Find your dream home' },
                            { id: 102, title: 'Rent', url: '/listings?listing_type=for_rent', description: 'Explore rental properties' }
                        ]
                    },
                    { id: 4, title: 'Our Services', url: '/services', is_mega_menu: false },
                    { id: 5, title: 'Blog', url: '/blog', is_mega_menu: false },
                    { id: 6, title: 'Contact Us', url: '/contact', is_mega_menu: false },
                ]);
            }
        };
        fetchMenus();
    }, []);

    const handleLogout = () => logout();

    const userInitials = user?.full_name
        ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    const { siteSettings } = useAuth();

    return (
        <header className={`sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md ${className ? className : 'border-b border-border'}`}>
            <div className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${hideLogo ? '' : 'max-w-7xl'}`}>
                <div className="flex h-16 items-center justify-between">
                    {!hideLogo ? (
                        <Link to="/" className="flex items-center gap-2">
                            {siteSettings?.logo ? (
                                <img src={siteSettings.logo} alt="Logo" className="h-8 w-auto" />
                            ) : (
                                <>
                                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
                                        <HomeIcon className="w-5 h-5 text-primary-foreground" />
                                    </div>
                                    <span className="text-xl font-bold tracking-tight">Estate<span className="text-primary">Hub</span></span>
                                </>
                            )}
                        </Link>
                    ) : (
                        <div className="flex items-center gap-4">
                            <button className="md:hidden p-2 text-slate-500 hover:text-slate-700">
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>
                    )}

                    <nav className="hidden md:flex items-center gap-6 z-50">
                        <NavigationMenu>
                            <NavigationMenuList>
                                {navLinks.map((menu) => (
                                    <NavigationMenuItem key={menu.id}>
                                        {menu.is_mega_menu ? (
                                            <>
                                                <NavigationMenuTrigger>{menu.title}</NavigationMenuTrigger>
                                                <NavigationMenuContent>
                                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                                        {menu.items?.map((item) => (
                                                            <li key={item.id}>
                                                                <NavigationMenuLink asChild>
                                                                    <Link
                                                                        to={item.url}
                                                                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                                    >
                                                                        <div className="text-sm font-medium leading-none">{item.title}</div>
                                                                        {item.description && (
                                                                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                                                                                {item.description}
                                                                            </p>
                                                                        )}
                                                                    </Link>
                                                                </NavigationMenuLink>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </NavigationMenuContent>
                                            </>
                                        ) : (
                                            <Link to={menu.url || '#'}>
                                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                                    {menu.title}
                                                </NavigationMenuLink>
                                            </Link>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </nav>

                    <div className="hidden md:flex items-center gap-3">
                        {isAuthenticated ? (
                            <>
                                {user?.role === 'agent' && (
                                    <Button asChild variant="outline" size="sm">
                                        <Link to="/submit-property"><Plus className="w-4 h-4 mr-1" /> List Property</Link>
                                    </Button>
                                )}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex items-center gap-2 rounded-full border border-border p-0.5 pr-3 hover:bg-muted transition-colors">
                                            <Avatar className="w-8 h-8"><AvatarFallback className="bg-primary text-primary-foreground text-xs">{userInitials}</AvatarFallback></Avatar>
                                            <span className="text-sm font-medium max-w-[100px] truncate">{user?.full_name || 'User'}</span>
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                                            <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                                        </DropdownMenuItem>
                                        {user?.role === 'agent' && (
                                            <DropdownMenuItem onClick={() => navigate('/submit-property')}>
                                                <Plus className="w-4 h-4 mr-2" /> Submit Property
                                            </DropdownMenuItem>
                                        )}
                                        {user?.role === 'admin' && (
                                            <DropdownMenuItem onClick={() => navigate('/admin')}>
                                                <Shield className="w-4 h-4 mr-2" /> Admin Panel
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                                            <LogOut className="w-4 h-4 mr-2" /> Log Out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <>
                                <Button asChild variant="ghost" size="sm"><Link to="/login">Log In</Link></Button>
                                <Button asChild size="sm"><Link to="/register">Sign Up</Link></Button>
                            </>
                        )}
                    </div>

                    <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
                        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {mobileOpen && (
                <div className="md:hidden border-t border-border bg-white">
                    <div className="px-4 py-4 space-y-3">
                        {navLinks.map(menu => (
                            <div key={menu.id} className="py-2">
                                {menu.is_mega_menu ? (
                                    <>
                                        <div className="text-sm font-bold text-muted-foreground mb-2">{menu.title}</div>
                                        <div className="pl-4 space-y-2 border-l-2 border-muted">
                                            {menu.items?.map(item => (
                                                <Link key={item.id} to={item.url} className="block py-1 text-sm font-medium" onClick={() => setMobileOpen(false)}>
                                                    {item.title}
                                                </Link>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <Link to={menu.url || '#'} className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>
                                        {menu.title}
                                    </Link>
                                )}
                            </div>
                        ))}
                        <div className="pt-3 border-t space-y-2">
                            {isAuthenticated ? (
                                <>
                                    <Button asChild variant="outline" className="w-full" onClick={() => setMobileOpen(false)}><Link to="/dashboard">Dashboard</Link></Button>
                                    {user?.role === 'agent' && (
                                        <Button asChild variant="outline" className="w-full" onClick={() => setMobileOpen(false)}><Link to="/submit-property">Submit Property</Link></Button>
                                    )}
                                    {user?.role === 'admin' && (
                                        <Button asChild variant="outline" className="w-full" onClick={() => setMobileOpen(false)}><Link to="/admin">Admin Panel</Link></Button>
                                    )}
                                    <Button variant="destructive" className="w-full" onClick={handleLogout}>Log Out</Button>
                                </>
                            ) : (
                                <>
                                    <Button asChild variant="outline" className="w-full"><Link to="/login" onClick={() => setMobileOpen(false)}>Log In</Link></Button>
                                    <Button asChild className="w-full"><Link to="/register" onClick={() => setMobileOpen(false)}>Sign Up</Link></Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}