import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { propertyService } from '@/api/services';
import PropertyCard from '@/components/properties/PropertyCard';
import { Button } from '@/components/ui/button';
import { Plus, Home as HomeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardProperties() {
    const { user } = useAuth();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            fetchProperties();
        }
    }, [user]);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const data = await propertyService.list({ agent_id: user.id });
            setProperties(data.results || data);
        } catch (error) {
            console.error("Failed to fetch properties:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Properties</h1>
                    <p className="text-slate-500 text-sm">Manage the properties you have listed on EstateHub.</p>
                </div>
                <Button asChild className="gap-2 shrink-0">
                    <Link to="/submit-property">
                        <Plus className="w-4 h-4" /> Add New Property
                    </Link>
                </Button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="aspect-[4/3] bg-slate-100 animate-pulse rounded-xl" />
                    ))}
                </div>
            ) : properties.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-border">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HomeIcon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No properties yet</h3>
                    <p className="text-slate-500 mb-6 max-w-md mx-auto">
                        You haven't listed any properties. Click the button below to add your first property listing.
                    </p>
                    <Button asChild variant="outline">
                        <Link to="/submit-property">Add Property</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map(property => (
                        <div key={property.id} className="relative group">
                            <PropertyCard property={property} />
                            <div className="absolute top-2 left-2 z-10 flex gap-2">
                                <Button size="sm" asChild variant="secondary" className="h-8">
                                    <Link to={`/properties/${property.id}`}>View Details</Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
