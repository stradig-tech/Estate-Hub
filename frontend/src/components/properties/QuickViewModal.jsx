import { Bed, Bath, Maximize, MapPin, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { formatPrice, formatNumber } from '@/lib/format';

export default function QuickViewModal({ property, open, onOpenChange }) {
    if (!property) return null;
    const image = property.images?.[0] || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden">
                <DialogHeader className="sr-only">
                    <DialogTitle>{property.title}</DialogTitle>
                </DialogHeader>
                <div className="grid md:grid-cols-2">
                    <div className="aspect-square md:aspect-auto bg-muted overflow-hidden">
                        <img src={image} alt={property.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-5 space-y-3 flex flex-col">
                        <Badge className="w-fit bg-primary text-primary-foreground">
                            {property.listing_type === 'for_sale' ? 'For Sale' : 'For Rent'}
                        </Badge>
                        <p className="text-2xl font-bold text-primary">{formatPrice(property.price, property.listing_type)}</p>
                        <h3 className="text-lg font-semibold leading-tight">{property.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {property.city}, {property.state}
                        </p>
                        <div className="flex gap-4 text-sm pt-2 border-t">
                            <span className="flex items-center gap-1"><Bed className="w-4 h-4" /> {property.bedrooms} Beds</span>
                            <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> {property.bathrooms} Baths</span>
                            <span className="flex items-center gap-1"><Maximize className="w-4 h-4" /> {formatNumber(property.size)} sqft</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3 flex-1">{property.description}</p>
                        <Button asChild className="mt-auto">
                            <Link to={`/properties/${property.id}`}>View Full Details <ArrowRight className="w-4 h-4 ml-1" /></Link>
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}