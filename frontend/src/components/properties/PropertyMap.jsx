import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { Bed, Bath, Maximize } from 'lucide-react';
import { formatPrice } from '@/lib/format';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export default function PropertyMap({ properties = [], center }) {
    const validProperties = properties.filter(p => p.latitude && p.longitude);
    const defaultCenter = center || (validProperties[0] ? [validProperties[0].latitude, validProperties[0].longitude] : [40.7128, -74.006]);

    if (validProperties.length === 0) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px] bg-muted rounded-lg text-muted-foreground">
                Map view unavailable — no location data for these properties.
            </div>
        );
    }

    return (
        <MapContainer center={defaultCenter} zoom={11} scrollWheelZoom={false} className="w-full h-full min-h-[500px] rounded-lg">
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />
            {validProperties.map(p => (
                <Marker key={p.id} position={[p.latitude, p.longitude]}>
                    <Popup>
                        <div className="w-56">
                            <Link to={`/properties/${p.id}`} className="block">
                                <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400'} alt={p.title} className="w-full h-28 object-cover rounded mb-2" />
                                <p className="font-bold text-primary">{formatPrice(p.price, p.listing_type)}</p>
                                <p className="text-sm font-medium line-clamp-1">{p.title}</p>
                                <p className="text-xs text-muted-foreground">{p.city}, {p.state}</p>
                                <div className="flex gap-3 text-xs mt-1 text-muted-foreground">
                                    <span className="flex items-center gap-0.5"><Bed className="w-3 h-3" /> {p.bedrooms}</span>
                                    <span className="flex items-center gap-0.5"><Bath className="w-3 h-3" /> {p.bathrooms}</span>
                                    <span className="flex items-center gap-0.5"><Maximize className="w-3 h-3" /> {p.size}</span>
                                </div>
                            </Link>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}