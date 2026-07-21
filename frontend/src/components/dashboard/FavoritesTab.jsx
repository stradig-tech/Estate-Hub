import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { favoriteService } from '@/api/services';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Trash2, MapPin } from 'lucide-react';
import { formatPrice, formatNumber } from '@/lib/format';

export default function FavoritesTab() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    favoriteService.list()
      .then(data => setFavorites(data.results || data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleRemove = async (id) => {
    await favoriteService.delete(id);
    load();
  };

  if (loading) return <div className="py-10 text-center text-muted-foreground">Loading...</div>;

  if (favorites.length === 0) {
    return (
      <Card className="p-10 text-center">
        <Heart className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
        <p className="text-muted-foreground">No favorites yet. Browse listings and save your favorites!</p>
        <Button asChild className="mt-4"><Link to="/listings">Browse Properties</Link></Button>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {favorites.map(fav => (
        <Card key={fav.id} className="overflow-hidden p-0">
          <Link to={`/properties/${fav.property_id}`}>
            <div className="aspect-[4/3] bg-muted overflow-hidden">
              <img src={fav.property_image || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600'} alt={fav.property_title} className="w-full h-full object-cover" />
            </div>
          </Link>
          <div className="p-3 space-y-1">
            <p className="font-bold text-primary">{formatPrice(fav.property_price, fav.listing_type)}</p>
            <p className="font-medium text-sm line-clamp-1">{fav.property_title}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> {fav.property_city}, {fav.property_state}</p>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">{fav.property_beds} bd | {fav.property_baths} ba | {formatNumber(fav.property_size)} sqft</span>
              <Button variant="ghost" size="sm" onClick={() => handleRemove(fav.id)} className="text-destructive h-8 px-2"><Trash2 className="w-3.5 h-3.5" /></Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}