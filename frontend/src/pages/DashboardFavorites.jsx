import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { favoriteService } from '@/api/services';
import PropertyCard from '@/components/properties/PropertyCard';
import { Button } from '@/components/ui/button';
import { Heart, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export default function DashboardFavorites() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchFavorites();
        }
    }, [user]);

    const fetchFavorites = async () => {
        setLoading(true);
        try {
            const data = await favoriteService.list();
            setFavorites(data.results || data);
        } catch (error) {
            console.error("Failed to fetch favorites:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (id) => {
        try {
            await favoriteService.delete(id);
            setFavorites(prev => prev.filter(f => f.id !== id));
            toast({ title: "Removed from favorites" });
        } catch (error) {
            toast({ title: "Failed to remove", variant: "destructive" });
        }
    };

    // Transform favorite object to match property interface for PropertyCard
    const transformFavoriteToProperty = (fav) => ({
        id: fav.property,
        title: fav.property_title,
        price: fav.property_price,
        images: fav.property_image ? [fav.property_image] : [],
        city: fav.property_city,
        state: fav.property_state,
        bedrooms: fav.property_beds,
        bathrooms: fav.property_baths,
        size: fav.property_size,
        property_type: fav.property_type,
        listing_type: fav.listing_type,
    });

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">My Favorites</h1>
                <p className="text-slate-500 text-sm">Properties you've saved for later.</p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="aspect-[4/3] bg-slate-100 animate-pulse rounded-xl" />
                    ))}
                </div>
            ) : favorites.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-border">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No favorites yet</h3>
                    <p className="text-slate-500 mb-6 max-w-md mx-auto">
                        You haven't saved any properties to your favorites. Start browsing and click the heart icon on properties you love!
                    </p>
                    <Button asChild variant="outline" className="gap-2">
                        <Link to="/listings"><Search className="w-4 h-4" /> Browse Properties</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map(fav => (
                        <div key={fav.id} className="relative group">
                            <PropertyCard property={transformFavoriteToProperty(fav)} />
                            <div className="absolute top-2 right-2 z-10">
                                <Button 
                                    size="icon" 
                                    variant="destructive" 
                                    className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                    onClick={() => handleRemoveFavorite(fav.id)}
                                    title="Remove from favorites"
                                >
                                    <Heart className="w-4 h-4 fill-current" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
