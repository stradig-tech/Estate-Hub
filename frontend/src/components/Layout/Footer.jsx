import { Link } from 'react-router-dom';
import { Home as HomeIcon, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function Footer() {
    const { siteSettings } = useAuth();
    
    // Default to true if siteSettings is not yet loaded, or use the actual setting if available
    const showStradigtech = siteSettings ? siteSettings.show_developer_stradigtech : true;
    const showMansib = siteSettings ? siteSettings.show_developer_mansib : true;
    const showDevelopers = showStradigtech || showMansib;

    return (
        <footer className="border-t border-border bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    <div className="col-span-2 md:col-span-2 lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
                                <HomeIcon className="w-4 h-4 text-primary-foreground" />
                            </div>
                            <span className="text-lg font-bold">Estate<span className="text-primary">Hub</span></span>
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            The trusted marketplace for real estate. Find your dream home or list your property with confidence.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold mb-3">Properties</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/listings?listing_type=for_sale" className="hover:text-primary">Buy</Link></li>
                            <li><Link to="/listings?listing_type=for_rent" className="hover:text-primary">Rent</Link></li>
                            <li><Link to="/listings?property_type=commercial" className="hover:text-primary">Commercial</Link></li>
                            <li><Link to="/listings" className="hover:text-primary">All Listings</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold mb-3">Services</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/services" className="hover:text-primary">Our Services</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold mb-3">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/pricing" className="hover:text-primary">Pricing</Link></li>
                            <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold mb-3">Connect</h4>
                        <div className="flex gap-3">
                            {siteSettings?.facebook_url ? <a href={siteSettings.facebook_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary"><Facebook className="w-5 h-5" /></a> : <a href="#" className="text-muted-foreground hover:text-primary"><Facebook className="w-5 h-5" /></a>}
                            {siteSettings?.twitter_url ? <a href={siteSettings.twitter_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary"><Twitter className="w-5 h-5" /></a> : <a href="#" className="text-muted-foreground hover:text-primary"><Twitter className="w-5 h-5" /></a>}
                            {siteSettings?.instagram_url ? <a href={siteSettings.instagram_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary"><Instagram className="w-5 h-5" /></a> : <a href="#" className="text-muted-foreground hover:text-primary"><Instagram className="w-5 h-5" /></a>}
                            {siteSettings?.linkedin_url ? <a href={siteSettings.linkedin_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary"><Linkedin className="w-5 h-5" /></a> : <a href="#" className="text-muted-foreground hover:text-primary"><Linkedin className="w-5 h-5" /></a>}
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="flex flex-col gap-1 text-muted-foreground">
                        <p className="text-xs">© 2026 EstateHub. All rights reserved.</p>
                        {showDevelopers && (
                            <p className="text-blue-500 flex gap-1 items-center text-sm">
                                Developed by 
                                {showStradigtech && <a href="https://stradigtech.com/" target="_blank" rel="noreferrer" className="hover:underline text-blue-500 font-bold">Stradigtech</a>}
                                {showStradigtech && showMansib && <span>&amp;</span>}
                                {showMansib && <a href="https://mansibahsan.netlify.app/" target="_blank" rel="noreferrer" className="hover:underline text-blue-500 font-semibold">Mansib</a>}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-6 text-xs text-muted-foreground">
                        <a href="#" className="hover:text-primary">Terms of Service</a>
                        <a href="#" className="hover:text-primary">Privacy Policy</a>
                        <a href="#" className="hover:text-primary">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}