import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Bed, Bath, Maximize, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { favoriteService } from '@/api/services';
import { useAuth } from '@/lib/AuthContext';
import { formatPrice, formatNumber } from '@/lib/format';

export default function PropertyCard({ property }) {
    const { isAuthenticated } = useAuth();
    const [isFavorited, setIsFavorited] = useState(false);
    const [favId, setFavId] = useState(null);

    useEffect(() => {
        if (!isAuthenticated || !property.id) return;
        favoriteService.list({ property_id: property.id })
            .then(data => {
                const favs = data.results || data;
                if (favs.length > 0) {
                    setIsFavorited(true);
                    setFavId(favs[0].id);
                }
            })
            .catch(() => { });
    }, [property.id, isAuthenticated]);

    const toggleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) return;
        if (isFavorited && favId) {
            await favoriteService.delete(favId);
            setIsFavorited(false);
            setFavId(null);
        } else {
            const fav = await favoriteService.create({
                property_id: property.id,
                property_title: property.title,
                property_price: property.price,
                property_image: property.images?.[0],
                property_city: property.city,
                property_state: property.state,
                property_beds: property.bedrooms,
                property_baths: property.bathrooms,
                property_size: property.size,
                property_type: property.property_type,
                listing_type: property.listing_type,
            });
            setIsFavorited(true);
            setFavId(fav.id);
        }
    };

    const image = property.images?.[0] || property.property_image || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800';

    return (
        <Link to={`/properties/${property.id}`} className="block group">
            <Card className="overflow-hidden p-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img src={image} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className="bg-primary text-primary-foreground">
                            {property.listing_type === 'for_sale' ? 'For Sale' : 'For Rent'}
                        </Badge>
                        {property.featured && <Badge className="bg-amber-500 text-white">Featured</Badge>}
                    </div>
                    {isAuthenticated && (
                        <button
                            onClick={toggleFavorite}
                            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-sm transition-all"
                        >
                            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                        </button>
                    )}
                </div>
                <div className="p-4 space-y-2">
                    <p className="text-xl font-bold text-primary">{formatPrice(property.price, property.listing_type)}</p>
                    <h3 className="font-semibold text-foreground line-clamp-1">{property.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {property.city || property.property_city}, {property.state || property.property_state}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border">
                        <span className="flex items-center gap-1"><Bed className="w-4 h-4" /> {property.bedrooms ?? property.property_beds ?? 0}</span>
                        <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> {property.bathrooms ?? property.property_baths ?? 0}</span>
                        <span className="flex items-center gap-1"><Maximize className="w-4 h-4" /> {formatNumber(property.size ?? property.property_size)} sqft</span>
                    </div>
                </div>
            </Card>
        </Link>
    );
}